

import pika
import cv2
import pickle  # To serialize frames
import struct  # To send the size of the frame

# Set up RabbitMQ connection
connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
channel = connection.channel()
channel.queue_declare(queue="video_frames")

# Open video using OpenCV
video_path = 'b.mp4'  # Replace with your video path
cap = cv2.VideoCapture(video_path)

count = 0

if not cap.isOpened():
    print("Error: Could not open video.")
    connection.close()
    exit()

# Loop to read each frame from the video
while cap.isOpened():
    ret, frame = cap.read()

    if not ret:
        print("End of video or error in reading frame.")
        break

    count +=1    
    if count % 15 != 0:
        continue
    count = 0    
    # Serialize the frame using pickle
    serialized_frame = pickle.dumps(frame)

    # Send the actual serialized frame to the queue
    channel.basic_publish(exchange="", routing_key="video_frames", body=serialized_frame)

    print("Sent a frame.")

# Release the video capture and close connections
cap.release()
connection.close()
print("Video processing complete.")
