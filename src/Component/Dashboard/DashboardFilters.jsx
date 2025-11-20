import React, { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { message, Select, Spin } from "antd";
import { deviceApi } from "../../utils/axiosInstance";

const DashboardFilters = () => {
  const [sites, setSites] = useState([]);
  const [zones, setZones] = useState([]);
  const [nvrs, setNvrs] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selected, setSelected] = useState({
    site: "",
    zone: "",
    nvr: "",
    camera: "",
  });
  const [loading, setLoading] = useState(false);

  const userId = Cookies.get("userId");

  useEffect(() => {
    const fetchDropdowns = async () => {
      if (!userId) return;

      try {
        setLoading(true);

        const [siteRes, zoneRes, nvrRes, cameraRes] = await Promise.all([
          deviceApi.get("/Location/", {
            params: { userid: userId, page: 1, pageSize: 100 },
          }),
          deviceApi.get("/Zone/", {
            params: { userid: userId, page: 1, pageSize: 100 },
          }),
          deviceApi.get("/NVR/", {
            params: { user_id: userId, page: 1, page_size: 100 },
          }),
          deviceApi.get("/Camera/", {
            params: { user_id: userId, page: 1, pageSize: 100 },
          }),
        ]);

        const siteOptions = siteRes.data.results || siteRes.data || [];
        const zoneOptions = zoneRes.data.results || zoneRes.data || [];
        const nvrOptions = nvrRes.data.results || nvrRes.data || [];
        const cameraOptions = cameraRes.data.results || cameraRes.data || [];

        setSites(Array.isArray(siteOptions) ? siteOptions : []);
        setZones(Array.isArray(zoneOptions) ? zoneOptions : []);
        setNvrs(Array.isArray(nvrOptions) ? nvrOptions : []);
        setCameras(Array.isArray(cameraOptions) ? cameraOptions : []);

        setSelected({
          site: siteOptions[0]?.id || "",
          zone: zoneOptions[0]?.id || "",
          nvr: nvrOptions[0]?.id || "",
          camera: cameraOptions[0]?.id || "",
        });
      } catch (error) {
        console.error("Failed to load dashboard dropdowns:", error);
        message.error("Unable to load filter options");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, [userId]);

  const handleChange = (key, value) => {
    setSelected((prev) => ({ ...prev, [key]: value }));
  };

  const dropdowns = useMemo(
    () => [
      {
        key: "site",
        label: "Sites",
        placeholder: "Select Site",
        options: (sites || []).map((site) => ({
          label: site.name || site.locationName || `Site ${site.id}`,
          value: site.id,
        })),
        emptyLabel: "No sites available",
      },
      {
        key: "zone",
        label: "Zones",
        placeholder: "Select Zone",
        options: (zones || []).map((zone) => ({
          label: zone.name || zone.zoneName || `Zone ${zone.id}`,
          value: zone.id,
        })),
        emptyLabel: "No zones available",
      },
      {
        key: "nvr",
        label: "NVRs",
        placeholder: "Select NVR",
        options: (nvrs || []).map((nvr) => ({
          label: nvr.name || nvr.nvrName || `NVR ${nvr.id}`,
          value: nvr.id,
        })),
        emptyLabel: "No NVRs available",
      },
      {
        key: "camera",
        label: "Cameras",
        placeholder: "Select Camera",
        options: (cameras || []).map((camera) => ({
          label: camera.name || camera.cameraName || `Camera ${camera.id}`,
          value: camera.id,
        })),
        emptyLabel: "No cameras available",
      },
    ],
    [sites, zones, nvrs, cameras]
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dropdowns.map((dropdown) => (
          <div key={dropdown.key} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              {dropdown.label}
            </label>
            <Select
              value={selected[dropdown.key] || undefined}
              placeholder={dropdown.placeholder}
              onChange={(value) => handleChange(dropdown.key, value)}
              options={dropdown.options}
              loading={loading}
              size="large"
              allowClear
              showSearch
              className="w-full"
              optionFilterProp="label"
              notFoundContent={
                loading ? <Spin size="small" /> : dropdown.emptyLabel
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardFilters;



