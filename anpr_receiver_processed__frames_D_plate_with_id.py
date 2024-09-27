
import pika
import cv2
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
from ultralytics import YOLO

# Load the YOLO model
model = YOLO("license_plate_detector.pt")


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
        timestamp = frame_data["timestamp"]
        frame = frame_data["frame"]

        # Convert timestamp to seconds (OpenCV uses ticks, so divide by ticks per second)
        fps = cv2.getTickFrequency()
        time_in_seconds = timestamp / fps

        # Detect and classify objects in the frame
        results = model(frame)[0]
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, id = result
            if score > 0.5:
                # slice license plate 
                license_plate_crop = frame[int(y1):int(y2), int(x1): int(x2), :]
                # Process license plate
                license_plate_crop_resized = cv2.resize(license_plate_crop, (200, 100))
                license_plate_crop_gray = cv2.cvtColor(license_plate_crop_resized, cv2.COLOR_BGR2GRAY)
                _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 155, 255, cv2.THRESH_BINARY_INV)
                # Serialize the frame and send it to the 'processed_frames' queue
                processed_frame_data = {
                    "camera_id": camera_id,
                    "timestamp": timestamp,
                    "frame": license_plate_crop_gray
                }
                serialized_frame = pickle.dumps(processed_frame_data)

                # Send the frame to the 'processed_frames' queue
                processed_channel.basic_publish(
                    exchange="",
                    routing_key="plate_frames",
                    body=serialized_frame
                )
                print(f"Processed frame sent from Camera {camera_id} to 'processed_frames' queue.")
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
                cv2.putText(frame, results.names[int(id)], (int(x1) + 20, int(y1) + 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 2)

        # Display the frame
        cv2.imshow(f"Camera {camera_id}", frame)

        # Print metadata (camera ID and timestamp)
        print(f"Received frame from Camera ID: {camera_id}, Timestamp (s): {time_in_seconds:.2f}")
        
        # Stop consuming if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            ch.stop_consuming()
            cv2.destroyAllWindows()

    except Exception as e:
        print(f"Error processing frame: {e}")

def main(queue_name="processed_frames", processed_queue_name="plate_frames"):
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
