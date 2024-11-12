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
               "Event Type":"Video Analytics send Event",
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

# List of YOLO object class names
Object_list = ['Person', 'Bicycle', 'Car', 'Motorcycle', 'Airplane', 'Bus', 'Train', 'Truck', 'Boat', 'Traffic Light', 'Fire Hydrant', 'Stop Sign', 'Parking Meter', 'Bench', 'Bird', 'Cat', 'Dog', 'Horse', 'Sheep', 'Cow', 'Elephant', 'Bear', 'Zebra', 'Giraffe', 'Backpack', 'Umbrella', 'Handbag', 'Tie', 'Suitcase', 'Frisbee', 'Skis', 'Snowboard', 'Sports Ball', 'Kite', 'Baseball Bat', 'Baseball Glove', 'Skateboard', 'Surfboard', 'Tennis Racket', 'Bottle', 'Wine Glass', 'Cup', 'Fork', 'Knife', 'Spoon', 'Bowl', 'Banana', 'Apple', 'Sandwich', 'Orange', 'Broccoli', 'Carrot', 'Hot Dog', 'Pizza', 'Donut', 'Cake', 'Chair', 'Couch', 'Potted Plant', 'Bed', 'Dining Table', 'Toilet', 'TV', 'Laptop', 'Mouse', 'Remote', 'Keyboard', 'Cell Phone', 'Microwave', 'Oven', 'Toaster', 'Sink', 'Refrigerator', 'Book', 'Clock', 'Vase', 'Scissors', 'Teddy Bear', 'Hair Drier', 'Toothbrush']
# Load the YOLOv8 model
model = YOLO('yolov8s.pt')

# Function to process each frame
# database = read()
def process(frame, Camera_Ip,objectlist):
    object_detect = {}
    flag=0
    # included_item = next((data["objectList"] for data in database if data["cameraIP"] == Camera_Ip), None)
    # included_item = ["Person","Dog","Truck"]
    included_item =objectlist
    if included_item is None:
        return frame,object_detect,flag
    results = model(frame)
    # person_count = 0
    for result in results:
        for box in result.boxes:
            score = box.conf.item()
            class_id = int(box.cls)
            if Object_list[class_id] in included_item and score > 0.5:
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
        Logs(None,'Exceptions',f"Failed to connect to RabbitMQ: {e}")
        print(f"Failed to connect to RabbitMQ: {e}")

# connect_to_rabbitmq()

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
        objectlist = frame_data["ObjectList"]
        
        # Decode base64 frame data
        data = base64.b64decode(frame)
        nparr = np.frombuffer(data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Process the frame
        processed_frame, object_detect, flag = process(frame, camera_ip,objectlist)

        # Display the processed frame

        # Encode the processed frame back to base64
        _, buffer = cv2.imencode('.jpg', processed_frame)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')

        # Create the data to send to the new queue
        image_info = {
            "Event Type":"Analytics",
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
                    Logs(camera_ip,"Success", f'{{"Message": "Sent a processed frame from camera {camera_ip} to image_info", "Details": {object_detect}}}')
                else:
                    print("Channel is closed. Attempting to reconnect to RabbitMQ.")
                    Logs(camera_ip,"Error","Channel is closed. Attempting to reconnect to RabbitMQ.")
                    connect_to_rabbitmq()  # Ensure this method handles reconnection
            except pika.exceptions.AMQPError as e:
                print(f"Failed to publish message: {e}")
                Logs(camera_ip,"Error",f"Failed to publish message: {e}.")
                connect_to_rabbitmq()  # Attempt to reconnect if publishing fails
            except :
                connect_to_rabbitmq()
        ch.basic_ack(delivery_tag=method.delivery_tag)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            cv2.destroyAllWindows()
            ch.stop_consuming()
    except Exception as e:
        print(f"Error processing frame: {e}")
        Logs(camera_ip,"Error",f"Error processing frame: {e}")

def main():
    connect_to_rabbitmq()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='processed_frames', on_message_callback=callback, auto_ack=False)
    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()
# Start consuming messages from the queue
if __name__=='__main__':
    try:
        main()
        # channel.basic_qos(prefetch_count=1)
        # channel.basic_consume(queue='processed_frames', on_message_callback=callback, auto_ack=False)
        # print('Waiting for messages. To exit press CTRL+C')
        # channel.start_consuming()

    except KeyboardInterrupt:
        print("Interrupted by user, exiting...")

    except Exception as e:
        Logs(None,"Exception",f"An error occurred: {e}")
        print(f"An error occurred: {e}")
        main()

    finally:
        # Cleanup resources
        cv2.destroyAllWindows()
        connection.close()
