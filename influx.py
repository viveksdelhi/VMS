# from influxdb_client import InfluxDBClient,Point,influx_client
# import os
# import cv2
# import logging
# # import influx_client
# import time

# influx_url = os.getenv("INFLUX_URL")
# token = os.getenv("INFLUX_TOKEN")
# org = os.getenv("INFLUX_ORG")
# bucket = os.getenv("INFLUX_BUCKET")


# def monitor_camera(camera_name, rtsp_link):
#     while True:
#         try:
#             cap = cv2.VideoCapture(rtsp_link)
#             if not cap.isOpened():
#                 logging.warning(f"{camera_name}: Failed to connect.")
#                 influx_client.write_api().write(bucket, org, [
#                     Point("camera_status")
#                     .tag("camera_name", camera_name)
#                     .tag("status", "disconnected")
#                     .field("message", "Failed to connect")
#                 ])
#                 time.sleep(5)  # Retry after a delay
#                 continue

#             logging.info(f"{camera_name}: Successfully connected.")
#             influx_client.write_api().write(bucket, org, [
#                 Point("camera_status")
#                 .tag("camera_name", camera_name)
#                 .tag("status", "connected")
#                 .field("message", "Successfully connected")
#             ])

#             start_time = time.time()
#             frame_count = 0
#             lost_packets = 0
#             last_timestamp = time.time()

#             while True:
#                 ret, frame = cap.read()
#                 if not ret:
#                     logging.warning(f"{camera_name}: Lost connection.")
#                     lost_packets += 1
#                     influx_client.write_api().write(bucket, org, [
#                         Point("camera_status")
#                         .tag("camera_name", camera_name)
#                         .tag("status", "disconnected")
#                         .field("message", "Lost connection")
#                     ])
#                     break

#                 frame_count += 1
#                 latency = time.time() - start_time
#                 width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
#                 height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
#                 fps = cap.get(cv2.CAP_PROP_FPS)

#                 # Prevent division by zero for bitrate calculation
#                 bitrate = frame.nbytes * 8 / (time.time() - last_timestamp) if last_timestamp != 0 else 0

#                 logging.info(
#                     f"{camera_name} | Time: {time.strftime('%Y-%m-%d %H:%M:%S')} | "
#                     f"Latency: {latency:.2f}s | "
#                     f"Resolution: {width}x{height} | "
#                     f"FPS: {fps:.2f} | "
#                     f"Bitrate: {bitrate:.2f} bps | "
#                     f"Lost Packets: {lost_packets}"
#                 )

#                 # Prepare data for InfluxDB
#                 try:
#                     influx_client.write_api().write(bucket, org, [
#                         Point("camera_metrics")
#                         .tag("camera_name", camera_name)
#                         .tag("stream_type", "live")
#                         .field("latency", latency)
#                         .field("width", width)
#                         .field("height", height)
#                         .field("fps", fps)
#                         .field("bitrate", bitrate)
#                         .field("lost_packets", lost_packets)
#                     ])
#                     logging.info(f"{camera_name}: Successfully logged metrics to InfluxDB.")
#                 except Exception as e:
#                     logging.error(f"{camera_name}: Failed to log metrics to InfluxDB: {str(e)}")

#                 last_timestamp = time.time()
#                 time.sleep(5)

#             cap.release()
#         except cv2.error as e:
#             logging.error(f"{camera_name}: OpenCV error occurred: {str(e)}")
#             time.sleep(5)  # Wait before trying to reconnect
#         except Exception as e:
#             logging.error(f"{camera_name}: Exception occurred: {str(e)}")
#             time.sleep(5)  # Wait before trying to reconnect



# def get_camera_metrics(camera_name):
    
#     # time range for the query
#     now = datetime.utcnow()
#     start_time = (now - timedelta(hours=5)).isoformat() + 'Z'  # Last hour
#     stop_time = now.isoformat() + 'Z'  # Now

#     # Specify the window period (e.g., 1 minute)
#     window_period = '1m'

#     query = f'''
#         from(bucket: "{bucket}")
#         |> range(start: {start_time}, stop: {stop_time})
#         |> filter(fn: (r) => r["_field"] == "latency")
#         |> filter(fn: (r) => r["_measurement"] == "camera_metrics")
#         |> filter(fn: (r) => r["camera_name"] == "{camera_name}")
#         |> aggregateWindow(every: {window_period}, fn: mean, createEmpty: false)
#         |> yield(name: "mean")
#     '''



import pika
import pickle
from influxdb_client import InfluxDBClient, Point
import os
from datetime import datetime

# RabbitMQ connection parameters
rabbitmq_host = 'localhost'  # Change to your RabbitMQ server IP if needed
queue_name = 'Logs'

# InfluxDB connection details
influx_url = os.getenv("INFLUX_URL")  # Example: 'http://localhost:8086'
token = os.getenv("INFLUX_TOKEN")
org = os.getenv("INFLUX_ORG")
bucket = os.getenv("INFLUX_BUCKET")

influx_url="https://vmsinfluxdb.ajeevi.in/"
bucket = "va"
org = "ajeevi"
token = "5PFv_EzYOR29IdYqNnb8trVJJYJv89CpQAEJFmqBkSiV5BwthInzqvDYrPgmchKSzMcZa3Vz0VmZlJgqfutizg=="
# Initialize InfluxDB client   
influx_client = InfluxDBClient(url=influx_url, token=token, org=org)

# Function to push data into InfluxDB
def push_to_influxdb(data,ch,method):
    # .tag("event_type", data['Event Type']) \
    try:
        point = Point(data['Event Type']) \
            .tag("camera", data['Camera']) \
            .field("type", data['Type']) \
            .field("description", data['Description']) \
            .time(datetime.utcnow())
        ch.basic_ack(delivery_tag=method.delivery_tag)
        influx_client.write_api().write(bucket, org, point)
        print(f"Data written to InfluxDB: {data}")
    except Exception as e:
        print(f"Failed to write to InfluxDB: {str(e)}")

# Callback function to process and push data to InfluxDB
def callback(ch, method, properties, body):
    # Unpickle the message data (deserialize)
    data = pickle.loads(body)
    
    # Log received message
    print(f"Received message: {data}")
    
    # Push data to InfluxDB
    push_to_influxdb(data,ch,method)

# RabbitMQ setup: establish connection and consume messages
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
channel = connection.channel()

# Declare the queue (optional if the queue is already created)
channel.queue_declare(queue=queue_name)
channel.basic_qos(prefetch_count=1)
# Subscribe to the queue and set the callback function
channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=False)

print('Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
