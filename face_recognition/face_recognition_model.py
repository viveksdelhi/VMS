import cv2
import os
import face_recognition
import datetime
import pika
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size unpacking
import logging
import time
import pika.exceptions
import numpy as np
import requests
import base64

#markAttendace_url = 'https://vmsfaceattapi.ajeevi.in/api/MarkAttendance/markAttendance'
markAttendace_url = os.getenv("ATTENDANCE_URL")

# API URL
all_faces_user_url = 'https://vmsfaceattapi.ajeevi.in/api/FaceAteendance/getAllUserFaces'
#all_faces_user_url = os.getenv("USER_FACE_URL")

credit_url = os.getenv("CREDIT_URL")

save_faces = 'faces'
os.makedirs(save_faces, exist_ok=True)

# Function to send logs to RabbitMQ
def send_log_to_rabbitmq(log_message):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq', heartbeat=600))
        channel = connection.channel()
        channel.queue_declare(queue='face_logs')  # Declare the queue for logs
        
        # Serialize the log message as JSON and send it to RabbitMQ
        channel.basic_publish(
            exchange='',
            routing_key='face_logs',
            body=pickle.dumps(log_message)
        )
        connection.close()
    except Exception as e:
        print(f"Failed to send log to RabbitMQ: {e}")

# Wrapper functions for logging and sending logs to RabbitMQ
def log_info(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "INFO",
        "Event_Type":"Face Recognition Event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

def log_error(message):
    logging.info(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "ERROR",
        "Event_Type":"Face Recognition Event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)    

def log_exception(message):
    logging.error(message)
    current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    message_data = {
        "log_level" : "EXCEPTION",
        "Event_Type":"Face Recognition Event",
        "Message":message,
        "datetime" : current_time,

    }
    send_log_to_rabbitmq(message_data)

# function for set up RabbitMQ connection
def setup_rabbitmq_connection(queue_name,rabbitmq_host, retries=5,retry_delay=10):
    """
    Set up RabbitMQ connection and declare queues
    """
    for attempt in range(retries):
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host, heartbeat=600))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            log_info(f"Connected to RabbitMQ at {rabbitmq_host}")
            return connection, channel
        except pika.exceptions.AMQPConnectionError as e:
            log_error(f"RabbitMQ connection failed (attempt {attempt+1}/{retries}): {e}")
            time.sleep(retry_delay)
    raise log_exception(f"Could not connect to RabbitMQ after {retries} attempts")        

# ******************** Important part of script below ********************

def download_and_process_image(image_url):
    try:
        response = requests.get(image_url, stream=True)
        response.raise_for_status()  # Raise an error for bad status codes
        image_data = np.frombuffer(response.content, np.uint8)
        image = cv2.imdecode(image_data, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        log_exception(f"Error downloading or processing image from {image_url}: {e}")
        return None


def encode_images_for_person(image_paths):
    encodings = []
    for image_path in image_paths:
        try:
            img_url = f"http://14.195.152.244:6060{image_path}"
            #print("image url :", img_url)
            image = download_and_process_image(img_url)
            #print("Image :", image)
            if image is not None:
                imageS = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                face_encodings = face_recognition.face_encodings(imageS)
                if face_encodings:
                    encodings.append(face_encodings[0])
                    log_info(f"Successfully encoded image {image_path}")
        except Exception as e:
            log_error(f"Error encoding image {image_path}: {e}")
    return encodings

def prepare_data():
    try:
        global average_encoding, onlyid, userId, encode_List_Known_face
        response = requests.get(all_faces_user_url)
        response.raise_for_status()

        data = response.json()
        average_encodings = {}
        onlyid = []
        userId = {}

        for user in data:
            name = user.get("name", "Unknown")
            name = name.upper()
            image_paths = user.get("imagePaths", [])
            user_id = user.get("id", "Unknown")
            if image_paths:
                encodings = encode_images_for_person(image_paths)
                #print("Image encodes", encodings)
                if encodings:
                    average_encoding = np.mean(encodings, axis=0)
                    average_encodings[name] = average_encoding
                    onlyid.append(user_id)
                    userId[user_id] = name
                else:
                    log_info(f"No valid face encodings found for {name}.")
            else:
                log_info(f"No image paths provided for {name}.")

        encode_List_Known_face = list(average_encodings.values())
        #print("Encoding and classNames preparation completed.")
        log_info("Encoding and classNames preparation completed.")
        #return encode_List_Known_face, onlyid, userId

    except requests.exceptions.RequestException as e:
        log_exception(f"Error fetching data: {e}")
        exit()
        
prepare_data()
print(f"Known face encodings: {len(encode_List_Known_face)}")

# ******************** Important part of script above ********************
temp = []
last_temp_update_time = datetime.datetime.now()
def clear_temp_after_interval(interval_minute=1):
    global temp, last_temp_update_time
    current_time = datetime.datetime.now()
    if int((current_time - last_temp_update_time).total_seconds()) > interval_minute * 60:
        temp = []
        last_temp_update_time = current_time
        log_info("Temp list cleared after 1 minute")


def post_credit_data(api_url, credit_id, camera_id, event_id=3):
    
    payload = {
        "event_credit_id": credit_id, 
        "device_id": camera_id, 
        "event_type_id":event_id
    }
    
    try:
        response = requests.post(api_url, json=payload)
        response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
        log_info("Data posted successfully:", response.json())
        return response
    except requests.exceptions.RequestException as e:
        log_error("An error occurred:", e)
        return None

def encode_image_to_base64(image):
    """
    Convert an image (NumPy array) to a base64-encoded string.
    """
    _, buffer = cv2.imencode('.jpg', image)
    base64_image = base64.b64encode(buffer).decode('utf-8')
    return base64_image

prev_frame_gray = None  # Global variable for previous frame

def process_frame(ch, method, properties, body, rabbitmq_host):
    """
    Callback function to process the received frame from RabbitMQ.
    """
    global prev_frame_gray
    try:
        frame_data = pickle.loads(body)  # Deserialize the frame data
        frame = frame_data["frame"]  # Extract the frame
        camera_id = frame_data["camera_id"]
        credit_id = frame_data["credit_id"]
        date_time = frame_data["date_time"]
        user_id = frame_data["user_id"]

        # Resize frame for faster processing
        imgS = cv2.resize(frame, (0, 0), None, 0.25, 0.25)
        imgRGB = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

        # Motion detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        if prev_frame_gray is None:
            prev_frame_gray = gray
            log_info("Skip motion detection")
            return  # Skip motion detection on the first frame

        frame_diff = cv2.absdiff(prev_frame_gray, gray)
        _, thresh = cv2.threshold(frame_diff, 25, 255, cv2.THRESH_BINARY)
        motion_detected = cv2.countNonZero(thresh) > 200  # Adjust sensitivity as needed
        prev_frame_gray = gray
        #print("it id grayscale processed")

        if motion_detected:
            log_info("motion_detected")
            # Perform face detection and recognition
            faces_location_curr_frame = face_recognition.face_locations(imgRGB)
            face_encodes_curr_frame = face_recognition.face_encodings(imgRGB, faces_location_curr_frame)

            # Reverse userId dictionary for lookups (name -> user_id)
            # name_to_user_id = {v: k for k, v in userId.items()}
            #print("motion detected")

            # Process detected faces
            for encodeface, faceloc in zip(face_encodes_curr_frame, faces_location_curr_frame):
                matches = face_recognition.compare_faces(encode_List_Known_face, encodeface, tolerance=0.5)
                faceDis = face_recognition.face_distance(encode_List_Known_face, encodeface)
                #print(" Matches are: ", matches)

                if matches and len(matches) > 0:
                    matchIndex = np.argmin(faceDis)
                    score = 1 - faceDis[matchIndex]
                    log_info("Face Matches are detected")

                    if matches[matchIndex] and score > 0.5:
                        #print("matchIndex")
                        onlid = onlyid[matchIndex]
                        name = userId.get(onlid, "Unknown")  # Fetch name for the id
                        display_text = f"{name} (ID: {onlid})"
                        #print("Recognized person: " , display_text)
                        if onlid not in temp:
                            temp.append(onlid)
                            display_text = f"{name} (ID: {onlid})"  # Display both name and user_id
                            y1, x2, y2, x1 = faceloc
                            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4

                            # Draw bounding box and name
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.rectangle(frame, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                            cv2.putText(frame, display_text, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
                            #print("Recognized person: " , display_text)
                            now = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

                            # Save the cropped license plate
                            face_dir = os.path.join(save_faces, str(camera_id))
                            os.makedirs(face_dir, exist_ok=True)

                            # Save original frame
                            full_face_path = os.path.join(os.getcwd(), face_dir, f'{now}.png')
                            cv2.imwrite(full_face_path, frame)
                            #post_credit_data(credit_url,credit_id, camera_id)
                            # Encode the frame as base64
                            encoded_frame = encode_image_to_base64(frame)
                            #print("Image path :", full_face_path)
                    
                            
                            multipart_data = {
                                "DateTime": (None, date_time),  # Non-file fields need (None, value)
                                "UserId": (None, onlid),       # Ensure this is not empty or invalid
                                "Name": (None, name),          # Ensure this is not empty
                                "Status": (None, "Present"),   # Status field
                                "Images": ("image.jpg", base64.b64decode(encoded_frame), "image/jpeg")  # File field
                            }

                            # Send the data
                            response = requests.post(markAttendace_url, files=multipart_data)
                            clear_temp_after_interval() 

                            # Check response status
                            if response.status_code == 200:
                                #print("Data posted successfully")
                                log_info("Data sent successfully:")
                            else:
                                #print("Error while uploading")
                                log_error(f"Failed to send data. Status code: {response.status_code}, Response: {response.text}")

                            
                    else:
                        log_error("Face matches are detected but confident score is below 50%")    
    except Exception as e:
        print("Manoj error")
        log_exception(f"An error occurred while processing frame: {e}")


def main(queue_name="frames_for_face_recognition", rabbitmq_host="rabbitmq"):
    """
    Main function to det up RabbitMQ connection ti receiving frames  and sending the detected imformation.
    Arguments:
    queue_name (str):The RabbitMQ queue name to consume frames
    rabbitmq_host (str): The host of rabbitmq server
    """
    def handle_new_user_event(ch, method, properties, body):
        """
        Callback function to process new user events.
        """
        try:
            new_user_data = pickle.loads(body)
            new_user = new_user_data["New_User"]
            if new_user == "TRUE":
                log_info("Received new user event. Preparing data...")
                prepare_data()  # Call prepare_data to refresh face encodings and user data
            else:
                log_info("New user event not received")    
        except Exception as e:
            log_exception(f"An error occurred while handling new user event: {e}")

    # Set up RabbitMQ connection and channelfor receiviing frames
    new_user_queue = "new_user_for_face_recognition"
    receiver_user_connection, receiver_user_channel = setup_rabbitmq_connection(new_user_queue, rabbitmq_host)
    receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
    while True:
        try:
            # Check if connection is established or not
            if not receiver_connection.is_open or not receiver_channel:
                log_error("RabbitMQ connection is closed. Reconnecting...")
                time.sleep(25)
                receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)

            if not receiver_user_connection.is_open or not receiver_user_channel:
                log_error("RabbitMQ connection is closed. Reconnecting...")
                time.sleep(25)
                receiver_user_connection, receiver_user_channel = setup_rabbitmq_connection(new_user_queue, rabbitmq_host)    

            receiver_channel.basic_consume(queue=queue_name,
            on_message_callback=lambda ch, method, properties, body: process_frame(ch, method ,properties, body, rabbitmq_host),
            auto_ack=True
            )
            # Consume messages from the new user event queue
            receiver_user_channel.basic_consume(queue=new_user_queue,
                on_message_callback=handle_new_user_event,
                auto_ack=True
            )

            log_info("Waiting for video frames...")
            receiver_channel.start_consuming()
            receiver_user_channel.start_consuming()
            

        except pika.exceptions.ConnectionClosedByBroker as e:
            log_error(f"RabbitMQ connection closed by broker: {e}, reconnecting...")
            time.sleep(25)
            receiver_connection, receiver_channel = setup_rabbitmq_connection(queue_name, rabbitmq_host)
        except Exception as e:
            log_exception(f"An error occurred: {e}")
            continue    

if __name__ == "__main__":
    main()
