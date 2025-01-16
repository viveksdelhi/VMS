from django.db import models
from django.contrib.auth.hashers import make_password, check_password

STATUS_CHOICES = [
        (1, 'True'),
        (0, 'False'),
    ]

class Anprstatus(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraId = models.ForeignKey('Cameras', on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    cameraName = models.TextField(db_column='CameraName', blank=True, null=True)  # Field name made lowercase.
    url = models.TextField(db_column='URL', blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status', choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'anprstatus'
        ordering = ['-id']


class Cameraalertstatuss(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraId = models.ForeignKey('Cameras', on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    recording = models.IntegerField(db_column='Recording')  # Field name made lowercase.
    anpr = models.IntegerField(db_column='ANPR')  # Field name made lowercase.
    snapshot = models.IntegerField(db_column='Snapshot')  # Field name made lowercase.
    personDetection = models.IntegerField(db_column='PersonDetection')  # Field name made lowercase.
    fireDetection = models.IntegerField(db_column='FireDetection')  # Field name made lowercase.
    animalDetection = models.IntegerField(db_column='AnimalDetection')  # Field name made lowercase.
    bikeDetection = models.IntegerField(db_column='BikeDetection')  # Field name made lowercase.
    maskDetection = models.IntegerField(db_column='MaskDetection')  # Field name made lowercase.
    umbrelaDetection = models.IntegerField(db_column='UmbrelaDetection')  # Field name made lowercase.
    brifecaseDetection = models.IntegerField(db_column='BrifecaseDetection')  # Field name made lowercase.
    garbageDetection = models.IntegerField(db_column='GarbageDetection')  # Field name made lowercase.
    weaponDetection = models.IntegerField(db_column='WeaponDetection')  # Field name made lowercase.
    wrongDetection = models.IntegerField(db_column='WrongDetection')  # Field name made lowercase.
    queueDetection = models.IntegerField(db_column='QueueDetection')  # Field name made lowercase.
    smokeDetection = models.IntegerField(db_column='SmokeDetection')  # Field name made lowercase.
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId') 

    class Meta:
        managed = False
        db_table = 'cameraalertstatuss'
        ordering = ['-id']


class Cameraalerts(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraId = models.ForeignKey('Cameras', on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    framePath = models.TextField(db_column='FramePath', blank=True, null=True)  # Field name made lowercase.
    objectName = models.TextField(db_column='ObjectName', blank=True, null=True)  # Field name made lowercase.
    objectCount = models.IntegerField(db_column='ObjectCount', blank=True, null=True)  # Field name made lowercase.
    alertStatus = models.CharField(db_column='AlertStatus', max_length=1, blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate', auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'cameraalerts'
        ordering = ['-id']


class Cameraiplists(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraIP = models.CharField(db_column='CameraIP', max_length=255, blank=True, null=True)  # Field name made lowercase.
    objectList = models.TextField(db_column='ObjectList', blank=True, null=True)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'cameraiplists'
        ordering = ['-id']




class Cameras(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  # Field name made lowercase.
    cameraIP = models.CharField(db_column='CameraIP', max_length=255, blank=True, null=True)  # Field name made lowercase.
    area = models.TextField(db_column='Area', blank=True, null=True)  # Field name made lowercase.
    location = models.TextField(db_column='Location', blank=True, null=True)  # Field name made lowercase.
    nvrId = models.ForeignKey('Nvr', on_delete=models.CASCADE, db_column='NVRId')  # Field name made lowercase.
    brand = models.TextField(db_column='Brand', blank=True, null=True)  # Field name made lowercase.
    manufacture = models.TextField(db_column='Manufacture', blank=True, null=True)  # Field name made lowercase.
    macAddress = models.TextField(db_column='MacAddress', blank=True, null=True)  # Field name made lowercase.
    make = models.TextField(db_column='Make', blank=True, null=True)  # Field name made lowercase.
    port = models.IntegerField(db_column='Port', blank=True, null=True)  # Field name made lowercase.
    channelId = models.IntegerField(db_column='ChannelId', blank=True, null=True)  # Field name made lowercase.
    latitude = models.DecimalField(db_column='Latitude', max_digits=65, decimal_places=30, blank=True, null=True)  # Field name made lowercase.
    longitude = models.DecimalField(db_column='Longitude', max_digits=65, decimal_places=30, blank=True, null=True)  # Field name made lowercase.
    installationDate = models.DateTimeField(db_column='InstallationDate', blank=True, null=True)  # Field name made lowercase.
    lastLive = models.DateTimeField(db_column='LastLive', blank=True, null=True)  # Field name made lowercase.
    rtspurl = models.TextField(db_column='RTSPURL', blank=True, null=True)  # Field name made lowercase.
    pinCode = models.IntegerField(db_column='PinCode', blank=True, null=True)  # Field name made lowercase.
    isRecording = models.IntegerField(db_column='isRecording', blank=True, null=True)  # Field name made lowercase.
    isStreaming = models.IntegerField(db_column='isStreaming', blank=True, null=True)  # Field name made lowercase.
    isANPR = models.IntegerField(db_column='isANPR', blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status', choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    updateDate = models.DateTimeField(db_column='UpdateDate', blank=True, null=True)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'cameras'
        ordering = ['-id']


class Groups(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', unique=True, max_length=255)  # Field name made lowercase.
    description = models.TextField(db_column='Description', blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'groups'
        ordering = ['-id']




class Nvr(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', max_length=255, blank=True, null=True)  # Field name made lowercase.
    nvrip = models.TextField(db_column='NVRIP', blank=True, null=True)  # Field name made lowercase.
    port = models.IntegerField(db_column='Port')  # Field name made lowercase.
    username = models.TextField(db_column='Username', blank=True, null=True)  # Field name made lowercase.
    password = models.TextField(db_column='Password', blank=True, null=True)  # Field name made lowercase.
    nvrtype = models.TextField(db_column='NVRType', blank=True, null=True)  # Field name made lowercase.
    model = models.TextField(db_column='Model', blank=True, null=True)  # Field name made lowercase.
    location = models.TextField(db_column='Location', blank=True, null=True)  # Field name made lowercase.
    make = models.TextField(db_column='Make', blank=True, null=True)  # Field name made lowercase.
    zone = models.TextField(db_column='Zone', blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  # Field name made lowercase.
    img = models.ImageField(db_column='IMG', blank=True, null=True, upload_to='data/images')  # Field name made lowercase.
    responsible_Person = models.TextField(db_column='Responsible_Person', blank=True, null=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'nvr'
        ordering = ['-id']


class Numberplatedetections(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    platePath = models.TextField(db_column='PlatePath', blank=True, null=True)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    class Meta:
        managed = False
        db_table = 'numberplatedetections'
        ordering = ['-id']



class Readedvehiclenoplates(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    framePath = models.TextField(db_column='FramePath', blank=True, null=True)  # Field name made lowercase.
    platePath = models.TextField(db_column='PlatePath', blank=True, null=True)  # Field name made lowercase.
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    text = models.TextField(db_column='Text')  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate',  auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    def __str__(self):
        return self.userid
    
    class Meta:
        managed = False
        db_table = 'readedvehiclenoplates'
        ordering = ['-id']


class Roles(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    name = models.CharField(db_column='Name', unique=True, max_length=255, blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate', auto_now_add=True)  # Field name made lowercase.

    def __str__(self):
        return self.name
    
    class Meta:
        managed = False
        db_table = 'roles'
        ordering = ['-id']



class Users(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    firstName = models.TextField(db_column='FirstName', blank=True, null=True)  # Field name made lowercase.
    lastName = models.TextField(db_column='LastName', blank=True, null=True)  # Field name made lowercase.
    mobileNo = models.CharField(db_column='MobileNo', unique=True, max_length=255, blank=True, null=True)  # Field name made lowercase.
    emailId = models.CharField(db_column='EmailId', unique=True, max_length=255, blank=True, null=True)  # Field name made lowercase.
    username = models.CharField(db_column='Username', unique=True, max_length=255, blank=True, null=True)  # Field name made lowercase.
    password = models.TextField(db_column='Password', blank=True, null=True)  # Field name made lowercase.
    roleId = models.ForeignKey(Roles, on_delete=models.CASCADE, db_column='RoleId')  # Field name made lowercase.
    image = models.ImageField(db_column='Image', blank=True, null=True, upload_to='data/images')  # Field name made lowercase.
    status = models.IntegerField(db_column='Status' , choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now_add=True)  # Field name made lowercase.
    
    
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
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    framePath = models.TextField(db_column='FramePath', blank=True, null=True)  # Field name made lowercase.
    vehicleType = models.TextField(db_column='VehicleType', blank=True, null=True)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    def __str__(self):
        return self.cameraId
    
    class Meta:
        managed = False
        db_table = 'vehicledetections'
        ordering = ['-id']


class Videoanalytics(models.Model):
    id = models.AutoField(db_column='Id', primary_key=True)  # Field name made lowercase.
    cameraId = models.ForeignKey(Cameras, on_delete=models.CASCADE, db_column='CameraId')  # Field name made lowercase.
    cameraIP = models.TextField(db_column='CameraIP', blank=True, null=True)  # Field name made lowercase.
    rtspUrl = models.TextField(db_column='RTSPUrl', blank=True, null=True)  # Field name made lowercase.
    objectList = models.TextField(db_column='ObjectList', blank=True, null=True)  # Field name made lowercase.
    status = models.IntegerField(db_column='Status', choices=STATUS_CHOICES, default=0)  # Field name made lowercase.
    regDate = models.DateTimeField(db_column='RegDate' , auto_now=True)  # Field name made lowercase.
    userid = models.ForeignKey('Users', on_delete=models.CASCADE, db_column='UserId')

    def __str__(self):
        return self.cameraId
    
    class Meta:
        managed = False
        db_table = 'videoanalytics'
        ordering = ['-id']



