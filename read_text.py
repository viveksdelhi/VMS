import pika
import cv2
import pickle  # To deserialize frames
import struct  # To handle frame size packing
import numpy as np
import string
import datetime
import re
from paddleocr import PaddleOCR
# Initialize the OCR model
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Establish a connection to RabbitMQ server
connection_text = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))

# Create a channel
channel_text = connection_text.channel()

# Declare the same queue to receive from
channel_text.queue_declare(queue="plate_frames")

temp = None
# Callback function to process the received frames
def callback(ch, method, properties, body):
    global frame_buffer, frame_size_bytes, frame_size_received
    
    # If we haven't received the frame size, we're expecting it now
    if frame_size_received is False:
        # Unpack the frame size from the first 4 bytes
        #frame_size_bytes = struct.unpack('L', body)[0]
        frame_size_received = True
        return
    
    # If we already know the frame size, collect the frame data
    frame_buffer += body
    
    # Check if we've collected the entire frame
    if len(frame_buffer) >= frame_size_bytes:
        # Deserialize the frame
        frame = pickle.loads(frame_buffer)
        # read license plate
        result = ocr.ocr(frame, cls=True)

        t = ''  # Initialize the variable before processing the OCR result
        highest_score = 0

        if result:
            for result1 in result:
                if result1:
                    for bbox, (text, score) in result1:
                        t += text
                        if score > highest_score:
                            highest_score = score

                    # Clean the text
                    text = re.sub(r'[^\w\s]|_', '', t)
                    t = text.upper().replace(" ", "")
        
        # Only print if there's text detected
        if t:
            print("text :", t)
            print("score :", highest_score)
        else:
            print("No text detected")
        # Display the frame using OpenCV 
        cv2.imshow('plate Frame', frame)
        
        # Reset buffer for the next frame
        frame_buffer = b""
        frame_size_received = False
        
        # If the user presses 'q', exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            ch.stop_consuming()

# Initialize buffer variables
frame_buffer = b""
frame_size_bytes = 0
frame_size_received = False

# Start consuming messages from the queue
channel_text.basic_consume(queue="plate_frames", on_message_callback=callback, auto_ack=True)

print('Waiting for plate frames...')
channel_text.start_consuming()

# Close connection and release any OpenCV windows
connection_text.close()
cv2.destroyAllWindows()