import os
import cv2
import time
from flask import Flask, Response, jsonify, send_file, request
from concurrent.futures import ThreadPoolExecutor
from threading import Lock
from collections import deque
import shutil


app = Flask(__name__)

# Global dictionary to hold streams, buffers, and output file handles
buffers = {}
buffer_locks = {}
MAX_BUFFER_SIZE = 100  # Limit buffer size to prevent memory issues
FRAME_RATE = 20  # Desired frame rate for streaming

def start_stream(rtsp_link, camera_name):
    cap = cv2.VideoCapture(rtsp_link)
    if not cap.isOpened():
        print(f"Failed to open video stream: {rtsp_link}")
        return

    # Initialize buffer and lock for this camera
    buffers[camera_name] = deque(maxlen=MAX_BUFFER_SIZE)
    buffer_locks[camera_name] = Lock()

    folder_path = f"recordings/{camera_name}"
    os.makedirs(folder_path, exist_ok=True)

    out = None
    segment_duration = 2 * 60  # 2 minutes in seconds
    start_time = time.time()

    try:
        while True:
            current_time = time.time()

            # Check if it's time to create a new video file
            if out is None or (current_time - start_time) >= segment_duration:
                if out:
                    out.release()  # Release the current video writer if it exists
                filename = f"{folder_path}/{time.strftime('%Y%m%d_%H%M%S')}.avi"
                fourcc = cv2.VideoWriter_fourcc(*'XVID')
                frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                out = cv2.VideoWriter(filename, fourcc, FRAME_RATE, (frame_width, frame_height))
                start_time = current_time
                print(f"Started recording: {filename}")

            ret, frame = cap.read()
            if ret:
                with buffer_locks[camera_name]:  # Acquire lock for thread safety
                    buffers[camera_name].append(frame)  # Add frame to the buffer
                if out:
                    out.write(frame)  # Write the frame to the video file
                print(f"Captured frame for {camera_name}. Buffer size: {len(buffers[camera_name])}")
            else:
                print(f"Failed to read frame from {camera_name}, retrying...")
                time.sleep(1)  # Wait before retrying to read the frame

    finally:
        cap.release()
        if out:
            out.release()

@app.route('/add_camera', methods=['POST'])
def add_camera():
    '''
    In this function add the camera for starting the recording
    '''
    try:
        data = request.json
        camera_name = data.get('camera_name')
        rtsp_link = data.get('rtsp_link')

        if not camera_name or not rtsp_link:
            return jsonify({"error": "Camera name and RTSP link are required."}), 400

        # Start a new thread for the new camera
        if camera_name not in buffers:
            # Start the camera stream in a separate thread
            with ThreadPoolExecutor(max_workers=10) as executor:
                executor.submit(start_stream, rtsp_link, camera_name)
            return jsonify({"message": f"Recording has started for camera {camera_name}."}), 201
        else:
            return jsonify({"error": "Camera with this name already exists."}), 409

    except Exception as e:
        print(f"Error adding camera: {e}")
        return jsonify({"error": "Unable to add camera."}), 500

@app.route('/recordings/<camera_name>', methods=['GET'])
def list_recordings(camera_name):
    ''' this api returns the all video related to particular camera'''
    try:
        folder_path = f"recordings/{camera_name}"
        recordings = os.listdir(folder_path)
        recordings = [rec for rec in recordings if rec.endswith('.avi')]
        return jsonify(recordings), 200
    except Exception as e:
        print(f"Error retrieving recordings for {camera_name}: {e}")
        return jsonify({"error": "Unable to retrieve recordings."}), 500


# @app.route('/playback/<camera_name>/<recording_name>', methods=['GET'])
# def playback_recording(camera_name, recording_name):
#     '''play recording of camera '''
#     try:
#         folder_path = f"recordings/{camera_name}"
#         file_path = os.path.join(folder_path, recording_name)
#         if os.path.exists(file_path):
#             return send_file(file_path, as_attachment=True)
#         else:
#             return jsonify({"error": "Recording not found."}), 404
#     except Exception as e:
#         print(f"Error playing back recording {recording_name} for {camera_name}: {e}")
#         return jsonify({"error": "Unable to play back recording."}), 500


    
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
