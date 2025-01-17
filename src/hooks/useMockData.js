import { useState, useEffect, useCallback } from "react";
import { api } from "../components/services/api";

const SOCKET_UPDATE_INTERVAL = 5000;

export const useMockData = (dateRange) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const newData = await api.fetchDashboardData(dateRange);
      setData(newData || []); // Ensure data is always an array
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simulate WebSocket real-time updates
  useEffect(() => {
    if (!data.length) return;

    const updateLatestData = () => {
      setData((currentData) => {
        const updated = [...currentData];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          ...updated[lastIndex],
          sales: Math.floor(Math.random() * 10000),
          users: Math.floor(Math.random() * 1000),
          pageViews: Math.floor(Math.random() * 50000),
        };
        return updated;
      });
    };

    const interval = setInterval(updateLatestData, SOCKET_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
