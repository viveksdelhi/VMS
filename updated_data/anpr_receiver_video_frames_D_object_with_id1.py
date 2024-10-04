
import pika
import os
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
from ultralytics import YOLO
import datetime
import cv2

# Load the YOLO model
model = YOLO("yolov8s.pt")
vehicle = [2, 3, 5, 7]

# Directory to save frames 
vehicle_frame = "vehicle_frame"
os.makedirs(vehicle_frame, exist_ok=True)


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
                processed_frame_data = {
                    "camera_id": camera_id,
                    "frame": frame
                }
                now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                # Save original frame
                frame_path = os.path.join(vehicle_frame, f'{now}.jpg')
                cv2.imwrite(frame_path, frame)
                serialized_frame = pickle.dumps(processed_frame_data)

                # Send the frame to the 'processed_frames' queue
                processed_channel.basic_publish(
                    exchange="",
                    routing_key="detect_vehicle",
                    body=serialized_frame
                )
                print("Detection detail :", results.names[int(id)])
        

        # Print metadata (camera ID and timestamp)
        print(f"Received frame from Camera ID: {camera_id}")
        

    except Exception as e:
        print(f"Error processing frame: {e}")

def main(queue_name="frame_sender", processed_queue_name="detect_vehicle"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
        processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
    """
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name)

    # Set up RabbitMQ connection and channel for sending processed frames
    processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name)

    try:
        # Start consuming frames from the 'video_frames' queue
        receiver_channel.basic_consume(
            queue=queue_name, 
            on_message_callback=lambda ch, method, properties, body: process_frame(
                ch, method, properties, body, processed_channel
            ),
            auto_ack=True
        )
        print("Waiting for video frames...")
        receiver_channel.start_consuming()
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the connections when done
        receiver_connection.close()
        processed_connection.close()
        print("Receiver stopped. RabbitMQ connections closed.")

if __name__ == "__main__":
    # Start the receiver and sender
    main()
