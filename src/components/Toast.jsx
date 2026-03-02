import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, X } from "lucide-react";

export default function Toast({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex items-center gap-3
        px-4 py-3 rounded-lg shadow-2xl max-w-[calc(100vw-2rem)] sm:min-w-[320px]
        backdrop-blur-sm border-l-4
        ${
          type === "success"
            ? "bg-green-50 dark:bg-green-500/10 border-green-500 text-green-700 dark:text-green-400"
            : "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400"
        }`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 ${
          type === "success" ? "text-green-500" : "text-red-500"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertTriangle className="w-5 h-5" />
        )}
      </div>

      {/* Message */}
      <p className="text-xs sm:text-sm font-medium flex-1 leading-relaxed">
        {message}
      </p>

      {/* Close button */}
      <button
        onClick={onClose}
        className={`flex-shrink-0 p-1 rounded-full transition-colors ${
          type === "success"
            ? "hover:bg-green-100 dark:hover:bg-green-500/20"
            : "hover:bg-red-100 dark:hover:bg-red-500/20"
        }`}
      >
        <X className="w-4 h-4 opacity-50 hover:opacity-100" />
      </button>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-1 ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 4, ease: "linear" }}
        style={{ borderBottomLeftRadius: "0.5rem" }}
      />
    </motion.div>
  );
}
