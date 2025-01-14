from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path


router = DefaultRouter()
# router.register(r'ANPRStatus', AnprstatusViewSet)
# router.register(r'CameraAlertStatus', CameraalertstatussViewSet) 
# router.register(r'CameraAlert', CameraalertsViewSet)
# router.register(r'CameraIPList', CameraiplistsViewSet)
# router.register(r'Camera', CamerasViewSet)
# router.register(r'Group', GroupsViewSet)
# router.register(r'NVR', NvrViewSet)
# router.register(r'NumberPlateDetection', NumberplatedetectionsViewSet)
# router.register(r'NumberPlateReadedData', ReadedvehiclenoplatesViewSet)
# router.register(r'Role', RolesViewSet)
# router.register(r'user', UsersViewSet)
# router.register(r'VehicleDetection', VehicledetectionsViewSet)
# router.register(r'VideoAnalytic', VideoanalyticsViewSet)


router.register(r'ANPRStatus', AnprstatusViewSet, basename='anprstatus')
router.register(r'CameraAlertStatus', CameraalertstatussViewSet, basename='cameraalertstatuss') 
router.register(r'CameraAlert', CameraalertsViewSet, basename='cameraalerts')
router.register(r'CameraIPList', CameraiplistsViewSet, basename='cameraiplists')
router.register(r'Camera', CamerasViewSet, basename='cameras')
router.register(r'Group', GroupsViewSet, basename='groups')
router.register(r'NVR', NvrViewSet, basename='nvr')
router.register(r'NumberPlateDetection', NumberplatedetectionsViewSet, basename='numberplatedetections')
router.register(r'NumberPlateReadedData', ReadedvehiclenoplatesViewSet, basename='readedvehiclenoplates')
router.register(r'Role', RolesViewSet, basename='roles')
router.register(r'user', UsersViewSet, basename='users')
router.register(r'VehicleDetection', VehicledetectionsViewSet, basename='vehicledetections')
router.register(r'VideoAnalytic', VideoanalyticsViewSet, basename='videoanalytics')

# urlpatterns = router.urls
urlpatterns = router.urls +[
  path('Auth/login', LoginView.as_view(), name='auth-login'),
]