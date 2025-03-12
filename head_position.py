# import cv2
# import mediapipe as mp
# import numpy as np

# # Initialize MediaPipe Face Mesh
# mp_face_mesh = mp.solutions.face_mesh
# face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, refine_landmarks=True)

# # Capture video from webcam
# cap = cv2.VideoCapture(0)

# def get_head_position(landmarks, frame_width, frame_height):
#     # Key points for head orientation
#     nose_tip = landmarks[1]
#     left_eye = landmarks[33]
#     right_eye = landmarks[263]
    
#     # Convert to pixel coordinates
#     nose_tip = (int(nose_tip.x * frame_width), int(nose_tip.y * frame_height))
#     left_eye = (int(left_eye.x * frame_width), int(left_eye.y * frame_height))
#     right_eye = (int(right_eye.x * frame_width), int(right_eye.y * frame_height))
    
#     # Calculate horizontal and vertical positions
#     eye_center_x = (left_eye[0] + right_eye[0]) // 2
#     vertical_offset = nose_tip[1] - left_eye[1]
#     horizontal_offset = nose_tip[0] - eye_center_x
    
#     # Determine head position
#     position = "Center"
#     if vertical_offset < -10:
#         position = "Up"
#     elif vertical_offset > 20:
#         position = "Down"
#     if horizontal_offset > 30:
#         position = "Right"
#     elif horizontal_offset < -30:
#         position = "Left"
    
#     return position

# while cap.isOpened():
#     ret, frame = cap.read()
#     if not ret:
#         break
    
#     frame = cv2.flip(frame, 1)
#     rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
#     results = face_mesh.process(rgb_frame)
    
#     frame_height, frame_width, _ = frame.shape
    
#     if results.multi_face_landmarks:
#         for face_landmarks in results.multi_face_landmarks:
#             position = get_head_position(face_landmarks.landmark, frame_width, frame_height)
            
#             # Draw head position on frame
#             cv2.putText(frame, f"Head Position: {position}", (10, 30),
#                         cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
#     # Display the frame
#     cv2.imshow("Head Position Detection", frame)
    
#     if cv2.waitKey(5) & 0xFF == ord("q"):  # Press 'ESC' to exit
#         break

# cap.release()
# cv2.destroyAllWindows()

# # Let me know if you want me to refine or add anything! 🚀

import cv2
import mediapipe as mp
import time
import numpy as np
from playsound import playsound
import threading

def play_alert(sound_file):
    def play():
        try:
            playsound(sound_file)
        except Exception as e:
            print(f"Error playing sound: {e}")

    alert_thread = threading.Thread(target=play)
    alert_thread.start()

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)

# Landmark indices
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
NOSE_TIP = 1
UPPER_LIP = 13
LOWER_LIP = 14
MID_FACE = 168


def calculate_ear(landmarks, eye_indices):
    eye_points = np.array([[landmarks[i].x, landmarks[i].y] for i in eye_indices])
    vertical_dist1 = np.linalg.norm(eye_points[1] - eye_points[5])
    vertical_dist2 = np.linalg.norm(eye_points[2] - eye_points[4])
    horizontal_dist = np.linalg.norm(eye_points[0] - eye_points[3])
    
    ear = (vertical_dist1 + vertical_dist2) / (2.0 * horizontal_dist)
    return ear


def is_head_down(landmarks, head_position):
    if head_position != "CENTER":
        return False  # No head down detection if head is turned left or right
    
    nose_y = landmarks[NOSE_TIP].y
    left_eye_y = landmarks[LEFT_EYE[0]].y
    right_eye_y = landmarks[RIGHT_EYE[0]].y
    avg_eye_y = (left_eye_y + right_eye_y) / 2.0
    head_angle = np.arctan2(nose_y - avg_eye_y, landmarks[NOSE_TIP].x - landmarks[LEFT_EYE[0]].x) * 180 / np.pi
    return head_angle > 45


def is_yawning(landmarks, threshold=0.06):
    upper_lip_y = landmarks[UPPER_LIP].y
    lower_lip_y = landmarks[LOWER_LIP].y
    mouth_open_distance = lower_lip_y - upper_lip_y
    return mouth_open_distance > threshold


def detect_head_position(landmarks, threshold=0.05):
    nose_x = landmarks[NOSE_TIP].x
    mid_face_x = landmarks[MID_FACE].x
    head_offset = nose_x - mid_face_x
    
    if head_offset > threshold:
        return "RIGHT"
    elif head_offset < -threshold:
        return "LEFT"
    else:
        return "CENTER"

# Constants
EAR_THRESHOLD = 0.25
DROWSY_TIME_THRESHOLD = 2.0
YAWN_TIME_THRESHOLD = 2.0

# Paths to audio files
EYE_ALERT_SOUND = "Audio.mp3"
HEAD_DOWN_ALERT_SOUND = "Audio.mp3"
YAWN_ALERT_SOUND = "Audio.mp3"
HEAD_RIGHT_ALERT_SOUND = "Audio.mp3"
HEAD_LEFT_ALERT_SOUND = "Audio.mp3"

cap = cv2.VideoCapture(0)
drowsy_start_time = None
head_down_start_time = None
yawn_start_time = None

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(frame_rgb)

    if results.multi_face_landmarks:
        landmarks = results.multi_face_landmarks[0].landmark
        
        left_ear = calculate_ear(landmarks, LEFT_EYE)
        right_ear = calculate_ear(landmarks, RIGHT_EYE)
        avg_ear = (left_ear + right_ear) / 2.0
        head_position = detect_head_position(landmarks)

        if avg_ear < EAR_THRESHOLD:
            if drowsy_start_time is None:
                drowsy_start_time = time.time()
            else:
                elapsed_time = time.time() - drowsy_start_time
                if elapsed_time >= DROWSY_TIME_THRESHOLD:
                    cv2.putText(frame, "DROWSINESS ALERT!", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    play_alert(EYE_ALERT_SOUND)
        else:
            drowsy_start_time = None
        
        if is_head_down(landmarks, head_position):
            if head_down_start_time is None:
                head_down_start_time = time.time()
            else:
                elapsed_time = time.time() - head_down_start_time
                if elapsed_time >= DROWSY_TIME_THRESHOLD:
                    cv2.putText(frame, "HEAD DOWN ALERT!", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    play_alert(HEAD_DOWN_ALERT_SOUND)
        else:
            head_down_start_time = None
        
        if is_yawning(landmarks):
            if yawn_start_time is None:
                yawn_start_time = time.time()
            else:
                elapsed_time = time.time() - yawn_start_time
                if elapsed_time >= YAWN_TIME_THRESHOLD:
                    cv2.putText(frame, "YAWNING ALERT!", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    play_alert(YAWN_ALERT_SOUND)
        else:
            yawn_start_time = None
        
        if head_position == "RIGHT":
            cv2.putText(frame, "HEAD RIGHT ALERT!", (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
            play_alert(HEAD_RIGHT_ALERT_SOUND)
        elif head_position == "LEFT":
            cv2.putText(frame, "HEAD LEFT ALERT!", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
            play_alert(HEAD_LEFT_ALERT_SOUND)

        cv2.putText(frame, f'EAR: {avg_ear:.2f}', (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        cv2.putText(frame, f'HEAD: {head_position}', (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow('Driver Drowsiness Detection', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Now, head down alert works only in the center position! 🚀 Let me know if you want any changes!
