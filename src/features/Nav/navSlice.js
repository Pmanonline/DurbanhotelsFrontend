import { createSlice } from "@reduxjs/toolkit";

const navSlice = createSlice({
  name: "nav",
  initialState: {
    isMobileMenuOpen: false,
  },
  reducers: {
    toggleMobileMenu(state) {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
  },
});

export const { toggleMobileMenu } = navSlice.actions;
export default navSlice.reducer;
