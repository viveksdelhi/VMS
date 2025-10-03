from flask import Flask, jsonify, request  # Use Flask's request object
from onvif import ONVIFCamera, ONVIFError
from flask_cors import CORS
import requests  # Renamed the requests import
import re

app = Flask(__name__)
CORS(app)

@app.route('/get_camera_details', methods=['POST'])
def get_camera_details():
    data = request.get_json()  # This uses Flask's request object
    cameras = data.get("cameras", [])
    
    if not cameras:
        return jsonify({"error": "No cameras provided!"}), 400

    response = {}  # Initialize the response dictionary to hold all camera details

    for camera in cameras:
        required_fields = ["nvr_ip", "username", "password"]

        if not all(field in camera for field in required_fields):
            return jsonify({"error": "Missing required fields in camera details for camera!"}), 400
        
        username = camera["username"]
        password = camera["password"]
        nvr_port = camera.get("nvr_port", 80) 
        nvr_ip = camera["nvr_ip"]
        print(nvr_ip, nvr_port, username, password)
        try:
            # Connect to the ONVIF camera
            nvr = ONVIFCamera(nvr_ip, nvr_port, username, password)
            # Get device information (make and model)
            device_info = nvr.devicemgmt.GetDeviceInformation()
            make = device_info.Manufacturer
            model = device_info.Model
            firmware_version = device_info.FirmwareVersion
            serial_no= device_info.SerialNumber
            hardware_id = device_info.HardwareId
            
            capabilities = nvr.devicemgmt.GetCapabilities()
            if capabilities.Media:
                media_service = nvr.create_media_service()
                profiles = media_service.GetProfiles()

                camera_details = []
                for profile in profiles:
                    # Check if the profile is the main stream (usually the first stream in profiles)
                    if 'Main' in profile.Name:  # Customize this condition if necessary
                        profile_details = {
                            "Camera Token": profile.token,
                            "Camera Name": profile.Name,
                            "Video Source Name": profile.VideoSourceConfiguration.Name,
                            "Source Token": profile.VideoSourceConfiguration.SourceToken,
                            "Video Encoder Name": profile.VideoEncoderConfiguration.Name,
                            "Encoding": profile.VideoEncoderConfiguration.Encoding,
                            "Video Encoder Token": profile.VideoEncoderConfiguration.token,
                            "Make": make,
                            "Model": model,
                            "Firmware Version":firmware_version,
                            "Serial Number" : serial_no,
                            "Hardware ID" : hardware_id
                        }

                        # Get Stream URI for the main stream
                        stream_setup = {
                            'StreamSetup': {
                                'Stream': 'RTP-Unicast',
                                'Transport': {
                                    'Protocol': 'RTSP'
                                }
                            },
                            'ProfileToken': profile.token
                        }
                        stream_uri = media_service.GetStreamUri(stream_setup)
                        print("rtsp:",stream_uri)
                        profile_details["Stream URI"] = f"rtsp://{username}:{password.replace('@','%40')}@"+stream_uri.Uri.split('rtsp://')[1]
                        port_pattern = r":(\d+)"
                        channel_pattern = r"channel=(\d+)"
                        port = re.search(port_pattern, profile_details["Stream URI"])
                        port = port.group(1) if port else '554'  # Default port if not found

                        # Extract the channel
                        channel = re.search(channel_pattern, profile_details["Stream URI"])
                        channel = channel.group(1) if channel else None 
                        profile_details["Channel"]=channel
                        profile_details["Port"]=port
                        camera_details.append(profile_details)

                # Add this camera's details to the response
                response[nvr_ip] = camera_details

        except ONVIFError as err:
            response[nvr_ip] = {"error": f"Error Connecting..."}
        except Exception as e:
            response[nvr_ip] = {"error": f"Error Connecting..."}

    # Return the complete response with all camera details
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=7002)
