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


# Initialize MediaPipe Solutions
mp_face_mesh = mp.solutions.face_mesh
mp_hands = mp.solutions.hands
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1, refine_landmarks=True)
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)

# Initialize MediaPipe Pose and Drawing utils for no driver
mp_pose = mp.solutions.pose
#mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Landmark indices
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]
NOSE_TIP = 1
CHIN = 152
LEFT_EAR_POINT = 234
RIGHT_EAR_POINT = 454
UPPER_LIP = 13
LOWER_LIP = 14


# Constants
EAR_THRESHOLD = 0.25
DROWSY_TIME_THRESHOLD = 1.5
YAWN_TIME_THRESHOLD = 1.0
HEAD_POSE_TIME_THRESHOLD = 1.0  # Time threshold for head pose alerts
tempering_alert_duration = 5  # seconds
driver_alert_threshold = 5  # seconds


# Paths to audio files
EYE_ALERT_SOUND = "Audio.mp3"
HEAD_DOWN_ALERT_SOUND = "Audio.mp3"
YAWN_ALERT_SOUND = "Audio.mp3"
HEAD_RIGHT_ALERT_SOUND = "Audio.mp3"
HEAD_LEFT_ALERT_SOUND = "Audio.mp3"
PHONE_ALERT_SOUND = "Audio.mp3"
DRIVER_ALERT_SOUND = "Audio.mp3"
Tempering_ALERT_SOUND = "Audio.mp3"


# Head pose estimation

def estimate_head_pose(face_landmarks, img_w, img_h):
    face_3d = []
    face_2d = []
    
    for idx, lm in enumerate(face_landmarks):
        if idx in [33, 263, 1, 61, 291, 199]:
            x, y = int(lm.x * img_w), int(lm.y * img_h)
            face_2d.append([x, y])
            face_3d.append([x, y, lm.z])

    face_2d = np.array(face_2d, dtype=np.float64)
    face_3d = np.array(face_3d, dtype=np.float64)

    focal_length = 1 * img_w
    cam_matrix = np.array([
        [focal_length, 0, img_h / 2],
        [0, focal_length, img_w / 2],
        [0, 0, 1]
    ])

    dist_matrix = np.zeros((4, 1), dtype=np.float64)

    success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
    rmat, _ = cv2.Rodrigues(rot_vec)
    angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)

    x, y, z = angles[0] * 360, angles[1] * 360, angles[2] * 360
    return x, y, z

def calculate_ear(landmarks, eye_indices):
    eye_points = np.array([[landmarks[i].x, landmarks[i].y] for i in eye_indices])
    vertical_dist1 = np.linalg.norm(eye_points[1] - eye_points[5])
    vertical_dist2 = np.linalg.norm(eye_points[2] - eye_points[4])
    horizontal_dist = np.linalg.norm(eye_points[0] - eye_points[3])
    
    ear = (vertical_dist1 + vertical_dist2) / (2.0 * horizontal_dist)
    return ear

def is_yawning(landmarks, threshold=0.03):
    upper_lip_y = landmarks[UPPER_LIP].y
    lower_lip_y = landmarks[LOWER_LIP].y
    mouth_open_distance = lower_lip_y - upper_lip_y
    return mouth_open_distance > threshold

def is_hand_near_ear(hand_landmarks, face_landmarks, distance_threshold=0.1):
    if hand_landmarks:
        hand_x, hand_y = hand_landmarks.landmark[0].x, hand_landmarks.landmark[0].y
        left_ear_x, left_ear_y = face_landmarks[LEFT_EAR_POINT].x, face_landmarks[LEFT_EAR_POINT].y
        right_ear_x, right_ear_y = face_landmarks[RIGHT_EAR_POINT].x, face_landmarks[RIGHT_EAR_POINT].y
        
        dist_left = np.linalg.norm(np.array([hand_x, hand_y]) - np.array([left_ear_x, left_ear_y]))
        dist_right = np.linalg.norm(np.array([hand_x, hand_y]) - np.array([right_ear_x, right_ear_y]))
        
        return dist_left < distance_threshold or dist_right < distance_threshold
    return False

def is_camera_covered(frame, edge_threshold=10):
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_frame, 100, 200)
    edge_pixels = np.sum(edges > 0)

    # If the number of edge pixels is below the threshold, consider the camera covered
    return edge_pixels < edge_threshold, edges


cap = cv2.VideoCapture(0)
drowsy_start_time = None
head_down_start_time = None
yawn_start_time = None
# Head pose timing trackers
head_up_start_time = None
head_down_start_time = None
head_left_start_time = None
head_right_start_time = None
no_edge_start_time = None





while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    img_h, img_w, _ = frame.shape
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = face_mesh.process(frame_rgb)
    hand_results = hands.process(frame_rgb)
    covered, edges = is_camera_covered(frame)
    if covered:
        if no_edge_start_time is None:
            no_edge_start_time = time.time()  # Start the timer
        
        elapsed_time = time.time() - no_edge_start_time

        if elapsed_time >= tempering_alert_duration:
            cv2.putText(frame, "CAMERA TEMPERING ALERT!", (50, 400), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
            play_alert(Tempering_ALERT_SOUND)
                #no_edge_start_time = None  # Reset the timer after alert
    else:
        no_edge_start_time = None  # Reset timer if edges are detected

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0].landmark
        hand_landmarks = hand_results.multi_hand_landmarks[0] if hand_results.multi_hand_landmarks else None

        if is_hand_near_ear(hand_landmarks, face_landmarks):
            cv2.putText(frame, "PHONE USAGE ALERT!", (50, 350), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            play_alert(PHONE_ALERT_SOUND)

    no_driver_results = pose.process(frame_rgb)
    # Check if any pose is detected and draw landmarks
    if no_driver_results.pose_landmarks:
        cv2.putText(frame, "Driver detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        #mp_drawing.draw_landmarks(frame, no_driver_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        no_person_start_time = None  # Reset timer when a person is detected
    else:
        cv2.putText(frame, "No driver detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        if no_person_start_time is None:
            no_person_start_time = time.time()
        else:
            elapsed_time = time.time() - no_person_start_time
            if elapsed_time >= driver_alert_threshold:
                cv2.putText(frame, "ALERT: No driver for your given time!", (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                play_alert(DRIVER_ALERT_SOUND)
                #print("ALERT: No person detected for 30 seconds!")
            

    if results.multi_face_landmarks:
        face_landmarks = results.multi_face_landmarks[0].landmark
        hand_landmarks = hand_results.multi_hand_landmarks[0] if hand_results.multi_hand_landmarks else None
        
        # Head pose detection
        x_angle, y_angle, _ = estimate_head_pose(face_landmarks, img_w, img_h)
        # Head pose time-based alerts
        current_time = time.time() 

        if y_angle < -12:
            if head_left_start_time is None:
                head_left_start_time = current_time
            elif current_time - head_left_start_time >= HEAD_POSE_TIME_THRESHOLD:
                cv2.putText(frame, "HEAD LEFT ALERT!", (50, 250), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                play_alert(HEAD_LEFT_ALERT_SOUND)
        else:
            head_left_start_time = None
            
        if y_angle > 12:
            if head_right_start_time is None:
                head_right_start_time = current_time
            elif current_time - head_right_start_time >= HEAD_POSE_TIME_THRESHOLD:
                cv2.putText(frame, "HEAD RIGHT ALERT!", (50, 300), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                play_alert(HEAD_RIGHT_ALERT_SOUND)
        else:
            head_right_start_time = None

        if x_angle > 15:
            if head_up_start_time is None:
                head_up_start_time = current_time
            elif current_time - head_up_start_time >= HEAD_POSE_TIME_THRESHOLD:
                cv2.putText(frame, "HEAD UP ALERT!", (50, 400), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                play_alert(HEAD_DOWN_ALERT_SOUND)
        else:
            head_up_start_time = None   

        if x_angle < -10:
            if head_down_start_time is None:
                head_down_start_time = current_time
            elif current_time - head_down_start_time >= HEAD_POSE_TIME_THRESHOLD:
                cv2.putText(frame, "HEAD DOWN ALERT!", (50, 400), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                play_alert(HEAD_DOWN_ALERT_SOUND)
        else:
            head_down_start_time = None    
        
      
        left_ear = calculate_ear(face_landmarks, LEFT_EYE)
        right_ear = calculate_ear(face_landmarks, RIGHT_EYE)
        avg_ear = (left_ear + right_ear) / 2.0
        
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

        # Yawning detection
        if is_yawning(face_landmarks):
            if yawn_start_time is None:
                yawn_start_time = time.time()
            else:
                elapsed_time = time.time() - yawn_start_time
                if elapsed_time >= YAWN_TIME_THRESHOLD:
                    cv2.putText(frame, "YAWNING ALERT!", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    play_alert(YAWN_ALERT_SOUND)
        else:
            yawn_start_time = None

    cv2.imshow('Ajeevi Drowsiness System', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Now, this combines everything: head pose, drowsiness, yawning, and phone usage! 🚀 Let me know if you want me to tweak anything!
