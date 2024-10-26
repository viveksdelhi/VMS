# import pika
# import requests
# import logging
# import json

# # Function to fetch camera data from API
# def fetch_data_from_api(api_url):
#     try:
#         response = requests.get(api_url)
#         if response.status_code == 200:
#             data = response.json()  # Parse the JSON response
#             filtered_data = [{'CameraId': cam['cameraId'], 'CameraUrl': cam['url'], 'Running': cam['status']} for cam in data]
#             print(filtered_data)
#             return filtered_data
#         else:
#             logging.error(f"Failed to fetch data. Status code: {response.status_code}")
#             return None
#     except Exception as e:
#         logging.error(f"An error occurred while fetching data from the API: {e}")
#         return None

# # Function to set up RabbitMQ connection
# def setup_rabbitmq_connection(queue_name):
#     try:
#         connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
#         channel = connection.channel()
#         channel.queue_declare(queue=queue_name)
#         return connection, channel
#     except Exception as e:
#         logging.error(f"Failed to set up RabbitMQ connection: {e}")
#         return None, None

# # # Function to send camera data to RabbitMQ queue
# def send_camera_data_to_queue(channel, queue_name, camera_data):
#     try:
#         for cam in camera_data:
#             # Prepare the message
#             message = json.dumps({'CameraId': cam['CameraId'], 'CameraUrl': cam['CameraUrl'], 'Running': cam['Running']})
#             # Publish the message to the queue
#             channel.basic_publish(exchange='', routing_key=queue_name, body=message)
#             print(f"Sent camera id: {cam['CameraId']}, rtspurl: {cam['CameraUrl']} Status : {cam["Running"]} to RabbitMQ queue.")
#     except Exception as e:
#         logging.error(f"Failed to send data to RabbitMQ: {e}")

# def main(api_url, queue_name):
#     # Step 1: Fetch camera data from API
#     cameras = fetch_data_from_api(api_url)
#     if cameras:
#         # Step 2: Set up RabbitMQ connection
#         connection, channel = setup_rabbitmq_connection(queue_name)
#         if connection and channel:
#             # Step 3: Send camera data to RabbitMQ queue
#             send_camera_data_to_queue(channel, queue_name, cameras)

#             # Step 4: Close the RabbitMQ connection
#             connection.close()
#             print("Connection closed.")
#         else:
#             logging.error("Could not set up RabbitMQ connection.")
#     else:
#         logging.error("No cameras to send to RabbitMQ.")

# if __name__ == "__main__":
#     api_url = 'https://vmsapi2.ajeevi.in/api/ANPRStatus/GetAll'  # Replace with your API URL
#     queue_name = 'rtspurl_from_api_db'  # Name of RabbitMQ queue
#     main(api_url, queue_name)


import pika
import requests
import logging
import pickle
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
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "INFO",
        "Event_Type":"Get RTSPURL from Database",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Get RTSPURL from Database",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

# Function to fetch camera data from API
def fetch_data_from_api(api_url):
    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()  # Parse the JSON response
            filtered_data = [{'CameraId': cam['cameraId'], 'CameraUrl': cam['url'], 'Running': cam['status']} for cam in data]
            log_info(f"Successfully fetched and filtered data from API: {filtered_data}")
            return filtered_data
        else:
            log_exception(f"Failed to fetch data. Status code: {response.status_code}")
            return None
    except Exception as e:
        log_exception(f"An error occurred while fetching data from the API: {e}")
        return None

# Function to set up RabbitMQ connection
def setup_rabbitmq_connection(queue_name):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
        channel = connection.channel()
        channel.queue_declare(queue=queue_name)
        log_info(f"Successfully connected to RabbitMQ and declared queue: {queue_name}")
        return connection, channel
    except Exception as e:
        log_exception(f"Failed to set up RabbitMQ connection: {e}")
        return None, None

# Function to send camera data to RabbitMQ queue
def send_camera_data_to_queue(channel, queue_name, camera_data):
    try:
        for cam in camera_data:
            # Prepare the message
            message = pickle.dumps({'CameraId': cam['CameraId'], 'CameraUrl': cam['CameraUrl'], 'Running': cam['Running']})
            # Publish the message to the queue
            channel.basic_publish(exchange='', routing_key=queue_name, body=message)
            log_info(f"Sent camera id: {cam['CameraId']}, rtspurl: {cam['CameraUrl']}, Status: {cam['Running']} to RabbitMQ queue.")
    except Exception as e:
        log_exception(f"Failed to send data to RabbitMQ: {e}")

# Main function
def main(api_url, queue_name):
    # Step 1: Fetch camera data from API
    cameras = fetch_data_from_api(api_url)
    if cameras:
        # Step 2: Set up RabbitMQ connection
        connection, channel = setup_rabbitmq_connection(queue_name)
        if connection and channel:
            # Step 3: Send camera data to RabbitMQ queue
            send_camera_data_to_queue(channel, queue_name, cameras)

            # Step 4: Close the RabbitMQ connection
            connection.close()
            log_info("Connection closed.")
        else:
            log_exception("Could not set up RabbitMQ connection.")
    else:
        log_exception("No cameras to send to RabbitMQ.")

if __name__ == "__main__":
    api_url = 'https://vmsapi2.ajeevi.in/api/ANPRStatus/GetAll'  # Replace with your API URL
    queue_name = 'rtspurl_from_api_db'  # Name of RabbitMQ queue
    main(api_url, queue_name)
