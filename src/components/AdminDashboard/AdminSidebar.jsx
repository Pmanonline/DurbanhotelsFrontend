import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  UtensilsCrossed,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  BarChart3,
  Star,
  CreditCard,
  ClipboardList,
  MessageSquare,
  ImageIcon,
  FileText,
  Percent,
  Home,
  ShieldCheck,
} from "lucide-react";

import { adminLogout } from "../../features/Auth/AdminAuth/adminAuthActions";

import DubanLogo from "../../assets/images/DubanLogo.png";

// ── Nav structure ─────────────────────────────────────────────────────────────
const NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
      { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    ],
  },
  {
    section: "Reservations",
    items: [
      {
        label: "Bookings",
        icon: CalendarCheck,
        path: "/admin/bookings",
        badge: "12",
        children: [
          { label: "All Bookings", path: "/admin/bookings" },
          { label: "Pending", path: "/admin/bookings/pending" },
          { label: "Confirmed", path: "/admin/bookings/confirmed" },
          { label: "Checked In", path: "/admin/bookings/checked-in" },
          { label: "Checked Out", path: "/admin/bookings/checked-out" },
          { label: "Cancelled", path: "/admin/bookings/cancelled" },
        ],
      },
      {
        label: "Availability",
        icon: BedDouble,
        path: "/admin/availability",
        children: [
          { label: "Room Calendar", path: "/admin/availability/calendar" },
          { label: "Block Dates", path: "/admin/availability/block" },
        ],
      },
    ],
  },
  {
    section: "Rooms",
    items: [
      {
        label: "Rooms & Suites",
        icon: BedDouble,
        path: "/admin/rooms",
        children: [
          { label: "All Rooms", path: "/admin/rooms" },
          { label: "Add Room", path: "/admin/rooms/add" },
          { label: "Room Types", path: "/admin/rooms/types" },
          { label: "Amenities", path: "/admin/rooms/amenities" },
        ],
      },
      {
        label: "Reviews & Ratings",
        icon: Star,
        path: "/admin/reviews",
        badge: "3",
        badgeRed: true,
      },
      { label: "Promotions", icon: Percent, path: "/admin/promotions" },
    ],
  },
  {
    section: "F&B",
    items: [
      {
        label: "Food & Beverage",
        icon: UtensilsCrossed,
        path: "/admin/menu",
        children: [
          { label: "Menus", path: "/admin/menu" },
          {
            label: "Orders",
            path: "/admin/menu/orders",
            badge: "5",
            badgeRed: true,
          },
          { label: "Categories", path: "/admin/menu/categories" },
        ],
      },
    ],
  },
  {
    section: "Guests & Staff",
    items: [
      {
        label: "Guests",
        icon: Users,
        path: "/admin/guests",
        children: [
          { label: "All Guests", path: "/admin/guests" },
          { label: "VIP Guests", path: "/admin/guests/vip" },
          { label: "Guest History", path: "/admin/guests/history" },
        ],
      },
      { label: "Staff / Admins", icon: ShieldCheck, path: "/admin/staff" },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Transactions", icon: CreditCard, path: "/admin/transactions" },
      { label: "Reports", icon: ClipboardList, path: "/admin/reports" },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Media Library", icon: ImageIcon, path: "/admin/media" },
      { label: "Blog & News", icon: FileText, path: "/admin/blog" },
      {
        label: "Messages",
        icon: MessageSquare,
        path: "/admin/messages",
        badge: "2",
        badgeRed: true,
      },
      { label: "Notifications", icon: Bell, path: "/admin/notifications" },
    ],
  },
];

// ── Sidebar ───────────────────────────────────────────────────────────────────
export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminInfo } = useSelector((s) => s.adminAuth);
  const [expanded, setExpanded] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const toggle = (label) => setExpanded((p) => ({ ...p, [label]: !p[label] }));

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/");
  };

  const initials = adminInfo?.name
    ? adminInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  // Desktop width classes
  const widthClass = isCollapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative z-50 h-full bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-white/10
          transition-all duration-300 ease-in-out flex flex-col
          ${widthClass}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 hidden lg:flex items-center justify-center w-6 h-6 
            bg-gold-500 hover:bg-gold-400 text-white rounded-full shadow-lg z-10 transition-colors"
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`}
          />
        </button>

        {/* Logo */}
        <div
          className={`flex items-center gap-3 px-4 py-5 border-b border-gray-200 dark:border-white/10 flex-shrink-0 ${isCollapsed ? "justify-center px-2" : ""}`}
        >
          <div className="w-9 h-9 flex-shrink-0 border border-gold-500/30 bg-gold-500/10 flex items-center justify-center">
            <Link to="/" className="" aria-label="DubanInternational Hotel">
              <img
                src={DubanLogo}
                alt="DubanInternational Hotel"
                className="h-8 sm:h-8 w-auto"
              />
            </Link>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="font-heading text-sm font-bold text-navy-900 dark:text-white truncate">
                DubanInternational
              </div>
              <div className="text-[8px] text-gold-500 tracking-[0.2em] uppercase">
                Admin Portal
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-hide">
          {/* Quick link home */}
          <Link
            to="/"
            className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors relative
              ${isCollapsed ? "justify-center px-2" : ""}
              ${
                isActive("/")
                  ? "text-gold-500 bg-gold-500/10 border-l-2 border-gold-500"
                  : "text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/5 border-l-2 border-transparent"
              }`}
            onClick={onClose}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && (
              <span className="flex-1 text-left">View Hotel Site</span>
            )}
          </Link>

          <div className="h-px bg-gray-200 dark:bg-white/5 mx-4 my-2" />

          {NAV.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <div className="text-[8px] font-bold text-gray-400 dark:text-white/30 tracking-[0.2em] uppercase px-4 py-2">
                  {section.section}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const hasChildren = item.children?.length > 0;
                const open = expanded[item.label];

                return (
                  <div key={item.label}>
                    {hasChildren ? (
                      <button
                        className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors relative
                          ${isCollapsed ? "justify-center px-2" : ""}
                          ${
                            active
                              ? "text-gold-500 bg-gold-500/10 border-l-2 border-gold-500"
                              : "text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/5 border-l-2 border-transparent"
                          }`}
                        onClick={() => toggle(item.label)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
                                ${item.badgeRed ? "bg-red-500/10 text-red-500" : "bg-gold-500/10 text-gold-500"}`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0
                              ${open ? "rotate-90" : ""}`}
                            />
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors relative
                          ${isCollapsed ? "justify-center px-2" : ""}
                          ${
                            active
                              ? "text-gold-500 bg-gold-500/10 border-l-2 border-gold-500"
                              : "text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/5 border-l-2 border-transparent"
                          }`}
                        onClick={onClose}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
                                ${item.badgeRed ? "bg-red-500/10 text-red-500" : "bg-gold-500/10 text-gold-500"}`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    )}

                    {hasChildren && !isCollapsed && (
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pl-9 pr-2 py-1 space-y-0.5 bg-gray-50/50 dark:bg-white/5">
                              {item.children.map((child) => (
                                <Link
                                  key={child.path}
                                  to={child.path}
                                  className={`flex items-center gap-2 py-1.5 text-xs transition-colors
                                    ${
                                      location.pathname === child.path
                                        ? "text-gold-500 font-medium"
                                        : "text-gray-400 dark:text-white/40 hover:text-gold-500"
                                    }`}
                                  onClick={onClose}
                                >
                                  <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                  <span>{child.label}</span>
                                  {child.badge && (
                                    <span className="ml-auto text-[8px] font-bold bg-red-500/10 text-red-500 px-1 py-0.5 rounded-full">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          <div className="h-px bg-gray-200 dark:bg-white/5 mx-4 my-2" />

          <Link
            to="/admin/settings"
            className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-colors relative
              ${isCollapsed ? "justify-center px-2" : ""}
              ${
                isActive("/admin/settings")
                  ? "text-gold-500 bg-gold-500/10 border-l-2 border-gold-500"
                  : "text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/5 border-l-2 border-transparent"
              }`}
            onClick={onClose}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">Settings</span>}
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-2 pb-3 flex-shrink-0">
          <button
            className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors
      ${isCollapsed ? "justify-center px-2" : ""}
      text-red-500 hover:text-red-400 hover:bg-red-500/5 border-l-2 border-transparent`}
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
