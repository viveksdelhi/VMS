import pika
from post_data import post_data
from live_stream import live_stream
import json
import os, sys

def reciever():
  connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
  channel = connection.channel()
  channel.queue_declare(queue='py_camera_details')
  
  def callback(ch, method, properties, body):

    print(f"[x] Recieved ")
    
    try:
      data = json.loads(body.decode())

      #calling post data function to save the data in database
      post_data(**data)
      
      #send data to api for live stream
      # live_stream(data['name'], data['rtspurl'])
      
    except json.JSONDecodeError:
      print("error in decoding")
    
  channel.basic_consume(queue='py_camera_details', on_message_callback=callback, auto_ack=True)
  print("[*] Waiting for message")
  channel.start_consuming()
  
if __name__ == '__main__':
  try:
    reciever()
  except KeyboardInterrupt:
    print('Interrupted')
    try:
      sys.exit()
    except SystemExit:
      os._exit(0)