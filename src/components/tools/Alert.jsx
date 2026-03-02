import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons from react-icons

export const AlertDescription = ({ children, className = "" }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export const Alert = ({
  children,
  variant = "default",
  className = "",
  show: initialShow = true,
  onClose,
  autoClose = true,
  autoCloseTime = 5000,
}) => {
  const [show, setShow] = useState(initialShow);

  useEffect(() => {
    setShow(initialShow);
  }, [initialShow]);

  useEffect(() => {
    let timeoutId;
    if (show && autoClose) {
      timeoutId = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [show, autoClose, autoCloseTime]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  if (!show) return null;

  const baseClasses =
    "fixed top-4 right-4 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-[480px] animate-slide-in-right z-50";
  const variantClasses = {
    default: "bg-[#E3F2FD] border-[#64B5F6] text-[#1565C0]",
    destructive: "bg-[#FFEBEE] border-[#EF9A9A] text-[#C62828]",
    success: "bg-[#E8F5E9] border-[#81C784] text-[#2E7D32] hover:bg-[#d2d6d3]",
    warning: "bg-[#FFF3E0] border-[#FFB74D] text-[#EF6C00]",
  };

  // Icon configuration based on variant
  const iconConfig = {
    success: {
      icon: <FaCheckCircle className="w-5 h-5 text-green-600" />,
      ariaLabel: "Success",
    },
    destructive: {
      icon: <FaTimesCircle className="w-5 h-5 text-red-500" />,
      ariaLabel: "Error",
    },
    default: {
      icon: null,
      ariaLabel: "Info",
    },
    warning: {
      icon: null,
      ariaLabel: "Warning",
    },
  };

  const { icon, ariaLabel } = iconConfig[variant] || {};

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Render icon if it exists for the variant */}
          {icon && <span aria-label={ariaLabel}>{icon}</span>}
          <div className="flex-1">{children}</div>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/10"
          aria-label="Close alert"
          role="button">
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;
