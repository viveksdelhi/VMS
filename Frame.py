import pika
import cv2
import pickle
import base64
import threading

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

    try:
        # Declare the queue passively (will throw an exception if the queue doesn't exist)
        channel.queue_declare(queue=queue_name, passive=True)
    except pika.exceptions.ChannelClosedByBroker:
        print(f"Queue {queue_name} does not exist, creating it.")
        channel = connection.channel()
        channel.queue_declare(queue=queue_name)
    channel.basic_qos(prefetch_count=1)
    
    return connection, channel

def process_frame(connection, channel, method, properties, body, frame_interval=5):
    """
    Callback function to process the received frames from RabbitMQ and send them to another queue.

    Args:
        connection: RabbitMQ connection object.
        channel: RabbitMQ channel object.
        method: RabbitMQ method object containing delivery tag for acknowledgment.
        properties: RabbitMQ properties object.
        body: The serialized frame data received from the queue.
    """
    try:
        # Deserialize the frame and metadata
        frame_data = pickle.loads(body)
        camera_id = frame_data["CameraId"]
        camera_ip = frame_data["CameraIp"]
        camera_url = frame_data["CameraUrl"]

    except Exception as e:
        print(f"Error in receiving: {e}")
        channel.basic_ack(delivery_tag=method.delivery_tag)
        return

    cap = cv2.VideoCapture(camera_url)
    if not cap.isOpened():
        print(f"Error: Could not open video stream from {camera_url}")
        channel.basic_ack(delivery_tag=method.delivery_tag)
        return
    
    frame_count = 0

    try:
        # Create a new queue to send processed frames
        processed_queue_name = "processed_frames"
        channel.queue_declare(queue=processed_queue_name)

        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                print("End of video or error in reading frame.")
                break

            # Only send every `frame_interval`th frame
            frame_count += 1
            if frame_count != frame_interval:
                continue

            frame_count = 0
            cv2.imshow(camera_ip, frame)

            # Serialize the frame and camera metadata
            _, buffer = cv2.imencode('.jpg', frame)
            frame_data = {
                "CameraIp": camera_ip,
                "Frame": base64.b64encode(buffer).decode('utf-8')
            }
            serialized_frame = pickle.dumps(frame_data)

            # Send the frame to the new queue
            try:
                if channel.is_open:  # Check if channel is open
                    channel.basic_publish(
                        exchange="",
                        routing_key=processed_queue_name,
                        body=serialized_frame
                    )
                    print(f"Sent a processed frame from camera {camera_id} to {processed_queue_name}")
                else:
                    print("Channel is closed. Unable to publish message.")
                    break
            except Exception as e:
                print(f"Failed to publish message: {e}")

            if cv2.waitKey(1) & 0xFF == ord('q'):  # Break loop on 'q' key press
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()
        channel.basic_ack(delivery_tag=method.delivery_tag)

def threaded_frame_processor(ch, method, properties, body):
    """
    Create a separate thread for each frame processing job.
    
    Args:
        ch: The RabbitMQ channel object.
        method: RabbitMQ method object containing delivery tag for acknowledgment.
        properties: RabbitMQ properties object.
        body: The serialized frame data received from the queue.
    """
    thread = threading.Thread(
        target=process_frame,
        args=(ch.connection, ch, method, properties, body),
        daemon=True  # Mark thread as daemon, so it will exit when the main program exits
    )
    thread.start()

def main(queue_name="details"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'details'.
    """
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name)

    try:
        # Start consuming frames from the specified queue
        # receiver_channel.basic_consume(
        #     queue=queue_name,
        #     on_message_callback=lambda ch, method, properties, body: process_frame(
        #         receiver_connection, receiver_channel, method, properties, body,
        #     ),
        #     auto_ack=False  # Set auto_ack to False for manual acknowledgment
        # )
        # receiver_channel.basic_qos(prefetch_count=1)

        receiver_channel.basic_consume(
            queue=queue_name,
            on_message_callback=threaded_frame_processor,
            auto_ack=True  # Set auto_ack to False for manual acknowledgment
        )
        print("Waiting for messages. To exit press CTRL+C")
        receiver_channel.start_consuming()
    except Exception as e:
        print(f"An error occurred: {e}")
    except KeyboardInterrupt:
        print("Interrupted by user, exiting...")
    finally:
        receiver_connection.close()
        print("Receiver stopped. RabbitMQ connections closed.")

if __name__ == "__main__":
    main()
