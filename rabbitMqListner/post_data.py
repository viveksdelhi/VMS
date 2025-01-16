import requests
import json
from requests.exceptions import ConnectTimeout, HTTPError
from live_stream import live_stream
from recording import recording
from set_status import status
from health import monitor_health
from dotenv import load_dotenv
import os

load_dotenv()
global credit_id
def post_data(**kwargs):
    api_url = os.getenv("VMS_API")

    payload = {key: value for key, value in kwargs.items()}
    credit_id= payload['credit_id']
    print("Payload:", json.dumps(payload, indent=2)) 


    try:
        data_response = requests.post(api_url, json=payload)
        print(f"Data post status code: {data_response.status_code}")
        
        
        if data_response.status_code == 201:
            
            response_data = data_response.json()
            print(response_data)
            stream_id = response_data.get("id")
            stream_name = response_data.get("name")
            stream_rtspurl = response_data.get("rtspurl") 
            user_id = response_data.get("userid")
            print(user_id)
            
            #monitor health
            monitor_health(stream_id, stream_rtspurl)
            
            #live stream function called 
            live_stream(stream_id, stream_rtspurl, credit_id)
            
            #recording function called
            recording_status = recording(stream_id, stream_rtspurl, credit_id)
            
            #print status of recording 
            print(recording_status)
            
            #check recording status if recording status and set value true or false
            if recording_status[1] :
                
                status(stream_id,  user_id, True)
            else:
                status(stream_id, user_id, False)
            
        else:
            print(f"Failed to post data with status code: {data_response.status_code}")
    
    except ConnectTimeout:
        print("Connection time out please chcek youe internet connection or Server Status")
    
    except HTTPError as http_err:
        print(f"Http error ocurred : {http_err}")
    except Exception as e:
        print(f"Error posting data: {e}")