import requests
from requests.exceptions import ConnectTimeout, HTTPError
from dotenv import load_dotenv
import os

load_dotenv()

def live_stream(id, public_url, credit_id):
    stream_url = os.getenv("STREAM_URL")
    try:
        payload = {
            "camera_id": id,
            "rtsp_url": public_url,
            "credit_id" : credit_id
        }
        response = requests.post(stream_url, json=payload) 
        response.raise_for_status()  # Raise HTTPError for bad responses
        if response.status_code == 200:
            print("Stream started successfully.")
        else:
            print(f"Unexpected response: {response.status_code} - {response.text}")
    except ConnectTimeout:
        print("Check your internet connection or server status.")
    except HTTPError as http_err:
        print(f"HTTP Error occurred: {http_err}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

