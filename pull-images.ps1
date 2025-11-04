$images = @(
    "rabbitmq:4.0-management",
    "ajeevi32189/vms_1.0:vms_ui5",
    "ajeevi32189/vms_1.0:vmsapi-latest1",
    "ajeevi32189/vms_1.0:videostreamingservice",
    "ajeevi32189/videorecordingservice:latest",
    "ajeevi32189/vms_1.0:analyticsapi",
    "ajeevi32189/vms_1.0:vmsframer",
    "ajeevi32189/vms_1.0:vmsvideo",
    "ajeevi32189/vms_1.0:vmswritedb1",
    "ajeevi32189/vms_1.0:onvif",
    "ajeevi32189/vms_1.0:new-vms-sqldb",
    "ajeevi32189/demoauth:latest"
)

foreach ($img in $images) {
    Write-Host "Pulling $img..."
    docker pull $img
}