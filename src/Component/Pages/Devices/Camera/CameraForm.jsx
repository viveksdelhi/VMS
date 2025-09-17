import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Select,
  Spin,
  message,
  Row,
  Col,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { deviceApi } from "../../../../utils/axiosInstance";
import Cookies from "js-cookie";

const { Option } = Select;

function CameraForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [nvrs, setNvrs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const userId = Cookies.get("userId");

  const editingCamera = location.state?.camera || null;

  // Fetch NVR list
  const fetchNvrs = async () => {
    try {
      const nvrRes = await deviceApi.get(`/NVR/?user_id=${userId}&page=1&page_size=100`);
      setNvrs(nvrRes.data.results || []);
    } catch (err) {
      message.error("Failed to load NVR data");
    }
  };

  useEffect(() => {
    fetchNvrs();
    if (editingCamera) {
      form.setFieldsValue(editingCamera);
    }
  }, [editingCamera]);

  // Validation rules
  const rules = {
    ip: [
      {
        pattern:
          /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/,
        message: "Invalid IP address",
      },
    ],
    rtsp: [
      { required: true, message: "RTSP URL is required" },
      {
        pattern:
          /^rtsp:\/\/(?:\S+(?::\S*)?@)?(?:[A-Za-z0-9.-]+|\[[A-Fa-f0-9:.]+\])(?::\d+)?(?:\/[^\s]*)?$/,
        message: "Invalid RTSP URL",
      },
    ],
    latitude: [
      { required: true, message: "Latitude is required" },
      {
        validator: (_, value) =>
          value >= -90 && value <= 90
            ? Promise.resolve()
            : Promise.reject("Latitude must be between -90 and 90"),
      },
    ],
    longitude: [
      { required: true, message: "Longitude is required" },
      {
        validator: (_, value) =>
          value >= -180 && value <= 180
            ? Promise.resolve()
            : Promise.reject("Longitude must be between -180 and 180"),
      },
    ],
  };

  // Submit handler
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        hotspot: "2", // static
        channelId: 101, // static
        macAddress: "00:1A:2B:3C:4D:5E", // static
        userid: String(userId),
        isRecording: 1,
        isStreaming: 1,
        creditId: "67890",
      };

      if (editingCamera) {
        await deviceApi.put(`/Camera/${editingCamera.id}/`, payload);
        message.success("Camera updated successfully!");
      } else {
        await deviceApi.post(`/Camera/`, payload);
        message.success("Camera created successfully!");
      }

      navigate("/devices/cameras");
    } catch (err) {
      console.error(err);
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4 shadow-md">
      <div className="mb-4 bg-[#9864DB] text-white px-6 py-2 rounded-md flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          {editingCamera ? "✏️ Edit Camera" : "➕ Add Camera"}
        </h3>
        <Button
          onClick={() => navigate("/devices/cameras")}
          style={{
            background: "#9864DB",
            color: "white",
            borderColor: "#9864DB",
          }}
        >
          📋 Camera Details
        </Button>
      </div>

      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Row 1 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Camera Name"
                name="name"
                rules={[{ required: true, message: "Camera Name is required" }]}
              >
                <Input placeholder="Enter camera name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Camera IP" name="cameraIP" rules={rules.ip}>
                <Input placeholder="e.g., 192.168.1.20 (optional)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Port" name="port">
                <InputNumber
                  min={1}
                  max={65535}
                  style={{ width: "100%" }}
                  placeholder="Optional"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Location is required" }]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="RTSP URL" name="rtspurl" rules={rules.rtsp}>
                <Input placeholder="rtsp://user:pass@ip:port/stream" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="NVR"
                name="nvrId"
                rules={[{ required: true, message: "Please select an NVR!" }]} // 👈 required rule
              >
                <Select placeholder="Select NVR">
                  {nvrs.map((n) => (
                    <Select.Option key={n.id} value={n.id}>
                      {n.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          {/* Row 4 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Make" name="manufacture">
                <Input placeholder="Optional" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Model" name="brand">
                <Input placeholder="Optional" />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 5 */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Zone" name="area">
                <Input placeholder="Optional" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Latitude" name="latitude" rules={rules.latitude}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="Longitude"
                name="longitude"
                rules={rules.longitude}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          {/* Actions */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#9864DB", borderColor: "#9864DB" }}
            >
              {editingCamera ? "Update Camera" : "Create Camera"}
            </Button>
            <Button
              className="ml-2"
              onClick={() => navigate("/devices/cameras")}
              style={{ borderColor: "#522EA8", color: "#522EA8" }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
}

export default CameraForm;
