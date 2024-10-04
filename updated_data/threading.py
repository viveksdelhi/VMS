import pika
import time
import cv2
import pickle  # To serialize frames
import struct  # To send the size of the frame
from multiprocessing import Process, current_process  # Import multiprocessing components
import requests

def setup_rabbitmq_connection(queue_name):
    """
    Set up a RabbitMQ connection and declare the queue.
    
    Args:
        queue_name (str): The name of the queue to be used.
        
    Returns:
        tuple: The RabbitMQ connection and channel objects.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name)
    return connection, channel

def process_video(camera_url, camera_id, queue_name="manoj_sender", frame_interval=15):
    """
    Process the video stream and send frames to RabbitMQ.

    Args:
        camera_url (str): The URL or path of the camera/video stream.
        camera_id (str): A unique ID for the camera.
        queue_name (str): The queue to send the video frames to.
        frame_interval (int): Interval for sending frames to the queue.
    """
    cap = cv2.VideoCapture(camera_url)

    if not cap.isOpened():
        print(f"Error: Could not open video stream from {camera_url}")
        return

    # Set up RabbitMQ connection and channel
    connection, channel = setup_rabbitmq_connection(queue_name)

    frame_count = 0
    last_frame_time = time.time()

    try:
        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                # Check if 5 seconds have passed without receiving a frame
                if time.time() - last_frame_time > 5:
                    print(f"No frame received for 5 seconds from {camera_id}, restarting...")
                    break  # Exit the loop to re-attempt the connection

                continue
            last_frame_time = time.time()

            # Only send every `frame_interval`th frame
            frame_count += 1
            if frame_count % frame_interval != 0:
                continue

            frame_count = 0

            # Serialize the frame and camera metadata
            frame_data = {
                "camera_id": camera_id,
                "frame": frame
            }
            serialized_frame = pickle.dumps(frame_data)

            # Send the frame to the queue
            channel.basic_publish(
                exchange="",
                routing_key=queue_name,
                body=serialized_frame
            )
            print(f"Sent a frame from camera {camera_id} (Process ID: {current_process().pid})")

    except Exception as e:
        print(f"An error occurred in camera {camera_id}: {e}")
    finally:
        cap.release()
        connection.close()
        print(f"Camera {camera_id}: Video processing complete. RabbitMQ connection closed.")

def start_camera_process(camera_url, camera_id, queue_name="manoj_sender", frame_interval=15):
    """
    Start a separate process for each camera.

    Args:
        camera_url (str): The RTSP URL or path of the camera/video stream.
        camera_id (str): A unique ID for the camera.
        queue_name (str): The RabbitMQ queue name. Defaults to 'video_frames'.
        frame_interval (int): Interval for sending frames to the queue. Defaults to 15.
    """
    process = Process(target=process_video, args=(camera_url, camera_id, queue_name, frame_interval))
    process.start()
    return process

def fetch_data_from_api(api_url):
    try:
        # Make the GET request to the API
        response = requests.get(api_url)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()  # Parse the JSON response
            print("Data fetched successfully:")
            filtered_data = [{'id': cam['id'], 'name': cam['name'], 'rtspurl': cam['rtspurl']} for cam in data]
            print(filtered_data)
            return filtered_data
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


if __name__ == "__main__":
    # Replace this with your actual API URL
    api_url = 'https://vmsapi.ajeevi.in/api/Camera/GetAll'
    # Call the function to fetch data
    cameras = fetch_data_from_api(api_url)

    # Start a separate process for each camera
    processes = []
    for camera in cameras:
        process = start_camera_process(camera["rtspurl"], camera["id"])
        processes.append(process)

    # Wait for all processes to complete
    for process in processes:
        process.join()

    print("All camera processes have completed.")
