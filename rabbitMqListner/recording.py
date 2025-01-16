import requests
from requests.exceptions import ConnectTimeout, HTTPError
from dotenv import load_dotenv
import os

load_dotenv()

def recording(camera_id, public_url, credit_id, time_minutes=5, resolution="1280x720"):
    recording_url = os.getenv("RECORDING_URL")
    try:
        payload = {
            "camera_id": camera_id,
            "rtsp_url": public_url,
            "time_minutes": time_minutes, #5 minutes of recording
            "resolution": resolution,  #1280x720 resolution
            "credit_id" : credit_id
        }
        response = requests.post(recording_url, json=payload) 
        response.raise_for_status()
        if response.status_code == 200:
            return(
                "Recording started successfully",
                True
            )
        else:
            
            return({
                    "msg" : f"Unexpected response: {response.status_code} - {response.text}",
                    "status" : False
                })
            
    except ConnectTimeout:
        return({
            "msg" : "Check your internet connection or server status.",
            "status" : False
        })
    except HTTPError as http_err:
        return({
                "msg" : f"HTTP Error occurred: {http_err}",
                "status" : False
            })
    except Exception as e:
        return({
        "msg" : f"An unexpected error occurred: {e}",
        "status" : False
        })
    

