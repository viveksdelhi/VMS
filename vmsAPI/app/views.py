import os
import requests
from requests.exceptions import ConnectTimeout, HTTPError
from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models.functions import TruncDate
from django.db.models import Count


from django.contrib.auth.hashers import make_password, check_password

from django_filters import rest_framework as django_filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *
from .permissions import *


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'pageSize'
    max_page_size = 1000  
    

class AnprstatusViewSet(viewsets.ModelViewSet):
    serializer_class = AnprstatusSerializer
    pagination_class = StandardResultsSetPagination
    
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Anprstatus.objects.filter(userid=user_id)
        return Anprstatus.objects.all()

class CameraalertstatussViewSet(viewsets.ModelViewSet):
    serializer_class = CameraalertstatussSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        
        if user_id:
            return Cameraalertstatuss.objects.filter(userid=user_id)
        return Cameraalertstatuss.objects.all()

class CameraalertsFilter(django_filters.FilterSet):
    camera_name = django_filters.filters.CharFilter(field_name='cameraId__name', lookup_expr='icontains')
    camera_location = django_filters.filters.CharFilter(field_name='cameraId__location', lookup_expr='icontains')
    camera_area = django_filters.filters.CharFilter(field_name='cameraId__area', lookup_expr='icontains')
    camera_id = django_filters.filters.NumberFilter(field_name='cameraId', lookup_expr='exact')
    user_id = django_filters.filters.NumberFilter(field_name='userid', lookup_expr='exact')
    
    class Meta:
        model = Cameraalerts
        fields = ['camera_name', 'camera_location', 'camera_area', 'camera_id']
        
class CameraalertsViewSet(viewsets.ModelViewSet):
    serializer_class = CameraalertsSerializer
    pagination_class = StandardResultsSetPagination 
    search_fields = ['objectName', 'objectCount', 'alertStatus', 'regDate', 'cameraId__name', 'cameraId__location', 'cameraId__area']
    filter_backends = (filters.SearchFilter, DjangoFilterBackend, )
    filterset_class = CameraalertsFilter 
    
    def get_queryset(self):
        queryset = Cameraalerts.objects.all()
        return queryset

class CameraiplistsViewSet(viewsets.ModelViewSet):
    serializer_class = CameraiplistsSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        cameraIP = self.request.query_params.get('cameraIP', None)
        if cameraIP:
            return Cameraiplists.objects.filter(cameraIP=cameraIP)
        return Cameraiplists.objects.all()

class CamerasViewSet(viewsets.ModelViewSet): 
    serializer_class = CamerasSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated,  require_claims({
            "SAFE_METHODS": "camera.read",   # GET, HEAD, OPTIONS
            "UNSAFE_METHODS": "camera.write" # POST, PUT, PATCH, DELETE
        })]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        zone_id = self.request.query_params.get('zone')
        location_id = self.request.query_params.get('location')

        queryset = Cameras.objects.all()

        if user_id:
            queryset = queryset.filter(userid=user_id)
        if zone_id:
            queryset = queryset.filter(zone=zone_id)
        if location_id:
            queryset = queryset.filter(location=location_id)

        return queryset


    def live_stream(self, id, public_url, credit_id):
        """Start live stream by sending a POST request to STREAM_URL service."""
        credit_id = 0 if credit_id == None else 0
        stream_url = "http://14.195.152.244:9015/Streaming/add_camera"
        try:
            payload = {
                "cameraId": id,
                "rtspUrl": public_url,
                "creditId": credit_id
            }
            response = requests.post(stream_url, json=payload, timeout=10)
            response.raise_for_status()
            print("Stream started successfully.")
        except ConnectTimeout:
            print("Check your internet connection or server status.")
        except HTTPError as http_err:
            print(f"HTTP Error occurred: {http_err}")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

    def perform_create(self, serializer):
        """Called when a new camera is created."""
        camera = serializer.save()  # Save the camera first

        # Now automatically call live_stream
        public_url = camera.rtspurl
        credit_id = self.request.data.get("creditId", None)
        if public_url and credit_id:
            self.live_stream(camera.id, public_url, credit_id)
 
class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Location.objects.filter(userid=user_id)
        return Location.objects.all()

class ZoneViewSet(viewsets.ModelViewSet):
    serializer_class = ZoneSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Zone.objects.filter(userid=user_id)
        return Zone.objects.all()

class GroupsViewSet(viewsets.ModelViewSet):
    serializer_class = GroupsSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Groups.objects.filter(userid=user_id)
        return Groups.objects.all()

class NvrViewSet(viewsets.ModelViewSet):
    serializer_class = NvrSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Nvr.objects.filter(userid=user_id)
        return Nvr.objects.all()

class NumberplatedetectionsViewSet(viewsets.ModelViewSet):
    serializer_class = NumberplatedetectionsSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Numberplatedetections.objects.filter(userid=user_id)
        return Numberplatedetections.objects.all()
    

class ReadedvehiclenoplatesFilter(django_filters.FilterSet):
    camera_name = django_filters.filters.CharFilter(field_name='cameraId__name', lookup_expr='icontains')
    camera_location = django_filters.filters.CharFilter(field_name='cameraId__location', lookup_expr='icontains')
    camera_area = django_filters.filters.CharFilter(field_name='cameraId__area', lookup_expr='icontains')
    camera_id = django_filters.filters.NumberFilter(field_name='cameraId', lookup_expr='exact')
    user_id = django_filters.filters.NumberFilter(field_name='userid', lookup_expr='exact')
    vehicle_number = django_filters.filters.CharFilter(field_name='text', lookup_expr='icontains')
    
    class Meta:
        model = Readedvehiclenoplates
        fields = ['camera_name', 'camera_location', 'camera_area', 'camera_id', 'vehicle_number']

    
class ReadedvehiclenoplatesViewSet(viewsets.ModelViewSet):
    serializer_class = ReadedvehiclenoplatesSerializer
    pagination_class = StandardResultsSetPagination 
    search_fields = ['regDate', 'cameraId__name', 'cameraId__location', 'cameraId__area', 'text']
    filter_backends = (filters.SearchFilter, DjangoFilterBackend, )
    filterset_class = ReadedvehiclenoplatesFilter 
    
    def get_queryset(self):
        queryset = Readedvehiclenoplates.objects.all()
        return queryset

class RolesViewSet(viewsets.ModelViewSet):
    serializer_class = RolesSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Roles.objects.filter(userid=user_id)
        return Roles.objects.all()

class UsersViewSet(viewsets.ModelViewSet):
    serializer_class = UsersSerializer
    pagination_class = StandardResultsSetPagination
    
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
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Vehicledetections.objects.filter(userid=user_id)
        return Vehicledetections.objects.all()

class VideoanalyticsViewSet(viewsets.ModelViewSet):
    serializer_class = VideoanalyticsSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id:
            return Videoanalytics.objects.filter(userid=user_id)
        return Videoanalytics.objects.all()

class CameraalertsCountViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CameraalertsSerializer
    pagination_class = StandardResultsSetPagination
    queryset = Cameraalerts.objects.all()

    def list(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')

        queryset = self.get_queryset()

        # Filter by user ID (optional)
        if user_id:
            queryset = queryset.filter(userid=user_id)

        # Date range filters
        if from_date and to_date:
            queryset = queryset.filter(regDate__date__range=[from_date, to_date])
        elif from_date:
            queryset = queryset.filter(regDate__date__gte=from_date)
        elif to_date:
            queryset = queryset.filter(regDate__date__lte=to_date)
        # else: no date filter → include all data

        # Group and count per day
        daily_counts = (
            queryset
            .annotate(date=TruncDate('regDate'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        return Response(daily_counts)

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
