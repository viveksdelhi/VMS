from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated  


class AnprstatusViewSet(viewsets.ModelViewSet):
    serializer_class = AnprstatusSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Anprstatus.objects.filter(userid=user_id)
        return Anprstatus.objects.all()

class CameraalertstatussViewSet(viewsets.ModelViewSet):
    serializer_class = CameraalertstatussSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Cameraalertstatuss.objects.filter(userid=user_id)
        return Cameraalertstatuss.objects.all()

class CameraalertsViewSet(viewsets.ModelViewSet):
    serializer_class = CameraalertsSerializer
    
    def get_queryset(self):
        
        queryset = Cameraalerts.objects.all()
        
        user_id = self.request.query_params.get('user_id', None)
        camera_id =self.request.query_params.get('camera_id', None)
        if user_id:
            queryset = queryset.filter(userid=user_id)
        if camera_id:
            queryset = queryset.filter(cameraId=camera_id)
        return queryset

class CameraiplistsViewSet(viewsets.ModelViewSet):
    serializer_class = CameraiplistsSerializer
    
    def get_queryset(self):
        cameraIP = self.request.query_params.get('cameraIP', None)
        if cameraIP:
            return Cameraiplists.objects.filter(cameraIP=cameraIP)
        return Cameraiplists.objects.all()

class CamerasViewSet(viewsets.ModelViewSet):
    serializer_class = CamerasSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Cameras.objects.filter(userid=user_id)
        return Cameras.objects.all()

class GroupsViewSet(viewsets.ModelViewSet):
    serializer_class = GroupsSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Groups.objects.filter(userid=user_id)
        return Groups.objects.all()

class NvrViewSet(viewsets.ModelViewSet):
    serializer_class = NvrSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Nvr.objects.filter(userid=user_id)
        return Nvr.objects.all()

class NumberplatedetectionsViewSet(viewsets.ModelViewSet):
    serializer_class = NumberplatedetectionsSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Numberplatedetections.objects.filter(userid=user_id)
        return Numberplatedetections.objects.all()

class ReadedvehiclenoplatesViewSet(viewsets.ModelViewSet):

    serializer_class = ReadedvehiclenoplatesSerializer

    def get_queryset(self):
        
        queryset = Readedvehiclenoplates.objects.all()
        
        user_id = self.request.query_params.get('user_id', None)
        camera_id =self.request.query_params.get('camera_id', None)
        
        if user_id:
            queryset =  Readedvehiclenoplates.objects.filter(userid=user_id)
        if camera_id:
            queryset =  Readedvehiclenoplates.objects.filter(cameraId=camera_id)
        return queryset

class RolesViewSet(viewsets.ModelViewSet):
    serializer_class = RolesSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Roles.objects.filter(userid=user_id)
        return Roles.objects.all()

class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UsersSerializer
    
    def get_queryset(self):
        # Get the user ID from the request (if passed as a query param)
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Users.objects.filter(id=user_id)
        return Users.objects.all()

    def perform_create(self, serializer):
        # Get the validated data from the serializer
        validated_data = serializer.validated_data

        # Hash the password before saving the user
        password = validated_data.pop('password', None)
        if password:
            validated_data['password'] = make_password(password)

        # Save the user with hashed password
        serializer.save(**validated_data)


class VehicledetectionsViewSet(viewsets.ModelViewSet):
    serializer_class = VehicledetectionsSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Vehicledetections.objects.filter(userid=user_id)
        return Vehicledetections.objects.all()

class VideoanalyticsViewSet(viewsets.ModelViewSet):
    serializer_class = VideoanalyticsSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Videoanalytics.objects.filter(userid=user_id)
        return Videoanalytics.objects.all()


class LoginView(APIView):
    
    def post(self, request):
        # Deserialize the input data
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            try:
                # Try to find the user by the username
                user = Users.objects.get(username=username)
                
                # Check if the provided password matches the stored password hash
                if check_password(password, user.password):
                    # Password is correct, return success
                    return Response({
                        'message': 'Login successful',
                        'user_id': user.id,
                        'username': user.username,
                        'firstName': user.firstName,
                        'lastName': user.lastName,
                        'emailId': user.emailId,
                    }, status=status.HTTP_200_OK)
                
                else:
                    # Invalid password
                    return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)
            
            except Users.DoesNotExist:
                # User not found
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)