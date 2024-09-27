
import pika
import cv2
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
import re
from paddleocr import PaddleOCR
# Initialize the OCR model
ocr = PaddleOCR(use_angle_cls=True, lang='en')


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

def process_frame(ch, method, properties, body):
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

       
        result = ocr.ocr(frame, cls=True)

        t = ''  # Initialize the variable before processing the OCR result
        highest_score = 0

        if result:
            for result1 in result:
                if result1:
                    for bbox, (text, score) in result1:
                        t += text
                        if score > highest_score:
                            highest_score = score

                    # Clean the text
                    text = re.sub(r'[^\w\s]|_', '', t)
                    t = text.upper().replace(" ", "")
        
        # Only print if there's text detected
        if t:
            print("text :", t)
            print("score :", highest_score)
        else:
            print("No text detected")
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

def main(queue_name="plate_frames"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
        processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
    """
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name)

    # # Set up RabbitMQ connection and channel for sending processed frames
    # processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name)

    try:
        # Start consuming frames from the 'video_frames' queue
        receiver_channel.basic_consume(
            queue=queue_name, 
            on_message_callback=lambda ch, method, properties, body: process_frame(
                ch, method, properties, body
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
        print("Receiver stopped. RabbitMQ connections closed.")

if __name__ == "__main__":
    # Start the receiver and sender
    main()
