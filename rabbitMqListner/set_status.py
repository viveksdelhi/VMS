import requests
from requests.exceptions import ConnectTimeout, HTTPError
from dotenv import load_dotenv
import os

load_dotenv()

def status(id, user_id, recording_status=None):
    print("user_id ", user_id)
    api_url = os.getenv("STATUS_API")
    try:
        payload = {
            "cameraId": id,
            "recording": 1 if recording_status else 0,
            "anpr": 0,
            "snapshot": 0,
            "personDetection": 0,
            "fireDetection": 0,
            "animalDetection": 0,
            "bikeDetection": 0,
            "maskDetection": 0,
            "umbrelaDetection": 0,
            "brifecaseDetection": 0,
            "garbageDetection": 0,
            "weaponDetection": 0,
            "wrongDetection": 0,
            "queueDetection": 0,
            "smokeDetection": 0,
            "userid":user_id,
            "status":0
          }
#         payload = {
#             "recording": 0,
#             "anpr": 0,
#             "snapshot": 0,
#             "personDetection": 0,
#             "fireDetection": 0,
#             "animalDetection": 0,
#             "bikeDetection": 0,
#             "maskDetection": 0,
#             "umbrelaDetection": 0,
#             "brifecaseDetection": 0,
#             "garbageDetection": 0,
#             "weaponDetection": 0,
#             "wrongDetection": 0,
#             "queueDetection": 0,
#             "smokeDetection": 0,
#             "status": 0,
#             "cameraId": id,
#             "userid": user_id
# }
        response = requests.post(api_url, json=payload) 
        response.raise_for_status()  # Raise HTTPError for bad responses
        if response.status_code == 201:
            print(f"Status set successfully.{response.status_code}")
        else:
            print(f"Unexpected response: {response.status_code} - {response.text}")
    except ConnectTimeout:
        print("Check your internet connection or server status.")
    except HTTPError as http_err:
        print(f"HTTP Error occurred: {http_err}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

