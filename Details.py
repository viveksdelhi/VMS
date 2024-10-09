from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pika

app = Flask(__name__)
CORS(app)

@app.route('/details', methods=['POST'])
def update_camera_details():
    data = request.get_json()

    cameras = data.get("cameras", [])
    if not cameras:
        return jsonify({"error": "No cameras provided!"}), 400

    for camera in cameras:
        # required_fields = ["camera_id", "url", "camera_ip", "camera_name", "location_name", "area_id"]

        # if not all(field in camera for field in required_fields):
        #     return jsonify({"error": f"Missing required fields in camera details for camera {camera.get('camera_id')}!"}), 400
        camera_id = camera["camera_id"]
        camera_url = camera["url"]
        camera_ip = camera["camera_ip"]
        running = camera["running"]
        # Connect to RabbitMQ
        try :
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()
            try:
                # Declare the queue passively (will throw an exception if the queue doesn't exist)
                channel.queue_declare(queue='details', passive=True)
            except pika.exceptions.ChannelClosedByBroker:
                channel.queue_declare(queue='details')
        except Exception as e:
            return jsonify({"error": "Failed to connect to RabbitMQ!"}), 500


        frame_data = {
                "CameraId":camera_id,
                "CameraIp": camera_ip,
                "CameraUrl":camera_url,
            }
        serialized_frame = pickle.dumps(frame_data)

        # Send the frame to the queue
        if running:
            try:
                channel.basic_publish(
                    exchange="",
                    routing_key="details",
                    body=serialized_frame
                )
                print(f"Sent a frame from camera {camera_id}")
            except Exception as e:
                print(f"Failed to publish message: {e}")

    return jsonify({"message": "Cameras added/updated successfully!"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6969)
