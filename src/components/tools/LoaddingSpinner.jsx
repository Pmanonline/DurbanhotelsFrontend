import React, { useEffect, useState, useCallback, memo } from "react";
import { Loader2, X } from "lucide-react";

const LoadingSpinner = memo(() => (
  <div className="fixed inset-0 flex items-center justify-center bg-background-light/90 dark:bg-primary-900/90 backdrop-blur-sm z-50 animate-in fade-in duration-300">
    <div className="relative">
      <div className="absolute inset-0 animate-ping">
        <div className="w-20 h-20 border-4 border-primary-600/20 dark:border-primary-400/20 rounded-full opacity-20"></div>
      </div>

      <div
        className="absolute inset-2 animate-spin"
        style={{ animationDuration: "2s" }}>
        <div className="w-16 h-16 border-2 border-secondary-500/40 dark:border-secondary-400/40 border-t-transparent rounded-full opacity-40"></div>
      </div>

      <div className="relative flex items-center justify-center w-20 h-20">
        <div className="absolute animate-pulse">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600/10 dark:from-primary-700/10 to-secondary-500/10 dark:to-secondary-400/10 rounded-full opacity-10"></div>
        </div>
        <Loader2
          className="animate-spin text-primary-600 dark:text-primary-400 drop-shadow-sm"
          size={40}
        />
      </div>

      <div
        className="absolute -top-2 -left-2 w-2 h-2 bg-accent-purple-500/60 dark:bg-accent-purple-400/60 rounded-full animate-bounce opacity-60"
        style={{ animationDelay: "0s" }}></div>
      <div
        className="absolute -top-2 -right-2 w-1.5 h-1.5 bg-accent-purple-500/70 dark:bg-accent-purple-400/70 rounded-full animate-bounce opacity-70"
        style={{ animationDelay: "0.2s" }}></div>
      <div
        className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-accent-purple-500/50 dark:bg-accent-purple-400/50 rounded-full animate-bounce opacity-50"
        style={{ animationDelay: "0.4s" }}></div>
      <div
        className="absolute -bottom-2 -right-2 w-2 h-2 bg-accent-purple-500/80 dark:bg-accent-purple-400/80 rounded-full animate-bounce opacity-80"
        style={{ animationDelay: "0.6s" }}></div>
    </div>

    <div className="absolute mt-24 text-primary-600 dark:text-text-light font-medium text-sm animate-pulse">
      Loading<span className="animate-ping">...</span>
    </div>
  </div>
));
export default LoadingSpinner;
