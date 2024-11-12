import pika
import base64
import numpy as np
import cv2
from ultralytics import YOLO
import pickle
import requests
from datetime import datetime

def read():
    url = 'http://127.0.0.1:5000/cameras'

    try:
        # Sending a GET request to the URL
        response = requests.get(url)
        
        # Check if the request was successful
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx or 5xx)

        # Parsing the response as JSON (if the API returns JSON)
        database = response.json()
        print("Camera details:")
        print(database)
        return database

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

# List of YOLO object class names
Object_list = ['Person', 'Bicycle', 'Car', 'Motorcycle', 'Airplane', 'Bus', 'Train', 'Truck', 'Boat', 'Traffic Light', 'Fire Hydrant', 'Stop Sign', 'Parking Meter', 'Bench', 'Bird', 'Cat', 'Dog', 'Horse', 'Sheep', 'Cow', 'Elephant', 'Bear', 'Zebra', 'Giraffe', 'Backpack', 'Umbrella', 'Handbag', 'Tie', 'Suitcase', 'Frisbee', 'Skis', 'Snowboard', 'Sports Ball', 'Kite', 'Baseball Bat', 'Baseball Glove', 'Skateboard', 'Surfboard', 'Tennis Racket', 'Bottle', 'Wine Glass', 'Cup', 'Fork', 'Knife', 'Spoon', 'Bowl', 'Banana', 'Apple', 'Sandwich', 'Orange', 'Broccoli', 'Carrot', 'Hot Dog', 'Pizza', 'Donut', 'Cake', 'Chair', 'Couch', 'Potted Plant', 'Bed', 'Dining Table', 'Toilet', 'TV', 'Laptop', 'Mouse', 'Remote', 'Keyboard', 'Cell Phone', 'Microwave', 'Oven', 'Toaster', 'Sink', 'Refrigerator', 'Book', 'Clock', 'Vase', 'Scissors', 'Teddy Bear', 'Hair Drier', 'Toothbrush']
# Load the YOLOv8 model
model = YOLO('yolov8s.pt')

# Function to process each frame
def process(frame, Camera_Ip):
    database = read()
    object_detect = {}
    flag=0
    included_item = next((data["ObjectList"] for data in database if data["CameraIP"] == Camera_Ip), None)
    #included_item = ["Person","Dog","Truck"]
    if included_item is None:
        print(f"Camera IP {Camera_Ip} not found in the database.")
    results = model(frame)
    # person_count = 0
    for result in results:
        for box in result.boxes:
            score = box.conf.item()
            class_id = int(box.cls)
            if Object_list[class_id] in included_item and score > 0.7:
                flag=1
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                color = (0, 255, 0)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                object_detect[Object_list[class_id]] = object_detect.get(Object_list[class_id], 0) + 1

    return frame,object_detect,flag


connection = None
channel = None

def connect_to_rabbitmq():
    global connection, channel
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    try:
        # Declare queues passively (will throw an exception if the queue doesn't exist)
        channel.queue_declare(queue='image_info',passive=True)
    except pika.exceptions.ChannelClosedByBroker:
        # If the queue doesn't exist, declare it
        channel = connection.channel() 
        channel.queue_declare(queue='image_info')
    except pika.exceptions.AMQPError as e:
        print(f"Failed to connect to RabbitMQ: {e}")

connect_to_rabbitmq()

def callback(ch, method, properties, body):
    try:
        # Decode the received frame
        frame_data = pickle.loads(body)
        
        # Ensure frame_data is a dictionary
        if not isinstance(frame_data, dict):
            raise ValueError("Received frame_data is not a dictionary")

        frame = frame_data["Frame"]
        camera_ip = frame_data["CameraIp"]
        camera_id = frame_data["CameraId"]
        date_time = frame_data["Datetime"]
        
        # Decode base64 frame data
        data = base64.b64decode(frame)
        nparr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Process the frame
        processed_frame, object_detect, flag = process(frame, camera_ip)

        # Display the processed frame

        # Encode the processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')

        # Create the data to send to the new queue
        image_info = {
            "CameraId": camera_id,
            'CameraIp': camera_ip,
            'Datetime': date_time,
            'Image': encoded_frame,
            'Object': object_detect
        }

        # Serialize the data
        serialized_data = pickle.dumps(image_info)

        # Send the image info to the new queue
        if flag==1:
            try:
                if channel is not None and channel.is_open:
                    channel.basic_publish(exchange="", routing_key="image_info", body=serialized_data)
                    print(f"Sent a processed frame from camera {camera_ip} to 'image_info'")
                else:
                    print("Channel is closed. Attempting to reconnect to RabbitMQ.")
                    connect_to_rabbitmq()  # Ensure this method handles reconnection
            except pika.exceptions.AMQPError as e:
                print(f"Failed to publish message: {e}")
                connect_to_rabbitmq()  # Attempt to reconnect if publishing fails
        ch.basic_ack(delivery_tag=method.delivery_tag)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            cv2.destroyAllWindows()
            ch.stop_consuming()
    except Exception as e:
        print(f"Error processing frame: {e}")

# Start consuming messages from the queue
try:
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='processed_frames', on_message_callback=callback, auto_ack=False)
    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

except KeyboardInterrupt:
    print("Interrupted by user, exiting...")
finally:
    # Cleanup resources
    cv2.destroyAllWindows()
    connection.close()
