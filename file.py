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


BaseUrl = 'https://vmsapi2.ajeevi.in'
auth_url = f"{BaseUrl}/api/Auth/login"  
auth_payload = {'userName': 'admin', 'password': 'admin'}
auth_response = requests.post(auth_url, json=auth_payload)

# Check if authentication was successful
if auth_response.status_code == 200:
    token = auth_response.json().get('token')  
    print("Authentication successful. Token received.")
else:
    print(f"Authentication failed with status code: {auth_response.status_code}")


previous = []
MEDIA_FOLDER = os.path.join(os.getcwd(), "media")
if not os.path.exists(MEDIA_FOLDER):
    os.makedirs(MEDIA_FOLDER)

predic={}

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
               "Event Type":"Video Analytics Send Event to database and Save data ",
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

def push_detection_data_to_base_url(camera_ip,camera_id, object_count, object_detect, framePath, alert_type):
        api_url = f'{BaseUrl}/api/CameraAlert'
        # object_detect_str = " ,".join(object_detect.keys()) if isinstance(object_detect, dict) else str(object_detect)
        object_detect_str = " ".join(object_detect) if isinstance(object_detect, list) else str(object_detect)
        print(object_detect_str,type(object_detect_str))
        payload = {
            "cameraId": int(camera_id),
            "framePath": framePath,
            "objectName": object_detect_str,
            "objectCount": object_count,
            "alertStatus": alert_type
        }

        headers = {"accept": "*/*", "Content-Type": "application/json", 'Authorization': f'Bearer {token}' }

        try:
            response = requests.post(api_url, json=payload, headers=headers)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error pushing data to API: {e}")
            Logs(camera_ip,"Error",f"Error pushing data to API: {e}")
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

        if camera_ip in predic:
            if object in predic[camera_ip]:
                if len(predic[camera_ip]) < 3:
                    predic[camera_ip].append(object)
                else:
                    predic[camera_ip].pop(0)
                    predic[camera_ip].append(object)
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return
            if len(predic[camera_ip]) < 3:
                predic[camera_ip].append(object)
            else:
                predic[camera_ip].pop(0)
                predic[camera_ip].append(object)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            predic[camera_ip] = [object]
      
        
        if MEDIA_FOLDER and camera_ip:
            CAMERA_FOLDER = os.path.join(MEDIA_FOLDER, str(camera_ip))
            if not os.path.exists(CAMERA_FOLDER):
                os.makedirs(CAMERA_FOLDER)
            filename = date_time + '.jpg'
            file_path = os.path.join(CAMERA_FOLDER, filename)


            object_count = 0
            for count in object.values():
                object_count += count
            
            try:
                cv2.imwrite(file_path, frame)
                push_detection_data_to_base_url(camera_ip,camera_id, object_count, object, f'/media/{camera_ip}/{filename}', 'B')
                print("Image saved")
                Logs(camera_ip,"Success","Image saved")
            except Exception as e:
                print(f"Error saving image: {e}")
                Logs(camera_ip,"Exception",f"Error saving image: {e}")

        # Display the processed frame
        ch.basic_ack(delivery_tag=method.delivery_tag)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            ch.stop_consuming()

    except Exception as e:
        print(f"Error processing frame: {e}")
        Logs(camera_ip,"Exception",f"Error processing frame: {e}")

def main():
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='image_info', on_message_callback=callback, auto_ack=False)
    print('Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

if __name__=='__main__':
    try:
        main()

    except Exception as e:
        Logs(None,"Exception",f"An error occurred: {e}")
        print(f"An error occurred: {e}")

    except KeyboardInterrupt:
        print("Interrupted by user, exiting...")

    finally:
        # Cleanup resources
        cv2.destroyAllWindows()
        connection.close()

