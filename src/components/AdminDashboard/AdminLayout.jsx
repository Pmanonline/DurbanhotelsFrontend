import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMenuClick = () => {
    if (isMobile) setSidebarOpen((v) => !v);
    else setSidebarCollapsed((v) => !v);
  };

  return (
    <motion.div
      className="flex h-screen overflow-hidden bg-gray-50 dark:bg-navy-900 text-navy-900 dark:text-white/90 font-body"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed && !isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-white dark:bg-navy-900">
        {/* Header */}
        <AdminHeader
          onMenuClick={handleMenuClick}
          isCollapsed={sidebarCollapsed && !isMobile}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-navy-900">
          {/* Dot grid background pattern */}
          <div className="relative min-h-full">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Content */}
            <div className="relative p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
