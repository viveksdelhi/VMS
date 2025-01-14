import os
import subprocess
import threading
import time
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import shutil
import requests 

app = Flask(__name__)
CORS(app)

# Path to store HLS files
HLS_DIRECTORY = r"output"
os.makedirs(HLS_DIRECTORY, exist_ok=True)

# Store camera streams and processes
streams = {}
live_camera_status = {}
# Initialize the lock for thread-safe access to `streams`
streams_lock = threading.Lock()
stop_thread_event = {}

# Function to make the API call every 15 minutes for a specific camera
def call_api_periodically_for_camera(camera_id, credit_id=1, event_id=2):
    stop_event = stop_thread_event.get(camera_id)  # Get the stop event for this camera
    
    while live_camera_status.get(camera_id, False) and not (stop_event and stop_event.is_set()):
        try:
            data = {
                "event_credit_id": credit_id,  # credit id
                "device_id": camera_id,      # camera name as device ID
                "event_type_id": event_id      # event type ID
            }

            response = requests.post("https://vmsccp.ajeevi.in/transaction_update", json=data)

            if response.status_code == 201:
                print(f"API call successful for camera {camera_id}")
            else:
                print(f"API call failed with status code {response.status_code} for camera {camera_id}")
        except Exception as e:
            print(f"Error during API call for camera {camera_id}: {str(e)}")

        # Wait for 15 minutes before calling the API again
        time.sleep(15 * 60)  # 15 minutes in seconds

def clear_directory(directory):
    """
    Remove all contents of a directory.
    """
    try:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory, exist_ok=True)
        print(f"Cleared contents of directory: {directory}")
    except Exception as e:
        print(f"Error clearing directory {directory}: {str(e)}")

def delete_old_ts_files(hls_path):
    """Delete old .ts files in the HLS directory, keeping only the latest."""
    ts_files = [f for f in os.listdir(hls_path) if f.endswith('.ts')]
    
    # If there are any .ts files, delete the old ones (keep the newest)
    if len(ts_files) > 1:
        # Sort by creation time (oldest first)
        ts_files.sort(key=lambda x: os.path.getctime(os.path.join(hls_path, x)))
        # Delete all but the most recent file
        for ts_file in ts_files[:-1]:
            try:
                os.remove(os.path.join(hls_path, ts_file))
                print(f"Deleted old .ts file: {ts_file}")
            except Exception as e:
                print(f"Error deleting .ts file {ts_file}: {str(e)}")

def stop_ffmpeg_process(camera_id):
    """Stop the FFmpeg process for the given camera."""
    with streams_lock:
        process_info = streams.get(camera_id)
        if process_info:
            process = process_info.get("process")
            if process:
                print(f"Stopping FFmpeg process for camera {camera_id}...")
                try:
                    process.terminate()  # Gracefully terminate the process
                    try:
                        process.wait(timeout=10)
                        print(f"FFmpeg process for camera {camera_id} stopped gracefully.")
                    except subprocess.TimeoutExpired:
                        print(f"FFmpeg process for camera {camera_id} did not stop in time. Killing process...")
                        process.kill()  # Forcefully kill the process
                        print(f"FFmpeg process for camera {camera_id} killed.")
                except Exception as e:
                    print(f"Error stopping FFmpeg process for camera {camera_id}: {str(e)}")
            else:
                print(f"No FFmpeg process to stop for camera {camera_id}.")
        else:
            print(f"No active FFmpeg process found for camera {camera_id}.")


def start_ffmpeg(rtsp_url, camera_id):
    """
    Start FFmpeg to convert RTSP to HLS in a background thread.
    This function includes retry logic if FFmpeg fails due to network issues.
    """
    hls_path = os.path.join(HLS_DIRECTORY, str(camera_id))
    
    command = [
        "ffmpeg",
        "-rtsp_transport", "tcp",
        "-i", rtsp_url,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-tune", "zerolatency",
        "-s", "854x480", #fix resolution to 480px
        "-f", "hls",
        "-hls_time", "1",
        "-hls_list_size", "1",
        "-hls_flags", "delete_segments+append_list",
        f"{hls_path}/stream.m3u8"
    ]

    while live_camera_status.get(camera_id, False):
        try:
            print(f"Running FFmpeg command for camera {camera_id}: {' '.join(command)}")

            # Clear the directory before starting or restarting FFmpeg
            clear_directory(hls_path)
            # Start the FFmpeg process
            process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = process.communicate()

            # Log FFmpeg output
            print(f"FFmpeg stdout: {stdout.decode('utf-8')}")
            print(f"FFmpeg stderr: {stderr.decode('utf-8')}")

            if process.returncode != 0:
                print(f"FFmpeg error for camera {camera_id}: {stderr.decode('utf-8')}")
                raise Exception(f"FFmpeg failed to start: {stderr.decode('utf-8')}")

            print(f"FFmpeg process started successfully for camera {camera_id}")

            # Update the streams dictionary after FFmpeg starts
            
            with streams_lock:
                streams[camera_id] = {"process": process}
                print(f"Assigned FFmpeg process to streams for camera {camera_id}")
            print(f"Camera {camera_id} fully registered with FFmpeg process.")

            
            # Monitor the FFmpeg process
            while process.poll() is None:
                delete_old_ts_files(hls_path)  # Optionally delete old .ts files
                time.sleep(1)  # Wait for the process to finish or be terminated
            
            # If the FFmpeg process stopped unexpectedly
            print(f"FFmpeg process for camera {camera_id} stopped unexpectedly, restarting...")

            # Stop the FFmpeg process (if it was running) before restarting
            stop_ffmpeg_process(camera_id)
            
            # Retry the FFmpeg process after it stops unexpectedly
            print(f"Retrying FFmpeg process for camera {camera_id} in 5 seconds...")
            time.sleep(5)

        except Exception as e:
            print(f"Error starting FFmpeg for camera {camera_id}: {str(e)}")
            print(f"Retrying in 5 seconds...")

            # Stop the process if it's running
            stop_ffmpeg_process(camera_id)
            
            # Retry after a delay
            time.sleep(5) # Retry after 5 seconds if FFmpeg fails to start or disconnects



@app.route('/add_camera', methods=['POST'])
def add_camera():
    """
    Add a new RTSP camera and start processing in the background.
    """
    data = request.json
    if not data:
        return jsonify({"error": "Invalid JSON. Please provide a valid JSON request body."}), 400

    
    rtsp_url = data.get('rtsp_url')
    camera_id = data.get('camera_id')
    credit_id = data.get('credit_id')

    if not camera_id or not rtsp_url:
        return jsonify({"error": "Both 'camera_name' and 'rtsp_url' are required"}), 400

    # Check if the camera already exists
    with streams_lock:
        if camera_id in streams:
            return jsonify({"error": "Camera already exists"}), 400

        # Register the camera immediately, even if FFmpeg is still processing
        streams[camera_id] = {"process": None, "path": os.path.join(HLS_DIRECTORY, str(camera_id))}
        live_camera_status[camera_id] = True
        print(f"Camera {camera_id} added to streams dictionary.")

    # Start FFmpeg in the background by launching a new thread
    thread = threading.Thread(target=start_ffmpeg, args=(rtsp_url, camera_id))
    thread.start()
    
    api_thread = threading.Thread(target=call_api_periodically_for_camera, args=(camera_id,credit_id))
    api_thread.start()

    return jsonify({"message": "Camera added successfully"+ str(streams)}), 200  # Camera added immediately


@app.route('/stream/<int:camera_id>/<filename>')
def stream_file(camera_id, filename):
    """
    Serve the HLS playlist (.m3u8) and the .ts segment files for the camera stream.
    """
    # with streams_lock:
    if camera_id not in streams:
        return jsonify({"error": "Camera not found"}), 404

    # Path to the HLS directory
    hls_path = os.path.join(HLS_DIRECTORY, str(camera_id))

    # Check if the file exists (either .m3u8 or .ts)
    file_path = os.path.join(hls_path, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    # Serve the file (either .m3u8 or .ts)
    return send_from_directory(hls_path, filename)


@app.route('/remove_camera/<int:camera_id>', methods=['DELETE'])
def remove_camera(camera_id):
    """
    Stop streaming a camera and clean up resources.
    """
    print(streams)
    # with streams_lock:
    if camera_id in streams:
        # Stop FFmpeg process and clean up HLS files
        live_camera_status[camera_id] = False
        stop_ffmpeg_process(camera_id)
        hls_path = streams[camera_id]["path"]
        shutil.rmtree(hls_path)  # Use shutil to remove the HLS directory
        
        if camera_id in stop_thread_event:
            stop_thread_event[camera_id].set() # Set the stop event to stop the thread
            print(f"Periodic thread for camera {camera_id} stopped.")
        del streams[camera_id]
        return jsonify({"message": "Camera removed successfully"}), 200

    return jsonify({"error": "Camera not found"}), 404





if __name__ == '__main__':
    app.run(host="0.0.0.0", port=6050)
