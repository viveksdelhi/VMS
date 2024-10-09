# import pika
# import base64
# import numpy as np
# import cv2
# from ultralytics import YOLO
# import pickle
# import requests 

# database = [
#     {
#     "cameraIp": "122.186.21.222" ,
#     "analytics":["Person","Car","Truck"]
#     },
#     {
#     "cameraIp": "192.168.0.213" ,
#     "analytics":["Truck"]
#     }
# ]

# # Load the YOLO model
# model = YOLO('yolov8s.pt')
# Object_list = [
#     "Person", "Bicycle", "Car", "Motorcycle", "Airplane", "Bus", "Train", "Truck", "Boat",
#     "Traffic light", "Fire hydrant", "Stop sign", "Parking meter", "Bench",
#     "Bird", "Cat", "Dog", "Horse", "Sheep", "Cow", "Elephant", "Bear", "Zebra", "Giraffe",
#     "Backpack", "Umbrella", "Handbag", "Tie", "Suitcase",
#     "Frisbee", "Skis", "Snowboard", "Sports ball", "Kite",
#     "Baseball bat", "Baseball glove", "Skateboard", "Surfboard", "Tennis racket",
#     "Bottle", "Wine glass", "Cup", "Fork", "Knife", "Spoon", "Bowl",
#     "Chair", "Couch", "Potted plant", "Bed", "Dining table", "Toilet",
#     "TV", "Laptop", "Mouse", "Remote", "Keyboard", "Cell phone",
#     "Microwave", "Oven", "Toaster", "Sink", "Refrigerator",
#     "Book", "Clock", "Vase", "Scissors", "Phone", "Hair drier", "Toothbrush"
# ]


# def process(frame,Camera_Ip):
#     included_item = next((data["analytics"] for data in database if data["cameraIp"] == Camera_Ip), None)

#     if included_item == None :return frame

#     results = model(frame)
#     person_count = 0
#     for result in results:
#         for box in result.boxes:
#             score = box.conf.item()
#             class_id = int(box.cls)
#             if Object_list[class_id] in included_item and score > 0.8:  # Class ID 0 corresponds to "person"
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])
#                 color = (0, 255, 0)
#                 cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
#                 person_count += 1  # Increment the person count
#     height, width, _ = frame.shape
#     cv2.putText(frame, f"Person Count: {person_count}", (10, height - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
#     return frame

# # Connect to RabbitMQ
# connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
# channel = connection.channel()
# try:
#     # Declare the queue passively (will throw an exception if the queue doesn't exist)
#     channel.queue_declare(queue='processed_frames', passive=True)
# except pika.exceptions.ChannelClosedByBroker:
#     channel.queue_declare(queue='processed_frames')

# def callback(ch, method, properties, body):
#     try:
#         # Decode the received frame
#         frame_data = pickle.loads(body)
#         frame = frame_data["Frame"]
#         camera_ip = frame_data["CameraIp"]
#         print(camera_ip)
#         frame_data = base64.b64decode(frame)
#         nparr = np.frombuffer(frame_data, np.uint8)
#         frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#         # Process the frame
#         processed_frame = process(frame,camera_ip)

#         # Display the processed frame
#         cv2.imshow('Camera Feed', processed_frame)
#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             ch.stop_consuming()
#     except Exception as e:
#         print(f"Error processing frame: {e}")

# try:
#     channel.basic_consume(queue='processed_frames', on_message_callback=callback, auto_ack=True)

#     print('Waiting for messages. To exit press CTRL+C')
#     channel.start_consuming()

# except KeyboardInterrupt:
#     print("Interrupted by user, exiting...")
# finally:
#     cv2.destroyAllWindows()
#     connection.close()



#---------------------------------------------------------------------------------------------------------------
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

# Sample database with camera IPs and corresponding analytics settings
# database = [
#     {
#         "cameraIp": "122.186.21.222",
#         "analytics": ["Person", "Car", "Truck"]
#     },
#     {
#         "cameraIp": "192.168.0.213",
#         "analytics": ["Truck"]
#     }
# ]

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
    if included_item is None:
        print(f"Camera IP {Camera_Ip} not found in the database.")
        return frame,object_detect

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
                # if Object_list[class_id] == "Person":
                #     person_count += 1

    # height, width, _ = frame.shape
    # cv2.putText(frame, f"Person Count: {person_count}", (10, height - 10),
    #             cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    return frame,object_detect,flag

# Connect to RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
try:
    # Declare queues passively (will throw an exception if the queue doesn't exist)
    # channel.queue_declare(queue='processed_frames', passive=True)
    channel.queue_declare(queue='image_info',passive=True)
except pika.exceptions.ChannelClosedByBroker:
    # If the queue doesn't exist, declare it
    channel = connection.channel() 
    channel.queue_declare(queue='image_info')
    # channel.queue_declare(queue='processed_frames')

def callback(ch, method, properties, body):
    try:
        # Decode the received frame
        frame_data = pickle.loads(body)
        frame = frame_data["Frame"]
        camera_ip = frame_data["CameraIp"]
        # Decode base64 frame data
        data = base64.b64decode(frame)
        nparr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Process the frame
        processed_frame,object_detect,flag = process(frame, camera_ip)

        # Display the processed frame
        cv2.imshow('Camera Feed', processed_frame)

        # Get current datetime
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Encode the processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')

        # Create the data to send to the new queue
        image_info = {
            'CameraIp': camera_ip,
            'Datetime': current_time,
            'Image': encoded_frame,
            'Object':object_detect
        }

        # Serialize the data
        serialized_data = pickle.dumps(image_info)

        # Send the image info to the new queue
        if flag==1:
            channel.basic_publish(exchange='', routing_key='image_info', body=serialized_data)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            ch.stop_consuming()
    except Exception as e:
        print(f"Error processing frame: {e}")

# Start consuming messages from the queue
try:
    # channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='processed_frames', on_message_callback=callback, auto_ack=True)
    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

except KeyboardInterrupt:
    print("Interrupted by user, exiting...")
finally:
    # Cleanup resources
    cv2.destroyAllWindows()
    connection.close()
