import pika
import cv2
import pickle  # To deserialize and serialize frames
import struct  # To handle frame size packing
from ultralytics import YOLO

# Load the YOLO model
model = YOLO("yolov8s.pt")
vehicle = [2, 3, 5, 7]

# Establish a connection to RabbitMQ server for receiving frames
connection_receive_frameV = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
channel_receive = connection_receive_frameV.channel()
channel_receive.queue_declare(queue="video_frames")

# Establish a second connection to RabbitMQ for sending processed frames
connection_send_frameV = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
channel_send = connection_send_frameV.channel()
channel_send.queue_declare(queue="processed_frames")

# Callback function to process the received frames and forward them
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
        
        # Process the frame with YOLO model
        results = model(frame)[0]
        for result in results.boxes.data.tolist():
            x1, y1, x2, y2, score, id = result
            if int(id) in vehicle and score > 0.5:
                # Serialize the processed frame to send to another queue
                serialized_frame = pickle.dumps(frame)
                
                # Send the actual serialized frame to the new queue
                channel_send.basic_publish(exchange="", routing_key="processed_frames", body=serialized_frame)
                cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (255, 0, 0), 2)
                cv2.putText(frame, results.names[int(id)], (int(x1) + 20, int(y1) + 20),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 2)


        # Display the frame using OpenCV
        cv2.imshow('Received Frame', frame)

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

# Start consuming messages from the first queue
channel_receive.basic_consume(queue="video_frames", on_message_callback=callback, auto_ack=True)

print('Waiting for video frames...')
channel_receive.start_consuming()

# Close connections and release any OpenCV windows when done
connection_receive_frameV.close()
connection_send_frameV.close()
cv2.destroyAllWindows()
