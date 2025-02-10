import pika
import os
import pickle # to serialize and deserialize frames
import cv2
import pika.connection
import pika.exceptions
from ultralytics import YOLO
import datetime
import logging
import time
import math

'''
fire and smoke, fall detection, triple riding, cattle on road, helmet detection, seatbelt detection, vehicle classification,
'''

fire_smoke_model = YOLO("fire_smoke_detectorv8.pt")
fall_model = YOLO("Fall_detectorv8.pt")
model = YOLO("yolov8m.pt")
helmet_model = YOLO("hemletYoloV8_100epochs.pt")
seat_belt_model=YOLO("belt_mobile_65v8s_best.pt")

# Cattle for detection
CATTLE_CLASSES = ["cat", "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe"]
vehicles = [2, 3, 5, 7]

# Function to send logs to rabbitmq
def send_logs_to_rabbitmq(log_message):
    try:
        # Establish RabbitMQ connection to
        connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost", heartbeat=600))
        # Create channel
        channel = connection.channel()
        # Declare the queue for logs
        channel.queue_declare(queue="traffic_domain_logs")
        # Serialize the log messages and sending them to the queue
        channel.basic_publish(
            exchange="",
            routing_key="traffic_domain_logs",
            body=pickle.dumps(log_message)
        )
        connection.close()
    except Exception as e:
        print(f"Failed to send log to RabbitMQ: {e}")


# wrapper function for logging and sendding logs to RabbitMQ

def log_info(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level": "INFO",
        "Event_Type": "Video Processing for traffic domain",
        "Message": message,
        "Timestamp": current_time
    }
    send_logs_to_rabbitmq(message_data)    

def log_error(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "ERROR",
        "Event_Type":"Video Processing for traffic domain",
        "Message":message,
        "datetime" : current_time,

    }
    send_logs_to_rabbitmq(message_data)       

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Video Processing for traffic domain",
        "Message":message,
        "datetime" : current_time,

    }
    send_logs_to_rabbitmq(message_data)  

# Function for setup rabbitmq connection

def setup_rabbitmq_connection(queue_name, rabbitmq_host,retries = 5, retry_delay = 5):
    """
    Set up a RabbitMQ connection and declare the queue
    """           
    for attempt in range(retries):
        try:
            connecttion = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, heartbeat=600))
            channel  = connecttion.channel()
            channel.queue_declare(queue=queue_name)
            log_info(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connecttion, channel
        except pika.exceptions.AMQPConnectionError as e:
            log_error(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise log_exception(f"Could not connect to RabbitMQ after {retries} attempts")

def publish_to_queue(camera_id, frame, processed_channel,processed_queue_name):
    """Publish processed data to RabbitMQ."""
    print("publish")
    processed_frame_data = {
        "camera_id": camera_id,
        "frame": frame
    }
    serialized_frame = pickle.dumps(processed_frame_data)
    processed_channel.basic_publish(exchange="", routing_key=processed_queue_name, body=serialized_frame)


def process_cattle(frame, results):
    """Process detections for 'Cattle on Road'."""
    cattle_detected = 0
    for result in results.boxes.data.tolist():
        cx1, cy1, cx2, cy2, cattle_score, cattle_id = result
        label = results.names[int(cattle_id)]
        if label in CATTLE_CLASSES and cattle_score > 0.52:             
            # Draw bounding box
            cv2.rectangle(frame, (int(cx1), int(cy1)), (int(cx2), int(cy2)), (0, 255, 0), 2)
            cattle_detected += 1

    return frame, cattle_detected

# function to process frame received
def process_frame(ch, method, properties, body, processed_channel,processed_queue_name, rabbitmq_host):
    """
    Process a frame received from RabbitMQ:
    Args:
        channel: The RabbitMQ channel.
        method: The RabbitMQ method.
        properties: The RabbitMQ properties.
        body: The frame data as bytes.
        rabbitmq_host: The RabbitMQ host.
    """
    if not processed_channel.is_open:
        log_error("Receiver channel is closed. Attempting to reconnect.")
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

    try:
        # Deserialize the frame and metadata
        frame_data = pickle.loads(body)

        camera_id = frame_data["camera_id"]
        camera_ip = frame_data["camera_ip"]
        object_list = frame_data["object_list"]
        datetime = frame_data["datetime"]
        frame = frame_data["frame"]
        user_id = frame_data["user_id"]
        credit_id = frame_data["credit_id"] 
        detected_object = {}
        flag = 0
        object_for_detection = object_list.lower()  

        results = model(frame, verbose=False)[0] 

        # fire and smoke
        if "fire and smoke" in object_for_detection:
            fire_smoke_results = fire_smoke_model(frame, verbose=False)[0]
            for fire_smoke_reslut in  fire_smoke_results.boxes.data.tolist():
                fsx1, fsy1, fsx2, fsy2, fsscore, fsid = fire_smoke_reslut
                fslabel = fire_smoke_results.names[int(fsid)]
                if fsscore > 0.5:
                    flag = 1
                    cv2.rectangle(frame, (int(fsx1), int(fsy1)), (int(fsx2), int(fsy2)), (0, 255, 0), 2)
                    detected_object[fslabel] = detected_object.get(fslabel, 0) + 1
                    log_info(f"Fire and smoke detected with camera_id :{camera_id}")   

        if "fall detection" in object_for_detection:
            fall_results = fall_model(frame, verbose=False)[0]  # has only one class Fall-Detectioned
            for fall_reslut in  fall_results.boxes.data.tolist():
                fx1, fy1, fx2, fy2, fscore, fid = fall_reslut
                flabel = fall_results.names[int(fid)]
                if fscore > 0.52:
                    flag = 1
                    cv2.rectangle(frame, (int(fx1), int(fy1)), (int(fx2), int(fy2)), (0, 255, 0), 2)
                    detected_object[flabel] = detected_object.get(flabel, 0) + 1
                    log_info(f"Fall detected with camera_id :{camera_id}")    

        if "triple riding" in object_for_detection:
            triple_results = results
            person_results = results
            for triple_reslut in  triple_results.boxes.data.tolist():
                tpx1, tpy1, tpx2, tpy2, tpscore, tpclass_id = triple_reslut
                if tpscore > .5 and tpclass_id == 3 :
                    tpmlabel = triple_results.names[int(tpclass_id)]
                    # Define area for person detection
                    dx1, dy1, dx2, dy2 = int(tpx1)- 20, int(tpy1) - 150, int(tpx2), int(tpy2)
                    # Draw vehicle bounding box
                    cv2.rectangle(frame, (dx1, dy1), (dx2, dy2), (255, 0, 0), 2)
                    cv2.putText(frame, tpmlabel, (dx1, dy1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
                    person_count = 0
                    # Check for persons within the defined area
                    for person in person_results.boxes.data.tolist():
                        px1, py1, px2, py2, pscore, pclass_id = person
                        if pclass_id == 0 and pscore > 0.5:  # ID 0 assumed for person
                            
                            # Check if the person's bounding box is inside the defined area
                            if px1 >= dx1 and py1 >= dy1 and px2 <= dx2 and py2 <= dy2:
                                cv2.rectangle(frame, (int(px1), int(py1)), (int(px2), int(py2)), (0, 255, 0), 2)
                                cv2.putText(frame, "Person", (int(px1), int(py1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                                person_count += 1
                            if person_count >= 3 :
                                cv2.putText(frame, "Triple Riding Detected!", (dx1, dy1 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                                print("triple reder detected")
                                flag = 1
                                detected_object["triple reder"] = detected_object.get("triple reder", 0) + 1 
                                person_count = 0    
                                log_info(f"Triple riding detected with camera_id :{camera_id}")   

        if "Cattle on road" in object_for_detection:
            #print("Cattle on road")
            frame, cattle_count = process_cattle(frame, results)
            if cattle_count > 0:
                flag = 1
                detected_object["Cattle"] = cattle_count  
                log_info(f"Cattle detected successfully for camera_id : {camera_id}")     
        if "vehicle classification" in object_for_detection:
            for vehicle_class in results.boxes.data.tolist():
                vcx1, vcy1, vcx2, vcy2, vcscore, vcid = vehicle_class
                vcid = int(vcid) 
                # check vehicle class id in vehicle id list
                if vcid in vehicles and vcscore > .5:
                    vehicle_name = results.names[vcid]
                    flag = 1
                    detected_object[vehicle_name] = detected_object.get(vehicle_name, 0) + 1

        if "helmet" in object_for_detection:
            # Iterate over detected objects
            for result in results.boxes.data.tolist():
                mx1, my1, mx2, my2, mscore, mclass_id = result
                
                # Check if the detected object is a vehicle (ID 3 assumed for vehicle)
                if mclass_id == 3 and mscore > 0.5:
                    label_name = results.names[int(mclass_id)]
                    
                    # Define area for person detection
                    dx1, dy1, dx2, dy2 = int(mx1)- 20, int(my1) - 150, int(mx2), int(my2)

                    # Draw vehicle bounding box
                    cv2.rectangle(frame, (dx1, dy1), (dx2, dy2), (255, 0, 0), 2)
                    cv2.putText(frame, label_name, (dx1, dy1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
                    person_count = 0
                    # Check for persons within the defined area
                    for person in results.boxes.data.tolist():
                        px1, py1, px2, py2, pscore, pclass_id = person
                        if pclass_id == 0 and pscore > 0.5:  # ID 0 assumed for person
                            
                            # Check if the person's bounding box is inside the defined area
                            if px1 >= dx1 and py1 >= dy1 and px2 <= dx2 and py2 <= dy2:
                                cv2.rectangle(frame, (int(px1), int(py1)), (int(px2), int(py2)), (0, 255, 0), 2)
                                cv2.putText(frame, "Person", (int(px1), int(py1) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                                person_count += 1

                    # Process head detection for all cases
                    if person_count >= 1:
                        head_count = 0
                        helmet_results = helmet_model(frame, verbose=False)[0]
                        for helmet_result in helmet_results.boxes.data.tolist():
                            hx1, hy1, hx2, hy2, hscore, hclass_id = helmet_result
                            helmet_label = helmet_results.names[int(hclass_id)]
                            if helmet_label == "head" and hscore > 0.5:  
                                if hx1 >= dx1 and hy1 >= dy1 and hx2 <= dx2 and hy2 <= dy2:
                                    head_count += 1

                        print("Person count", person_count)
                        print("Head count", head_count)
                        if person_count == 1:
                            if head_count == 1:
                                flag = 1
                                cv2.putText(frame, "Single Riding Detected!", (dx1, dy1 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                                detected_object["Without helmet"] = detected_object.get("Without helmet", 0) + 1
                                print("Single rider without helmet detected")

                        elif person_count == 2:
                            if head_count >=1:
                                flag = 1
                                cv2.putText(frame, "Double Riding Detected!", (dx1, dy1 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                                detected_object["Without helmet"] = detected_object.get("Without helmet", 0) + 1
                                print("Double rider detected")

                        elif person_count >= 3:
                            if head_count >= 1:
                                flag = 1
                                cv2.putText(frame, "Triple Riding Detected!", (dx1, dy1 - 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                                detected_object["Without helmet"] = detected_object.get("Without helmet", 0) + 1
                                print("Triple rider detected")
                            
                        person_count = 0
        # Specific Rules: Without Seat Belt
        if "Without Seat belt" in object_for_detection:
            #print("Without Seat belt")
            results2 = seat_belt_model(frame,verbose=False)[0]
            for result in results2.boxes.data.tolist():
                x1, y1, x2, y2, seat_score, seat_id = result
                label_seat = results2.names[seat_id]
                if label_seat == "no-seatbelt" and seat_score > .55:
                    flag = 1
                    publish_to_queue(camera_id, frame, processed_channel,processed_queue_name="detected_vehicle")
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2)), (0, 255, 0), 2)
                    detected_object["Without Seat belt"] = detected_object.get("Without Seat belt", 0) + 1  
                    log_info(f"Seat belt detected successfully for camera_id : {camera_id}")                                      

        # Serialize the processed license plate frame
        #print("Detected object :", detected_object)
        #print("object :", object_for_detection)
        if detected_object:
            image_info = {
                "Event_Type":"Analytics",
                "CameraId": camera_id,
                'CameraIp': camera_ip,
                'Datetime': datetime,
                'Image': frame,
                'Object': detected_object,
                "UserId": user_id,
                "CreditId": credit_id,
            }
            serialized_frame = pickle.dumps(image_info)
            # Send the processed frame to the 'processed_frames' queue
            processed_channel.basic_publish(
                exchange="",
                routing_key=processed_queue_name,
                body=serialized_frame
            )
            log_info("Object detected successfully")            

    except Exception as e:
        log_exception(f"Error processing frame: {e}")
        processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)    


# function to processed frame received
def main(received_queue_name="all_frames", processed_queue_name="traffic_analytics", rabbitmq_host="localhost"):  
    """
    Main function to set up Rabbitmq connection for receiving and sending frames:
    Args:
        queue_name (str): The RabbitMQ queue to consume frames from. Defaults to 'video_frames'.
        processed_queue_name (str): The RabbitMQ queue to send processed frames to. Defaults to 'processed_frames'.
    """   
    # Set up RabbitMQ connection and channel for receiving frames
    receiver_connection, receiver_channel = setup_rabbitmq_connection(received_queue_name, rabbitmq_host)

    # Set up RabbitMQ connection and channel for sending processed frames
    processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)

    while True:
        try:
            if not receiver_channel.is_open:
                log_error("Receiver channel is closed. Attempting to reconnect.")
                time.sleep(25)
                receiver_connection, receiver_channel = setup_rabbitmq_connection(received_queue_name, rabbitmq_host)
            if not processed_channel.is_open:
                log_error("Receiver channel is closed. Attempting to reconnect.")
                time.sleep(25)
                processed_connection, processed_channel = setup_rabbitmq_connection(processed_queue_name, rabbitmq_host)
            receiver_channel.basic_consume(
                queue=received_queue_name,
                on_message_callback= lambda ch, method, properties, body: process_frame(ch, method, properties, body,
                    processed_channel,processed_queue_name, rabbitmq_host), auto_ack=True
            )  
            log_info("Waiting for video frames...")
            receiver_channel.start_consuming()
        except pika.exceptions.ChannelClosedByBroker as e:
            log_error("Connection closed by broker, reconnecting...")
            time.sleep(25)
            receiver_connection, receiver_channel = setup_rabbitmq_connection(received_queue_name, rabbitmq_host)  
        except Exception as e:
            log_exception(f"Unexpected error: {e}")
            time.sleep(25)
            continue 

if __name__ == "__main__":
    # Start the receiver and sender
    main()                
