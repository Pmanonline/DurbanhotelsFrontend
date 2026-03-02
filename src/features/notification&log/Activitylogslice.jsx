// features/activityLog/activityLogSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendURL from "../../config";

const getToken = (getState) => {
  const state = getState();
  return (
    state.adminAuth?.adminInfo?.token || state.auth?.userInfo?.token || null
  );
};

// ==================== Async Thunks ====================

// ── Fetch paginated logs ──────────────────────────────────────────────────────
export const fetchActivityLogs = createAsyncThunk(
  "activityLog/fetchAll",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const q = new URLSearchParams();
      if (params.action) q.append("action", params.action);
      if (params.severity) q.append("severity", params.severity);
      if (params.resourceType) q.append("resourceType", params.resourceType);
      if (params.resourceId) q.append("resourceId", params.resourceId);
      if (params.performedBy) q.append("performedBy", params.performedBy);
      if (params.startDate) q.append("startDate", params.startDate);
      if (params.endDate) q.append("endDate", params.endDate);
      if (params.page) q.append("page", String(params.page));
      if (params.limit) q.append("limit", String(params.limit));

      const { data } = await axios.get(`${backendURL}/activity-logs?${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch activity logs",
      );
    }
  },
);

// ── Fetch a single log entry ──────────────────────────────────────────────────
export const fetchActivityLogById = createAsyncThunk(
  "activityLog/fetchById",
  async (logId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const { data } = await axios.get(`${backendURL}/activity-logs/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch log entry",
      );
    }
  },
);

// ── Fetch aggregated stats (for dashboard charts) ─────────────────────────────
export const fetchActivityStats = createAsyncThunk(
  "activityLog/fetchStats",
  async (days = 7, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const { data } = await axios.get(
        `${backendURL}/activity-logs/stats?days=${days}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch activity stats",
      );
    }
  },
);

// ==================== Initial State ====================

const initialState = {
  logs: [],
  currentLog: null,

  // Stats from /stats endpoint
  stats: {
    byAction: [], // [{ _id: "ORDER_CREATED", count: 12 }, ...]
    bySeverity: [], // [{ _id: "info", count: 80 }, ...]
    byDay: [], // [{ _id: "2025-02-20", count: 14 }, ...]
    period: "",
  },

  loading: false,
  statsLoading: false,
  error: null,

  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  },
};

// ==================== Slice ====================

const activityLogSlice = createSlice({
  name: "activityLog",
  initialState,
  reducers: {
    clearActivityLogError: (state) => {
      state.error = null;
    },
    clearCurrentLog: (state) => {
      state.currentLog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch All ──────────────────────────────────────────────────────────
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.data?.logs || [];
        state.pagination = {
          page: action.payload.page ?? 1,
          limit: action.payload.limit ?? 50,
          total: action.payload.total ?? 0,
          pages: action.payload.pages ?? 0,
        };
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch By ID ────────────────────────────────────────────────────────
      .addCase(fetchActivityLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLog = action.payload.data?.log || null;
      })
      .addCase(fetchActivityLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Stats ────────────────────────────────────────────────────────
      .addCase(fetchActivityStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchActivityStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        const d = action.payload.data || {};
        state.stats = {
          byAction: d.byAction || [],
          bySeverity: d.bySeverity || [],
          byDay: d.byDay || [],
          period: d.period || "",
        };
      })
      .addCase(fetchActivityStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearActivityLogError, clearCurrentLog } =
  activityLogSlice.actions;

export default activityLogSlice.reducer;
