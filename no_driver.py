# # import cv2
# # import mediapipe as mp

# # # Initialize MediaPipe Pose
# # mp_pose = mp.solutions.pose
# # pose = mp_pose.Pose()

# # # Start capturing video
# # cap = cv2.VideoCapture(0)

# # while cap.isOpened():
# #     ret, frame = cap.read()
# #     if not ret:
# #         break
    
# #     # Convert frame to RGB for MediaPipe
# #     rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
# #     results = pose.process(rgb_frame)
    
# #     # Check if any pose is detected
# #     if results.pose_landmarks:
# #         cv2.putText(frame, "Person detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
# #     else:
# #         cv2.putText(frame, "No person detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
# #         print("No person detected")
    
# #     # Show the video feed
# #     cv2.imshow('Person Detection', frame)
    
# #     # Exit on 'q' key
# #     if cv2.waitKey(10) & 0xFF == ord('q'):
# #         break

# # cap.release()
# # cv2.destroyAllWindows()

# # # Let me know if you want to tweak the logic or add features like saving logs or using object detection instead of pose tracking! 🚀


# import cv2
# import mediapipe as mp

# # Initialize MediaPipe Pose and Drawing utils
# mp_pose = mp.solutions.pose
# mp_drawing = mp.solutions.drawing_utils
# pose = mp_pose.Pose()

# # Start capturing video
# cap = cv2.VideoCapture(0)

# while cap.isOpened():
#     ret, frame = cap.read()
#     if not ret:
#         break
    
#     # Convert frame to RGB for MediaPipe
#     rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#     no_driver_results = pose.process(rgb_frame)
    
#     # Check if any pose is detected and draw landmarks
#     if no_driver_results.pose_landmarks:
#         cv2.putText(frame, "Person detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
#         mp_drawing.draw_landmarks(frame, no_driver_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
#     else:
#         cv2.putText(frame, "No person detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
#         print("No person detected")
    
#     # Show the video feed
#     cv2.imshow('Person Detection', frame)
    
#     # Exit on 'q' key
#     if cv2.waitKey(10) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()

# # Let me know if you want any adjustments! 🚀

import cv2
import mediapipe as mp
import time

# Initialize MediaPipe Pose and Drawing utils
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Start capturing video
cap = cv2.VideoCapture(0)

no_person_start_time = None
driver_alert_threshold = 5  # seconds

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert frame to RGB for MediaPipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    no_driver_results = pose.process(rgb_frame)
    
    # Check if any pose is detected and draw landmarks
    if no_driver_results.pose_landmarks:
        cv2.putText(frame, "Person detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        mp_drawing.draw_landmarks(frame, no_driver_results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        no_person_start_time = None  # Reset timer when a person is detected
    else:
        cv2.putText(frame, "No person detected", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        if no_person_start_time is None:
            no_person_start_time = time.time()
        else:
            elapsed_time = time.time() - no_person_start_time
            if elapsed_time >= driver_alert_threshold:
                cv2.putText(frame, "ALERT: No person for 30 seconds!", (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                print("ALERT: No person detected for 30 seconds!")
    
    # Show the video feed
    cv2.imshow('Person Detection', frame)
    
    # Exit on 'q' key
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Let me know if you want me to add sound alerts or other actions! 🚀
