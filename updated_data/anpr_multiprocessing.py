import cv2
import pickle  # To serialize frames
import pika    # RabbitMQ connection
import time
from multiprocessing import Process, current_process
import requests

def setup_rabbitmq_connection(queue_name):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()
    channel.queue_declare(queue=queue_name)
    return connection, channel

def process_video(camera_url, camera_id, queue_name="manoj_sender", frame_interval=15):
    cap = cv2.VideoCapture(camera_url)
    
    if not cap.isOpened():
        print(f"Error: Could not open video stream from {camera_url}")
        return

    connection, channel = setup_rabbitmq_connection(queue_name)
    frame_count = 0
    last_frame_time = time.time()

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                if time.time() - last_frame_time > 5:
                    print(f"No frame received for 5 seconds from {camera_id}, restarting...")
                    break
                continue

            last_frame_time = time.time()

            frame_count += 1
            if frame_count % frame_interval != 0:
                continue

            frame_count = 0

            frame_data = {"camera_id": camera_id, "frame": frame}
            serialized_frame = pickle.dumps(frame_data)

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
    process = Process(target=process_video, args=(camera_url, camera_id, queue_name, frame_interval))
    process.start()
    return process

def fetch_data_from_api(api_url):
    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            data = response.json()
            filtered_data = [{'id': cam['id'], 'name': cam['name'], 'rtspurl': cam['rtspurl']} for cam in data]
            return filtered_data
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    api_url = 'https://vmsapi.ajeevi.in/api/Camera/GetAll'
    cameras = fetch_data_from_api(api_url)

    if cameras:
        processes = []
        for camera in cameras:
            process = start_camera_process(camera["rtspurl"], camera["id"])
            processes.append(process)

        # Wait for all processes to complete
        for process in processes:
            process.join()

        print("All camera processes have completed.")
