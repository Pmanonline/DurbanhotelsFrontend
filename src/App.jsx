import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { TokenExpirationModal } from "./components/tools/TokenExpirationModal";
import AIChatbot from "./components/AI CHATBOT/AIChatbot";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/routes/protectedRoutes";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUsPage";
import ContactUs from "./pages/ContactUs";
import MenuPage from "./pages/Menupage";
import ServicesPage from "./pages/Services";
import TestimonialsPage from "./pages/testimonial";
import GalleryPage from "./pages/Gallery.jsx";
import MeetingsEventsPage from "./pages/Meetingseventspage";
import FAQPage from "./pages/FAQ.jsx";
import GymWellnessPage from "./pages/GymAndWellness.jsx";

// admin auth
import AdminLogin from "./pages/AdminAuth/AdminLogin";

// Admin Dashboard
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminNotificationPage from "./pages/AdminPages/AdminNotifications.jsx";
import AdminMenuList from "./pages/AdminPages/AdminMenuList";
import AdminMenuManage from "./pages/AdminPages/ManageMenu";
import Adminorderlist from "./pages/AdminPages/Adminorderlist";
import AdminRoomList from "./pages/AdminPages/Adminroomlist.jsx";
import AdminRoomForm from "./pages/AdminPages/Adminroomform.jsx";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import RoomDetail from "./pages/Roomdetail";
import RoomsPage from "./pages/Roomspage";
import BookingPage from "./pages/Bookingpage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const themeMode = useSelector((state) => state.theme.mode);

  const isDashboardRoute =
    location.pathname.startsWith("/Admin") ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Navbar />}
      <Routes>
        {/* General Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/rooms/roomdetail/:slug" element={<RoomDetail />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<MeetingsEventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="wellness" element={<GymWellnessPage />} />

        {/* admin auth route */}
        <Route path="/Admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/Admin/notifications"
              element={<AdminNotificationPage />}
            />
            <Route path="/Admin/dashboard" element={<AdminDashboard />} />
            <Route path="/Admin/menu" element={<AdminMenuList />} />
            <Route
              path="/Admin/menu/:menuId/edit"
              element={<AdminMenuManage />}
            />
            <Route path="/Admin/menu/orders" element={<Adminorderlist />} />
            {/* rooms */}
            <Route path="/admin/rooms" element={<AdminRoomList />} />
            <Route path="/admin/rooms/create" element={<AdminRoomForm />} />
            <Route path="/admin/rooms/:id/edit" element={<AdminRoomForm />} />
          </Route>
        </Route>
      </Routes>

      {!isDashboardRoute && <Footer />}
      {!isDashboardRoute && <AIChatbot />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <TokenExpirationModal />
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
