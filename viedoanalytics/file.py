# import pika
# import base64
# from io import BytesIO
# from PIL import Image

# # Connect to RabbitMQ
# connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
# channel = connection.channel()

# # Declare a queue
# channel.queue_declare(queue='image_queue')

# # Callback to handle image message
# def callback(ch, method, properties, body):
#     # Decode the base64 image data
#     image_data = base64.b64decode(body)
    
#     # Load the image from the byte stream
#     image = Image.open(BytesIO(image_data))
    
#     # Show the image
#     image.show()
    
#     print(" [x] Image received and displayed")

# # Start consuming the message
# channel.basic_consume(queue='image_queue', on_message_callback=callback, auto_ack=True)

# print(' [*] Waiting for images. To exit press CTRL+C')
# channel.start_consuming()




# ------------------------------------------------------------------------------------------------------------

import pika
import base64
import numpy as np
import cv2
import pickle
import requests
import os 

previous = {}
BaseUrl = 'https://vmsapi2.ajeevi.in/'
MEDIA_FOLDER = os.path.join(os.getcwd(), "media")
if not os.path.exists(MEDIA_FOLDER):
    os.makedirs(MEDIA_FOLDER)

def push_detection_data_to_base_url(camera_id, object_count, object_detect, framePath, alert_type):
        api_url = f'{BaseUrl}/api/CameraAlert/'
        object_detect_str = " ,".join(object_detect.keys()) if isinstance(object_detect, dict) else str(object_detect)
        # object_detect_str = " ".join(object_detect) if isinstance(object_detect, list) else str(object_detect)
        payload = {
            "cameraId": int(camera_id),
            "framePath": framePath,
            "objectName": object_detect_str,
            "objectCount": object_count,
            "alertStatus": alert_type
        }

        headers = {"accept": "*/*", "Content-Type": "application/json"}

        try:
            response = requests.post(api_url, json=payload, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error pushing data to API: {e}")
            if e.response:
                print(f"Response Content: {e.response.text}")

# Connect to RabbitMQ
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

def callback(ch, method, properties, body):
    global previous
    try:
        # Decode the received frame
        frame_data = pickle.loads(body)
        camera_ip = frame_data["CameraIp"]
        frame = frame_data["Image"]
        object = frame_data["Object"]
        date_time = frame_data["Datetime"]
        camera_id = frame_data["CameraId"]
        frame_data = base64.b64decode(frame)
        nparr = np.frombuffer(frame_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if previous == object:
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        if MEDIA_FOLDER and camera_ip:
            CAMERA_FOLDER = os.path.join(MEDIA_FOLDER, str(camera_ip))
            if not os.path.exists(CAMERA_FOLDER):
                os.makedirs(CAMERA_FOLDER)
            filename = date_time + '.jpg'
            file_path = os.path.join(CAMERA_FOLDER, filename)

            previous = object

            object_count = 0
            for count in object.values():
                object_count += count
            
            try:
                cv2.imwrite(file_path, frame)
                push_detection_data_to_base_url(camera_id, object_count, object, f'/media/{camera_ip}/{filename}', 'B')
                print("Image saved")
            except Exception as e:
                print(f"Error saving image: {e}")

        # Display the processed frame
        ch.basic_ack(delivery_tag=method.delivery_tag)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            ch.stop_consuming()

    except Exception as e:
        print(f"Error processing frame: {e}")

try:
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='image_info', on_message_callback=callback, auto_ack=False)
    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

except KeyboardInterrupt:
    print("Interrupted by user, exiting...")

finally:
    cv2.destroyAllWindows()
    connection.close()

