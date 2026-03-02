import React, { useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/Auth/authSlice";
import { AlertCircle, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TokenExpirationModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const checkTokenValidity = useCallback(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();

      if (now >= expiresAt) {
        setTokenValid(false);
        setIsModalOpen(true);
        dispatch(logoutUser());
      } else {
        setTokenValid(true);
      }
    } catch (error) {
      setTokenValid(false);
      setIsModalOpen(true);
      dispatch(logoutUser());
    }
  }, [token, dispatch]);

  useEffect(() => {
    checkTokenValidity();
    const interval = setInterval(checkTokenValidity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

  const handleLogin = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  if (!isModalOpen || tokenValid) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-600/50 dark:bg-primary-900/70 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="token-expiration-modal-title"
      aria-describedby="token-expiration-modal-description"
      aria-modal="true">
      <div
        className="relative w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="bg-white dark:bg-primary-800 rounded-xl overflow-hidden border border-secondary-200/30 dark:border-secondary-700/30 shadow-2xl">
          <div className="bg-primary-600 dark:bg-primary-700 px-4 sm:px-6 py-4 flex items-center gap-3">
            <AlertCircle
              className="text-secondary-500 dark:text-secondary-400"
              size={24}
            />
            <h3
              id="token-expiration-modal-title"
              className="text-xl sm:text-2xl font-bold text-white">
              Session Expired
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <p
              id="token-expiration-modal-description"
              className="text-sm sm:text-base text-text-dark dark:text-text-light mb-6">
              For your security, your session has timed out. Please sign in
              again for a better user access!!
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2 sm:py-3 text-sm sm:text-base font-medium text-text-dark dark:text-text-light rounded-lg border border-secondary-200/30 dark:border-secondary-700/30 hover:bg-secondary-100 dark:hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-secondary-500"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close session expired modal">
                Close
              </button>
              <button
                className="px-5 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 rounded-lg transition-colors flex items-center gap-2 focus:ring-2 focus:ring-secondary-500"
                onClick={handleLogin}
                aria-label="Login again">
                <LogIn size={18} />
                Login Again
              </button>
            </div>
          </div>
          <div className="bg-background-light/90 dark:bg-primary-900/90 px-4 sm:px-6 py-3 text-center text-xs sm:text-sm text-text-dark dark:text-text-light/80">
            Pride of Nigeria • Secured Access
          </div>
        </div>
      </div>
    </div>
  );
};

export const useCheckTokenExpiration = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const checkToken = useCallback(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiresAt = decoded.exp * 1000;
      if (Date.now() >= expiresAt) {
        dispatch(logoutUser());
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      dispatch(logoutUser());
    }
  }, [token, dispatch]);

  useEffect(() => {
    checkToken();
    const intervalId = setInterval(checkToken, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [checkToken]);
};
