from flask import Flask, jsonify, request
import json 
import logging
import pika
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 
logging.basicConfig(filename='service.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def add_data_in_queue(**kwargs):
  connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
  channel  = connection.channel()
  channel.queue_declare(queue='py_camera_details')
  channel.basic_publish(exchange='',
                        routing_key='py_camera_details',
                        body=json.dumps(kwargs))
  connection.close()

@app.route('/camera_details', methods=['POST'])
def add_camera_details():
    try:
        data = request.get_json()  # Use get_json() to retrieve JSON data
        print(data)
        name = data.get('camera_name') #string
        cameraIP = data.get('camera_ip') #string
        nvrId = int(data.get('nvr'))#str
        groupId = int(data.get('hotspot'))#string
        location = data.get('location')#string
        rtspurl = data.get('public_url')#string
        port = int(data.get('port'))#int
        channelId = int(data.get('channel_id'))#int
        manufacture = data.get('manufacture')#string
        macAddress = data.get('mac_address')#string
        latitude = float(data.get('lattitude')) #float
        longitude = float(data.get('longitude')) #float
        area = data.get('area') #string
        brand = data.get('brand') #string
        # isStreaming = data.get('isStreaming')
        # isRecording = data.get('isRecording')
        user_id = data.get('user_id')
        credit_id = data.get('credit_id')
        
        #addig data to queue` `
        add_data_in_queue(
            name=name,
            cameraIP=cameraIP,
            nvrId=nvrId,
            groupId=groupId,
            location=location,
            rtspurl=rtspurl,
            port=port,
            channelId=channelId,
            manufacture=manufacture,
            macAddress=macAddress,
            latitude=latitude,
            longitude=longitude,
            area=area,
            brand=brand,
            userid = user_id,
            credit_id = credit_id
            # isStreaming=isStreaming,
            # isRecording=isRecording
        )
        logging.info("Data added in queue")
        return jsonify({'msg': 'data added', 'camera_name': name}), 201 

    except Exception as e:
        logging.error(f"Something Went Wrong {e}")
        return jsonify({'error': f'something went wrong {e}'}), 500  
  
  
if __name__ == '__main__':
  app.run(port=6052)
