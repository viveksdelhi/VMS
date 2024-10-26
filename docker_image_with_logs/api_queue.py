# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pickle
# import pika
# import logging

# # Set up logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# app = Flask(__name__)
# CORS(app)

# @app.route('/details', methods=['POST'])

# def update_camera_details():
#     data = request.get_json()

#     cameras = data.get("cameras", [])
#     if not cameras:
#         logging.error("No cameras provided in the request.")
#         return jsonify({"error": "No cameras provided!"}), 400

#     for camera in cameras:
#         required_fields = ["camera_id", "url"]

#         if not all(field in camera for field in required_fields):
#             missing_fields = [field for field in required_fields if field not in camera]
#             logging.error(f"Missing required fields: {missing_fields} for camera {camera.get('camera_id', 'Unknown')}!")
#             return jsonify({"error": f"Missing required fields in camera details for camera {camera.get('camera_id')}!"}), 400

#         camera_id = camera["camera_id"]
#         camera_url = camera["url"]
#         running = camera.get("running", False)

#         # Connect to RabbitMQ
#         try:
#             connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
#             channel = connection.channel()
#             logging.info(f"Connected to RabbitMQ for camera {camera_id}.")
#             try:
#                 # Declare the queue passively (will throw an exception if the queue doesn't exist)
#                 channel.queue_declare(queue='rtspurl_from_api_db', passive=True)
#             except pika.exceptions.ChannelClosedByBroker:
#                 channel = connection.channel()
#                 channel.queue_declare(queue='rtspurl_from_api_db')
#                 logging.info(f"Queue 'rtspurl_from_api_db' declared successfully.")
#         except Exception as e:
#             logging.error(f"Failed to connect to RabbitMQ for camera {camera_id}: {e}")
#             return jsonify({"error": "Failed to connect to RabbitMQ!"}), 500

#         frame_data = {
#             "CameraId": camera_id,
#             "CameraUrl": camera_url,
#             "Running": running
#         }
#         serialized_frame = pickle.dumps(frame_data)

#         # Send the frame to the queue
#         try:
#             channel.basic_publish(
#                 exchange="",
#                 routing_key="rtspurl_from_api_db",
#                 body=serialized_frame
#             )
#             logging.info(f"Sent a frame from camera {camera_id} to RabbitMQ queue.")
#         except Exception as e:
#             logging.error(f"Failed to publish message for camera {camera_id}: {e}")

#     logging.info("Cameras added/updated successfully.")
#     return jsonify({"message": "Cameras added/updated successfully!"}), 201

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=6565)

from flask import Flask, request, jsonify,send_from_directory
from flask_cors import CORS
import pickle
import pika
import logging
import datetime
import os

app = Flask(__name__)
CORS(app)

# Function to send logs to RabbitMQ
def send_log_to_rabbitmq(log_message):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='anpr_logs')
        
        
        # Serialize the log message as JSON and send it to RabbitMQ
        channel.basic_publish(
            exchange='',
            routing_key='anpr_logs',
            body=pickle.dumps(log_message)
        )
        connection.close()
    except Exception as e:
        print(f"Failed to send log to RabbitMQ: {e}")

# Wrapper functions for different log levels
def log_info(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "INFO",
        "Event_Type":"Push RTSPULR into Queue by API",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Push RTSPULR into Queue by API",
        "Message":message,
        "datetime" :current_time,

    }
    send_log_to_rabbitmq(message_data)

@app.route('/anprStartByQueue', methods=['POST'])
def update_camera_details():
    data = request.get_json()

    cameras = data.get("cameras", [])
    if not cameras:
        log_exception("No cameras provided in the request.")
        return jsonify({"error": "No cameras provided!"}), 400

    for camera in cameras:
        required_fields = ["camera_id", "url"]

        if not all(field in camera for field in required_fields):
            missing_fields = [field for field in required_fields if field not in camera]
            log_exception(f"Missing required fields: {missing_fields} for camera {camera.get('camera_id', 'Unknown')}!")
            return jsonify({"error": f"Missing required fields in camera details for camera {camera.get('camera_id')}!"}), 400

        camera_id = camera["camera_id"]
        camera_url = camera["url"]
        running = camera.get("running", False)

        # Connect to RabbitMQ
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()
            log_info(f"Connected to RabbitMQ for camera {camera_id}.")
            try:
                # Declare the queue passively (will throw an exception if the queue doesn't exist)
                channel.queue_declare(queue='rtspurl_from_api_db', passive=True)
            except pika.exceptions.ChannelClosedByBroker:
                channel = connection.channel()
                channel.queue_declare(queue='rtspurl_from_api_db')
                log_info(f"Queue 'rtspurl_from_api_db' declared successfully.")
        except Exception as e:
            log_exception(f"Failed to connect to RabbitMQ for camera {camera_id}: {e}")
            return jsonify({"error": "Failed to connect to RabbitMQ!"}), 500

        frame_data = {
            "CameraId": camera_id,
            "CameraUrl": camera_url,
            "Running": running
        }
        serialized_frame = pickle.dumps(frame_data)

        # Send the frame to the queue
        try:
            channel.basic_publish(
                exchange="",
                routing_key="rtspurl_from_api_db",
                body=serialized_frame
            )
            log_info(f"Sent a frame from camera {camera_id} to RabbitMQ queue.")
        except Exception as e:
            log_exception(f"Failed to publish message for camera {camera_id}: {e}")

    log_info("Cameras added/updated successfully.")
    return jsonify({"message": "Cameras added/updated successfully!"}), 201

@app.route('/<foldername>/<camera_id>/<filename>')
def get_image(foldername,camera_id, filename):
    print(camera_id,filename)
    camera_folder = os.path.join(os.path.join(os.getcwd(), foldername), camera_id)
    print(camera_folder)
    return send_from_directory(camera_folder, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6565)
