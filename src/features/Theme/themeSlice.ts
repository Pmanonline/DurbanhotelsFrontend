// themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getSavedTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme;

  // Handle legacy "darkMode" boolean key
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") return "dark";
  if (darkMode === "false") return "light";

  return "light"; // ✅ default changed from "dark" → "light"
};

const initialState = {
  mode: getSavedTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
      localStorage.removeItem("darkMode");
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
      localStorage.removeItem("darkMode");
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
