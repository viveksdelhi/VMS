import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
import pika
import os
import pickle
import struct
from ultralytics import YOLO
import datetime
import cv2
import logging
import time
import requests
import math

os.environ['TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD'] = '1'
Object_list = ['Person', 'Bicycle', 'Car', 'Motorcycle', 'Airplane', 'Bus', 'Train', 'Truck', 'Boat', 'Traffic Light', 'Fire Hydrant', 
               'Stop Sign', 'Parking Meter', 'Bench', 'Bird', 'Cat', 'Dog', 'Horse', 'Sheep', 'Cow', 'Elephant', 'Bear', 'Zebra', 
               'Giraffe', 'Backpack', 'Umbrella', 'Handbag', 'Tie', 'Suitcase', 'Frisbee', 'Skis', 'Snowboard', 'Sports Ball', 'Kite', 
               'Baseball Bat', 'Baseball Glove', 'Skateboard', 'Surfboard', 'Tennis Racket', 'Bottle', 'Wine Glass', 'Cup', 'Fork', 
               'Knife', 'Spoon', 'Bowl', 'Banana', 'Apple', 'Sandwich', 'Orange', 'Broccoli', 'Carrot', 'Hot Dog', 'Pizza', 'Donut', 
               'Cake', 'Chair', 'Couch', 'Potted Plant', 'Bed', 'Dining Table', 'Toilet', 'TV', 'Laptop', 'Mouse', 'Remote', 
               'Keyboard', 'Cell Phone', 'Microwave', 'Oven', 'Toaster', 'Sink', 'Refrigerator', 'Book', 'Clock', 'Vase', 
               'Scissors', 'Teddy Bear', 'Hair Drier', 'Toothbrush']

CATTLE_CLASSES = ["cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe"]

model = YOLO("yolov8m.pt")
seat_belt_model = YOLO("belt_mobile_65v8s_best.pt")
helmet_model = YOLO("hemletYoloV8_100epochs.pt")

vehicle_frame = "vehicle_frame"
os.makedirs(vehicle_frame, exist_ok=True)

previous_frames = {}
SIMILARITY_THRESHOLD = 360000

def send_log_to_rabbitmq(log_message):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq', heartbeat=600))
        channel = connection.channel()
        channel.queue_declare(queue='anpr_logs')
        channel.basic_publish(exchange='', routing_key='anpr_logs', body=pickle.dumps(log_message))
        connection.close()
    except Exception as e:
        print(f"Failed to send log to RabbitMQ: {e}")

def log_info(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level": "INFO",
        "Event_Type": "Start threads for send frames",
        "Message": message,
        "datetime": current_time,
    }
    send_log_to_rabbitmq(message_data)

def log_error(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level": "ERROR",
        "Event_Type": "Start threads for send frames",
        "Message": message,
        "datetime": current_time,
    }
    send_log_to_rabbitmq(message_data)

def log_exception(message):
    logging.exception(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level": "EXCEPTION",
        "Event_Type": "Start threads for send frames",
        "Message": message,
        "datetime": current_time,
    }
    send_log_to_rabbitmq(message_data)

def setup_rabbitmq_connection(queue_name, rabbitmq_host, retries=5, retry_delay=5):
    for attempt in range(retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, heartbeat=600))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            log_info(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            log_error(f"RabbitMQ connection failed (attempt {attempt + 1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise log_exception(f"Could not connect to RabbitMQ after {retries} attempts")

def publish_to_queue(camera_id, frame, processed_channel, processed_queue_name):
    processed_frame_data = {
        "camera_id": camera_id,
        "frame": frame
    }
    serialized_frame = pickle.dumps(processed_frame_data)
    processed_channel.basic_publish(exchange="", routing_key=processed_queue_name, body=serialized_frame)

def process_cattle(frame, results):
    cattle_detected = 0
    for result in results.boxes.data.tolist():
        x1, y1, x2, y2, score, id = result
        label = Object_list[int(id)].lower()
        if label in CATTLE_CLASSES and score > 0.5:
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            cattle_detected += 1
    return frame, cattle_detected

def process_frame(ch, method, properties, body, processed_channel, processed_queue_name, rabbitmq_host):
    global previous_frames
    if not processed_channel.is_open:
        log_error("Receiver channel is closed. Attempting to reconnect.")
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
    try:
        frame_data = pickle.loads(body)
        camera_id = frame_data["camera_id"]
        camera_ip = frame_data["camera_ip"]
        object_list = frame_data["object_list"]
        datetime_str = frame_data["datetime"]
        frame = frame_data["frame"]
        user_id = frame_data["user_id"]
        credit_id = frame_data["credit_id"]

        if camera_id in previous_frames:
            prev_gray = cv2.cvtColor(previous_frames[camera_id], cv2.COLOR_BGR2GRAY)
            curr_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            diff = cv2.absdiff(prev_gray, curr_gray)
            # print(cv2.countNonZero(diff))
            if cv2.countNonZero(diff) < SIMILARITY_THRESHOLD:
                print(f"Skipping frame for camera_id {camera_id} due to similarity.")
                return
        previous_frames[camera_id] = frame.copy()
        print(cv2.countNonZero(diff))
        detected_object = {}
        flag = 0
        if not object_list:
            return frame, detected_object, flag

        results = model(frame, verbose=False)[0]

        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, id = result
            label = results.names[int(id)]
            
            if label in object_list and score > 0.5:
                flag = 1
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                detected_object[label] = detected_object.get(label, 0) + 1

        # Optional: print all detections
        print("Detected objects:", detected_object)

        # Convert to 'Crowd' if person count is more than 2
        if detected_object.get('person', 0) > 4:
            temp = detected_object['person']
            detected_object = {'Crowd': temp}

        if "Cattle on road" in object_list:
            frame, cattle_count = process_cattle(frame, results)
            if cattle_count > 0:
                flag = 1
                detected_object["Cattle"] = cattle_count

        # if "Crowd" in object_list:
        #     person_count = sum(1 for result in results.boxes.data.tolist() if results.names[int(result[5])] == "person" and result[4] > 0.5)
        #     if person_count >= 2:
        #         flag = 1
        #         detected_object["Crowd"] = person_count
        #         print(detected_object)
        #         log_info(f"Crowd detected with {person_count} persons for camera_id: {camera_id}")

        if "Without Seat belt" in object_list:
            results2 = seat_belt_model(frame, verbose=False)[0]
            for result in results2.boxes.data.tolist():
                x1, y1, x2, y2, score, id = result
                label = results2.names[int(id)]
                if label == "no-seatbelt" and score > 0.5:
                    flag = 1
                    publish_to_queue(camera_id, frame, processed_channel, "detected_vehicle")
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    detected_object["Without Seat belt"] = detected_object.get("Without Seat belt", 0) + 1

        if "Without Helmet" in object_list:
            results3 = helmet_model(frame, verbose=False)[0]
            head_boxes = [tuple(result[:4]) for result in results3.boxes.data.tolist() if results3.names[int(result[5])] == "head" and result[4] > 0.5]

            results4 = model(frame)[0]
            for result4 in results4.boxes.data.tolist():
                mx1, my1, mx2, my2, score, id = result4
                if results4.names[int(id)] == "motorcycle" and score > 0.5:
                    for hx1, hy1, hx2, hy2 in head_boxes:
                        if math.sqrt((hx1 + hx2)/2 - (mx1 + mx2)/2)*2 + ((hy1 + hy2)/2 - (my1 + my2)/2)*2 < 100:
                            flag = 1
                            publish_to_queue(camera_id, frame, processed_channel, "detected_vehicle")
                            detected_object["Without Helmet"] = detected_object.get("Without Helmet", 0) + 1

        if detected_object:
            image_info = {
                "Event_Type": "Analytics",
                "CameraId": camera_id,
                "CameraIp": camera_ip,
                "Datetime": datetime_str,
                "Image": frame,
                "Object": detected_object,
                "UserId": user_id,
                "CreditId": credit_id,
            }
            serialized_frame = pickle.dumps(image_info)
            processed_channel.basic_publish(exchange="", routing_key="video_analytics", body=serialized_frame)
            log_info("Object detected successfully")

    except Exception as e:
        log_exception(f"Error processing frame: {e}")
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

def main(queue_name="all_frames", processed_queue_name="video_analytics", rabbitmq_host="rabbitmq"):
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
    processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

    while True:
        try:
            if not receiver_channel.is_open:
                time.sleep(25)
                receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
            if not processed_channel.is_open:
                time.sleep(25)
                processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

            receiver_channel.basic_consume(
                queue=queue_name,
                on_message_callback=lambda ch, method, properties, body: process_frame(
                    ch, method, properties, body, processed_channel, processed_queue_name, rabbitmq_host
                ),
                auto_ack=True
            )
            log_info("Waiting for video frames...")
            receiver_channel.start_consuming()

        except pika.exceptions.ConnectionClosedByBroker:
            time.sleep(25)
            receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
            processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
        except Exception as e:
            log_exception(f"Unexpected error: {e}")
            time.sleep(25)
            continue

if __name__ == "__main__":
    main()
