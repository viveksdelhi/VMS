# 📘 Recording Service API Documentation

Base URL:
```
http://<server_ip>:5000
```
---

## 🔹 1. Start Recording
**Endpoint:**
```
POST /start_recording
```

**Description:**  
Start recording from a camera RTSP stream.

**Request Body (JSON):**
```json
{
  "camera_id": "1",
  "rtsp_url": "rtsp://user:pass@ip:554/stream",
  "time_minutes": 1,
  "resolution": "854x480",
  "credit_id": 1
}
```

- `camera_id` *(string, required)* → Unique ID for the camera.  
- `rtsp_url` *(string, required)* → RTSP stream URL.  
- `time_minutes` *(int, optional)* → Length of each recording file (default: 1).  
- `resolution` *(string, optional)* → Output resolution (default: 854x480).  
- `credit_id` *(int, optional)* → ID used for periodic API callback.  

**Response (Success):**
```json
{
  "message": "Recording started"
}
```

**Response (Error):**
```json
{
  "error": "Recording already active"
}
```

---

## 🔹 2. Stop Recording
**Endpoint:**
```
POST /stop_recording
```

**Request Body (JSON):**
```json
{
  "camera_id": "1"
}
```

**Response:**
```json
{
  "message": "Recording stopped for camera 1"
}
```

---

## 🔹 3. List Recordings
**Endpoint:**
```
GET /list_recordings/<camera_id>
```

**Query Parameters:**
- `date=YYYY-MM-DD` → Get all recordings for a specific date.  
- `datetime=YYYY-MM-DD HH:MM:SS` → Get nearest recording to given datetime.  
- *(no params)* → Get all recordings.  

**Examples:**
```
GET /list_recordings/1
GET /list_recordings/1?date=2025-08-28
GET /list_recordings/1?datetime=2025-08-28 05:07:11
```

**Response (All recordings):**
```json
{
  "recordings": [
    "1_20250828_050547.mp4",
    "1_20250828_060000.mp4"
  ]
}
```

**Response (Date filter):**
```json
{
  "date": "2025-08-28",
  "recordings": [
    "1_20250828_050547.mp4",
    "1_20250828_060000.mp4"
  ]
}
```

**Response (Nearest datetime):**
```json
{
  "requested": "2025-08-28 05:07:11",
  "nearest": "2025-08-28 05:06:48",
  "file": "1_20250828_050648.mp4",
  "playback_url": "http://127.0.0.1:5000/playback/1/1_20250828_050648.mp4"
}
```

---

## 🔹 4. Delete Recording
**Endpoint:**
```
POST /delete_recording
```

**Request Body (JSON):**
```json
{
  "camera_id": "1",
  "filename": "1_20250828_050547.mp4"
}
```

**Response (Success):**
```json
{
  "message": "Recording deleted"
}
```

**Response (Error):**
```json
{
  "error": "Recording not found"
}
```

---

## 🔹 5. Playback Recording
**Endpoint:**
```
GET /playback/<camera_id>/<filename>
```

**Description:**  
Stream or download a specific recording.

**Example:**
```
GET /playback/1/1_20250828_050547.mp4
```

**Response:**  
- Streams the video file directly.  
- Returns `404` if the file doesn’t exist.

---

✅ This API allows you to:  
- Start/Stop recording  
- List recordings (all, by date, or nearest to datetime)  
- Delete a recording  
- Playback a recording  

