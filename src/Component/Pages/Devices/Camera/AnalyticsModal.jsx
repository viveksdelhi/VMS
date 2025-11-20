import React, { useState } from 'react';
import { Modal, Button, message, Checkbox, Divider } from 'antd';
import axios from 'axios';
import { deviceApi } from '../../../../utils/axiosInstance';
import { ANALYTICS_API_URL } from '../../../../config';

const groupOptions = {
  Vehicles: [
    'Bicycle',
    'Car',
    'Motorcycle',
    'Airplane',
    'Bus',
    'Train',
    'Truck',
    'Boat',
    'Traffic',
    'Traffic Light',
    'Without Seat belt',
    'Without Helmet',
    'Triple Riding',
    'Cattle on road',
  ],
  Person: [
    'Person',
    'Animals',
    'Bird',
    'Cat',
    'Dog',
    'Horse',
    'Sheep',
    'Cow',
    'Elephant',
    'Bear',
    'Zebra',
    'Giraffe',
  ],
  Furniture: ['Chair', 'Couch', 'Potted Plant', 'Bed', 'Dining Table', 'Bench', 'Bookshelf'],
  Electronics: [
    'TV',
    'Laptop',
    'Mouse',
    'Remote',
    'Keyboard',
    'Cell Phone',
    'Microwave',
    'Oven',
    'Hair Drier',
    'Fridge',
  ],
};

const AnalyticsModal = ({ open, onClose, camera, userId, field, value, onSaved }) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGroupChange = checkedValues => {
    setSelectedGroups(checkedValues);
  };

  const handleSave = async () => {
    if (!camera) return;
    setLoading(true);

    try {
      // Flatten objects from selected groups
      const selectedObjects = selectedGroups.flatMap(group => groupOptions[group] || []);

      // 1️⃣ Analytics API
      const analyticsPayload = {
        cameras: [
          {
            objectlist: value ? JSON.stringify(selectedObjects) : '[]',
            camera_id: camera.id,
            url: camera.rtspurl || camera.url,
            camera_ip: camera.cameraIP || '',
            user_id: camera.user_id || userId,
            credit_id: camera.credit_id || 0,
            running: value ? 'True' : 'False',
          },
        ],
      };

      await axios.post(`${ANALYTICS_API_URL}/CameraDetails`, analyticsPayload);
      message.success('Analytics server updated successfully!');

      // 2️⃣ Camera DB API
      const payload = {
        ...camera,
        [field]: value ? 1 : 0,
        userid: String(userId),
      };
      await deviceApi.put(`/Camera/${camera.id}/`, payload);
      message.success('Camera updated successfully');

      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Analytics update failed:', err);
      message.error('Failed to update analytics or camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      title={`Analytics Settings - ${camera?.name || ''}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <h3 className="text-lg font-semibold text-gray-800">Video Analytics Settings</h3>
        <p className="text-gray-600 text-sm">
          Select the object groups you want the camera to detect. Only the group name will be
          displayed, but all objects in the group will be sent to the analytics server.
        </p>

        {/* Checkbox Groups */}
        <Checkbox.Group
          disabled={!value} // disable if analytics OFF
          value={selectedGroups}
          onChange={handleGroupChange}
        >
          {Object.keys(groupOptions).map(group => (
            <div key={group} className="mb-2">
              <Checkbox value={group}>{group}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            disabled={value && selectedGroups.length === 0} // require at least one group if analytics ON
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AnalyticsModal;
