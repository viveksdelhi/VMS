import pika
import cv2
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
from ultralytics import YOLO
import cv2
import os
import datetime
import logging
import time
import requests

#url = "https://vmsapi3.ajeevi.in/api/NumberPlateDetection/Post"
url = os.getenv("API_URL")
# Directory to save frame with number plate 
vehicle_plate_frame = "plate_frame"
os.makedirs(vehicle_plate_frame, exist_ok=True)

# Load the YOLO model
model = YOLO("license_plate_detector.pt")

# Function to send logs to RabbitMQ
def send_log_to_rabbitmq(log_message):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq',heartbeat=600))
        channel = connection.channel()
        channel.queue_declare(queue='anpr_logs')  # Declare the queue for logs
        # Serialize the log message as JSON and send it to RabbitMQ
        channel.basic_publish(
            exchange='',
            routing_key='anpr_logs',
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
        "Event_Type":"Numbper Plate detection event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_error(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "ERROR",
        "Event_Type":"Numbper Plate detection event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)    

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Numbper Plate detection event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)



def setup_rabbitmq_connection(queue_name, rabbitmq_host, retries=5, retry_delay=5):
    """
    Set up a RabbitMQ connection and declare the queue.
    """
    for attempt in range(retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, heartbeat=600))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            log_info(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            log_error(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise log_exception(f"Could not connect to RabbitMQ after {retries} attempts")
def process_frame(ch, method, properties, body, processed_channel, processed_queue_name, rabbitmq_host):
    """
    Callback function to process the received frames from RabbitMQ.

    Args:
        ch, method, properties: RabbitMQ parameters.
        body: The serialized frame data received from the queue.
        processed_channel: RabbitMQ channel for sending processed frames.
    """
    if not processed_channel.is_open:
        log_error("Receiver channel is closed. Attempting to reconnect.")
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
    try:
        # Deserialize the frame and metadata
        frame_data = pickle.loads(body)
        camera_id = frame_data.get("camera_id", "Unknown")  # Default to 'Unknown' if not found
        frame = frame_data.get("frame", None)  # Ensure 'frame' is present
        user_id = frame_data.get("user_id", "Unknown") # Default to 'Unknown'
        credit_id = frame_data.get("credit_id", "Unknown") # Default    
        date_time = frame_data.get("date_time", "Unknown") # Default

        if frame is None:
            raise log_error("Frame data is missing from the message")

        # Detect and classify objects in the frame
        results = model(frame)[0]
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, id = result
            if score > 0.5:
                # Slice license plate
                license_plate_crop = frame[int(y1):int(y2), int(x1): int(x2), :]
                # Process license plate
                license_plate_crop_resized = cv2.resize(license_plate_crop, (200, 100))
                license_plate_crop_gray = cv2.cvtColor(license_plate_crop_resized, cv2.COLOR_BGR2GRAY)
                _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 155, 255, cv2.THRESH_BINARY_INV)
                
                # Serialize the processed license plate frame
                processed_frame_data = {
                    "camera_id": camera_id,
                    "frame" : frame,
                    "frame_plate": license_plate_crop_gray,
                    "user_id": user_id,
                    "credit_id": credit_id,
                    "date_time": date_time
                }
                now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                # Create a directory with the camera ID as its name
                camera_dir = os.path.join(vehicle_plate_frame, str(camera_id))
                os.makedirs(camera_dir, exist_ok=True)

                # Save original frame
                # full_frame_path = os.path.join(os.getcwd(), camera_dir, f'{now}.jpg')
                # cv2.imwrite(full_frame_path, license_plate_crop_gray)

                serialized_frame = pickle.dumps(processed_frame_data)

                # Send the processed frame to the 'processed_frames' queue
                processed_channel.basic_publish(
                    exchange="",
                    routing_key="detected_plate",
                    body=serialized_frame
                )

                platedata = {
                    "cameraId": camera_id,
                    "platePath": None,
                }
                # Send POST request with JSON data
                response = requests.post(url, json=platedata)

                # Check response status
                # if response.status_code == 200:
                #     log_info(f"Data sent successfully: {response.json()}")
                #     print("Success send data successfully")
                # else:
                #     log_error(f"Failed to send data. Status code: {response.status_code}")
                #     print("Failed send data successfully")
                # log_info(f"License plate detected from camera id {camera_id}")
            else:
                log_error(f"No license plate detected from camera id {camera_id}")    

        # Print metadata (camera ID)
        log_info(f"Received frame from Camera ID: {camera_id}")

    except Exception as e:
        log_exception(f"Error processing frame --=: {e}")
        # Set up RabbitMQ connection and channel for sending processed frames
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)


def main(queue_name="detected_vehicle", processed_queue_name="detected_plate", rabbitmq_host="rabbitmq"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
        processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
    """
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)

    # Set up RabbitMQ connection and channel for sending processed frames
    processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
    # ---------------------------------------------------
    if not receiver_channel.is_open:
        log_error("Receiver channel is closed. Attempting to reconnect.")
        receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
    if not processed_channel.is_open:
        log_error("Receiver channel is closed. Attempting to reconnect.")
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)    

    while True:
        try:
            if not receiver_channel.is_open:
                log_error("Receiver channel is closed. Attempting to reconnect.")
                time.sleep(25)
                receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
            if not processed_channel.is_open:
                log_error("Receiver channel is closed. Attempting to reconnect.")
                time.sleep(25)
                processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)  
            # Start consuming frames from the 'video_frames' queue
            receiver_channel.basic_consume(
                queue=queue_name, 
                on_message_callback=lambda ch, method, properties, body: process_frame(
                    ch, method, properties, body, processed_channel,processed_queue_name, rabbitmq_host 
                ),
                auto_ack=True
            )
            log_info("Waiting for video frames...")
            receiver_channel.start_consuming()
        except pika.exceptions.ConnectionClosedByBroker as e:
            log_error("Connection closed by broker, reconnecting...")
            time.sleep(25)
            receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
            processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
        except Exception as e:
            log_exception(f"Unexpected error: {e}")
            time.sleep(25)
            continue
    

if __name__ == "__main__":
    # Start the receiver and sender
    main()
