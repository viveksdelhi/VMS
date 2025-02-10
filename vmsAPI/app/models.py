from django.db import models
from django.contrib.auth.hashers import make_password, check_password

STATUS_CHOICES = [
        (1, 'True'),
        (0, 'False'),
    ]

class Anprstatus(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraId = models.ForeignKey('Cameras', on_delete=models.CASCADE, db_column='CameraId')  
    cameraName = models.TextField(db_column='CameraName', blank=True, null=True)  
    url = models.TextField(db_column='URL', blank=True, null=True)  
    status = models.IntegerField(db_column='Status', choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'anprstatus'
        ordering = ['-id']


class Cameraalertstatuss(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraId = models.ForeignKey('Cameras', on_delete=models.CASCADE, db_column='CameraId')  
    recording = models.IntegerField(db_column='Recording')  
    anpr = models.IntegerField(db_column='ANPR')  
    snapshot = models.IntegerField(db_column='Snapshot')  
    personDetection = models.IntegerField(db_column='PersonDetection')  
    fireDetection = models.IntegerField(db_column='FireDetection')  
    animalDetection = models.IntegerField(db_column='AnimalDetection')  
    bikeDetection = models.IntegerField(db_column='BikeDetection')  
    maskDetection = models.IntegerField(db_column='MaskDetection')  
    umbrelaDetection = models.IntegerField(db_column='UmbrelaDetection')  
    brifecaseDetection = models.IntegerField(db_column='BrifecaseDetection')  
    garbageDetection = models.IntegerField(db_column='GarbageDetection')  
    weaponDetection = models.IntegerField(db_column='WeaponDetection')  
    wrongDetection = models.IntegerField(db_column='WrongDetection')  
    queueDetection = models.IntegerField(db_column='QueueDetection')  
    smokeDetection = models.IntegerField(db_column='SmokeDetection')  
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId') 

    class Meta:
        managed = False
        db_table = 'cameraalertstatuss'
        ordering = ['-id']


class Cameraalerts(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraId = models.ForeignKey('Cameras', on_delete=models.CASCADE, db_column='CameraId')  
    framePath = models.TextField(db_column='FramePath', blank=True, null=True)  
    objectName = models.TextField(db_column='ObjectName', blank=True, null=True)  
    objectCount = models.IntegerField(db_column='ObjectCount', blank=True, null=True)  
    alertStatus = models.CharField(db_column='AlertStatus', max_length=1, blank=True, null=True)  
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate', auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'cameraalerts'
        ordering = ['-id']


class Cameraiplists(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraIP = models.CharField(db_column='CameraIP', max_length=255, blank=True, null=True)  
    objectList = models.TextField(db_column='ObjectList', blank=True, null=True)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'cameraiplists'
        ordering = ['-id']




class Cameras(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  
    cameraIP = models.CharField(db_column='CameraIP', max_length=255, blank=True, null=True)  
    area = models.TextField(db_column='Area', blank=True, null=True)  
    location = models.TextField(db_column='Location', blank=True, null=True)  
    nvrId = models.ForeignKey('Nvr', on_delete=models.CASCADE, db_column='NVRId')  
    brand = models.TextField(db_column='Brand', blank=True, null=True)  
    manufacture = models.TextField(db_column='Manufacture', blank=True, null=True)  
    macAddress = models.TextField(db_column='MacAddress', blank=True, null=True)  
    make = models.TextField(db_column='Make', blank=True, null=True)  
    port = models.IntegerField(db_column='Port', blank=True, null=True)  
    channelId = models.IntegerField(db_column='ChannelId', blank=True, null=True)  
    latitude = models.DecimalField(db_column='Latitude', max_digits=10, decimal_places=6, blank=True, null=True)  
    longitude = models.DecimalField(db_column='Longitude', max_digits=10, decimal_places=6, blank=True, null=True)  
    installationDate = models.DateTimeField(db_column='InstallationDate', blank=True, null=True)  
    lastLive = models.DateTimeField(db_column='LastLive', blank=True, null=True)  
    rtspurl = models.TextField(db_column='RTSPURL', blank=True, null=True)  
    pinCode = models.IntegerField(db_column='PinCode', blank=True, null=True)  
    isRecording = models.IntegerField(db_column='isRecording', blank=True, null=True)  
    isStreaming = models.IntegerField(db_column='isStreaming', blank=True, null=True)  
    isANPR = models.IntegerField(db_column='isANPR', blank=True, null=True)  
    status = models.IntegerField(db_column='Status', choices=STATUS_CHOICES, default=0)  
    updateDate = models.DateTimeField(db_column='UpdateDate', blank=True, null=True)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'cameras'
        ordering = ['-id']


class Groups(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    name = models.CharField(db_column='Name', unique=True, max_length=255)  
    description = models.TextField(db_column='Description', blank=True, null=True)  
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'groups'
        ordering = ['-id']




class Nvr(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  
    nvrip = models.TextField(db_column='NVRIP', blank=True, null=True)  
    port = models.IntegerField(db_column='Port')  
    username = models.TextField(db_column='Username', blank=True, null=True)  
    password = models.TextField(db_column='Password', blank=True, null=True)  
    nvrtype = models.TextField(db_column='NVRType', blank=True, null=True)  
    model = models.TextField(db_column='Model', blank=True, null=True)  
    location = models.TextField(db_column='Location', blank=True, null=True)  
    make = models.TextField(db_column='Make', blank=True, null=True)  
    zone = models.TextField(db_column='Zone', blank=True, null=True)  
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  
    img = models.ImageField(db_column='IMG', blank=True, null=True, upload_to='data/images')  
    responsible_Person = models.TextField(db_column='Responsible_Person', blank=True, null=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'nvr'
        ordering = ['-id']


class Numberplatedetections(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  
    platePath = models.TextField(db_column='PlatePath', blank=True, null=True)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'numberplatedetections'
        ordering = ['-id']



class Readedvehiclenoplates(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    framePath = models.TextField(db_column='FramePath', blank=True, null=True)  
    platePath = models.TextField(db_column='PlatePath', blank=True, null=True)  
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  
    text = models.TextField(db_column='Text')  
    regDate = models.DateTimeField(db_column='RegDate',  auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    def __str__(self):
        return self.userid
    
    class Meta:
        managed = False
        db_table = 'readedvehiclenoplates'
        ordering = ['-id']


class Roles(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    name = models.CharField(db_column='Name', unique=True, max_length=255, blank=True, null=True)  
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate', auto_now_add=True)  

    def __str__(self):
        return self.name
    
    class Meta:
        managed = False
        db_table = 'roles'
        ordering = ['-id']



class Users(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    firstName = models.TextField(db_column='FirstName', blank=True, null=True)  
    lastName = models.TextField(db_column='LastName', blank=True, null=True)  
    mobileNo = models.CharField(db_column='MobileNo', unique=True, max_length=255, blank=True, null=True)  
    emailId = models.CharField(db_column='EmailId', unique=True, max_length=255, blank=True, null=True)  
    username = models.CharField(db_column='Username', unique=True, max_length=255, blank=True, null=True)  
    password = models.TextField(db_column='Password', blank=True, null=True)  
    roleId = models.ForeignKey(Roles, on_delete=models.CASCADE, db_column='RoleId')  
    image = models.ImageField(db_column='Image', blank=True, null=True, upload_to='data/images')  
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  
    
    
    def set_password(self, raw_password):
        """Hash the password before saving it."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Check if the password matches the stored hash."""
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.firstName
    
    class Meta:
        managed = False
        db_table = 'users'
        ordering = ['-id']


class Vehicledetections(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  
    framePath = models.TextField(db_column='FramePath', blank=True, null=True)  
    vehicleType = models.TextField(db_column='VehicleType', blank=True, null=True)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    def __str__(self):
        return self.cameraId
    
    class Meta:
        managed = False
        db_table = 'vehicledetections'
        ordering = ['-id']


class Videoanalytics(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  
    cameraIP = models.TextField(db_column='CameraIP', blank=True, null=True)  
    rtspUrl = models.TextField(db_column='RTSPUrl', blank=True, null=True)  
    objectList = models.TextField(db_column='ObjectList', blank=True, null=True)  
    status = models.IntegerField(db_column='Status', choices=STATUS_CHOICES, default=0)  
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    def __str__(self):
        return self.cameraId
    
    class Meta:
        managed = False
        db_table = 'videoanalytics'
        ordering = ['-id']



