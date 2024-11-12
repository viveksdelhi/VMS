FROM python:3.12-slim
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD python Details.py

# FROM python:3.12-slim

# # Install the required packages for OpenCV (libGL)
# RUN apt-get update && apt-get install -y \
#     libgl1-mesa-glx \
#     libglib2.0-0

# # Set working directory
# WORKDIR /app

# # Copy your requirements file
# COPY requirements.txt .

# # Install dependencies
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy your application code
# COPY . .

# # Command to run your application
# CMD ["python", "anpr_receiver_video_frames_D_object_with_id1.py"]
