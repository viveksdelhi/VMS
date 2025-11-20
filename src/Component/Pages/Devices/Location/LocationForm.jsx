import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Select,
  Switch,
  Spin,
  Row,
  Col,
  message,
} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { deviceApi } from '../../../../utils/axiosInstance'; // ✅ central axios instance
import Cookies from 'js-cookie';

const { Option } = Select;

function LocationForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [locationTypes, setLocationTypes] = useState([]); // ✅ dynamic dropdown
  const navigate = useNavigate();
  const location = useLocation();

  const userId = Cookies.get('userId');
  const editingLocation = location.state?.location || null;

  // ✅ Fetch location types dynamically
  useEffect(() => {
    const fetchLocationTypes = async () => {
      try {
        const res = await deviceApi.get('/LocationType/'); // adjust endpoint if different
        setLocationTypes(res.data.results || res.data || []);
      } catch (error) {
        console.error('Failed to fetch location types', error);
        message.error('Failed to load location types');
      }
    };

    fetchLocationTypes();
  }, []);

  useEffect(() => {
    if (editingLocation) {
      form.setFieldsValue(editingLocation);
    }
  }, [editingLocation]);

  const rules = {
    latitude: [
      { required: true, message: 'Latitude is required' },
      {
        validator: (_, value) =>
          value >= -90 && value <= 90
            ? Promise.resolve()
            : Promise.reject('Latitude must be between -90 and 90'),
      },
    ],
    longitude: [
      { required: true, message: 'Longitude is required' },
      {
        validator: (_, value) =>
          value >= -180 && value <= 180
            ? Promise.resolve()
            : Promise.reject('Longitude must be between -180 and 180'),
      },
    ],
    pincode: [
      { required: true, message: 'Pincode is required' },
      {
        pattern: /^[1-9][0-9]{5}$/,
        message: 'Invalid pincode format',
      },
    ],
  };

  const onFinish = async values => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        userid: userId,
      };

      if (editingLocation) {
        await deviceApi.put(`/Location/${editingLocation.id}/`, payload); // ✅ deviceApi
        message.success('Location updated successfully!');
      } else {
        await deviceApi.post(`/Location/`, payload); // ✅ deviceApi
        message.success('Location created successfully!');
      }

      navigate('/devices/locations');
    } catch (err) {
      console.error(err);
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4 shadow-md">
      {/* Header */}
      <div className="mb-4 bg-[#9864DB] text-white px-6 py-2 rounded-md flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {editingLocation ? '✏️ Edit Location' : '➕ Add Location'}
        </h3>
        <Button
          onClick={() => navigate('/devices/locations')}
          style={{
            background: '#9864DB',
            color: 'white',
            borderColor: '#9864DB',
          }}
        >
          📍 Location Details
        </Button>
      </div>

      {/* Form */}
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Location Name"
                name="name"
                rules={[{ required: true, message: 'Location name is required' }]}
              >
                <Input placeholder="Enter location name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Landmark" name="landmark">
                <Input placeholder="Optional" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: 'Street is required' }]}
              >
                <Input placeholder="Enter street" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'City is required' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'State is required' }]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Pincode" name="pincode" rules={rules.pincode}>
                <Input placeholder="Enter pincode" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 4 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Latitude" name="latitude" rules={rules.latitude}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Longitude" name="longitude" rules={rules.longitude}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Location Type"
                name="locationType"
                rules={[{ required: true, message: 'Location type is required' }]}
              >
                <Select placeholder="Select type">
                  {locationTypes.length > 0 ? (
                    locationTypes.map(lt => (
                      <Option key={lt.id} value={lt.id}>
                        {lt.name}
                      </Option>
                    ))
                  ) : (
                    <>
                      <Option value="office">Office</Option>
                      <Option value="warehouse">Warehouse</Option>
                      <Option value="store">Store</Option>
                      <Option value="other">Other</Option>
                    </>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Full Address" name="address">
                <Input.TextArea rows={2} placeholder="Enter full address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="status" valuePropName="checked" initialValue={false}>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          </Row>

          {/* Actions */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: '#9864DB', borderColor: '#9864DB' }}
            >
              {editingLocation ? 'Update Location' : 'Create Location'}
            </Button>
            <Button
              className="ml-2"
              onClick={() => navigate('/devices/locations')}
              style={{ borderColor: '#522EA8', color: '#522EA8' }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

export default LocationForm;
