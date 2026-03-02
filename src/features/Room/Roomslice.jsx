// features/rooms/roomSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backendURL from "../../config";

// Helper to get auth token from either adminAuth or regular auth
const getToken = (getState) => {
  const state = getState();
  return (
    state.adminAuth?.adminInfo?.token || state.auth?.userInfo?.token || null
  );
};

// ── Helper: build axios headers based on whether payload is FormData ──────────
// When sending FormData, do NOT set Content-Type — the browser sets it
// automatically with the correct multipart boundary. Forcing it to
// "multipart/form-data" without the boundary breaks the request.
const buildHeaders = (token, isFormData = false) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";
  return headers;
};

// ==================== Async Thunks ====================

// ── Public: Get all published rooms ───────────────────────────────────────────
export const fetchRooms = createAsyncThunk(
  "rooms/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page || 1);
      queryParams.append("limit", params.limit || 6);
      queryParams.append("sortBy", params.sortBy || "createdAt");
      queryParams.append("sortOrder", params.sortOrder || "desc");

      if (params.search?.trim())
        queryParams.append("search", params.search.trim());
      if (params.category) queryParams.append("category", params.category);
      if (params.bedType) queryParams.append("bedType", params.bedType);
      if (params.minPrice != null)
        queryParams.append("minPrice", params.minPrice);
      if (params.maxPrice != null)
        queryParams.append("maxPrice", params.maxPrice);
      if (params.guests != null) queryParams.append("guests", params.guests);
      if (params.checkIn) queryParams.append("checkIn", params.checkIn);
      if (params.checkOut) queryParams.append("checkOut", params.checkOut);

      const response = await axios.get(`${backendURL}/rooms?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rooms",
      );
    }
  },
);

// ── Public: Get room by ID ────────────────────────────────────────────────────
export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/getRoomById/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Room not found");
    }
  },
);

// ── Public: Get room by slug ──────────────────────────────────────────────────
export const fetchRoomBySlug = createAsyncThunk(
  "rooms/fetchRoomBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/getRoomBySlug/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Room not found");
    }
  },
);

// ── Public: Check room availability ───────────────────────────────────────────
export const checkRoomAvailability = createAsyncThunk(
  "rooms/checkAvailability",
  async (
    { roomId, checkIn, checkOut, adults, children },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${backendURL}/availability`, {
        roomId,
        checkIn,
        checkOut,
        adults,
        children,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Availability check failed",
      );
    }
  },
);

// ── Public: Get price estimate ────────────────────────────────────────────────
export const getRoomPriceEstimate = createAsyncThunk(
  "rooms/priceEstimate",
  async (
    { roomId, checkIn, checkOut, roomCount, extras },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(`${backendURL}/estimate`, {
        roomId,
        checkIn,
        checkOut,
        roomCount,
        extras,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Price estimate failed",
      );
    }
  },
);

// ── Public: Create booking ────────────────────────────────────────────────────
export const createBooking = createAsyncThunk(
  "rooms/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/createBooking`,
        bookingData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking",
      );
    }
  },
);

// ── Public: Get booking by reference ──────────────────────────────────────────
export const getBookingByRef = createAsyncThunk(
  "rooms/getBookingByRef",
  async (ref, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/booking/ref/${ref}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Booking not found",
      );
    }
  },
);

// ── Public: Get bookings by phone ─────────────────────────────────────────────
export const getBookingsByPhone = createAsyncThunk(
  "rooms/getBookingsByPhone",
  async (phone, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendURL}/booking/phone/${phone}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

// ── Admin: Get all rooms (including drafts) ───────────────────────────────────
export const fetchAllRoomsAdmin = createAsyncThunk(
  "rooms/fetchAllAdmin",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page || 1);
      queryParams.append("limit", params.limit || 15);
      queryParams.append("sortBy", params.sortBy || "createdAt");
      queryParams.append("sortOrder", params.sortOrder || "desc");

      if (params.search && params.search.trim())
        queryParams.append("search", params.search.trim());
      if (params.category && params.category !== "all")
        queryParams.append("category", params.category);
      if (params.status && params.status !== "all")
        queryParams.append("status", params.status);

      const response = await axios.get(
        `${backendURL}/admin/rooms?${queryParams}`,
        {
          headers: buildHeaders(token),
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch rooms",
      );
    }
  },
);

// ── Admin: Create room ────────────────────────────────────────────────────────
// Accepts { roomData, isFormData } from AdminRoomForm
// isFormData=true  → roomData is a FormData object (has new image files)
// isFormData=false → roomData is a plain JS object (JSON)
export const createRoom = createAsyncThunk(
  "rooms/create",
  async ({ roomData, isFormData = false }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(`${backendURL}/admin/rooms`, roomData, {
        headers: buildHeaders(token, isFormData),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create room",
      );
    }
  },
);

// ── Admin: Update room ────────────────────────────────────────────────────────
// Accepts { roomId, roomData, isFormData } from AdminRoomForm
export const updateRoom = createAsyncThunk(
  "rooms/update",
  async (
    { roomId, roomData, isFormData = false },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/admin/rooms/${roomId}`,
        roomData,
        { headers: buildHeaders(token, isFormData) },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update room",
      );
    }
  },
);

// ── Admin: Delete room ────────────────────────────────────────────────────────
export const deleteRoom = createAsyncThunk(
  "rooms/delete",
  async (roomId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.delete(
        `${backendURL}/admin/rooms/${roomId}`,
        {
          headers: buildHeaders(token),
        },
      );
      return { roomId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete room",
      );
    }
  },
);

// ── Admin: Toggle publish status ──────────────────────────────────────────────
export const togglePublishRoom = createAsyncThunk(
  "rooms/togglePublish",
  async (roomId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/admin/rooms/${roomId}/publish`,
        {},
        { headers: buildHeaders(token) },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle publish status",
      );
    }
  },
);

// ── Admin: Update room status ─────────────────────────────────────────────────
export const updateRoomStatus = createAsyncThunk(
  "rooms/updateStatus",
  async ({ roomId, status }, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/admin/rooms/${roomId}/status`,
        { status },
        { headers: buildHeaders(token) },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update room status",
      );
    }
  },
);

// ── Admin: Duplicate room ─────────────────────────────────────────────────────
export const duplicateRoom = createAsyncThunk(
  "rooms/duplicate",
  async (roomId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.post(
        `${backendURL}/admin/rooms/${roomId}/duplicate`,
        {},
        { headers: buildHeaders(token) },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to duplicate room",
      );
    }
  },
);

// ── Admin: Get all bookings ───────────────────────────────────────────────────
export const fetchAllBookings = createAsyncThunk(
  "rooms/fetchAllBookings",
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append("status", params.status);
      if (params.paymentStatus)
        queryParams.append("paymentStatus", params.paymentStatus);
      if (params.roomId) queryParams.append("roomId", params.roomId);
      if (params.guestPhone)
        queryParams.append("guestPhone", params.guestPhone);
      if (params.guestEmail)
        queryParams.append("guestEmail", params.guestEmail);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const response = await axios.get(
        `${backendURL}/admin/bookings?${queryParams}`,
        {
          headers: buildHeaders(token),
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

// ── Admin: Get booking by ID ──────────────────────────────────────────────────
export const fetchBookingById = createAsyncThunk(
  "rooms/fetchBookingById",
  async (bookingId, { rejectWithValue, getState }) => {
    try {
      const token = getToken(getState);
      const response = await axios.get(
        `${backendURL}/admin/bookings/${bookingId}`,
        {
          headers: buildHeaders(token),
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch booking",
      );
    }
  },
);

// ── Admin: Update booking status ──────────────────────────────────────────────
export const updateBookingStatus = createAsyncThunk(
  "rooms/updateBookingStatus",
  async (
    { bookingId, status, cancelReason },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/admin/bookings/${bookingId}/status`,
        { status, cancelReason },
        { headers: buildHeaders(token) },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking status",
      );
    }
  },
);

// ── Admin: Update booking payment ─────────────────────────────────────────────
export const updateBookingPayment = createAsyncThunk(
  "rooms/updateBookingPayment",
  async (
    { bookingId, paymentStatus, paymentMethod, paymentNotes },
    { rejectWithValue, getState },
  ) => {
    try {
      const token = getToken(getState);
      const response = await axios.patch(
        `${backendURL}/admin/bookings/${bookingId}/payment`,
        { paymentStatus, paymentMethod, paymentNotes },
        { headers: buildHeaders(token) },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update payment",
      );
    }
  },
);

// ==================== Initial State ====================

const initialState = {
  rooms: [],
  currentRoom: null,
  bookings: [],
  currentBooking: null,
  availability: null,
  priceEstimate: null,
  loading: false,
  error: null,
  success: false,
  successMessage: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

// ==================== Slice ====================

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearRoomError: (state) => {
      state.error = null;
    },
    clearRoomSuccess: (state) => {
      state.success = false;
      state.successMessage = null;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearAvailability: (state) => {
      state.availability = null;
    },
    clearPriceEstimate: (state) => {
      state.priceEstimate = null;
    },
    resetRoomState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch Rooms (Public) ──────────────────────────────────────────────
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data?.rooms || [];
        state.pagination = {
          page: action.payload.page || 1,
          total: action.payload.total || 0,
          pages: action.payload.pages || 1,
          limit: action.payload.limit || 6,
        };
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Room By ID ──────────────────────────────────────────────────
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload.data?.room || null;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Room By Slug ────────────────────────────────────────────────
      .addCase(fetchRoomBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload.data?.room || null;
      })
      .addCase(fetchRoomBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Check Availability ────────────────────────────────────────────────
      .addCase(checkRoomAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkRoomAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availability = action.payload || null;
      })
      .addCase(checkRoomAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Price Estimate ────────────────────────────────────────────────────
      .addCase(getRoomPriceEstimate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomPriceEstimate.fulfilled, (state, action) => {
        state.loading = false;
        state.priceEstimate =
          action.payload.data?.estimate ||
          action.payload.data ||
          action.payload ||
          null;
      })
      .addCase(getRoomPriceEstimate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Create Booking ────────────────────────────────────────────────────
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data?.booking || null;
        state.success = true;
        state.successMessage =
          action.payload.message || "Booking created successfully";
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Get Booking By Reference ──────────────────────────────────────────
      .addCase(getBookingByRef.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingByRef.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data?.booking || null;
      })
      .addCase(getBookingByRef.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Get Bookings By Phone ─────────────────────────────────────────────
      .addCase(getBookingsByPhone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingsByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data?.bookings || [];
      })
      .addCase(getBookingsByPhone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch All Rooms Admin ─────────────────────────────────────────────
      .addCase(fetchAllRoomsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoomsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.data?.rooms || [];
        state.pagination = {
          page: action.payload.page || 1,
          total: action.payload.total || 0,
          pages: action.payload.pages || 1,
          limit: action.payload.limit || 15,
        };
      })
      .addCase(fetchAllRoomsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch All Bookings Admin ──────────────────────────────────────────
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data?.bookings || [];
        if (action.payload.pagination)
          state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch Booking By ID Admin ─────────────────────────────────────────
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.data?.booking || null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update Booking Status ─────────────────────────────────────────────
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updatedBooking = action.payload.data?.booking;
        if (updatedBooking) {
          const index = state.bookings.findIndex(
            (b) => b._id === updatedBooking._id,
          );
          if (index !== -1) state.bookings[index] = updatedBooking;
          if (state.currentBooking?._id === updatedBooking._id)
            state.currentBooking = updatedBooking;
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Booking status updated";
        state.loading = false;
      })

      // ── Update Booking Payment ────────────────────────────────────────────
      .addCase(updateBookingPayment.fulfilled, (state, action) => {
        const updatedBooking = action.payload.data?.booking;
        if (updatedBooking) {
          const index = state.bookings.findIndex(
            (b) => b._id === updatedBooking._id,
          );
          if (index !== -1) state.bookings[index] = updatedBooking;
          if (state.currentBooking?._id === updatedBooking._id)
            state.currentBooking = updatedBooking;
        }
        state.success = true;
        state.successMessage =
          action.payload.message || "Payment status updated";
        state.loading = false;
      })

      // ── Create Room ───────────────────────────────────────────────────────
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload.data?.room || null;
        state.success = true;
        state.successMessage =
          action.payload.message || "Room created successfully";
        if (action.payload.data?.room)
          state.rooms.unshift(action.payload.data.room);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // ── Update Room ───────────────────────────────────────────────────────
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload.data?.room || null;
        state.success = true;
        state.successMessage =
          action.payload.message || "Room updated successfully";
        const updatedRoom = action.payload.data?.room;
        if (updatedRoom) {
          const index = state.rooms.findIndex((r) => r._id === updatedRoom._id);
          if (index !== -1) state.rooms[index] = updatedRoom;
        }
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Delete Room ───────────────────────────────────────────────────────
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter(
          (r) => r._id !== action.payload.roomId,
        );
        if (state.currentRoom?._id === action.payload.roomId)
          state.currentRoom = null;
        state.success = true;
        state.successMessage =
          action.payload.message || "Room deleted successfully";
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Toggle Publish ────────────────────────────────────────────────────
      .addCase(togglePublishRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePublishRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedRoom = action.payload.data?.room;
        if (updatedRoom) {
          const index = state.rooms.findIndex((r) => r._id === updatedRoom._id);
          if (index !== -1) state.rooms[index] = updatedRoom;
          if (state.currentRoom?._id === updatedRoom._id)
            state.currentRoom = updatedRoom;
        }
        state.successMessage =
          action.payload.message || "Room publish status toggled";
      })
      .addCase(togglePublishRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Update Room Status ────────────────────────────────────────────────
      .addCase(updateRoomStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedRoom = action.payload.data?.room;
        if (updatedRoom) {
          const index = state.rooms.findIndex((r) => r._id === updatedRoom._id);
          if (index !== -1) state.rooms[index] = updatedRoom;
          if (state.currentRoom?._id === updatedRoom._id)
            state.currentRoom = updatedRoom;
        }
        state.successMessage = action.payload.message || "Room status updated";
      })
      .addCase(updateRoomStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Duplicate Room ────────────────────────────────────────────────────
      .addCase(duplicateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(duplicateRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.successMessage =
          action.payload.message || "Room duplicated successfully";
        if (action.payload.data?.room)
          state.rooms.unshift(action.payload.data.room);
      })
      .addCase(duplicateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ==================== Exports ====================

export const {
  clearRoomError,
  clearRoomSuccess,
  clearCurrentRoom,
  clearCurrentBooking,
  clearAvailability,
  clearPriceEstimate,
  resetRoomState,
} = roomSlice.actions;

export default roomSlice.reducer;
