// UMORUS-POR.../client/src/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/Auth/authSlice";
import themeReducer from "./features/Theme/themeSlice";
import navReducer from "./features/Nav/navSlice";
import adminAuthReducer from "./features/Auth/AdminAuth/adminAuthSlice";
import menuReducer from "./features/Menu/menuSlice";
import roomReducer from "./features/Room/Roomslice";
import notificationReducer from "./features/notification&log/Notificationslice";
import activityLogReducer from "./features/notification&log/Activitylogslice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    nav: navReducer,
    adminAuth: adminAuthReducer,
    menu: menuReducer,
    rooms: roomReducer,
    notifications: notificationReducer,
    activityLog: activityLogReducer,
  },
});
