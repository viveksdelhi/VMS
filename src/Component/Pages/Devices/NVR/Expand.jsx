import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Button, Spin, message, Input, Select, Tooltip } from 'antd';
import Cookies from 'js-cookie';
import { deviceApi } from '../../../../utils/axiosInstance';
import axios from 'axios';
import { ONVIF_API_URL } from '../../../../config';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

const Expand = ({ data }) => {
  const userId = Cookies.get('userId');
  const navigate = useNavigate();
  const [cameraData, setCameraData] = useState([]);
  const [addCameraData, setAddCameraData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCameraDetails();
    fetchLocations();
    fetchZones();
  }, []);

  const fetchCameraDetails = async () => {
    setLoading(true);
    try {
      const added = await deviceApi.get(`/Camera/?user_id=${userId}`);
      setAddCameraData(added.data.results || []);

      const onvif = await axios.post(`${ONVIF_API_URL}/get_camera_details`, {
        cameras: [
          {
            nvr_ip: data.nvrip,
            username: data.username,
            password: data.password,
            nvr_port: parseInt(data.port, 10),
          },
        ],
      });

      if (onvif.data?.[data.nvrip]?.error) {
        message.error(onvif.data[data.nvrip].error);
        setCameraData([]);
      } else {
        setCameraData(onvif.data[data.nvrip] || []);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch ONVIF cameras!');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await deviceApi.get(`/Location/?user_id=${userId}`);
      setLocations(res.data.results || []);
    } catch {
      message.error('Failed to load locations');
    }
  };

  const fetchZones = async () => {
    try {
      const res = await deviceApi.get(`/Zone/?user_id=${userId}`);
      setZones(res.data.results || []);
    } catch {
      message.error('Failed to load zones');
    }
  };

  const handleCheckboxChange = (camera, checked) => {
    const key = camera['Stream URI'];
    if (checked) {
      setSelectedCameras(prev => ({
        ...prev,
        [key]: {
          ...camera,
          camera_name: camera['Camera Name'] || '',
          location: null,
          zone: null,
          port: camera['Port'] || '554',
          manufacture: camera['Manufacturer'] || 'N/A',
          brand: camera['Brand'] || 'N/A',
          nvrId: data.id,
        },
      }));
    } else {
      setSelectedCameras(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleFieldChange = (key, field, value) => {
    setSelectedCameras(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const submitCameras = async () => {
    for (const key in selectedCameras) {
      const cam = selectedCameras[key];
      if (!cam.camera_name || !cam.location || !cam.zone) {
        return message.warning('Camera Name, Location, and Zone are required!');
      }
    }

    setLoading(true);
    try {
      for (const key in selectedCameras) {
        const cam = selectedCameras[key];
        await deviceApi.post(`/Camera/`, {
          name: cam.camera_name,
          cameraIP: cam['Camera Name'] || 'N/A',
          nvrId: cam.nvrId,
          zone: cam.zone,
          location: cam.location,
          rtspurl: cam['Stream URI'],
          port: cam.port,
          brand: cam.brand,
          manufacture: cam.manufacture,
          hotspot: cam['GroupId'] || 5,
          macAddress: cam['Mac Address'] || 'N/A',
          channelId: cam['Channel'] || 101,
          latitude: cam['Latitude'] || 21.14,
          longitude: cam['Longitude'] || 79.08,
          isRecording: 0,
          isStreaming: 1,
          userid: String(userId),
          creditId: '67890',
        });
      }
      message.success('Selected cameras added successfully!');
      setSelectedCameras({});
      // fetchCameraDetails();
    } catch (err) {
      console.error(err);
      message.error('Failed to add cameras!');
    } finally {
      setLoading(false);
      navigate('/devices/cameras');
    }
  };

  const columns = [
    {
      title: 'Select',
      render: (_, record) => {
        const alreadyAdded = addCameraData.some(c => c.rtspurl === record['Stream URI']);
        return (
          <Checkbox
            disabled={alreadyAdded}
            checked={!!selectedCameras[record['Stream URI']]}
            onChange={e => handleCheckboxChange(record, e.target.checked)}
          />
        );
      },
    },
    { title: 'Camera Name (ONVIF)', dataIndex: 'Camera Name' },
    {
      title: 'Custom Camera Name',
      render: (_, record) => {
        const selected = selectedCameras[record['Stream URI']];
        return selected ? (
          <Input
            placeholder="Enter camera name"
            value={selected.camera_name}
            onChange={e => handleFieldChange(record['Stream URI'], 'camera_name', e.target.value)}
          />
        ) : null;
      },
    },
    {
      title: 'Location',
      render: (_, record) => {
        const selected = selectedCameras[record['Stream URI']];
        return selected ? (
          <Select
            placeholder="Select Location"
            value={selected.location}
            onChange={val => handleFieldChange(record['Stream URI'], 'location', val)}
            style={{ width: 150 }}
          >
            {locations.map(loc => (
              <Option key={loc.id} value={loc.id}>
                {loc.name}
              </Option>
            ))}
          </Select>
        ) : null;
      },
    },
    {
      title: 'Zone',
      render: (_, record) => {
        const selected = selectedCameras[record['Stream URI']];
        return selected ? (
          <Select
            placeholder="Select Zone"
            value={selected.zone}
            onChange={val => handleFieldChange(record['Stream URI'], 'zone', val)}
            style={{ width: 150 }}
          >
            {zones.map(z => (
              <Option key={z.id} value={z.id}>
                {z.name}
              </Option>
            ))}
          </Select>
        ) : null;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Spin spinning={loading}>
        <Table
          rowKey={record => record['Stream URI']}
          columns={columns}
          dataSource={cameraData}
          pagination={false}
          bordered
        />
      </Spin>

      {Object.keys(selectedCameras).length > 0 && (
        <Button
          type="primary"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={submitCameras}
        >
          Add Selected Cameras
        </Button>
      )}
    </div>
  );
};

export default Expand;
