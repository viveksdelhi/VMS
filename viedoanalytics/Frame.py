import pika
import cv2
import pickle
import base64
import threading
import datetime
 
# Global dictionary to store threads by camera IP
threads_dict = {}
threads_lock = threading.Lock()  # Lock for thread-safe operations on threads_dict


class CameraThread:
    def __init__(self, camera_id, camera_ip, camera_url, rabbitmq_params):
        self.camera_id =camera_id
        self.camera_ip = camera_ip
        self.camera_url = camera_url
        self.rabbitmq_params = rabbitmq_params
        self.connection = None
        self.channel = None
        self.stop_event = threading.Event()
        self.thread = threading.Thread(target=self.process_frames, daemon=True)
        self.thread.start()

    def connect_to_rabbitmq(self):
        """Establish or re-establish a connection to RabbitMQ and open a channel."""
        try:
            if self.connection and self.connection.is_open:
                self.connection.close()

            self.connection = pika.BlockingConnection(pika.ConnectionParameters(**self.rabbitmq_params))
            self.channel = self.connection.channel()
            self.channel.queue_declare(queue="processed_frames")
            print("Connected to RabbitMQ")
        except Exception as e:
            print(f"Failed to connect to RabbitMQ: {e}")
            self.connection = None
            self.channel = None

    def process_frames(self):
        while not self.stop_event.is_set():
            cap = cv2.VideoCapture(self.camera_url)
            if not cap.isOpened():
                print(f"Error: Could not open video stream from {self.camera_url}")
                return

            frame_count = 0

            # Ensure RabbitMQ connection
            self.connect_to_rabbitmq()

            try:
                while cap.isOpened() and not self.stop_event.is_set():
                    ret, frame = cap.read()
                    if not ret:
                        print("End of video or error in reading frame.")
                        break

                    frame_count += 1
                    if frame_count % 5 != 0:  # Process every 5th frame
                        continue

                    # Resize frame to 640x480
                    # frame = cv2.resize(frame, (640, 480))
                    # cv2.imshow(self.camera_ip, frame)

                    # Encode frame as JPEG and serialize it
                    _, buffer = cv2.imencode('.jpg', frame)
                    current_time = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
                    frame_data = {
                        "CameraId":self.camera_id,
                        "Datetime":current_time,
                        "CameraIp": self.camera_ip,
                        "Frame": base64.b64encode(buffer).decode('utf-8')
                    }
                    serialized_frame = pickle.dumps(frame_data)

                    # Check frame size before sending
                    max_frame_size = 512 * 1024  # Example: Limit frame size to 512 KB
                    if len(serialized_frame) > max_frame_size:
                        print(f"Serialized frame size too large: {len(serialized_frame)} bytes. Skipping frame.")
                        continue

                    # Publish frame to RabbitMQ
                    try:
                        if self.channel is not None and self.channel.is_open:
                            self.channel.basic_publish(
                                exchange="",
                                routing_key="processed_frames",
                                body=serialized_frame
                            )
                            print(f"Sent a processed frame from camera {self.camera_ip} to 'processed_frames'")
                        else:
                            print("Channel is closed. Attempting to reconnect to RabbitMQ.")
                            self.connect_to_rabbitmq()
                    except pika.exceptions.AMQPError as e:
                        print(f"Failed to publish message: {e}")
                        self.connect_to_rabbitmq()  # Attempt to reconnect if publishing fails

                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
            finally:
                cap.release()
                cv2.destroyAllWindows()
        cap.release()
        cv2.destroyAllWindows()

    def stop(self):
        self.stop_event.set()  # Signal the thread to stop
        self.thread.join()      # Wait for the thread to finish
        if self.channel is not None and self.channel.is_open:
            self.channel.close()
        if self.connection is not None and self.connection.is_open:
            self.connection.close()
        print(f"Stopped thread for {self.camera_ip}.")


def setup_rabbitmq_connection(queue_name, rabbitmq_params):
    """
    Set up a RabbitMQ connection and declare the queue.

    Args:
        queue_name (str): The name of the queue to be used.
        rabbitmq_params (dict): RabbitMQ connection parameters.

    Returns:
        tuple: The RabbitMQ connection and channel objects.
    """
    connection = pika.BlockingConnection(pika.ConnectionParameters(**rabbitmq_params))
    channel = connection.channel()

    try:
        # Declare the queue passively (will throw an exception if the queue doesn't exist)
        channel.queue_declare(queue=queue_name, passive=True)
    except pika.exceptions.ChannelClosedByBroker:
        print(f"Queue {queue_name} does not exist, creating it.")
        channel.queue_declare(queue=queue_name)

    return connection, channel


def process_frame(ch, method, properties, body):
    """
    Process a frame received from RabbitMQ.

    Args:
        ch: The RabbitMQ channel object.
        method: RabbitMQ method object containing delivery tag for acknowledgment.
        properties: RabbitMQ properties object.
        body: The serialized frame data received from the queue.
    """
    frame_data = pickle.loads(body)
    camera_id = frame_data["CameraId"]
    camera_ip = frame_data["CameraIp"]
    running = frame_data["Running"]
    camera_url = frame_data["CameraUrl"]

    print(camera_id,camera_ip,camera_url,running)

    # Check if the thread for this camera IP already exists
    with threads_lock:
        if running.lower() == "false":
            if camera_ip in threads_dict:
                # Stop the existing thread and remove it from the dictionary
                threads_dict[camera_ip].stop()
                del threads_dict[camera_ip]  # Remove from the dictionary
                ch.basic_ack(delivery_tag=method.delivery_tag)
                print(f"Stopped thread for camera {camera_ip}.")
                return
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        else:
            if not camera_ip in threads_dict:
                # Start a new thread for the camera if running
                rabbitmq_params = {"host": "localhost"}
                threads_dict[camera_ip] = CameraThread(camera_id,camera_ip, camera_url, rabbitmq_params)

                # Acknowledge the message after starting the thread
                ch.basic_ack(delivery_tag=method.delivery_tag)
                print(f"Started thread for camera {camera_ip}.")
            else:
                ch.basic_ack(delivery_tag=method.delivery_tag)
            return


def main(queue_name="details"):
    """
    Main function to set up RabbitMQ connections for receiving and sending frames.

    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'details'.
    """
    rabbitmq_params = {"host": "localhost"}
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_params)

    try:
        receiver_channel.basic_qos(prefetch_count=1)
        receiver_channel.basic_consume(
            queue=queue_name,
            on_message_callback=process_frame,
            auto_ack=False  # Use manual acknowledgment
        )
        print("Waiting for messages. To exit press CTRL+C")
        receiver_channel.start_consuming()
    except Exception as e:
        print(f"An error occurred: {e}")
    except KeyboardInterrupt:
        print("Interrupted by user, exiting...")
    finally:
        # Stop all camera threads
        with threads_lock:
            for camera_ip, thread in threads_dict.items():
                thread.stop()  # Stop all threads on exit
        if receiver_connection.is_open:
            receiver_connection.close()
        print("Receiver stopped. RabbitMQ connections closed.")


if __name__ == "__main__":
    main()
