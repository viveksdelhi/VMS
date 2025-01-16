import requests 
from requests.exceptions import ConnectTimeout, HTTPError
from dotenv import load_dotenv
import os

load_dotenv()

def monitor_health(camera_name, rtsp_url):
  health_api = os.getenv("HEALTH_API")
  try:
    payload = {
            "camera_name": camera_name,
            "rtsp_link": rtsp_url,
        }
    
    response = requests.post(health_api, json=payload)
    response.raise_for_status()
    if response.status_code == 200:
        print("camera added for monitor")
    else:
        print(f"Unexpected response: {response.status_code} - {response.text}")
  except ConnectTimeout:
      print("Check your internet connection or server status.")
  except HTTPError as http_err:
      print(f"HTTP Error occurred: {http_err}")
  except Exception as e:
      print(f"An unexpected error occurred: {e}")