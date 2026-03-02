import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { adminLogin } from "../../features/Auth/AdminAuth/adminAuthActions";
import { clearAdminError } from "../../features/Auth/AdminAuth/adminAuthSlice";

// Import both logo variants
import DubanLogo from "../../assets/images/DubanLogo.png";
import DubanLogoWhite from "../../assets/images/DubanLogoWhite.png";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  // Properly access adminAuth state
  const { loading, error, adminInfo } = useSelector(
    (state) =>
      state.adminAuth || { loading: false, error: null, adminInfo: null },
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Clear any previous errors when component mounts
  useEffect(() => {
    dispatch(clearAdminError());
  }, [dispatch]);

  // Redirect if already logged in
  useEffect(() => {
    if (adminInfo) {
      // Redirect based on super admin status
      if (adminInfo.isSuperAdmin) {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, [adminInfo, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear Redux error when user types
    if (error) {
      dispatch(clearAdminError());
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const resultAction = await dispatch(
        adminLogin({
          email: formData.email,
          password: formData.password,
        }),
      );

      // Check if the action was fulfilled
      if (adminLogin.fulfilled.match(resultAction)) {
        // Login successful - navigation will happen in useEffect
        console.log("Admin login successful:", resultAction.payload);
      } else if (adminLogin.rejected.match(resultAction)) {
        // Error is handled by the slice and displayed via error state
        console.error("Login failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden transition-colors duration-300 ${
        isDarkMode ? "bg-navy-900 dark" : "bg-gray-50"
      }`}
    >
      {/* Background Pattern - adaptive opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? "#f5a623" : "#0F1D3A"} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
          opacity: isDarkMode ? 0.03 : 0.05,
        }}
      />

      {/* Decorative gradient orbs - adaptive colors */}
      <div
        className={`absolute top-0 -left-20 w-80 h-80 rounded-full blur-3xl transition-colors duration-300 ${
          isDarkMode ? "bg-gold-500/10" : "bg-navy-500/5"
        }`}
      />
      <div
        className={`absolute bottom-0 -right-20 w-80 h-80 rounded-full blur-3xl transition-colors duration-300 ${
          isDarkMode ? "bg-gold-500/10" : "bg-navy-500/5"
        }`}
      />

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 z-50 ${
          isDarkMode
            ? "bg-navy-800 text-gold-500 hover:bg-navy-700"
            : "bg-white text-navy-900 hover:bg-gray-100 shadow-lg"
        }`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <FaSun className="w-5 h-5" />
        ) : (
          <FaMoon className="w-5 h-5" />
        )}
      </button>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img
              src={isDarkMode ? DubanLogoWhite : DubanLogo}
              alt="DurbanInternational Hotel"
              className="h-16 w-auto mx-auto transition-all duration-300"
            />
          </Link>
          <h1
            className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-navy-900"
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Admin Portal
          </h1>
          <p
            className={`text-sm transition-colors duration-300 ${
              isDarkMode ? "text-white/40" : "text-navy-600/60"
            }`}
          >
            Secure access for hotel administrators
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`rounded-lg p-8 shadow-2xl transition-all duration-300 ${
            isDarkMode
              ? "bg-navy-800/50 backdrop-blur-sm border border-white/10"
              : "bg-white border border-navy-200 shadow-xl"
          }`}
        >
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <FaShieldAlt className="text-gold-500 w-4 h-4" />
            <span
              className={`text-xs tracking-wider transition-colors duration-300 ${
                isDarkMode ? "text-white/40" : "text-navy-500"
              }`}
            >
              SECURED BY DURBAN
            </span>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-400 text-xs text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                className={`block text-[10px] tracking-[0.2em] uppercase font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-white/40" : "text-navy-500"
                }`}
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <FaEnvelope
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                    isDarkMode ? "text-white/20" : "text-navy-300"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@dubanhotel.com"
                  className={`w-full pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200
                            ${
                              isDarkMode
                                ? "bg-navy-700/50 text-white placeholder-white/20 border-white/10 focus:border-gold-500"
                                : "bg-gray-50 text-navy-900 placeholder-navy-300 border-navy-200 focus:border-gold-500"
                            }
                            border ${
                              validationErrors.email ? "border-red-500/50" : ""
                            }`}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-400 text-[10px] mt-1.5">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                className={`block text-[10px] tracking-[0.2em] uppercase font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-white/40" : "text-navy-500"
                }`}
              >
                PASSWORD
              </label>
              <div className="relative">
                <FaLock
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                    isDarkMode ? "text-white/20" : "text-navy-300"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 text-sm outline-none transition-all duration-200
                            ${
                              isDarkMode
                                ? "bg-navy-700/50 text-white placeholder-white/20 border-white/10 focus:border-gold-500"
                                : "bg-gray-50 text-navy-900 placeholder-navy-300 border-navy-200 focus:border-gold-500"
                            }
                            border ${
                              validationErrors.password
                                ? "border-red-500/50"
                                : ""
                            }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    isDarkMode
                      ? "text-white/20 hover:text-gold-500"
                      : "text-navy-300 hover:text-gold-500"
                  }`}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-4 h-4" />
                  ) : (
                    <FaEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-400 text-[10px] mt-1.5">
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Email Verification Notice */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 border flex items-center justify-center transition-colors
                              ${
                                rememberMe
                                  ? "bg-gold-500 border-gold-500"
                                  : isDarkMode
                                    ? "border-white/20 group-hover:border-gold-500"
                                    : "border-navy-300 group-hover:border-gold-500"
                              }`}
                >
                  {rememberMe && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isDarkMode
                      ? "text-white/40 group-hover:text-white/60"
                      : "text-navy-500 group-hover:text-navy-700"
                  }`}
                >
                  Remember me
                </span>
              </label>

              {/* Email verification notice */}
              <Link
                to="/admin/resend-verification"
                className={`text-[10px] tracking-wider transition-colors ${
                  isDarkMode
                    ? "text-white/20 hover:text-gold-500"
                    : "text-navy-400 hover:text-gold-500"
                }`}
              >
                VERIFY EMAIL?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-4 text-sm tracking-[0.25em] font-bold
                        transition-all duration-300 shadow-lg relative overflow-hidden
                        ${
                          loading
                            ? "bg-gold-500/60 cursor-not-allowed"
                            : "bg-gold-500 hover:bg-gold-400"
                        } text-navy-900`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="60"
                      strokeDashoffset="20"
                    />
                  </svg>
                  <span>AUTHENTICATING...</span>
                </div>
              ) : (
                "LOGIN TO DASHBOARD"
              )}
            </motion.button>
          </form>

          {/* Admin Notes */}
          <div className="mt-6 space-y-3">
            <p
              className={`text-[10px] tracking-wider text-center transition-colors ${
                isDarkMode ? "text-white/20" : "text-navy-400"
              }`}
            >
              New admin accounts and password resets are handled by the Super
              Admin.
            </p>

            {/* Quick Links */}
            <div className="flex items-center justify-center gap-4 pt-2 text-[10px]">
              <Link
                to="/admin/forgot-password"
                className={`transition-colors ${
                  isDarkMode
                    ? "text-white/30 hover:text-gold-500"
                    : "text-navy-500 hover:text-gold-500"
                }`}
              >
                Forgot Password?
              </Link>
              <span className={isDarkMode ? "text-white/10" : "text-navy-200"}>
                |
              </span>
              <Link
                to="/admin/resend-verification"
                className={`transition-colors ${
                  isDarkMode
                    ? "text-white/30 hover:text-gold-500"
                    : "text-navy-500 hover:text-gold-500"
                }`}
              >
                Resend Verification
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Back to Main Site */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className={`text-xs tracking-wider transition-colors ${
              isDarkMode
                ? "text-white/20 hover:text-gold-500"
                : "text-navy-400 hover:text-gold-500"
            }`}
          >
            ← RETURN TO MAIN SITE
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
