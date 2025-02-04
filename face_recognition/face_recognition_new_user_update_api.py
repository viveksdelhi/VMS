from flask import Flask, request, jsonify , send_from_directory
import os
from flask_cors import CORS
import pickle
import pika
import logging
import datetime
import time
app = Flask(__name__)
CORS(app)


def setup_rabbitmq_connection(queue_name, retries=5, retry_delay=5):
    """
    Set up a RabbitMQ connection and declare the queue.
    """
    rabbitmq_host = "rabbitmq"
    for attempt in range(retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host="rabbitmq", heartbeat=600))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            print(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            print(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise Exception(f"Could not connect to RabbitMQ after {retries} attempts")


def send_log_to_rabbitmq(log_message):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq',heartbeat=600))
        channel = connection.channel()
        channel.queue_declare(queue='face_logs')  # Declare the queue for logs
        # Serialize the log message as JSON and send it to RabbitMQ
        channel.basic_publish(
            exchange='',
            routing_key='face_logs',
            body=pickle.dumps(log_message)
        )
        connection.close()
    except Exception as e:
        print(f"Failed to send log to RabbitMQ: {e}")

# Wrapper functions for logging and sending logs to RabbitMQ
def log_info(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "INFO",
        "Event_Type":"Update New User",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_error(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "ERROR",
        "Event_Type":"Update New User",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)    

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Update New User",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)



@app.route('/UpdateNewUser', methods=['POST'])
def update_user_details():
    data = request.get_json()

    cameras = data.get("cameras", [])
    if not cameras:
        log_info(f"No user provided!")
        return jsonify({"error": "No user provided!"}), 400

    for camera in cameras:
        required_fields = ["running"]

        if not all(field in camera for field in required_fields):
            log_error("Missing required fields in user details for user")
            return jsonify({"error": "Missing required fields in user details for user"}), 400
        
        new_user_status = camera.get("running", False)
        
        # Connect to RabbitMQ
        queue_name='new_user_for_face_recognition'
        new_user = new_user_status.upper()

        connection, channel = setup_rabbitmq_connection(queue_name)
        if not channel.is_open:
            log_error("Receiver channel is closed. Attempting to reconnect.")
            connection, channel = setup_rabbitmq_connection(queue_name)

        frame_data = {
                "New_User": new_user,
            }
        serialized_frame = pickle.dumps(frame_data)
        #print("frame_data :", frame_data)

        # Send the frame to the queue
        # if running:
        try:
            channel.basic_publish(
                exchange="",
                routing_key=queue_name,
                body=serialized_frame
            )
            #print(f"Sent camera info{camera_id}")
            log_info("Sent user info for face recognition")
        except Exception as e:
            print(f"Failed to publish message: {e}")
            log_exception(f"Failed to publish message: {e} and new user info")
    log_info("Cameras added/updated successfully!")
    return jsonify({"message": "User added/updated successfully!"}), 201

@app.route('/app/<folder>/<camera_id>/<filename>')
def get_image(folder,camera_id, filename):
    
    camera_folder = os.path.join(os.path.join(os.getcwd(), folder),camera_id)
    print(camera_folder)
    return send_from_directory(camera_folder, filename)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7676)
