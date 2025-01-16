import os
import subprocess
import shutil
from datetime import datetime
import threading
import time
from flask import Flask, jsonify, request, send_from_directory
import requests
from flask_cors import CORS

# Path to store recorded files
RECORDING_DIRECTORY = r"recording"
os.makedirs(RECORDING_DIRECTORY, exist_ok=True)

# Initialize a dictionary to track active recording processes for each camera
streams = {}
stop_thread_event = {}

# Dictionary to track if a camera is currently recording
camera_recording_state = {}

streams_lock = threading.Lock()

app = Flask(__name__)
CORS(app)

def call_api_periodically_for_camera(camera_id, credit_id=1, event_id=1):
    # stop event for this camera if it doesn't already exist
    stop_event = stop_thread_event.get(camera_id)
    if not stop_event:
        stop_event = threading.Event()
        stop_thread_event[camera_id] = stop_event
    print(camera_recording_state)
    while camera_recording_state.get(camera_id, False) and not stop_event.is_set():
        try:
            data = {
                "event_credit_id": credit_id,  # credit id
                "device_id": camera_id,        # camera name as device ID
                "event_type_id": event_id      # event type ID
            }
            print(data)

            response = requests.post("https://vmsccp.ajeevi.in/transaction_update", json=data)

            if response.status_code == 201:
                print(f"API call successful for camera {camera_id}")
            else:
                print(f"API call failed with status code {response.status_code} for camera {camera_id}")
        except Exception as e:
            print(f"Error during API call for camera {camera_id}: {str(e)}")

        # Wait for 15 minutes before calling the API again
        print(f"Waiting for 15 minutes before next API call for camera {camera_id}")
        time.sleep(15 * 60)  # 15 minutes in seconds


def clear_directory(directory):
    """Remove all contents of a directory."""
    try:
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory, exist_ok=True)
        print(f"Cleared contents of directory: {directory}")
    except Exception as e:
        print(f"Error clearing directory {directory}: {str(e)}")


def start_recording(camera_id, rtsp_url, recording_duration, resolution):
    """
    Start FFmpeg to record RTSP stream with specified duration and resolution.
    Handles reconnection if the RTSP stream disconnects.
    """
    recording_directory = os.path.join(RECORDING_DIRECTORY, str(camera_id))  # Use camera_id instead of camera_name
    os.makedirs(recording_directory, exist_ok=True)

    camera_recording_state[camera_id] = True  # Set the flag to True when starting recording

    try:
        while camera_recording_state.get(camera_id, False):  # Continue recording until the flag is False
            try:
                print(f"Starting recording for camera {camera_id}, RTSP URL: {rtsp_url}, Duration: {recording_duration} minutes, Resolution: {resolution}")

                # Construct the temporary file name to avoid file corruption
                temp_recording_file = os.path.join(recording_directory, f"{camera_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.temp.mp4")
                final_recording_file = os.path.join(recording_directory, f"{camera_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.mp4")

                # FFmpeg command for recording the stream
                record_command = [
                    "ffmpeg",
                    "-rtsp_transport", "tcp",
                    "-i", rtsp_url,
                    "-c:v", "libx264",
                    "-preset", "ultrafast",
                    "-tune", "zerolatency",
                    "-s", resolution,  # Set resolution dynamically based on input
                    "-t", str(recording_duration * 60),  # Convert minutes to seconds
                    "-y",  # Overwrite if file exists
                    temp_recording_file  # Write to the temporary file first
                ]

                # Start the recording process
                process_record = subprocess.Popen(record_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

                # Wait for the process to finish
                stdout, stderr = process_record.communicate()

                if process_record.returncode != 0:
                    print(f"FFmpeg error for camera {camera_id} (recording): {stderr.decode('utf-8')}")
                    # Retry after error, with added delay
                    print(f"Retrying recording for camera {camera_id} in 5 seconds...")
                    time.sleep(5)  # Add a 5-second delay before retry
                    continue

                # Only move the file to its final name if FFmpeg finishes without errors
                os.rename(temp_recording_file, final_recording_file)
                print(f"Recording for camera {camera_id} completed successfully.")
            
            except Exception as e:
                print(f"Error starting recording for camera {camera_id}: {str(e)}")
                # Retry immediately if an exception occurs
                print(f"Retrying recording for camera {camera_id}...")
                continue
    finally:
        # After finishing or stopping, ensure the recording flag is set to False
        camera_recording_state[camera_id] = False
        print(f"Recording stopped for camera {camera_id}.")


def stop_recording(camera_id):
    """Stop the FFmpeg recording process for the given camera."""
    if camera_id in camera_recording_state:
        print(f"Stopping recording process for camera {camera_id}...")
        # Set the recording flag to False to stop the recording thread
        camera_recording_state[camera_id] = False
        print(f"Recording process for camera {camera_id} stopped.")
    else:
        print(f"No active recording found for camera {camera_id}.")


def list_recordings(camera_id):
    """List all recordings for a specific camera."""
    recording_path = os.path.join(RECORDING_DIRECTORY, str(camera_id))  # Use camera_id instead of camera_name
    if not os.path.exists(recording_path):
        return []
    return [f for f in os.listdir(recording_path) if f.endswith('.mp4')]


def delete_recording(camera_id, filename):
    """Delete a specific recording file."""
    recording_path = os.path.join(RECORDING_DIRECTORY, str(camera_id))  # Use camera_id instead of camera_name
    file_path = os.path.join(recording_path, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except Exception as e:
            print(f"Error deleting file {filename}: {str(e)}")
            return False
    return False


@app.route('/start_recording', methods=['POST'])
def api_start_recording():
    """
    API endpoint to start recording a camera stream.
    """
    data = request.json
    print(data)
    camera_id = data.get('camera_id')  # Expecting camera_id instead of camera_name
    rtsp_url = data.get('rtsp_url')
    time_minutes = data.get('time_minutes', 1)  # Default to 5 minutes
    resolution = data.get('resolution', '854x480')  # Default to 854x480 resolution
    credit_id = data.get('credit_id')

    
    # Validate the inputs
    if not camera_id or not rtsp_url:
        return jsonify({"error": "Both 'camera_id' and 'rtsp_url' are required"}), 400

    # Check if recording is already active
    with streams_lock:
        if camera_id in streams:
            return jsonify({"error": "Recording already active for this camera"}), 400
        
        # Register the camera and start recording in a new thread
        thread = threading.Thread(target=start_recording, args=(camera_id, rtsp_url, time_minutes, resolution))
        thread.start()

        time.sleep(5)
        
        # Start the periodic API call in a new thread
        api_thread = threading.Thread(target=call_api_periodically_for_camera, args=(camera_id,credit_id))
        api_thread.start()

    return jsonify({"message": "Recording started successfully"}), 200


@app.route('/stop_recording', methods=['POST'])
def api_stop_recording():
    """
    API endpoint to stop recording a camera stream.
    """
    data = request.json
    camera_id = data.get('camera_id')  # Expecting camera_id instead of camera_name

    if not camera_id:
        return jsonify({"error": "Camera ID is required"}), 400

    # Stop the recording by setting the flag to False
    stop_recording(camera_id)
    if camera_id in stop_thread_event:
        stop_thread_event[camera_id].set()  # Set the stop event to stop the thread
        print(f"Periodic thread for camera {camera_id} stopped.")

    return jsonify({"message": "Stopping recording in the background."}), 200


@app.route('/list_recordings/<camera_id>', methods=['GET'])
def api_list_recordings(camera_id):
    """
    API endpoint to list all recordings for a specific camera.
    """
    recordings = list_recordings(camera_id)
    if not recordings:
        return jsonify({"message": "No recordings found for this camera"}), 404

    return jsonify({"recordings": recordings}), 200


@app.route('/delete_recording/<camera_id>/<filename>', methods=['DELETE'])
def api_delete_recording(camera_id, filename):
    """
    API endpoint to delete a specific recording for a given camera.
    """
    success = delete_recording(camera_id, filename)
    if success:
        return jsonify({"message": f"Recording {filename} deleted successfully"}), 200
    else:
        return jsonify({"error": f"Recording {filename} not found"}), 404


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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=6053)

