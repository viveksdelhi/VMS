import React, { useState, useEffect } from 'react';
import {
  Card,
  Modal,
  DatePicker,
  Select,
  Button,
  Tag,
  Empty,
  Badge,
  Spin,
  message,
  Pagination,
} from 'antd';
import { motion } from 'framer-motion';
import {
  PlayCircleOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import { deviceApi } from '../../../utils/axiosInstance';
import recording_thumbnail from '../../../assets/recording_thumbnail.png';
import { RECORDING_API_URL } from '../../../config';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RecordingViewer = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [dateRange, setDateRange] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentMeta, setCurrentMeta] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);

  const userId = Cookies.get('userId');

  // ✅ Fetch cameras for dropdown
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await deviceApi.get(`/Camera/`, {
          params: {
            user_id: userId,
            search: '',
            page: 1,
            pageSize: 100,
          },
        });
        setCameras(res.data.results || []);
      } catch (err) {
        console.error('Error fetching cameras:', err);
        message.error('Failed to load cameras');
      }
    };
    if (userId) fetchCameras();
  }, [userId]);

  // ✅ Fetch recordings from backend
  const fetchRecordings = async (page = 1) => {
    if (!selectedCamera) return;
    setLoading(true);
    try {
      const res = await axios.get(`${RECORDING_API_URL}/Recording/GetRecordings`, {
        params: {
          cameraid: selectedCamera,
          pageno: page,
          pagesize: pageSize,
          fromdate: dateRange?.[0]?.toISOString(),
          todate: dateRange?.[1]?.toISOString(),
        },
      });

      const data = res.data.recordings || [];
      const parsed = data.map((rec, index) => ({
        id: index + (page - 1) * pageSize,
        camera: selectedCamera,
        url: `${rec.fileUrl}`,
        fileName: rec.fileName,
        size: `${(rec.fileSizeKB / 1024).toFixed(2)} MB`,
        start_time: rec.recDate,
        duration: rec.duration || 'N/A',
        thumbnail: rec.thumbnailUrl || recording_thumbnail,
      }));

      setRecordings(parsed);
      setTotal(res.data.total || 0); // ✅ use API total
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      message.error('Failed to load recordings');
    }
    setLoading(false);
  };

  // ✅ Apply filters
  const applyFilters = () => {
    if (!selectedCamera) {
      message.warning('Please select a camera first');
      return;
    }
    fetchRecordings(1);
  };

  // ✅ Reset filters
  const resetFilters = () => {
    setSelectedCamera(null);
    setDateRange([]);
    setRecordings([]);
    setTotal(0);
  };

  // ✅ Handle download
  const handleDownload = rec => {
    const link = document.createElement('a');
    link.href = rec.url;
    link.download = rec.fileName;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Filters */}
      <Card className="mb-8 shadow-lg border border-purple-100 rounded-xl">
        <div className="flex flex-wrap gap-4 items-center">
          <Select
            placeholder="Select Camera"
            style={{ minWidth: 220 }}
            value={selectedCamera}
            onChange={val => setSelectedCamera(val)}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            {cameras.map(cam => (
              <Option key={cam.id} value={cam.id}>
                {cam.name} {cam.zone ? `(${cam.zone.name})` : ''}
              </Option>
            ))}
          </Select>

          <RangePicker value={dateRange} onChange={val => setDateRange(val || [])} allowClear />

          <Button type="primary" onClick={applyFilters}>
            Apply
          </Button>

          <Button icon={<ReloadOutlined />} onClick={resetFilters} className="border-gray-300">
            Reset
          </Button>
        </div>

        {/* Active Filters */}
        <div className="mt-3 space-x-2">
          {selectedCamera && (
            <Tag color="purple">Camera: {cameras.find(c => c.id === selectedCamera)?.name}</Tag>
          )}
          {dateRange.length === 2 && (
            <Tag color="blue">
              {dateRange[0].format('MMM D')} - {dateRange[1].format('MMM D')}
            </Tag>
          )}
        </div>
      </Card>

      {/* Recording Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : recordings.length > 0 ? (
          recordings.map(rec => (
            <motion.div
              key={rec.id}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer"
              onClick={() => {
                setCurrentVideo(rec.url);
                setCurrentMeta(rec);
                setVisible(true);
              }}
            >
              <Card
                hoverable
                cover={
                  <div className="relative group">
                    <img
                      alt="Recording Thumbnail"
                      src={rec.thumbnail}
                      className="h-44 w-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div className="w-14 h-14 bg-black/60 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition">
                        <PlayCircleOutlined className="text-white text-3xl" />
                      </div>
                    </div>
                  </div>
                }
                className="shadow-md rounded-xl overflow-hidden border border-gray-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <Badge
                    color="purple"
                    text={cameras.find(c => c.id === rec.camera)?.name || 'Camera'}
                  />
                  <Tag color="blue" icon={<ClockCircleOutlined />}>
                    {rec.size}
                  </Tag>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  <FileTextOutlined className="mr-1" />
                  {rec.fileName}
                </h3>
                <p className="text-xs text-gray-500">
                  {dayjs(rec.start_time).format('MMM D, YYYY HH:mm')}
                </p>
                <p className="text-xs text-gray-500">Duration: {rec.duration}</p>
                <Button
                  size="small"
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={e => {
                    e.stopPropagation();
                    handleDownload(rec);
                  }}
                >
                  Download
                </Button>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-12">
            <Empty description="No recordings found" />
          </div>
        )}
      </div>

      {/* ✅ Pagination - Only show if more than one page */}
      {total > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            simple
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={page => fetchRecordings(page)}
          />
        </div>
      )}

      {/* Video Modal */}
      <Modal
        title="Recording Playback"
        open={visible}
        footer={[
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(currentMeta)}
          >
            Download
          </Button>,
          <Button key="close" onClick={() => setVisible(false)}>
            Close
          </Button>,
        ]}
        onCancel={() => {
          setVisible(false);
          setCurrentVideo(null);
        }}
        centered
        width={850}
        destroyOnClose
      >
        {currentVideo && (
          <>
            <div className="mb-3">
              <p className="text-sm text-gray-700">
                <VideoCameraOutlined className="mr-1" />
                <strong>Camera:</strong> {cameras.find(c => c.id === currentMeta?.camera)?.name}
              </p>
              <p className="text-sm text-gray-700">
                <ClockCircleOutlined className="mr-1" />
                <strong>Date:</strong> {dayjs(currentMeta?.start_time).format('MMM D, YYYY HH:mm')}
              </p>
              <p className="text-sm text-gray-700">
                <strong>File:</strong> {currentMeta?.fileName}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Size:</strong> {currentMeta?.size}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Duration:</strong> {currentMeta?.duration}
              </p>
            </div>
            <video
              src={currentVideo}
              autoPlay
              controls
              width="100%"
              height="480px"
              style={{ borderRadius: '8px' }}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default RecordingViewer;
