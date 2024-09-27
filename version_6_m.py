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

@app.route('/video_feed/<camera_name>')
def video_feed(camera_name):
    def generate():
        last_frame = None
        while True:
            with buffer_locks.get(camera_name, Lock()):  # Use lock to safely access the buffer
                if camera_name in buffers and buffers[camera_name]:
                    last_frame = buffers[camera_name].popleft()  # Get the latest frame
                elif last_frame is not None:
                    print(f"No new frames available for {camera_name}. Replaying last frame.")
                else:
                    print(f"No frames available for {camera_name}.")
                    time.sleep(0.1)  # Prevent busy waiting
                    continue
            
            if last_frame is not None:
                _, jpeg = cv2.imencode('.jpg', last_frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
            time.sleep(1 / FRAME_RATE)  # Maintain the desired frame rate

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')
'''
#old code 
@app.route('/add_camera', methods=['POST'])
def add_camera():
    try:
        data = request.json
        camera_name = data.get('camera_name')
        rtsp_link = data.get('rtsp_link')

        if not camera_name or not rtsp_link:
            return jsonify({"error": "Camera name and RTSP link are required."}), 400

        # Start a new thread for the new camera
        if camera_name not in buffers:
            with ThreadPoolExecutor(max_workers=10) as executor:  # Limit to a number of threads
                executor.submit(start_stream, rtsp_link, camera_name)
            return jsonify({"message": f"Camera {camera_name} added successfully."}), 201
        else:
            return jsonify({"error": "Camera with this name already exists."}), 409

    except Exception as e:
        print(f"Error adding camera: {e}")
        return jsonify({"error": "Unable to add camera."}), 500
    
'''

@app.route('/add_camera', methods=['POST'])
def add_camera():
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


'calculate the disk information'
@app.route('/disk_info', methods=['get'])
def disk_info():
    dir = os.getcwd()
    drive = dir[:3]
    total, used, free = shutil.disk_usage(drive)

    # Convert bytes to gigabytes
    total_gb = total / (1024 ** 3)
    used_gb = used / (1024 ** 3)
    free_gb = free / (1024 ** 3)
    
    data = {
        "total_gb" : f"Total: {total / (1024 ** 3):.2f} GB"
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
