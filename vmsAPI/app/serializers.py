from rest_framework import serializers
from .models import *


class AnprstatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anprstatus
        fields = '__all__'
        
              
class CameraalertstatussSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cameraalertstatuss
        fields = '__all__'
        
class CameraalertsSerializer(serializers.ModelSerializer):
    camera_name = serializers.CharField(source='cameraId.name', read_only=True)
    camera_location = serializers.CharField(source='cameraId.location', read_only=True)
    camera_area = serializers.CharField(source='cameraId.area', read_only=True)
    class Meta:
        model = Cameraalerts
        fields = '__all__'
        
class CameraiplistsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cameraiplists
        fields = '__all__'
        
class CamerasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cameras
        fields = '__all__'

#group       
class GroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groups
        fields = '__all__'
        
#nvr
class NvrSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nvr
        fields = '__all__'
        
#Numberplatedetections   
class NumberplatedetectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Numberplatedetections
        fields = '__all__'
        
class ReadedvehiclenoplatesSerializer(serializers.ModelSerializer):
    camera_name = serializers.CharField(source='cameraId.name', read_only=True)
    camera_location = serializers.CharField(source='cameraId.location', read_only=True)
    camera_area = serializers.CharField(source='cameraId.area', read_only=True)
    class Meta:
        model = Readedvehiclenoplates
        fields = '__all__'
        
class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'
        
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
        
class VehicledetectionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicledetections
        fields = '__all__'
        
class VideoanalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videoanalytics
        fields = '__all__'
        
        
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)