import React from "react";
import { Loader2 } from "lucide-react";

const loadingSpinner2 = ({
  message = "Loading...??????????????????",
  size = "medium",
}) => {
  // Size variations
  const sizeVariants = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs z-50">
        <div className="relative flex items-center justify-center">
          {/* Glowing Bulb */}
          <div className="w-16 h-16 bg-red-500 rounded-full animate-glow shadow-lg"></div>
          {/* Light Effect */}
          <div className="absolute w-24 h-24 bg-white rounded-full opacity-50 animate-lightPulse"></div>
        </div>
      </div>
    </>
  );
};

export default loadingSpinner2;
