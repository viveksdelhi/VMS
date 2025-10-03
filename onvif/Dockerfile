# # Use a lightweight Python base image
# FROM python:3.11-slim

# # Set environment variables
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# # Set working directory
# WORKDIR /camera_api

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     gcc \
#     libxml2-dev \
#     libxslt-dev \
#     libffi-dev \
#     libssl-dev \
#     build-essential \
#     libcurl4-openssl-dev \
#     libjpeg-dev \
#     zlib1g-dev \
#     libpython3-dev \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# # Install ONVIF and Flask dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy application code
# COPY flasknvr.py . 

# # Expose the port your app runs on
# EXPOSE 6012

# # Run the Flask app
# CMD ["python", "flasknvr.py"]



# Use a lightweight Python base image
FROM python:3.12-slim

# Set environment variables
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /camera_api

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libxml2-dev \
    libxslt-dev \
    libffi-dev \
    libssl-dev \
    build-essential \
    libcurl4-openssl-dev \
    libjpeg-dev \
    zlib1g-dev \
    libpython3-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy application code and requirements
COPY . .

# Expose the app port
EXPOSE 7002

# Run: install requirements and then run the app
CMD pip install --no-cache-dir -r requirements.txt && python flasknvr.py
