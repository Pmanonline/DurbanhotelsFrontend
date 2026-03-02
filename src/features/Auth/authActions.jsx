import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import backendURL from "../../config";

export const setEmail = (email) => ({
  type: "SET_EMAIL",
  payload: email,
});

const normalizeUserData = (response) => {
  if (response.data?.requireOTP) {
    return response.data;
  }

  if (
    response.data?.accessToken &&
    response.data?.refreshToken &&
    response.data?.user
  ) {
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      user: {
        ...response.data.user,
      },
    };
  }

  const { token, user, ...rest } = response.data;
  return {
    accessToken: token || response.data.accessToken,
    refreshToken: response.data.refreshToken,
    user: user || rest,
  };
};

export const setCredentials = (data) => ({
  type: "auth/setCredentials",
  payload: data,
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const normalizedData = normalizeUserData(response);

      if (normalizedData.requireOTP) {
        return normalizedData;
      }

      Cookies.set("accessToken", normalizedData.accessToken, {
        expires: 1 / 96,
      });
      Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 });
      Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
        expires: 7,
      });

      return normalizedData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${backendURL}/api/refresh-token`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const { accessToken, user } = response.data;

      Cookies.set("accessToken", accessToken, { expires: 1 / 96 });
      Cookies.set("userInfo", JSON.stringify(user), { expires: 7 });

      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

export const handleGoogleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/google-login`,
        { credential },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      if (!response.data) {
        throw new Error("No data received from Google login");
      }

      const normalizedData = normalizeUserData(response);

      Cookies.set("accessToken", normalizedData.accessToken, {
        expires: 1 / 96,
      });
      Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 });
      Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
        expires: 7,
      });

      return normalizedData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);

export const handleFacebookLogin = createAsyncThunk(
  "auth/facebookLogin",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/facebook-login`,
        { accessToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      const normalizedData = normalizeUserData(response);

      Cookies.set("accessToken", normalizedData.accessToken, {
        expires: 1 / 96,
      });
      Cookies.set("refreshToken", normalizedData.refreshToken, { expires: 7 });
      Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
        expires: 7,
      });

      return normalizedData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Facebook login failed"
      );
    }
  }
);

export const handleTwitterLogin = createAsyncThunk(
  "auth/twitterLogin",
  async ({ code, state, redirectUri }, { rejectWithValue }) => {
    try {
      console.log("Dispatching Twitter login with:", {
        code: code.substring(0, 10) + "...",
        state,
        redirectUri,
      });

      const response = await axios.post(
        `${backendURL}/api/twitter-login`,
        { code, state, redirectUri }, // Send state instead of codeVerifier
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      if (!response.data) {
        throw new Error("No data received from Twitter login");
      }

      const normalizedData = normalizeUserData(response);

      // Store tokens in cookies
      Cookies.set("accessToken", normalizedData.accessToken, {
        expires: 1 / 96,
      });
      Cookies.set("refreshToken", normalizedData.refreshToken, {
        expires: 7,
      });
      Cookies.set("userInfo", JSON.stringify(normalizedData.user), {
        expires: 7,
      });

      return normalizedData;
    } catch (error) {
      console.error(
        "Twitter login action error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Twitter login failed"
      );
    }
  }
);
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/register`,
        { email, password, username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      if (response.data.token) {
        Cookies.set("accessToken", response.data.token, { expires: 1 / 96 });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerAdmin = createAsyncThunk(
  "auth/registerAdmin",
  async ({ email, password, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/registerAdmin`,
        { email, password, username },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      if (response.data.token) {
        Cookies.set("accessToken", response.data.token, { expires: 1 / 96 });
        Cookies.set("userInfo", JSON.stringify(response.data.user), {
          expires: 7,
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      };

      const response = await axios.post(
        `${backendURL}/api/reset-password/${token}`,
        { email, password },
        config
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue("Failed to reset password");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyAdminOTP = createAsyncThunk(
  "auth/verifyAdminOTP",
  async ({ userId, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/verifyAdminOTP`,
        { userId, otp },
        {
          withCredentials: false,
        }
      );

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify OTP"
      );
    }
  }
);
