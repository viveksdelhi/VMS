import pika
import cv2
import pickle
import base64
import threading
import datetime
import requests

# Global dictionary to store threads by camera IP
threads_dict = {}
threads_lock = threading.Lock()  # Lock for thread-safe operations on threads_dict
def Logs(camera_ip,type,message):
    try :
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        try:
            # Declare the queue passively (will throw an exception if the queue doesn't exist)
            channel.queue_declare(queue='Logs', passive=True)
        except pika.exceptions.ChannelClosedByBroker:
            channel = connection.channel() 
            channel.queue_declare(queue='Logs')
        try:
            data = {
               "Event Type":"Video Analytics send Frame",
               "Camera":camera_ip,
               "Type":type,
               "Description":message
            }
            serialized_data = pickle.dumps(data)
            channel.basic_publish(
                exchange="",
                routing_key="Logs",
                body=serialized_data
            )
            print(f"Message Publish")
        except Exception as e:
            print(f"Failed to publish message: {e}")

    except Exception as e:
        print({"error": "Failed to connect to RabbitMQ!"})


class CameraThread:
    def __init__(self, camera_id, camera_ip, camera_url, objectlist,rabbitmq_params):
        self.camera_id =camera_id
        self.camera_ip = camera_ip
        self.camera_url = camera_url
        self.objectlist = objectlist
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
            Logs(self.camera_ip,'Sucecss',"Connected to RabbitMQ")
        except Exception as e:
            print(f"Failed to connect to RabbitMQ: {e}")
            Logs(self.camera_ip,'Exceptions',f"Failed to connect to RabbitMQ: {e}")
            self.connection = None
            self.channel = None

    def process_frames(self):
        while not self.stop_event.is_set():
            cap = cv2.VideoCapture(self.camera_url)
            if not cap.isOpened():
                print(f"Error: Could not open video stream from {self.camera_url}")
                Logs(self.camera_ip,'Error',f"Error: Could not open video stream from {self.camera_url}")
                return

            frame_count = 0

            # Ensure RabbitMQ connection
            self.connect_to_rabbitmq()

            try:
                while cap.isOpened() and not self.stop_event.is_set():
                    ret, frame = cap.read()
                    if not ret:
                        print("End of video or error in reading frame.")
                        Logs(self.camera_ip,'Error',"End of video or error in reading frame.")
                        break

                    frame_count += 1
                    if frame_count % 10 != 0:  
                        # Process every 5th frame
                        continue
                    frame_count=0
                    # Resize frame to 640x480
                    frame = cv2.resize(frame, (640, 480))
                    # cv2.imshow(self.camera_ip, frame)

                    # Encode frame as JPEG and serialize it
                    _, buffer = cv2.imencode('.jpg', frame)
                    current_time = datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
                    frame_data = {
                        "CameraId":self.camera_id,
                        "Datetime":current_time,
                        "CameraIp": self.camera_ip,
                        "ObjectList": self.objectlist,
                        "Frame": base64.b64encode(buffer).decode('utf-8')
                    }
                    serialized_frame = pickle.dumps(frame_data)

                    # Check frame size before sending
                    max_frame_size = 512 * 1024  # Example: Limit frame size to 512 KB
                    if len(serialized_frame) > max_frame_size:
                        print(f"Serialized frame size too large: {len(serialized_frame)} bytes. Skipping frame.")
                        Logs(self.camera_ip,'Error',f"Serialized frame size too large: {len(serialized_frame)} bytes. Skipping frame.")
                        continue

                    # Publish frame to RabbitMQ
                    try:
                        if self.channel is not None and self.channel.is_open:
                            self.channel.basic_publish(
                                exchange="",
                                routing_key="processed_frames",
                                body=serialized_frame
                            )
                            # print(self.objectlist)
                            print(f"Sent a processed frame from camera {self.camera_ip} to 'processed_frames'")
                            Logs(self.camera_ip,'Success',f"Sent a processed frame from camera {self.camera_ip} to 'processed_frames'")
                        else:
                            print("Channel is closed. Attempting to reconnect to RabbitMQ.")
                            Logs(self.camera_ip,'Error',"Channel is closed. Attempting to reconnect to RabbitMQ.")
                            self.connect_to_rabbitmq()
                    except pika.exceptions.AMQPError as e:
                        print(f"Failed to publish message: {e}")
                        Logs(self.camera_ip,'Exceptions',f"Failed to publish message: {e}")
                        self.connect_to_rabbitmq()  
                    
                    except :
                        self.connect_to_rabbitmq()# Attempt to reconnect if publishing fails

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
        channel = connection.channel() 
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
    objectlist = frame_data["ObjectList"]
    camera_url = frame_data["CameraUrl"]

    print(camera_id,camera_ip,camera_url,running)

    # Check if the thread for this camera IP already exists
    with threads_lock:
        if running.lower() == "false" or not running:
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
                threads_dict[camera_ip] = CameraThread(camera_id,camera_ip, camera_url,objectlist, rabbitmq_params)

                # Acknowledge the message after starting the thread
                ch.basic_ack(delivery_tag=method.delivery_tag)
                print(f"Started thread for camera {camera_ip}.")
            else:
                threads_dict[camera_ip].objectlist=objectlist
                ch.basic_ack(delivery_tag=method.delivery_tag)
            return


def main(queue_name="details"):
    BaseUrl = "https://vmsapi3.ajeevi.in"

    url = f'{BaseUrl}/api/VideoAnalytic/GetAllActive'
    datas=None
    try:
        # Sending a GET request to the URL
        response = requests.get(url)
        
        # Check if the request was successful
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)

        # Parsing the response as JSON (if the API returns JSON)
        datas = response.json()

        print("Camera details:" ,datas)

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Error connecting to {url}: {conn_err}")
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error: {timeout_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"An error occurred: {req_err}")
    except ValueError as json_err:
        print(f"JSON decoding failed: {json_err}")
    
    for data in datas:
        print(data)
        print(data["cameraId"],data["cameraIP"],data["rtspUrl"],data["objectList"])
        camera_id=data["cameraId"]
        camera_ip=data["cameraIP"]
        camera_url=data["rtspUrl"]
        objectlist=data["objectList"]

        with threads_lock: 
            rabbitmq_params = {"host": "localhost"}
            threads_dict[camera_ip] = CameraThread(camera_id,camera_ip, camera_url,objectlist, rabbitmq_params)
            print(f"Started thread for camera {camera_ip}.")


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
        Logs(camera_ip,"Exception",f"An error occurred: {e}")
        print(f"An error occurred: {e}")
        main()
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
        # main()


if __name__ == "__main__":
    main()
