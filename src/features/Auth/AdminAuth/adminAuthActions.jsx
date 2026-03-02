import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import backendURL from "../../../config";

export const adminLogin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/auth/admin/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // Important for cookies
        },
      );

      // Response structure from your controller:
      // {
      //   status: "success",
      //   message: "Admin login successful",
      //   admin: { id, email, name, username, role, isSuperAdmin, permissions },
      //   accessToken,
      //   refreshToken
      // }

      const { accessToken, refreshToken, admin } = response.data;

      // Store tokens in cookies
      Cookies.set("adminAccessToken", accessToken, { expires: 1 / 96 }); // 15 mins
      Cookies.set("adminRefreshToken", refreshToken, { expires: 30 }); // 30 days

      // Store admin info (without sensitive data)
      Cookies.set(
        "adminInfo",
        JSON.stringify({
          ...response.data.admin,
          token: response.data.accessToken,
        }),
        { expires: 7 },
      );

      return { admin, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed",
      );
    }
  },
);

export const adminLogout = createAsyncThunk(
  "adminAuth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call logout endpoint if you have one
      // await axios.post(`${backendURL}/auth/admin/logout`);

      // Clear cookies
      Cookies.remove("adminAccessToken");
      Cookies.remove("adminRefreshToken");
      Cookies.remove("adminInfo");

      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  },
);

export const resendAdminVerification = createAsyncThunk(
  "adminAuth/resendVerification",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/auth/admin/resend-verification`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend verification email",
      );
    }
  },
);

export const forgotAdminPassword = createAsyncThunk(
  "adminAuth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/auth/admin/forgot-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link",
      );
    }
  },
);

export const resetAdminPassword = createAsyncThunk(
  "adminAuth/resetPassword",
  async ({ token, password, confirm_password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/auth/admin/reset-password?token=${token}`,
        { password, confirm_password },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password",
      );
    }
  },
);
