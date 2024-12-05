from ultralytics import YOLO
import pika
import os
import pickle
import struct
import datetime
import cv2
import logging
import time
import requests
import base64
import numpy as np

# Load the YOLO models
helmet_model = YOLO("hemletYoloV8_100epochs.pt")
bike_model = YOLO("yolov8s.pt")
cattle_model = YOLO("yolov8s.pt")
class_filter = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23]


# Environment variables
queue_name = os.getenv("QUEUE_NAME")   # Read QUEUE NAME from environment variable
processed_queue_name = os.getenv("PROCESSED_QUEUE_NAME")  # Read QUEUE NAME from environment variable


# Logging functions
def Logs(camera_ip,type,message):
    try :
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq', heartbeat=600))
        channel = connection.channel()
        try:
            # Declare the queue passively (will throw an exception if the queue doesn't exist)
            channel.queue_declare(queue='Logs', passive=True)
        except pika.exceptions.ChannelClosedByBroker:
            channel = connection.channel() 
            channel.queue_declare(queue='Logs')
        try:
            data = {
               "Event Type":"Video Analytics send Event",
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


def detect_cattle(model, image,camera_id, camera_ip, date_time, processed_channel, confidence_threshold=0.4):
    cattle_detection = False
    object_detect = {}
    results = model(image)[0]
    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result
        if score > confidence_threshold and int(class_id) in class_filter:
            cattle_detection = True
            cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)  # Red bounding box
            label = results.names[int(class_id)].upper()
            cv2.putText(image, label, (int(x1) + 5, int(y1) - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            object_detect[label] = object_detect.get(label, 0) + 1
        else:
            Logs(camera_ip,"info", f"Cattle is not detected from camera ip {camera_ip}")    
            

    if cattle_detection:
        _, buffer = cv2.imencode('.jpg', image)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')

        # Create the data to send to the new queue
        image_info = {
            "Event Type":"Analytics",
            "CameraId": camera_id,
            'CameraIp': camera_ip,
            'Datetime': date_time,
            'Image': encoded_frame,
            'Object': object_detect
        }
        
        serialized_frame = pickle.dumps(image_info)
        processed_channel.basic_publish(exchange='', routing_key=processed_queue_name, body=serialized_frame)
        Logs(camera_ip,"info", f"Cattle is detected from camera ip {camera_ip}")


# Helmet and bike detection functions
def detect_helmet(model, image, camera_id, confidence_threshold=0.4):
    helmet_detected = False
    results = model(image)[0]
    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result
        if score > confidence_threshold:
            label = results.names[int(class_id)].upper()
            if label=="HEAD":
                helmet_detected = True
                cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)  # Green bounding box
                cv2.putText(image, label, (int(x1) + 5, int(y1) - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                Logs(camera_id,"info", f"Head is detected from camera ip {camera_id}")
            else:
                Logs(camera_id,"info", f"Head is not detected from camera ip {camera_id}")    
    return helmet_detected

def detect_bike(model, image,camera_id, camera_ip, date_time, processed_channel, confidence_threshold=0.4, class_filter=3):
    bike_detection = False
    object_detect = {}
    results = model(image)[0]
    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, class_id = result
        if score > confidence_threshold and int(class_id) == class_filter:
            bike_detection = True
            cv2.rectangle(image, (int(x1) - 10, int(y1) - 120), (int(x2) + 40, int(y2)), (0, 0, 255), 2)  # Red bounding box
            label = results.names[int(class_id)].upper()
            cv2.putText(image, label, (int(x1) + 5, int(y1) - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            object_detect[label] = object_detect.get(label, 0) + 1
        else:
             Logs(camera_ip,"info", f"Mootrcycle is not detected from camera ip {camera_ip}")  

    if bike_detection:
        # now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        _, buffer = cv2.imencode('.jpg', image)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')

        # Create the data to send to the new queue
        image_info = {
            "Event Type":"Analytics",
            "CameraId": camera_id,
            'CameraIp': camera_ip,
            'Datetime': date_time,
            'Image': encoded_frame,
            'Object': object_detect
        }
        serialized_frame = pickle.dumps(image_info)
        processed_channel.basic_publish(exchange='', routing_key=processed_queue_name, body=serialized_frame)
        Logs(camera_ip,"info", f"Mootrcycle is detected from camera ip {camera_ip}")
             

# Frame processing function
def process_frame(ch, method, properties, body, processed_channel, processed_queue_name, rabbitmq_host):
    try:
        frame_data = pickle.loads(body)
        frame = frame_data["Frame"]
        camera_ip = frame_data["CameraIp"]
        camera_id = frame_data["CameraId"]
        date_time = frame_data["Datetime"]
        objectlist = frame_data["ObjectList"]

        data = base64.b64decode(frame)
        nparr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if not processed_channel.is_open:
                Logs(None,"error", "Receiver channel is closed. Attempting to reconnect.")
                processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
        detect_cattle(cattle_model, frame, camera_id, camera_ip, date_time, processed_channel)


        # Perform helmet detection
        if detect_helmet(helmet_model, frame, camera_id):
            Logs(None,"info", "Helmet detected. Checking for bike...")
            
            if not processed_channel.is_open:
                Logs(None,"error", "Receiver channel is closed. Attempting to reconnect.")
                processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
            detect_bike(bike_model, frame, camera_id, camera_ip, date_time, processed_channel)
        else:
            Logs(None,"info", f"No helmet detected.")
        
    except Exception as e:
        Logs(None,"exception", f"Error processing frame: {e}")

# RabbitMQ setup
def setup_rabbitmq_connection(queue_name, rabbitmq_host, retries=5, retry_delay=5):
    for attempt in range(retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, heartbeat=600))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            Logs(None,"info", f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            Logs(None,"error", f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise Logs(None,"exception", f"Could not connect to RabbitMQ after {retries} attempts")


# Main function
def main(queue_name=queue_name, processed_queue_name=processed_queue_name, rabbitmq_host="rabbitmq"):
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
    processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

    while True:
        try:
            print("Connected to RabbitMQ")
            receiver_channel.basic_consume(
                queue=queue_name,
                on_message_callback=lambda ch, method, properties, body: process_frame(
                    ch, method, properties, body, processed_channel, processed_queue_name, rabbitmq_host
                ),
                auto_ack=True
            )
            Logs(None,"info", f"Waiting for video frames...")
            receiver_channel.start_consuming()
        except pika.exceptions.ConnectionClosedByBroker:
            Logs(None,"Error", f"Connection closed by broker, reconnecting...")
            receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
            processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
        except Exception as e:
            Logs(None,"exception", f"Unexpected error: {e}")
            
            time.sleep(25)

if __name__ == "__main__":
    main()
