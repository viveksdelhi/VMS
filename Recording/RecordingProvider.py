import os
import shutil
import subprocess
import threading
import time
import logging
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests
from concurrent.futures import ThreadPoolExecutor

# -------------------- Configuration --------------------
RECORDING_DIRECTORY = "recording"
os.makedirs(RECORDING_DIRECTORY, exist_ok=True)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

executor = ThreadPoolExecutor(max_workers=10)

# -------------------- State Management --------------------
class CameraManager:
    streams = {}
    stop_events = {}
    recording_state = {}
    lock = threading.Lock()

# -------------------- Utility Functions --------------------
def get_camera_directory(camera_id):
    path = os.path.join(RECORDING_DIRECTORY, str(camera_id))
    os.makedirs(path, exist_ok=True)
    return path

def clear_directory(directory):
    try:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory, exist_ok=True)
        logger.info(f"Cleared contents of directory: {directory}")
    except Exception as e:
        logger.error(f"Error clearing directory {directory}: {str(e)}")

# -------------------- Recording Logic --------------------
def start_recording(camera_id, rtsp_url, duration_minutes, resolution):
    directory = get_camera_directory(camera_id)
    CameraManager.recording_state[camera_id] = True

    try:
        while CameraManager.recording_state.get(camera_id, False):
            try:
                timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
                temp_file = os.path.join(directory, f"{camera_id}_{timestamp}.temp.mp4")
                final_file = os.path.join(directory, f"{camera_id}_{timestamp}.mp4")

                logger.info(f"Recording started for camera {camera_id}")

                command = [
                    "ffmpeg",
                    "-rtsp_transport", "tcp",
                    "-i", rtsp_url,
                    "-c:v", "libx264",
                    "-preset", "ultrafast",
                    "-tune", "zerolatency",
                    "-s", resolution,
                    "-t", str(duration_minutes * 60),
                    "-y",
                    temp_file
                ]

                process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                stdout, stderr = process.communicate()

                if process.returncode != 0:
                    logger.error(f"FFmpeg error for camera {camera_id}: {stderr.decode('utf-8')}")
                    time.sleep(5)
                    continue

                os.rename(temp_file, final_file)
                logger.info(f"Recording completed for camera {camera_id}")

            except Exception as e:
                logger.error(f"Recording error for camera {camera_id}: {str(e)}")
                continue
    finally:
        CameraManager.recording_state[camera_id] = False
        logger.info(f"Recording stopped for camera {camera_id}")

def stop_recording(camera_id):
    if camera_id in CameraManager.recording_state:
        CameraManager.recording_state[camera_id] = False
        logger.info(f"Recording stopped for camera {camera_id}")
    else:
        logger.warning(f"No active recording found for camera {camera_id}")

# -------------------- Periodic API Call --------------------
def call_api_periodically(camera_id, credit_id=1, event_id=1):
    stop_event = CameraManager.stop_events.get(camera_id)
    if not stop_event:
        stop_event = threading.Event()
        CameraManager.stop_events[camera_id] = stop_event

    while CameraManager.recording_state.get(camera_id, False) and not stop_event.is_set():
        try:
            payload = {
                "event_credit_id": credit_id,
                "device_id": camera_id,
                "event_type_id": event_id
            }

            response = requests.post("https://vmsccp.ajeevi.in/transaction_update", json=payload, timeout=10)

            if response.status_code == 201:
                logger.info(f"API call successful for camera {camera_id}")
            else:
                logger.warning(f"API call failed for camera {camera_id}: {response.status_code}")
        except Exception as e:
            logger.error(f"API error for camera {camera_id}: {str(e)}")

        time.sleep(15 * 60)

# -------------------- Flask App --------------------
app = Flask(__name__)
CORS(app)

@app.route('/start_recording', methods=['POST'])
def api_start_recording():
    data = request.json
    camera_id = data.get('camera_id')
    rtsp_url = data.get('rtsp_url')
    duration = data.get('time_minutes', 1)
    resolution = data.get('resolution', '854x480')
    credit_id = data.get('credit_id', 1)

    if not camera_id or not rtsp_url:
        return jsonify({"error": "Missing 'camera_id' or 'rtsp_url'"}), 400

    with CameraManager.lock:
        if camera_id in CameraManager.streams:
            return jsonify({"error": "Recording already active"}), 400

        CameraManager.streams[camera_id] = True
        executor.submit(start_recording, camera_id, rtsp_url, duration, resolution)
        executor.submit(call_api_periodically, camera_id, credit_id)

    return jsonify({"message": "Recording started"}), 200

@app.route('/stop_recording', methods=['POST'])
def api_stop_recording():
    data = request.json
    camera_id = data.get('camera_id')

    if not camera_id:
        return jsonify({"error": "Missing 'camera_id'"}), 400

    stop_recording(camera_id)
    return jsonify({"message": f"Recording stopped for camera {camera_id}"}), 200

@app.route('/list_recordings/<camera_id>', methods=['GET'])
def api_list_recordings(camera_id):
    directory = get_camera_directory(camera_id)
    files = [f for f in os.listdir(directory) if f.endswith('.mp4')]
    return jsonify({"recordings": files})

@app.route('/delete_recording', methods=['POST'])
def api_delete_recording():
    data = request.json
    camera_id = data.get('camera_id')
    filename = data.get('filename')

    if not camera_id or not filename:
        return jsonify({"error": "Missing 'camera_id' or 'filename'"}), 400

    file_path = os.path.join(get_camera_directory(camera_id), filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return jsonify({"message": "Recording deleted"}), 200
        except Exception as e:
            logger.error(f"Error deleting file {filename}: {str(e)}")
            return jsonify({"error": "Failed to delete recording"}), 500
    return jsonify({"error": "Recording not found"}), 404

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"}), 200

@app.route('/playback/<camera_id>/<filename>', methods=['GET'])
def playback(camera_id, filename):
    """
    API endpoint to stream a specific recorded video.
    """
    video_path = os.path.join(RECORDING_DIRECTORY, str(camera_id), filename)  # Use camera_id instead of camera_name
    
    if not os.path.exists(video_path):
        return jsonify({"error": f"Video file {filename} not found for camera {camera_id}."}), 404
    
    return send_from_directory(
        os.path.join(RECORDING_DIRECTORY, str(camera_id)),
        filename,
        as_attachment=False
    )

# -------------------- Run App --------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)