import React, { useEffect, useMemo, useState } from 'react';
import { Select, Spin } from 'antd';
import { useDeviceInventory } from '../../contexts/DeviceInventoryContext';

const DashboardFilters = () => {
  const {
    sites,
    zones,
    nvrs,
    cameras,
    loading: inventoryLoading,
    refreshInventory,
  } = useDeviceInventory();
  const [selected, setSelected] = useState({
    site: '',
    zone: '',
    nvr: '',
    camera: '',
  });

  useEffect(() => {
    if (sites.length) {
      setSelected(prev => ({ ...prev, site: prev.site || sites[0]?.id || '' }));
    }
  }, [sites]);

  useEffect(() => {
    if (zones.length) {
      setSelected(prev => ({ ...prev, zone: prev.zone || zones[0]?.id || '' }));
    }
  }, [zones]);

  useEffect(() => {
    if (nvrs.length) {
      setSelected(prev => ({ ...prev, nvr: prev.nvr || nvrs[0]?.id || '' }));
    }
  }, [nvrs]);

  useEffect(() => {
    if (cameras.length) {
      setSelected(prev => ({
        ...prev,
        camera: prev.camera || cameras[0]?.id || '',
      }));
    }
  }, [cameras]);

  const handleChange = (key, value) => {
    setSelected(prev => ({ ...prev, [key]: value }));
  };

  const dropdowns = useMemo(
    () => [
      {
        key: 'site',
        label: 'Sites',
        placeholder: 'Select Site',
        options: (sites || []).map(site => ({
          label: site.name || site.locationName || `Site ${site.id}`,
          value: site.id,
        })),
        emptyLabel: 'No sites available',
      },
      {
        key: 'zone',
        label: 'Zones',
        placeholder: 'Select Zone',
        options: (zones || []).map(zone => ({
          label: zone.name || zone.zoneName || `Zone ${zone.id}`,
          value: zone.id,
        })),
        emptyLabel: 'No zones available',
      },
      {
        key: 'nvr',
        label: 'NVRs',
        placeholder: 'Select NVR',
        options: (nvrs || []).map(nvr => ({
          label: nvr.name || nvr.nvrName || `NVR ${nvr.id}`,
          value: nvr.id,
        })),
        emptyLabel: 'No NVRs available',
      },
      {
        key: 'camera',
        label: 'Cameras',
        placeholder: 'Select Camera',
        options: (cameras || []).map(camera => ({
          label: camera.name || camera.cameraName || `Camera ${camera.id}`,
          value: camera.id,
        })),
        emptyLabel: 'No cameras available',
      },
    ],
    [sites, zones, nvrs, cameras]
  );

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dropdowns.map(dropdown => (
          <div key={dropdown.key} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">{dropdown.label}</label>
            <Select
              value={selected[dropdown.key] || undefined}
              placeholder={dropdown.placeholder}
              onChange={value => handleChange(dropdown.key, value)}
              options={dropdown.options}
              loading={inventoryLoading}
              size="large"
              allowClear
              showSearch
              className="w-full"
              optionFilterProp="label"
              notFoundContent={inventoryLoading ? <Spin size="small" /> : dropdown.emptyLabel}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={refreshInventory}
          className="text-sm text-purple-600 underline"
          disabled={inventoryLoading}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default DashboardFilters;
