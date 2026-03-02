import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendURL from "../../config";

const getToken = (getState) => {
  const state = getState();
  return (
    state.adminAuth?.adminInfo?.token || state.auth?.userInfo?.token || null
  );
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const q = new URLSearchParams();
      if (params.isRead !== undefined)
        q.append("isRead", String(params.isRead));
      if (params.event) q.append("event", params.event);
      if (params.page) q.append("page", String(params.page));
      if (params.limit) q.append("limit", String(params.limit));

      const { data } = await axios.get(
        `${backendURL}/notifications/getNotifications?${q}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications",
      );
    }
  },
);

// ── Fetch unread count only (for header badge polling) ────────────────────────
export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const { data } = await axios.get(
        `${backendURL}/notifications/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data; // { status, data: { unreadCount } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch unread count",
      );
    }
  },
);

// ── Mark single notification as read ──────────────────────────────────────────
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const { data } = await axios.patch(
        `${backendURL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data; // { status, data: { notification } }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark notification as read",
      );
    }
  },
);

// ── Mark all notifications as read ────────────────────────────────────────────
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const { data } = await axios.patch(
        `${backendURL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data; // { status, message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark all as read",
      );
    }
  },
);

// ── Delete a notification ─────────────────────────────────────────────────────
export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      await axios.delete(
        `${backendURL}/notifications/deleteNotification/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return { notificationId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notification",
      );
    }
  },
);

// ==================== Initial State ====================

const initialState = {
  notifications: [],
  unreadCount: 0,

  loading: false,
  countLoading: false,
  error: null,

  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  },
};

// ==================== Slice ====================

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
    // Called by a WebSocket/SSE push to bump the badge instantly
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    // Optimistic prepend for real-time push notifications
    prependNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch All ──────────────────────────────────────────────────────────
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data?.notifications || [];
        state.unreadCount = action.payload.unreadCount ?? state.unreadCount;
        state.pagination = {
          page: action.payload.page ?? 1,
          limit: action.payload.limit ?? 50,
          total: action.payload.total ?? 0,
          pages: action.payload.pages ?? 0,
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Unread Count ───────────────────────────────────────────────────────
      .addCase(fetchUnreadCount.pending, (state) => {
        state.countLoading = true;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.countLoading = false;
        state.unreadCount =
          action.payload.data?.unreadCount ?? state.unreadCount;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.countLoading = false;
      })

      // ── Mark Single Read ───────────────────────────────────────────────────
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload.data?.notification;
        if (!updated) return;
        const idx = state.notifications.findIndex((n) => n._id === updated._id);
        if (idx !== -1) {
          const wasUnread = !state.notifications[idx].isRead;
          state.notifications[idx] = updated;
          if (wasUnread) state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // ── Mark All Read ──────────────────────────────────────────────────────
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
      })

      // ── Delete ─────────────────────────────────────────────────────────────
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const target = state.notifications.find(
          (n) => n._id === notificationId,
        );
        if (target && !target.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n._id !== notificationId,
        );
      });
  },
});

export const {
  clearNotificationError,
  incrementUnreadCount,
  prependNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
