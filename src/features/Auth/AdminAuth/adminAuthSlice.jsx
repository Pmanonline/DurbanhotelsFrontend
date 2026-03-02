import { createSlice } from "@reduxjs/toolkit";
import {
  adminLogin,
  adminLogout,
  resendAdminVerification,
  forgotAdminPassword,
  resetAdminPassword,
} from "./adminAuthActions";
import Cookies from "js-cookie";

const storedAdminInfo = Cookies.get("adminInfo");
const initialState = {
  loading: false,
  adminInfo: storedAdminInfo ? JSON.parse(storedAdminInfo) : null,
  error: null,
  success: false,
  message: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
    updateAdminInfo: (state, action) => {
      state.adminInfo = { ...state.adminInfo, ...action.payload };
      Cookies.set("adminInfo", JSON.stringify(state.adminInfo), { expires: 7 });
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = {
          ...action.payload.admin,
          token: action.payload.accessToken, // ✅ matches the returned key
        };
        Cookies.set("adminInfo", JSON.stringify(state.adminInfo), {
          expires: 7,
        });
        state.success = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.adminInfo = null;
      })

      // Admin Logout
      .addCase(adminLogout.fulfilled, (state) => {
        state.adminInfo = null;
        state.success = false;
        state.error = null;
      })

      // Resend Verification
      .addCase(resendAdminVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendAdminVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(resendAdminVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotAdminPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(forgotAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetAdminPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(resetAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearAdminSuccess, updateAdminInfo } =
  adminAuthSlice.actions;
export default adminAuthSlice.reducer;
