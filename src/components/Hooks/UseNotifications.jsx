import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const backendURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:3001";

export const useNotifications = (roleOverride = null) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userRole = roleOverride || userInfo?.role || "user";
  const isAdmin = userRole === "admin";
  const endpoint = isAdmin ? "admin" : "user";

  const fetchNotifications = async () => {
    if (!userInfo?.token) {
      setError("No authentication token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(
        `${backendURL}/api/notifications/getAllNotificationForAdmin`
      );
      setNotifications(data);
      setUnreadCount(data?.filter((n) => !n.isRead).length);
      console.log(data, "data structure");
    } catch (err) {
      console.error(`Failed to fetch ${endpoint} notifications:`, err);
      setError(
        err.response?.data?.message ||
          `Failed to fetch ${endpoint} notifications`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userInfo?.token, endpoint]); // Re-fetch if token or endpoint changes

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refresh: fetchNotifications,
  };
};
