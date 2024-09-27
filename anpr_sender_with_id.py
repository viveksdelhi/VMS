import pika
import cv2
import pickle  # To serialize frames
import struct  # To send the size of the frame

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

def process_video(camera_url, camera_id, channel, queue_name, frame_interval=15):
    """
    Process the video stream and send frames to RabbitMQ.

    Args:
        camera_url (str): The URL or path of the camera/video stream.
        camera_id (str): A unique ID for the camera.
        channel (pika.Channel): RabbitMQ channel object.
        queue_name (str): The queue to send the video frames to.
        frame_interval (int): Interval for sending frames to the queue.
    """
    cap = cv2.VideoCapture(camera_url)

    if not cap.isOpened():
        print(f"Error: Could not open video stream from {camera_url}")
        return

    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()

        if not ret:
            print("End of video or error in reading frame.")
            break

        # Only send every `frame_interval`th frame
        frame_count += 1
        if frame_count % frame_interval != 0:
            continue

        frame_count = 0

        # Serialize the frame and camera metadata
        frame_data = {
            "camera_id": camera_id,
            "timestamp": cv2.getTickCount(),
            "frame": frame
        }
        serialized_frame = pickle.dumps(frame_data)

        # Send the frame to the queue
        channel.basic_publish(
            exchange="",
            routing_key=queue_name,
            body=serialized_frame
        )
        print(f"Sent a frame from camera {camera_id}")

    # Release the video capture resource
    cap.release()

def main(camera_url, camera_id, queue_name="video_frames", frame_interval=15):
    """
    Main function to set up RabbitMQ and process the video.

    Args:
        camera_url (str): The URL or path of the camera/video stream.
        camera_id (str): A unique ID for the camera.
        queue_name (str): The RabbitMQ queue name. Defaults to 'video_frames'.
        frame_interval (int): Interval for sending frames to the queue. Defaults to 15.
    """
    # Set up RabbitMQ connection and channel
    connection, channel = setup_rabbitmq_connection(queue_name)

    try:
        # Process the video stream and send frames to RabbitMQ
        process_video(camera_url, camera_id, channel, queue_name, frame_interval)
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close RabbitMQ connection
        connection.close()
        print("Video processing complete. RabbitMQ connection closed.")

if __name__ == "__main__":
    # Example usage:
    # Replace 'b.mp4' with your video path or camera URL
    camera_url = "b.mp4"
    camera_id = "camera_1"
    
    # Start the video processing and frame sending
    main(camera_url, camera_id)
