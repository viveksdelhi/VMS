# Use a lightweight Python base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /RabbitMqListner

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY consumer.py .
COPY live_stream.py .
COPY post_data.py .
COPY recording.py .
COPY set_status.py .
COPY health.py .
COPY .env .

# Command to run the application
CMD ["python3", "consumer.py"]
