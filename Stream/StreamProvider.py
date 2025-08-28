import os
import shutil
import subprocess
import time
import logging
import threading
import requests
from concurrent.futures import ThreadPoolExecutor

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
HLS_DIRECTORY = "output"
os.makedirs(HLS_DIRECTORY, exist_ok=True)

# Shared state
streams = {}
live_camera_status = {}
stop_thread_event = {}
executor = ThreadPoolExecutor(max_workers=80)

def delete_old_ts_files(hls_path, keep_latest=5):
    """Delete older .ts files, keeping the most recent few."""
    try:
        with os.scandir(hls_path) as entries:
            ts_files = [e for e in entries if e.name.endswith('.ts') and e.is_file()]
            ts_files.sort(key=lambda e: e.stat().st_ctime)
            for entry in ts_files[:-keep_latest]:
                os.remove(entry.path)
                logger.info(f"Deleted old .ts file: {entry.name}")
    except Exception as e:
        logger.error(f"Error cleaning .ts files: {e}")

#tested on 24 Aug 2025
def start_ffmpeg(rtsp_url, camera_id):
    hls_path = os.path.join(HLS_DIRECTORY, str(camera_id))
    os.makedirs(hls_path, exist_ok=True)

    command = [
        "ffmpeg",
        "-rtsp_transport", "tcp",
        "-i", rtsp_url,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-s", "854x480",
        "-f", "hls",
        "-hls_time", "1",
        "-hls_list_size", "5",
        "-hls_flags", "delete_segments+append_list",
        os.path.join(hls_path, "stream.m3u8")
    ]

    while live_camera_status.get(camera_id, False):
        try:
            logger.info(f"Starting FFmpeg for camera {camera_id}")
            process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            pid = process.pid
            logger.info(f"FFmpeg started for camera {camera_id} with PID {pid}")
            streams[camera_id] = {"process": process, "path": hls_path}
            

            while process.poll() is None and live_camera_status.get(camera_id, False):
                delete_old_ts_files(hls_path)
                time.sleep(1)

            if live_camera_status[camera_id] == False:
                logger.info(f"FFmpeg process for camera {camera_id} stopped by user.")
                live_camera_status.pop(camera_id, None)
                break

            logger.warning(f"FFmpeg process for camera {camera_id} stopped unexpectedly. Restarting...")
            stop_ffmpeg_process(camera_id)
            time.sleep(5)

        except Exception as e:
            logger.error(f"FFmpeg error for camera {camera_id}: {e}")
            stop_ffmpeg_process(camera_id)
            time.sleep(5)

def call_api_periodically_for_camera(camera_id, credit_id=1, event_id=2):
    stop_event = stop_thread_event.get(camera_id)
    while live_camera_status.get(camera_id, False) and not (stop_event and stop_event.is_set()):
        try:
            data = {
                "event_credit_id": credit_id,
                "device_id": camera_id,
                "event_type_id": event_id
            }
            response = requests.post("https://vmsccp.ajeevi.in/transaction_update", json=data)
            if response.status_code == 201:
                logger.info(f"API call successful for camera {camera_id}")
            else:
                logger.warning(f"API call failed ({response.status_code}) for camera {camera_id}")
        except Exception as e:
            logger.error(f"API call error for camera {camera_id}: {e}")
        time.sleep(15 * 60)

def stop_ffmpeg_process(camera_id):
    
    process_info = streams.get(camera_id)
    if process_info:
        process = process_info.get("process")
        if process and process.poll() is None:
            logger.info(f"Stopping FFmpeg for camera {camera_id}")
            process.terminate()
            try:
                process.wait(timeout=10)
                logger.info(f"FFmpeg for camera {camera_id} stopped gracefully.")
            except subprocess.TimeoutExpired:
                process.kill()
                logger.warning(f"FFmpeg for camera {camera_id} forcefully killed.")

from flask import Flask, request, jsonify 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/add_camera', methods=['POST'])
def add_camera():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    rtsp_url = data.get('rtsp_url')
    camera_id = data.get('camera_id')
    credit_id = data.get('credit_id', 1)  # Default to 1 if not provided

    if not rtsp_url or not camera_id:
        return jsonify({"error": "Missing 'rtsp_url' or 'camera_id'"}), 400

    if camera_id in streams:
        return jsonify({"error": "Camera already exists"}), 400

    # Initialize camera state
    live_camera_status[camera_id] = True
    stop_thread_event[camera_id] = threading.Event()

    # Submit FFmpeg and API threads to executor
    executor.submit(start_ffmpeg, rtsp_url, camera_id)
    executor.submit(call_api_periodically_for_camera, camera_id, credit_id)

    logger.info(f"Camera {camera_id} added and threads started.")
    return jsonify({"message": f"Camera {camera_id} added successfully"}), 200

@app.route('/remove_camera/<int:camera_id>', methods=['DELETE'])
def remove_camera(camera_id):
    if camera_id not in streams:
        return jsonify({"error": "Camera not found"}), 404

    logger.info(f"Removing camera {camera_id}...")

    # Stop camera status
    live_camera_status[camera_id] = False

    # Signal API thread to stop
    if camera_id in stop_thread_event:
        stop_thread_event[camera_id].set()
        logger.info(f"Stop event triggered for camera {camera_id}")

    # Stop FFmpeg process
    stop_ffmpeg_process(camera_id)

    # Remove HLS directory
    hls_path = streams[camera_id].get("path")
    try:
        if hls_path and os.path.exists(hls_path):
            shutil.rmtree(hls_path)
            logger.info(f"Deleted HLS directory for camera {camera_id}")
    except Exception as e:
        logger.error(f"Error deleting HLS directory for camera {camera_id}: {e}")

    # Clean up shared state
    streams.pop(camera_id, None)
    stop_thread_event.pop(camera_id, None)

    return jsonify({"message": f"Camera {camera_id} removed successfully"}), 200

from flask import send_from_directory

@app.route('/stream/<int:camera_id>/<filename>')
def stream_file(camera_id, filename):
    if camera_id not in streams:
        logger.warning(f"Stream request for unknown camera {camera_id}")
        return jsonify({"error": "Camera not found"}), 404

    hls_path = streams[camera_id].get("path")
    if not hls_path or not os.path.exists(hls_path):
        logger.warning(f"HLS path missing for camera {camera_id}")
        return jsonify({"error": "Stream directory not found"}), 404

    file_path = os.path.join(hls_path, filename)
    if not os.path.isfile(file_path):
        logger.warning(f"Requested file '{filename}' not found for camera {camera_id}")
        return jsonify({"error": "File not found"}), 404

    logger.info(f"Serving file '{filename}' for camera {camera_id}")
    return send_from_directory(hls_path, filename)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=7015)