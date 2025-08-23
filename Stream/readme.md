# Streaming Service API Documentation

## Introduction

This API provides access to a Camera Streaming Service for managing camera devices and live video streams.

***

## 1. AddCamera

Registers a new camera in the system and starts processing its RTSP feed.

- **Method:** POST
- **Endpoint:** `http://127.0.0.1:6050/add_camera`
- **Request Payload (JSON):**

```json
{
  "camera_id": <int>,
  "rtsp_url": <string>,
  "user_id": <int>
}
```

- **Example:**

```json
{
  "camera_id": 1,
  "rtsp_url": "rtsp://adcam/realmonitor?channel=1&subtype=1&unicast=true&proto=Onvif",
  "user_id": 2
}
```

- **Response Example:**

```json
{
  "message": "Camera 1 added successfully"
}
```


***

## 2. RemoveCamera

Removes a camera from the system and stops its stream.

- **Method:** DELETE
- **Endpoint:** `http://127.0.0.1:6050/remove_camera/{camera_id}`
- **Example Request:**

```
DELETE http://127.0.0.1:6050/remove_camera/1
```

- **Response Example:**

```json
{
  "message": "Camera 1 removed successfully"
}
```


***

## 3. WatchLiveStream

Fetches the live HLS stream of a given camera. The `.m3u8` playlist can be played in VLC, Safari, or any HLS-compatible player.

- **Method:** GET
- **Endpoint:** `http://14.144:7015/stream/{camera_id}/stream.m3u8`
- **Example Request:**

```
http://14.144:7015/stream/1/stream.m3u8
```

- **Response:**
Returns a `.m3u8` playlist file with HLS segments for playback.

***


