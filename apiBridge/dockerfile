# Use a lightweight Python base image
FROM python:3.11-slim

# Set the working directory
WORKDIR /API_BRIDGE

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY app.py .
EXPOSE 6052

# Command to run the application with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:6052", "app:app"]
