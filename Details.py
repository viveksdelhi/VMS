from flask import Flask, request, jsonify , send_from_directory
import os
from flask_cors import CORS
import pickle
import pika

app = Flask(__name__)
CORS(app)

def Logs(camera_ip,type,message):
    try :
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        try:
            # Declare the queue passively (will throw an exception if the queue doesn't exist)
            channel.queue_declare(queue='Logs', passive=True)
        except pika.exceptions.ChannelClosedByBroker:
            channel = connection.channel() 
            channel.queue_declare(queue='Logs')
        try:
            data = {
               "Event Type":"Video Analytics Send Info",
               "Camera":camera_ip,
               "Type":type,
               "Description":message
            }
            serialized_data = pickle.dumps(data)
            channel.basic_publish(
                exchange="",
                routing_key="Logs",
                body=serialized_data
            )
            print(f"Message Publish")
        except Exception as e:
            print(f"Failed to publish message: {e}")

    except Exception as e:
        print({"error": "Failed to connect to RabbitMQ!"})



@app.route('/details', methods=['POST'])
def update_camera_details():
    data = request.get_json()

    cameras = data.get("cameras", [])
    if not cameras:
        return jsonify({"error": "No cameras provided!"}), 400

    for camera in cameras:
        required_fields = ["camera_id", "url", "camera_ip", ]

        if not all(field in camera for field in required_fields):
            return jsonify({"error": f"Missing required fields in camera details for camera {camera.get('camera_id')}!"}), 400
        camera_id = camera["camera_id"]
        camera_url = camera["url"]
        camera_ip = camera["camera_ip"]
        objectlist = camera.get("objectlist", "[]")
        running = camera.get("running", False)
        # Connect to RabbitMQ
        try :
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()
            try:
                # Declare the queue passively (will throw an exception if the queue doesn't exist)
                channel.queue_declare(queue='details', passive=True)
            except pika.exceptions.ChannelClosedByBroker:
                channel = connection.channel() 
                channel.queue_declare(queue='details')
        except Exception as e:
            return jsonify({"error": "Failed to connect to RabbitMQ!"}), 500


        frame_data = {
                "CameraId":camera_id,
                "CameraIp": camera_ip,
                "CameraUrl":camera_url,
                "ObjectList": objectlist,
                "Running":running 
            }
        serialized_frame = pickle.dumps(frame_data)

        # Send the frame to the queue
        # if running:
        try:
            channel.basic_publish(
                exchange="",
                routing_key="details",
                body=serialized_frame
            )
            print(f"Sent camera info{camera_id}")
            Logs(camera_ip,'Sucecss',f"Sent camera info{camera_id}")
        except Exception as e:
            print(f"Failed to publish message: {e}")
            Logs(camera_ip,'Exception',f"Failed to publish message: {e}")

    return jsonify({"message": "Cameras added/updated successfully!"}), 201

@app.route('/media/<camera_ip>/<filename>')
def get_image(camera_ip, filename):
    print(camera_ip,filename)
    camera_folder = os.path.join(os.path.join(os.getcwd(), "media"), camera_ip)
    print(camera_folder)
    return send_from_directory(camera_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6006)
