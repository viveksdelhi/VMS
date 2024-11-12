from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger
from sqlalchemy.exc import SQLAlchemyError
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Configure MySQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Ajeevi%40#321890@122.176.105.30:9512/newVMSDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Swagger configuration with custom URL
# Swagger configuration
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/swagger/apispec.json',
            "rule_filter": lambda rule: True,  # all in
            "model_filter": lambda tag: True,  # all in
        }
    ],
    "static_url_path": "/swagger/static",
    "swagger_ui": True,
    "specs_route": "/swagger/"
}

# Initialize Swagger with custom configuration
swagger = Swagger(app, config=swagger_config)

class CameraIPList(db.Model):
    __tablename__ = 'cameraiplist'
    
    id = db.Column(db.Integer, primary_key=True)
    CameraIP = db.Column(db.String(255), nullable=False)
    ObjectList = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'CameraIP': self.CameraIP,
            'ObjectList': self.ObjectList
        }
    
class VideoAnalytic(db.Model):
    __tablename__ = 'videoanalytic'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }

# CRUD Operations

# Create or Update
@app.route('/add_camera', methods=['POST'])
def add_or_update_camera():
    """
    Add or update a camera
    ---
    tags:
      - CameraIPList
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            CameraIP:
              type: string
              description: IP address of the camera
              example: "192.168.1.10"
            ObjectList:
              type: string
              description: List of detected objects
              example: "['person', 'car']"
    responses:
      200:
        description: Camera updated successfully
      201:
        description: Camera added successfully
      400:
        description: Bad request, missing CameraIP or ObjectList
      500:
        description: Internal server error
    """
    try:
        camera_ip = request.json['CameraIP']
        object_list = request.json['ObjectList']
        
        if not camera_ip or not object_list:
            return jsonify({"error": "CameraIP and ObjectList are required"}), 400
        
        existing_camera = CameraIPList.query.filter_by(CameraIP=camera_ip).first()

        if existing_camera:
            # Update existing camera
            existing_camera.ObjectList = object_list
            db.session.commit()
            return jsonify({"message": "Camera updated successfully", "camera": existing_camera.to_dict()}), 200
        else:
            # Create a new camera
            new_camera = CameraIPList(CameraIP=camera_ip, ObjectList=object_list)
            db.session.add(new_camera)
            db.session.commit()
            return jsonify({"message": "Camera added successfully", "camera": new_camera.to_dict()}), 201
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    except KeyError:
        return jsonify({"error": "Invalid input data"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Video Analytic Data
@app.route('/video_analytics', methods=['GET'])
def get_video_analytics():
    """
    Get all video analytics
    ---
    tags:
      - VideoAnalytic
    responses:
      200:
        description: A list of video analytics
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              video_name:
                type: string
              analysis_date:
                type: string
                format: date-time
              result:
                type: string
    """
    try:
        analytics = VideoAnalytic.query.all()
        return jsonify([analytic.to_dict() for analytic in analytics]), 200
    
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Read
@app.route('/cameras', methods=['GET'])
def get_cameras():
    """
    Get all cameras
    ---
    tags:
      - CameraIPList
    responses:
      200:
        description: A list of cameras
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              CameraIP:
                type: string
              ObjectList:
                type: string
    """
    try:
        cameras = CameraIPList.query.all()
        return jsonify([camera.to_dict() for camera in cameras]), 200
    
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update
@app.route('/update_camera/<int:id>', methods=['PUT'])
def update_camera(id):
    """
    Update a camera by ID
    ---
    tags:
      - CameraIPList
    parameters:
      - name: id
        in: path
        type: integer
        required: true
        description: ID of the camera
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            CameraIP:
              type: string
            ObjectList:
              type: string
    responses:
      200:
        description: Camera updated successfully
      400:
        description: Invalid input data
      404:
        description: Camera not found
      500:
        description: Internal server error
    """
    try:
        camera = CameraIPList.query.get_or_404(id)
        camera.CameraIP = request.json.get('CameraIP', camera.CameraIP)
        camera.ObjectList = request.json.get('ObjectList', camera.ObjectList)
        
        db.session.commit()
        return jsonify(camera.to_dict()), 200
    
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
    except KeyError:
        return jsonify({"error": "Invalid input data"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete by CameraIP
@app.route('/delete_camera', methods=['DELETE'])
def delete_camera_by_ip():
    """
    Delete a camera by CameraIP
    ---
    tags:
      - CameraIPList
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            CameraIP:
              type: string
              description: IP address of the camera to delete
              example: "192.168.1.10"
    responses:
      200:
        description: Camera deleted successfully
      404:
        description: Camera not found
      400:
        description: Invalid request
      500:
        description: Internal server error
    """
    try:
        camera_ip = request.json.get('CameraIP')

        if not camera_ip:
            return jsonify({"error": "CameraIP is required"}), 400
        
        camera = CameraIPList.query.filter_by(CameraIP=camera_ip).first()
        
        if not camera:
            return jsonify({"error": "Camera with the provided CameraIP not found"}), 404

        db.session.delete(camera)
        db.session.commit()
        return jsonify({"message": f"Camera with IP {camera_ip} deleted successfully"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
