
# import pika
# import pickle  # To deserialize and serialize frames
# import struct  # To handle frame size unpacking
# import re
# from paddleocr import PaddleOCR
# import os
# import cv2
# import datetime
# import requests
# # API endpoint
# url = "https://vmsapi2.ajeevi.in/api/DetectionVehicle/Post"

# # Initialize the OCR model
# ocr = PaddleOCR(use_angle_cls=True, lang='en')

# # Directory to save frames and cropped license plates
# save_frame = 'frames'
# save_plate = 'plates'
# os.makedirs(save_frame, exist_ok=True)
# os.makedirs(save_plate, exist_ok=True)

# temp = None

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

# #-------------------------------------------------------------------------------
# def process_frame(ch, method, properties, body):
#     """
#     Callback function to process the received frames from RabbitMQ.

#     Args:
#         ch, method, properties: RabbitMQ parameters.
#         body: The serialized frame data received from the queue.
#     """
#     global temp  # Use the global temp variable to track last detected plate
#     try:
#         # Deserialize the frame and metadata
#         frame_data = pickle.loads(body)
#         camera_id = frame_data["camera_id"]
#         frame = frame_data["frame"]
#         frame_plate = frame_data["frame_plate"]
       
#         # Perform OCR on the license plate region
#         result = ocr.ocr(frame_plate, cls=True)

#         t = ''  # Initialize the variable before processing the OCR result
#         highest_score = 0

#         if result:
#             for result1 in result:
#                 if result1:
#                     for bbox, (text, score) in result1:
#                         t += text
#                         if score > highest_score:
#                             highest_score = score

#                     # Clean the text
#                     text = re.sub(r'[^\w\s]|_', '', t)
#                     t = text.upper().replace(" ", "")
#                     length = len(t)
                    
#                     # Define license plate patterns
#                     patterns = [
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{1}\d{4}',  # Pattern 1: char, char, digit, char, digit, digit, digit, digit    = 8
#                     r'[a-zA-Z]{2}\d{2}[a-zA-Z]{1}\d{4}',  # Pattern 1: char, char, digit, digit, char, digit, digit, digit, digit  = 9
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{2}\d{4}',  # Pattern 1: char, char, digit, char, char, digit, digit, digit, digit  = 9
#                     r'[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, digit, digit, digit, digit  = 10
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{3}\d{4}',  # Pattern 2: char, char, digit, char, char, char, digit, digit, digit, digit  = 10
#                     r'[a-zA-Z]{2}\d{2}[a-zA-Z]{3}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, char, digit, digit, digit, digit  = 11
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{4}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, digit, digit, digit, digit  = 11
#                     r'[a-zA-Z]{2}\d{2}[a-zA-Z]{4}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, char, char, digit, digit, digit, digit  = 12
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{5}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, char, digit, digit, digit, digit  = 12
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{5}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, char, digit, digit, digit, digit  = 12
#                     r'[a-zA-Z]{2}\d{2}[a-zA-Z]{5}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, char, char, char, digit, digit, digit, digit  = 13
#                     r'[a-zA-Z]{2}\d{1}[a-zA-Z]{6}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, char, char, digit, digit, digit, digit  = 13
#                     r'\d{2}[a-zA-Z]{2}\d{4}[a-zA-Z]',      # digit, digit, char, char, digit, digit, digit, digit,char         
#                     ]
                    
#                     # Only proceed if the length of the detected text is valid
#                     if 8 <= length <= 13:
#                         # Find matches for the plate pattern
#                         all_matches = [match for pattern in patterns for match in re.findall(pattern, t)]
                        
#                         if all_matches:
#                             for match in all_matches:
#                                 print("plate text :", match)
                                
#                                 # Only save if this plate is different from the last detected one
#                                 if match != temp:
#                                     temp = match  # Update the temp variable with the new plate text
#                                     now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                                    
#                                     # Save the original frame
#                                     frame_path = os.path.join(save_frame, f'{now}_frame.jpg')
#                                     cv2.imwrite(frame_path, frame)
                                    
#                                     # Save the cropped license plate
#                                     cropped_plate_path = os.path.join(save_plate, f'{now}_plate.jpg')
#                                     cv2.imwrite(cropped_plate_path, frame_plate)
#                                     # print(f"Saved frame to {frame_path}")
#                                     # print(f"Saved license plate to {cropped_plate_path}")
#                                     # Data to send
#                                     platedata = {
#                                         "framePath": frame_path,
#                                         "platePath": cropped_plate_path,
#                                          "cameraId": camera_id,
#                                         "text": match
#                                     }
#                                     # Send POST request with JSON data
#                                     response = requests.post(url, json=platedata)

#                                     # Check response status
#                                     if response.status_code == 200:
#                                         print("Data sent successfully:", response.json())
#                                     else:
#                                         print(f"Failed to send data. Status code: {response.status_code}")
#                         else:
#                             print("No valid plate detected.")
#         else:
#             print("OCR result is empty, no text detected.")

#         # Print metadata (camera ID)
#         print(f"Received frame from Camera ID: {camera_id}")

#     except Exception as e:
#         print(f"Error processing frame: {e}")

# #----------------------------------------------------------------------------------


# def main(queue_name="detected_plate"):
#     """
#     Main function to set up RabbitMQ connections for receiving and sending frames.

#     Args:
#         queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
#         processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
#     """
#     # Set up RabbitMQ connection and channel for receiving frames
#     receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name)

#     # # Set up RabbitMQ connection and channel for sending processed frames
#     # processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name)

#     try:
#         # Start consuming frames from the 'video_frames' queue
#         receiver_channel.basic_consume(
#             queue=queue_name, 
#             on_message_callback=lambda ch, method, properties, body: process_frame(
#                 ch, method, properties, body
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
#         print("Receiver stopped. RabbitMQ connections closed.")

# if __name__ == "__main__":
#     # Start the receiver and sender
#     main()



import pika
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
import re
from paddleocr import PaddleOCR
import os
import cv2
import datetime
import requests
import logging
import time

# API endpoint
url = "https://vmsapi2.ajeevi.in/api/NumberPlateReadedData/Post"

# Initialize the OCR model
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Directory to save frames and cropped license plates
save_frame = 'frames'
save_plate = 'plates'
os.makedirs(save_frame, exist_ok=True)
os.makedirs(save_plate, exist_ok=True)

temp = None

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
        "Event_Type":"Read Numbper Plate event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_error(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "ERROR",
        "Event_Type":"Read Numbper Plate event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)    

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Read Numbper Plate event",
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
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            log_info(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            log_error(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise log_exception(f"Could not connect to RabbitMQ after {retries} attempts")

#-------------------------------------------------------------------------------
def process_frame(ch, method, properties, body):
    """
    Callback function to process the received frames from RabbitMQ.

    Args:
        ch, method, properties: RabbitMQ parameters.
        body: The serialized frame data received from the queue.
    """
    global temp  # Use the global temp variable to track last detected plate
    try:
        # Deserialize the frame and metadata
        frame_data = pickle.loads(body)
        camera_id = frame_data["camera_id"]
        frame = frame_data["frame"]
        frame_plate = frame_data["frame_plate"]
       
        # Perform OCR on the license plate region
        result = ocr.ocr(frame_plate, cls=True)

        t = ''  # Initialize the variable before processing the OCR result
        highest_score = 0

        if result:
            for result1 in result:
                if result1:
                    for bbox, (text, score) in result1:
                        t += text
                    # Clean the text
                    text = re.sub(r'[^\w\s]|_', '', t)
                    t = text.upper().replace(" ", "")
                    length = len(t)
                    
                    # Define license plate patterns
                    patterns = [
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{1}\d{4}',  # Pattern 1: char, char, digit, char, digit, digit, digit, digit    = 8
                    r'[a-zA-Z]{2}\d{2}[a-zA-Z]{1}\d{4}',  # Pattern 1: char, char, digit, digit, char, digit, digit, digit, digit  = 9
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{2}\d{4}',  # Pattern 1: char, char, digit, char, char, digit, digit, digit, digit  = 9
                    r'[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, digit, digit, digit, digit  = 10
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{3}\d{4}',  # Pattern 2: char, char, digit, char, char, char, digit, digit, digit, digit  = 10
                    r'[a-zA-Z]{2}\d{2}[a-zA-Z]{3}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, char, digit, digit, digit, digit  = 11
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{4}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, digit, digit, digit, digit  = 11
                    r'[a-zA-Z]{2}\d{2}[a-zA-Z]{4}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, char, char, digit, digit, digit, digit  = 12
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{5}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, char, digit, digit, digit, digit  = 12
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{5}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, char, digit, digit, digit, digit  = 12
                    r'[a-zA-Z]{2}\d{2}[a-zA-Z]{5}\d{4}',  # Pattern 2: char, char, digit, digit, char, char, char, char, char, digit, digit, digit, digit  = 13
                    r'[a-zA-Z]{2}\d{1}[a-zA-Z]{6}\d{4}',  # Pattern 2: char, char, digit, char, char, char, char, char, char, digit, digit, digit, digit  = 13
                    r'\d{2}[a-zA-Z]{2}\d{4}[a-zA-Z]',      # digit, digit, char, char, digit, digit, digit, digit,char         
                    ]
                    
                    # Only proceed if the length of the detected text is valid
                    if 8 <= length <= 13:
                        # Find matches for the plate pattern
                        all_matches = [match for pattern in patterns for match in re.findall(pattern, t)]
                        
                        if all_matches:
                            for match in all_matches:
                                print("plate text :", match)
                                
                                # Only save if this plate is different from the last detected one
                                if match != temp:
                                    temp = match  # Update the temp variable with the new plate text
                                    now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

                                    frame_dir = os.path.join(save_frame, str(camera_id))
                                    os.makedirs(frame_dir, exist_ok=True)

                                    # Save original frame
                                    full_frame_path = os.path.join(os.getcwd(), frame_dir, f'{now}.jpg')
                                    cv2.imwrite(full_frame_path, frame)
                                    
                                    # Save the cropped license plate
                                    plate_dir = os.path.join(save_plate, str(camera_id))
                                    os.makedirs(plate_dir, exist_ok=True)

                                    # Save original frame
                                    full_plate_path = os.path.join(os.getcwd(), plate_dir, f'{now}.jpg')
                                    cv2.imwrite(full_plate_path, frame_plate)
                                    
                                    # Data to send
                                    platedata = {
                                        "framePath": full_frame_path,
                                        "platePath": full_plate_path,
                                         "cameraId": camera_id,
                                        "text": match
                                    }
                                    # Send POST request with JSON data
                                    response = requests.post(url, json=platedata)

                                    # Check response status
                                    if response.status_code == 200:
                                        log_info("Data sent successfully:", response.json())
                                    else:
                                        log_error(f"Failed to send data. Status code: {response.status_code}")
                        else:
                            log_error("No valid patters were found from camera id {camera_id}")
                    else:
                        log_error(f"Invalid length of detected text from camera id {camera_id}")        
        else:
            log_error(f"OCR result is empty, no text readed from camera id {camera_id}")
        

    except Exception as e:
        log_exception(f"Error processing frame: {e}")

#----------------------------------------------------------------------------------


def main(queue_name="detected_plate", rabbitmq_host="localhost"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
        processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
    """
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)

    # # Set up RabbitMQ connection and channel for sending processed frames

    try:
        # Start consuming frames from the 'video_frames' queue
        receiver_channel.basic_consume(
            queue=queue_name, 
            on_message_callback=lambda ch, method, properties, body: process_frame(
                ch, method, properties, body
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
        log_exception("Receiver stopped. RabbitMQ connections closed.")

if __name__ == "__main__":
    # Start the receiver and sender
    main()
