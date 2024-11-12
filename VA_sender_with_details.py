import pika
import cv2
import pickle  # To serialize frames
import multiprocessing
from flask import Flask, request, jsonify
import logging
from flask_cors import CORS
import base64


logging.getLogger('ultralytics').setLevel(logging.CRITICAL)

app = Flask(__name__)
CORS(app)

def setup_rabbitmq_connection(queue_name):
    """
    Set up a RabbitMQ connection and declare the queue.
    
    Args:
        queue_name (str): The name of the queue to be used.

    Returns:
        tuple: The RabbitMQ connection and channel objects.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name)
    return connection, channel

def process_video(camera_id, camera_ip, camera_url, camera_name, location_name, longitude, latitude, area_id, queue_name, frame_interval=5):
    """
    Process the video stream and send frames to RabbitMQ.

    Args:
        camera_url (str): The URL or path of the camera/video stream.
        camera_id (str): A unique ID for the camera.
        queue_name (str): The queue to send the video frames to.
        frame_interval (int): Interval for sending frames to the queue.
    """
    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        print(f"Error: Could not open video stream from {camera_url}")
        return

    connection, channel = setup_rabbitmq_connection(queue_name)
    print(f"Connected to RabbitMQ and created channel: {channel}")

    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            print("End of video or error in reading frame.")
            break

        # Only send every `frame_interval`th frame
        frame_count += 1
        if frame_count != frame_interval:
            continue

        frame_count = 0

        # Serialize the frame and camera metadata
        _, buffer = cv2.imencode('.jpg', frame)
        frame_data = {
            "CameraIp": camera_ip,
            "CameraName": camera_name,
            "AreaId": int(area_id),
            "Lat": latitude,
            "Lng": longitude,
            "LocationName": location_name,
            "Frame": base64.b64encode(buffer).decode('utf-8')
        }
        serialized_frame = pickle.dumps(frame_data)

        # Send the frame to the queue
        try:
            channel.basic_publish(
                exchange="",
                routing_key=queue_name,
                body=serialized_frame
            )
            print(f"Sent a frame from camera {camera_id}")
        except Exception as e:
            print(f"Failed to publish message: {e}")

    # Release the video capture resource
    cap.release()
    connection.close()
    print("Released video capture and closed RabbitMQ connection.")

def main(camera_id, camera_ip, camera_url, camera_name, location_name, longitude, latitude, area_id, frame_interval=15):
    """
    Main function to set up RabbitMQ and process the video.

    Args:
        camera_url (str): The URL or path of the camera/video stream.
        camera_id (str): A unique ID for the camera.
        queue_name (str): The RabbitMQ queue name.
        frame_interval (int): Interval for sending frames to the queue.
    """
    queue_name = f"{camera_id}-{camera_ip}"
    process_video(camera_id, camera_ip, camera_url, camera_name, location_name, longitude, latitude, area_id, queue_name, frame_interval)

@app.route('/details', methods=['POST'])
def update_camera_details():
    data = request.get_json()

    cameras = data.get("cameras", [])
    if not cameras:
        return jsonify({"error": "No cameras provided!"}), 400

    processes = []

    for camera in cameras:
        required_fields = ["camera_id", "url", "camera_ip", "camera_name", "location_name", "area_id"]

        if not all(field in camera for field in required_fields):
            return jsonify({"error": f"Missing required fields in camera details for camera {camera.get('camera_id')}!"}), 400

        camera_id = camera["camera_id"]
        camera_url = camera["url"]
        camera_ip = camera["camera_ip"]
        camera_name = camera["camera_name"]
        location_name = camera["location_name"]
        latitude = camera["latitude"]
        longitude = camera["longitude"]
        area_id = camera["area_id"]
        # main(camera_id, camera_ip, camera_url, camera_name, location_name, longitude, latitude, area_id)
        process = multiprocessing.Process(target=main, args=(camera_id, camera_ip, camera_url, camera_name, location_name, longitude, latitude, area_id))
        processes.append(process)
        process.start()

    return jsonify({"message": "Cameras added/updated successfully!"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)
