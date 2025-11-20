import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import { deviceApi } from "../utils/axiosInstance";

const DeviceInventoryContext = createContext(null);

const normalizeResults = (response = {}) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data?.results)) return response.data.results;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const extractCount = (response = {}) => {
  if (typeof response?.data?.count === "number") return response.data.count;
  if (typeof response?.count === "number") return response.count;
  const list = normalizeResults(response);
  return Array.isArray(list) ? list.length : 0;
};

export const DeviceInventoryProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [zones, setZones] = useState([]);
  const [nvrs, setNvrs] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [counts, setCounts] = useState({
    siteCount: 0,
    zoneCount: 0,
    nvrCount: 0,
    cameraCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = Cookies.get("userId");

  const fetchInventory = useCallback(async () => {
    if (!userId) {
      setSites([]);
      setZones([]);
      setNvrs([]);
      setCameras([]);
      setCounts({ siteCount: 0, zoneCount: 0, nvrCount: 0, cameraCount: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);

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

      const siteList = normalizeResults(siteRes.data ?? siteRes);
      const zoneList = normalizeResults(zoneRes.data ?? zoneRes);
      const nvrList = normalizeResults(nvrRes.data ?? nvrRes);
      const cameraList = normalizeResults(cameraRes.data ?? cameraRes);

      setSites(siteList);
      setZones(zoneList);
      setNvrs(nvrList);
      setCameras(cameraList);

      setCounts({
        siteCount: extractCount(siteRes),
        zoneCount: extractCount(zoneRes),
        nvrCount: extractCount(nvrRes),
        cameraCount: extractCount(cameraRes),
      });
    } catch (err) {
      console.error("Failed to fetch device inventory:", err);
      setError(err.message || "Failed to load device data");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const value = useMemo(
    () => ({
      sites,
      zones,
      nvrs,
      cameras,
      ...counts,
      loading,
      error,
      refreshInventory: fetchInventory,
    }),
    [sites, zones, nvrs, cameras, counts, loading, error, fetchInventory]
  );

  return (
    <DeviceInventoryContext.Provider value={value}>
      {children}
    </DeviceInventoryContext.Provider>
  );
};

export const useDeviceInventory = () => {
  const context = useContext(DeviceInventoryContext);
  if (!context) {
    throw new Error(
      "useDeviceInventory must be used within a DeviceInventoryProvider"
    );
  }
  return context;
};

