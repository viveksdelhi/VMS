import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { deviceApi } from '../utils/axiosInstance';

const AlertDataContext = createContext(null);

const todayISOString = () => new Date().toISOString().split('T')[0];

const getPastDateISOString = daysAgo => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const AlertDataProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [alertsCount, setAlertsCount] = useState(0);
  const [weeklyCounts, setWeeklyCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = Cookies.get('userId');

  const fetchAlertData = useCallback(async () => {
    if (!userId) {
      setAlerts([]);
      setAlertsCount(0);
      setWeeklyCounts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const toDate = todayISOString();
      const fromDate = getPastDateISOString(6);

      const [alertsRes, weeklyRes] = await Promise.all([
        deviceApi.get('/CameraAlert/', {
          params: {
            userid: userId,
            page: 1,
            pageSize: 10,
            search: '',
            camera_id: '',
          },
        }),
        deviceApi.get('/CameraalertsCount/', {
          params: { user_id: userId, from_date: fromDate, to_date: toDate },
        }),
      ]);

      const alertResults = alertsRes?.data?.results ?? alertsRes?.results ?? alertsRes?.data ?? [];

      setAlerts(Array.isArray(alertResults) ? alertResults : []);
      setAlertsCount(
        typeof alertsRes?.data?.count === 'number'
          ? alertsRes.data.count
          : Array.isArray(alertResults)
            ? alertResults.length
            : 0
      );

      const countsData = Array.isArray(weeklyRes?.data)
        ? weeklyRes.data
        : Array.isArray(weeklyRes)
          ? weeklyRes
          : [];

      setWeeklyCounts(
        countsData.map(item => ({
          date: item.date,
          count: item.count,
          day: new Date(item.date).toLocaleDateString('en-US', {
            weekday: 'short',
          }),
        }))
      );
    } catch (err) {
      console.error('Failed to fetch alert data:', err);
      setError(err.message || 'Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAlertData();
  }, [fetchAlertData]);

  const value = useMemo(
    () => ({
      alerts,
      alertsCount,
      weeklyCounts,
      loading,
      error,
      refreshAlerts: fetchAlertData,
    }),
    [alerts, alertsCount, weeklyCounts, loading, error, fetchAlertData]
  );

  return <AlertDataContext.Provider value={value}>{children}</AlertDataContext.Provider>;
};

export const useAlertData = () => {
  const context = useContext(AlertDataContext);
  if (!context) {
    throw new Error('useAlertData must be used within an AlertDataProvider');
  }
  return context;
};
