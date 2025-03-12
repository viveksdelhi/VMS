from ultralytics import YOLO
import cv2
import mediapipe as mp
import os
os.environ['TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD'] = '1'
model = YOLO("yolov8m.pt")

vdo = cv2.VideoCapture("rtsp://admin:admin123@14.195.152.243:554/cam/realmonitor?channel=2&subtype=0")

#vdo = cv2.VideoCapture(0)

count = 1
previous_positions = {}
movement_threshold = 2  # Minimum movement distance to consider
phone_call_distance_threshold = 130  # Distance threshold to consider a phone call (in pixels)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1)

while vdo.isOpened():
    ret, frame = vdo.read()
    if not ret:
        print("No frame found")
        break

    if count % 15 != 0:
        count += 1
        continue

    # Convert frame to RGB for MediaPipe
    frame = cv2.flip(frame,1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    nose_tip = None
    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Get the nose tip landmark (landmark #1)
            nose_tip_x = int(face_landmarks.landmark[1].x * frame.shape[1])
            nose_tip_y = int(face_landmarks.landmark[1].y * frame.shape[0])
            nose_tip = (nose_tip_x, nose_tip_y)
            cv2.circle(frame, nose_tip, 5, (255, 0, 0), -1)

    cell_results = model(frame)[0]
    count = 1

    for cell_result in cell_results.boxes.data.tolist():
        x1, y1, x2, y2, score, id = cell_result
        label = cell_results.names[int(id)]
        
        if label == "cell phone" or label == "remote" and score > .5:
            # Calculate the center of the bounding box
            center_x = (x1 + x2) / 2
            center_y = (y1 + y2) / 2
            cv2.circle(frame,(int(center_x),int(center_y)),5,(2,0,255),-1)
            
            # Check for movement
            if label in previous_positions:
                prev_x, prev_y = previous_positions[label]
                distance = ((center_x - prev_x)**2 + (center_y - prev_y)**2)**0.5
                
                if distance > movement_threshold:
                    movement_status = "In Use"
                else:
                    movement_status = "STILL"
            else:
                movement_status = "STILL"

            # Check distance to nose tip
            if nose_tip is not None:
                nose_distance = ((center_x - nose_tip[0])**2 + (center_y - nose_tip[1])**2)**0.5
                if nose_distance < phone_call_distance_threshold:
                    movement_status = "PHONE CALL DETECTED"

            # Update the previous position
            previous_positions[label] = (center_x, center_y)
            label1 = "Mobile"
            
            # Draw the bounding box and label
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
            label_text = f"{label1} ({movement_status})"
            cv2.putText(frame, label_text, (int(x1), int(y1)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    cv2.imshow("win", frame)
    
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

vdo.release()
cv2.destroyAllWindows()

# Now the script detects if a phone is close to the nose, indicating a potential phone call! Let me know if you want me to refine this or add sound alerts. 🚀








