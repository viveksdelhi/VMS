
# import pika
# import os
# import pickle  # To deserialize and serialize frames
# import struct  # To handle frame size unpacking
# from ultralytics import YOLO
# import datetime
# import cv2

# # Load the YOLO model
# model = YOLO("yolov8s.pt")
# vehicle = [2, 3, 5, 7]

# # Directory to save frames 
# vehicle_frame = "vehicle_frame"
# os.makedirs(vehicle_frame, exist_ok=True)


# def setup_rabbitmq_connection(queue_name):
#     """
#     Set up a RabbitMQ connection and declare the queue.
    
#     Args:
#         queue_name (str): The name of the queue to be used.
        
#     Returns:
#         tuple: The RabbitMQ connection and channel objects.
#     """
#     connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
#     channel = connection.channel()
#     channel.queue_declare(queue=queue_name)
#     return connection, channel

# def process_frame(ch, method, properties, body, processed_channel):
#     """
#     Callback function to process the received frames from RabbitMQ.

#     Args:
#         ch, method, properties: RabbitMQ parameters.
#         body: The serialized frame data received from the queue.
#         processed_channel: RabbitMQ channel for sending processed frames.
#     """
#     try:
#         # Deserialize the frame and metadata
#         frame_data = pickle.loads(body)
#         camera_id = frame_data["camera_id"]
#         frame = frame_data["frame"]
        
#         # Detect and classify objects in the frame
#         results = model(frame)[0]
#         for result in results.boxes.data.tolist():
#             x1, y1, x2, y2, score, id = result
#             if int(id) in vehicle and score > 0.6:
#                 # Serialize the frame and send it to the 'processed_frames' queue
#                 processed_frame_data = {
#                     "camera_id": camera_id,
#                     "frame": frame
#                 }
#                 now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#                 # Save original frame
#                 frame_path = os.path.join(vehicle_frame, f'{now}.jpg')
#                 cv2.imwrite(frame_path, frame)
#                 serialized_frame = pickle.dumps(processed_frame_data)

#                 # Send the frame to the 'processed_frames' queue
#                 processed_channel.basic_publish(
#                     exchange="",
#                     routing_key="detected_vehicle",
#                     body=serialized_frame
#                 )
#                 print("Detection detail :", results.names[int(id)])
        

#         # Print metadata (camera ID and timestamp)
#         print(f"Received frame from Camera ID: {camera_id}")
        

#     except Exception as e:
#         print(f"Error processing frame: {e}")

# def main(queue_name="all_frame", processed_queue_name="detected_vehicle"):
#     """
#     Main function to set up RabbitMQ connections for receiving and sending frames.

#     Args:
#         queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
#         processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
#     """
#     # Set up RabbitMQ connection and channel for receiving frames
#     receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name)

#     # Set up RabbitMQ connection and channel for sending processed frames
#     processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name)

#     try:
#         # Start consuming frames from the 'video_frames' queue
#         receiver_channel.basic_consume(
#             queue=queue_name, 
#             on_message_callback=lambda ch, method, properties, body: process_frame(
#                 ch, method, properties, body, processed_channel
#             ),
#             auto_ack=True
#         )
#         print("Waiting for video frames...")
#         receiver_channel.start_consuming()
#     except Exception as e:
#         print(f"An error occurred: {e}")
#     finally:
#         # Close the connections when done
#         receiver_connection.close()
#         processed_connection.close()
#         print("Receiver stopped. RabbitMQ connections closed.")

# if __name__ == "__main__":
#     # Start the receiver and sender
#     main()


import pika
import os
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
from ultralytics import YOLO
import datetime
import cv2
import logging
import time
import requests

url = "https://vmsapi2.ajeevi.in/api/VehicleDetection/Post"

# Load the YOLO model
model = YOLO("yolov8s.pt")
vehicle = [2, 3, 5, 7]

# Function to send logs to RabbitMQ
def send_log_to_rabbitmq(log_message):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
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
        "Event_Type":"Start threads for send frames",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_error(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "ERROR",
        "Event_Type":"Start threads for send frames",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)    

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Start threads for send frames",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)


# Directory to save frames 
vehicle_frame = "vehicle_frame"
os.makedirs(vehicle_frame, exist_ok=True)


def setup_rabbitmq_connection(queue_name, rabbitmq_host, retries=5, retry_delay=5):
    """
    Set up a RabbitMQ connection and declare the queue.
    """
    for attempt in range(retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            log_info(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            log_error(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise log_exception(f"Could not connect to RabbitMQ after {retries} attempts")

def process_frame(ch, method, properties, body, processed_channel):
    """
    Callback function to process the received frames from RabbitMQ.

    Args:
        ch, method, properties: RabbitMQ parameters.
        body: The serialized frame data received from the queue.
        processed_channel: RabbitMQ channel for sending processed frames.
    """
    try:
        # Deserialize the frame and metadata
        frame_data = pickle.loads(body)
        camera_id = frame_data["camera_id"]
        frame = frame_data["frame"]
        
        # Detect and classify objects in the frame
        results = model(frame)[0]
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, id = result
            if int(id) in vehicle and score > 0.5:
                # Serialize the frame and send it to the 'processed_frames' queue
                vehicle_type = results.names[int(id)]
                processed_frame_data = {
                    "camera_id": camera_id,
                    "frame": frame
                }
                now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                
                # Create a directory with the camera ID as its name
                camera_dir = os.path.join(vehicle_frame, str(camera_id))
                os.makedirs(camera_dir, exist_ok=True)

                # Save the original frame in the corresponding camera folder
                frame_path = os.path.join(camera_dir, f'{now}.jpg')

                # Get the current working directory and construct the full path
                full_frame_path = os.path.join(os.getcwd(), camera_dir, f'{now}.jpg')
                cv2.imwrite(full_frame_path, frame)
                print("full frame paht", full_frame_path)
                
                serialized_frame = pickle.dumps(processed_frame_data)

                # Send the frame to the 'processed_frames' queue
                processed_channel.basic_publish(
                    exchange="",
                    routing_key="detected_vehicle",
                    body=serialized_frame
                )

                vehicledata = {
                    "cameraId": camera_id,
                    "framePath": full_frame_path,
                    "vehicleType": vehicle_type,
                }
                # Send POST request with JSON data
                response = requests.post(url, json=vehicledata)

                # Check response status
                if response.status_code == 200:
                    log_info(f"Data sent successfully: {response.json()}")
                else:
                    log_error(f"Failed to send data. Status code: {response.status_code}")
                #log_info(f"Vehicle detected with camera id {camera_id}: {results.names[int(id)]}")
            else:
                log_error(f"No vehicle detected with camera id {camera_id}")
        
        

        # Print metadata (camera ID and timestamp)
        log_info(f"Received frame from Camera ID: {camera_id}")
        

    except Exception as e:
        log_exception(f"Error processing frame: {e}")

def main(queue_name="all_frame", processed_queue_name="detected_vehicle", rabbitmq_host="localhost"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
        processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
    """
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name,rabbitmq_host)

    # Set up RabbitMQ connection and channel for sending processed frames
    processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

    try:
        # Start consuming frames from the 'video_frames' queue
        receiver_channel.basic_consume(
            queue=queue_name, 
            on_message_callback=lambda ch, method, properties, body: process_frame(
                ch, method, properties, body, processed_channel
            ),
            auto_ack=True
        )
        log_info("Waiting for video frames...")
        receiver_channel.start_consuming()
    except Exception as e:
        log_error(f"An error occurred: {e}")
    finally:
        # Close the connections when done
        receiver_connection.close()
        processed_connection.close()
        log_exception("Receiver stopped. RabbitMQ connections closed.")

if __name__ == "__main__":
    # Start the receiver and sender
    main()
