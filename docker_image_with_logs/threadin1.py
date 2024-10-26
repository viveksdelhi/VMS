
# import pika
# import time
# import cv2
# import pickle  # To serialize frames
# import struct  # To send the size of the frame
# from multiprocessing import Process, current_process
# import logging


# # Configure logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# # Dictionary to keep track of camera processes
# camera_processes = {}

# def setup_rabbitmq_connection(queue_name, rabbitmq_host, retries=5, retry_delay=5):
#     """
#     Set up a RabbitMQ connection and declare the queue.
#     """
#     for attempt in range(retries):
#         try:
#             connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
#             channel = connection.channel()
#             channel.queue_declare(queue=queue_name)
#             logging.info(f"Connected to RabbitMQ at {rabbitmq_host}")
#             return connection, channel
#         except pika.exceptions.AMQPConnectionError as e:
#             logging.error(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
#             time.sleep(retry_delay)
#     raise Exception(f"Could not connect to RabbitMQ after {retries} attempts")

# def process_video(camera_url, camera_id, rabbitmq_host, queue_name, frame_interval, retry_limit=3):
#     """
#     Process the video stream and send frames to RabbitMQ.
#     """
#     retry_count = 0
#     while retry_count < retry_limit:
#         cap = cv2.VideoCapture(camera_url)

#         if not cap.isOpened():
#             logging.error(f"Error: Could not open video stream from {camera_url}")
#             retry_count += 1
#             time.sleep(5)
#             continue

#         logging.info(f"Processing video stream from {camera_id}")
#         connection, channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)

#         frame_count = 0
#         last_frame_time = time.time()

#         try:
#             while cap.isOpened():
#                 ret, frame = cap.read()

#                 if not ret:
#                     if time.time() - last_frame_time > 5:
#                         logging.warning(f"No frame received for 5 seconds from {camera_id}, restarting...")
#                         break
#                     continue

#                 last_frame_time = time.time()

#                 frame_count += 1
#                 if frame_count % frame_interval != 0:
#                     continue

#                 frame_count = 0

#                 frame_data = {
#                     "camera_id": camera_id,
#                     "frame": frame
#                 }
#                 serialized_frame = pickle.dumps(frame_data)

#                 channel.basic_publish(
#                     exchange="",
#                     routing_key=queue_name,
#                     body=serialized_frame
#                 )
#                 logging.info(f"Sent a frame from camera {camera_id} (Process ID: {current_process().pid})")

#         except Exception as e:
#             logging.error(f"An error occurred in camera {camera_id}: {e}")
#         finally:
#             cap.release()
#             connection.close()
#             logging.info(f"Camera {camera_id}: Video processing complete. RabbitMQ connection closed.")
#             retry_count += 1
#             if retry_count >= retry_limit:
#                 logging.error(f"Failed to process video stream after {retry_count} retries.")
#                 break

# def start_camera_process(camera_url, camera_id, rabbitmq_host, queue_name="all_frame", frame_interval=15):
#     """
#     Start a separate process for each camera.
#     """
#     process = Process(target=process_video, args=(camera_url, camera_id, rabbitmq_host, queue_name, frame_interval))
#     process.start()
#     camera_processes[camera_id] = process  # Store process in the dictionary
#     return process

# def stop_camera_process(camera_id):
#     """
#     Stop the camera process if it's running.
#     """
#     process = camera_processes.get(camera_id)
#     if process and process.is_alive():
#         logging.info(f"Stopping process for camera {camera_id}")
#         process.terminate()
#         process.join()
#         logging.info(f"Camera {camera_id}: Process stopped.")
#         del camera_processes[camera_id]  # Remove from dictionary
#     else:
#         logging.warning(f"No active process found for camera {camera_id}")

# def fetch_camera_data_from_queue(queue_name, rabbitmq_host="localhost"):
#     """
#     Fetch camera ID and RTSP URL from RabbitMQ queue and manage the camera processes.
#     """
#     connection, channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
    
#     def callback(ch, method, properties, body):
#         try:
#             # Deserialize the message using pickle instead of JSON
#             camera_data = pickle.loads(body)

#             camera_id = camera_data.get('CameraId')
#             camera_url = camera_data.get('CameraUrl')
#             running_status = camera_data.get('Running').upper()  # status True or False
#             print("Camera Status :", running_status)

#             # Start or stop camera process based on status
#             if running_status=="TRUE":
#                 # Start the process only if it doesn't already exist or isn't running
#                 if camera_id in camera_processes and camera_processes[camera_id].is_alive():
#                     logging.info(f"Camera {camera_id} is already running.")
#                 else:
#                     logging.info(f"Starting camera process for {camera_id}.")
#                     start_camera_process(camera_url, camera_id, rabbitmq_host)
#             else:
#                 # If status is False, stop the process if it exists
#                 if camera_id in camera_processes and camera_processes[camera_id].is_alive():
#                     logging.info(f"Stopping camera process for {camera_id}.")
#                     stop_camera_process(camera_id)
#                 else:
#                     logging.warning(f"No active process found for camera {camera_id} to stop.")

#         except Exception as e:
#             logging.error(f"Failed to process message from RabbitMQ: {e}")

#     # Start consuming the queue
#     channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
#     logging.info(f"Waiting for camera data from queue {queue_name}...")
#     channel.start_consuming()


# if __name__ == "__main__":
#     # Fetch camera ID and RTSP URL from RabbitMQ queue 'details'
#     fetch_camera_data_from_queue(queue_name="rtspurl_from_api_db")


import pika
import time
import cv2
import pickle  # To serialize frames
import struct  # To send the size of the frame
from multiprocessing import Process, current_process
import logging
import datetime


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
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message_data = {
        "log_level" : "INFO",
        "Event_Type":"Start threads for send frames",
        "Message":message,
        "datetime":current_time,

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
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Start threads for send frames",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Dictionary to keep track of camera processes
camera_processes = {}

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

def process_video(camera_url, camera_id, rabbitmq_host, queue_name, frame_interval, retry_limit=3):
    """
    Process the video stream and send frames to RabbitMQ.
    """
    retry_count = 0
    while retry_count < retry_limit:
        cap = cv2.VideoCapture(camera_url)

        if not cap.isOpened():
            log_error(f"Error: Could not open video stream from {camera_url}")
            retry_count += 1
            time.sleep(5)
            continue

        log_info(f"Processing video stream from {camera_id}")
        connection, channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)

        frame_count = 0
        last_frame_time = time.time()

        try:
            while cap.isOpened():
                ret, frame = cap.read()

                if not ret:
                    if time.time() - last_frame_time > 5:
                        log_error(f"No frame received for 5 seconds from {camera_id}, restarting...")
                        break
                    continue

                last_frame_time = time.time()

                frame_count += 1
                if frame_count % frame_interval != 0:
                    continue

                frame_count = 0

                frame_data = {
                    "camera_id": camera_id,
                    "frame": frame
                }
                serialized_frame = pickle.dumps(frame_data)

                channel.basic_publish(
                    exchange="",
                    routing_key=queue_name,
                    body=serialized_frame
                )
                log_info(f"Sent a frame from camera {camera_id} (Process ID: {current_process().pid})")

        except Exception as e:
            log_exception(f"An error occurred in camera {camera_id}: {e}")
        finally:
            cap.release()
            connection.close()
            log_info(f"Camera {camera_id}: Video processing complete. RabbitMQ connection closed.")
            retry_count += 1
            if retry_count >= retry_limit:
                log_error(f"Failed to process video stream after {retry_count} retries.")
                break

def start_camera_process(camera_url, camera_id, rabbitmq_host, queue_name="all_frame", frame_interval=15):
    """
    Start a separate process for each camera.
    """
    process = Process(target=process_video, args=(camera_url, camera_id, rabbitmq_host, queue_name, frame_interval))
    process.start()
    camera_processes[camera_id] = process  # Store process in the dictionary
    return process

def stop_camera_process(camera_id):
    """
    Stop the camera process if it's running.
    """
    process = camera_processes.get(camera_id)
    if process and process.is_alive():
        log_info(f"Stopping process for camera {camera_id}")
        process.terminate()
        process.join()
        log_info(f"Camera {camera_id}: Process stopped.")
        del camera_processes[camera_id]  # Remove from dictionary
    else:
        log_error(f"No active process found for camera {camera_id}")

def fetch_camera_data_from_queue(queue_name, rabbitmq_host="localhost"):
    """
    Fetch camera ID and RTSP URL from RabbitMQ queue and manage the camera processes.
    """
    connection, channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
    
    def callback(ch, method, properties, body):
        try:
            # Deserialize the message using pickle instead of JSON
            camera_data = pickle.loads(body)

            camera_id = camera_data.get('CameraId')
            camera_url = camera_data.get('CameraUrl')
            running_status = camera_data.get('Running').upper()  # status True or False

            # Start or stop camera process based on status
            if running_status=="TRUE":
                # Start the process only if it doesn't already exist or isn't running
                if camera_id in camera_processes and camera_processes[camera_id].is_alive():
                    log_info(f"Camera {camera_id} is already running.")
                else:
                    log_info(f"Starting camera process for {camera_id}.")
                    start_camera_process(camera_url, camera_id, rabbitmq_host)
            else:
                # If status is False, stop the process if it exists
                if camera_id in camera_processes and camera_processes[camera_id].is_alive():
                    log_info(f"Stopping camera process for {camera_id}.")
                    stop_camera_process(camera_id)
                else:
                    log_error(f"No active process found for camera {camera_id} to stop.")

        except Exception as e:
            log_exception(f"Failed to process message from RabbitMQ: {e}")

    # Start consuming the queue
    channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
    log_info(f"Waiting for camera data from queue {queue_name}...")
    channel.start_consuming()


if __name__ == "__main__":
    # Fetch camera ID and RTSP URL from RabbitMQ queue 'details'
    fetch_camera_data_from_queue(queue_name="rtspurl_from_api_db")
