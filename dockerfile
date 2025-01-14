# FROM python:3.11-slim
# #FROM debian:buster-slim


# WORKDIR . 

# RUN apt-get update && apt-get install -y \
#     python3-dev \
#     default-libmysqlclient-dev \
#     build-essential \
#     pkg-config \
#     && rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .


# RUN pip install -r requirements.txt

# RUN pip install --no-cache-dir -r requirements.txt

# # ENV PYTHONUNBUFFERED 1

# ENV DJANGO_SETTINGS_MODULE core.settings


# EXPOSE 6054
# CMD ["python", "manage.py", "runserver","0.0.0.0:6054"]


FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3-dev \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project into the container
COPY . .

# Set environment variable for Django
ENV DJANGO_SETTINGS_MODULE=core.settings

# Expose the port the app will run on
EXPOSE 6054

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:6054"]
