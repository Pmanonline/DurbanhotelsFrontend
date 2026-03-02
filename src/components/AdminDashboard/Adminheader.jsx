// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Menu,
//   Search,
//   Bell,
//   Settings,
//   LogOut,
//   User,
//   Moon,
//   Sun,
//   ChevronDown,
//   PanelLeftClose,
//   PanelLeftOpen,
//   ShoppingBag,
//   UtensilsCrossed,
//   CreditCard,
//   AlertTriangle,
//   Info,
//   CheckCircle,
//   Loader2,
// } from "lucide-react";
// import { logoutUser } from "../../features/Auth/authSlice";
// import {
//   fetchUnreadCount,
//   fetchNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
// } from "../../features/notification&log/Notificationslice";

// // ── Map backend event strings → icon + colour ─────────────────────────────────
// function notifMeta(event = "") {
//   if (event.includes("ORDER_CREATED"))
//     return {
//       Icon: ShoppingBag,
//       color: "text-green-500",
//       bg: "bg-green-500/10",
//       border: "border-green-500/20",
//     };
//   if (event.includes("ORDER_STATUS"))
//     return {
//       Icon: UtensilsCrossed,
//       color: "text-blue-500",
//       bg: "bg-blue-500/10",
//       border: "border-blue-500/20",
//     };
//   if (event.includes("ORDER_CANCELLED"))
//     return {
//       Icon: AlertTriangle,
//       color: "text-red-500",
//       bg: "bg-red-500/10",
//       border: "border-red-500/20",
//     };
//   if (event.includes("PAYMENT"))
//     return {
//       Icon: CreditCard,
//       color: "text-gold-500",
//       bg: "bg-gold-500/10",
//       border: "border-gold-500/20",
//     };
//   if (
//     event.includes("MENU") ||
//     event.includes("ITEM") ||
//     event.includes("CATEGORY")
//   )
//     return {
//       Icon: UtensilsCrossed,
//       color: "text-purple-500",
//       bg: "bg-purple-500/10",
//       border: "border-purple-500/20",
//     };
//   return {
//     Icon: Info,
//     color: "text-gray-400",
//     bg: "bg-gray-100 dark:bg-white/5",
//     border: "border-gray-200 dark:border-white/10",
//   };
// }

// function timeAgo(dateStr) {
//   const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
//   if (diff < 60) return `${diff}s ago`;
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   return `${Math.floor(diff / 86400)}d ago`;
// }

// // ── POLL_INTERVAL: refresh badge every 60 s while header is mounted ───────────
// const POLL_INTERVAL = 60_000;

// export default function AdminHeader({
//   onMenuClick,
//   isCollapsed,
//   onToggleCollapse,
// }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { adminInfo } = useSelector((s) => s.adminAuth);
//   const {
//     notifications,
//     unreadCount,
//     loading: notifLoading,
//   } = useSelector((s) => s.notifications);

//   const [isDark, setIsDark] = useState(() => {
//     const saved = localStorage.getItem("darkMode");
//     return saved ? JSON.parse(saved) : false;
//   });
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [search, setSearch] = useState("");

//   const notifRef = useRef(null);
//   const profileRef = useRef(null);

//   // ── Dark mode ──────────────────────────────────────────────────────────────
//   const toggleDarkMode = () => {
//     setIsDark((prev) => {
//       const next = !prev;
//       localStorage.setItem("darkMode", JSON.stringify(next));
//       document.documentElement.classList.toggle("dark", next);
//       return next;
//     });
//   };

//   // ── Outside-click close ────────────────────────────────────────────────────
//   useEffect(() => {
//     const close = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target))
//         setNotifOpen(false);
//       if (profileRef.current && !profileRef.current.contains(e.target))
//         setProfileOpen(false);
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   // ── Poll unread count ──────────────────────────────────────────────────────
//   useEffect(() => {
//     dispatch(fetchUnreadCount());
//     const id = setInterval(() => dispatch(fetchUnreadCount()), POLL_INTERVAL);
//     return () => clearInterval(id);
//   }, [dispatch]);

//   // ── Load notifications when panel opens ────────────────────────────────────
//   const handleToggleNotif = useCallback(() => {
//     setNotifOpen((v) => {
//       if (!v) dispatch(fetchNotifications({ limit: 10 }));
//       return !v;
//     });
//     setProfileOpen(false);
//   }, [dispatch]);

//   // ── Mark single read on click ──────────────────────────────────────────────
//   const handleNotifClick = (notif) => {
//     if (!notif.isRead) dispatch(markNotificationRead(notif._id));
//   };

//   // ── Mark all read ──────────────────────────────────────────────────────────
//   const handleMarkAllRead = (e) => {
//     e.stopPropagation();
//     dispatch(markAllNotificationsRead());
//   };

//   const handleLogout = () => {
//     dispatch(logoutUser());
//     navigate("/");
//     setProfileOpen(false);
//   };

//   const initials = adminInfo?.name
//     ? adminInfo.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .slice(0, 2)
//         .toUpperCase()
//     : "AD";

//   const crumbs = location.pathname
//     .split("/")
//     .filter(Boolean)
//     .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1));

//   // Clamp badge at 99+
//   const badgeLabel = unreadCount > 99 ? "99+" : unreadCount;

//   return (
//     <header className="h-[60px] bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-white/10 px-4 sm:px-5 flex items-center justify-between gap-3 flex-shrink-0 relative z-30 transition-colors duration-300">
//       {/* ── Left ─────────────────────────────────────────────────────────── */}
//       <div className="flex items-center gap-2 sm:gap-3">
//         {/* Mobile menu */}
//         <button
//           className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
//           onClick={onMenuClick}
//         >
//           <Menu className="w-4 h-4" />
//         </button>

//         {/* Desktop collapse */}
//         <button
//           className="hidden lg:flex w-8 h-8 items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
//           onClick={onToggleCollapse}
//         >
//           {isCollapsed ? (
//             <PanelLeftOpen className="w-4 h-4" />
//           ) : (
//             <PanelLeftClose className="w-4 h-4" />
//           )}
//         </button>

//         {/* Search */}
//         <div className="relative hidden sm:block">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
//           <input
//             placeholder="Search bookings, guests…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-navy-800 border border-gray-200 dark:border-white/10
//               text-navy-900 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/30
//               focus:border-gold-500/50 focus:outline-none transition-all duration-300 w-[200px] focus:w-[260px]"
//           />
//         </div>

//         {/* Breadcrumb */}
//         <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
//           {crumbs.map((c, i) => (
//             <React.Fragment key={i}>
//               {i > 0 && (
//                 <span className="text-gray-300 dark:text-white/15 text-[10px]">
//                   /
//                 </span>
//               )}
//               <span
//                 className={
//                   i === crumbs.length - 1
//                     ? "text-gold-500"
//                     : "text-gray-400 dark:text-white/40"
//                 }
//               >
//                 {c}
//               </span>
//             </React.Fragment>
//           ))}
//         </div>
//       </div>

//       {/* ── Right ────────────────────────────────────────────────────────── */}
//       <div className="flex items-center gap-1 sm:gap-2">
//         {/* Live pill */}
//         <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 dark:border-white/10 text-[9px] tracking-wider uppercase text-gray-400 dark:text-white/40">
//           <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//           Live
//         </div>

//         {/* Dark mode */}
//         <button
//           className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
//           onClick={toggleDarkMode}
//         >
//           {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//         </button>

//         {/* ── Notifications ──────────────────────────────────────────────── */}
//         <div ref={notifRef} className="relative">
//           <button
//             className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors relative"
//             onClick={handleToggleNotif}
//           >
//             <Bell className="w-4 h-4" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-navy-900">
//                 {badgeLabel}
//               </span>
//             )}
//           </button>

//           <AnimatePresence>
//             {notifOpen && (
//               <motion.div
//                 className="absolute top-full right-0 mt-2 w-[340px] bg-white dark:bg-navy-800 border border-gold-500/20 rounded-lg shadow-2xl z-[200] overflow-hidden"
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.18 }}
//               >
//                 {/* Header */}
//                 <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span className="font-heading text-sm font-bold text-navy-900 dark:text-white">
//                       Notifications
//                     </span>
//                     {unreadCount > 0 && (
//                       <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-full">
//                         {unreadCount} new
//                       </span>
//                     )}
//                   </div>
//                   {unreadCount > 0 && (
//                     <button
//                       onClick={handleMarkAllRead}
//                       className="text-[10px] text-gray-400 dark:text-white/30 hover:text-gold-500 uppercase tracking-wider transition-colors"
//                     >
//                       Mark all read
//                     </button>
//                   )}
//                 </div>

//                 {/* List */}
//                 <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
//                   {notifLoading && notifications.length === 0 ? (
//                     <div className="flex items-center justify-center py-10 gap-2 text-gray-400 dark:text-white/30">
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       <span className="text-xs">Loading…</span>
//                     </div>
//                   ) : notifications.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-10 gap-2">
//                       <CheckCircle className="w-8 h-8 text-gray-300 dark:text-white/20" />
//                       <span className="text-xs text-gray-400 dark:text-white/30">
//                         You're all caught up!
//                       </span>
//                     </div>
//                   ) : (
//                     notifications.map((n) => {
//                       const { Icon, color, bg, border } = notifMeta(n.event);
//                       return (
//                         <div
//                           key={n._id}
//                           onClick={() => handleNotifClick(n)}
//                           className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-gold-500/5
//                             ${!n.isRead ? "bg-gold-500/[0.03]" : ""}`}
//                         >
//                           {/* Icon */}
//                           <div
//                             className={`w-8 h-8 rounded-lg border ${bg} ${border} flex items-center justify-center flex-shrink-0 mt-0.5`}
//                           >
//                             <Icon className={`w-3.5 h-3.5 ${color}`} />
//                           </div>

//                           {/* Content */}
//                           <div className="flex-1 min-w-0">
//                             <p
//                               className={`text-xs leading-snug mb-0.5 ${!n.isRead ? "text-navy-900 dark:text-white font-medium" : "text-gray-600 dark:text-white/60"}`}
//                             >
//                               {n.message}
//                             </p>
//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] text-gray-400 dark:text-white/30">
//                                 {timeAgo(n.createdAt)}
//                               </span>
//                               {!n.isRead && (
//                                 <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })
//                   )}
//                 </div>

//                 {/* Footer */}
//                 <Link
//                   to="/admin/notifications"
//                   className="block px-4 py-2.5 text-center text-[10px] font-bold text-gold-500 hover:text-gold-400 hover:bg-gold-500/5 uppercase tracking-wider transition-colors border-t border-gray-200 dark:border-white/10"
//                   onClick={() => setNotifOpen(false)}
//                 >
//                   View All Notifications →
//                 </Link>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* ── Profile ────────────────────────────────────────────────────── */}
//         <div className="relative" ref={profileRef}>
//           <button
//             className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 dark:border-white/10 hover:border-gold-500/30 rounded-lg transition-colors"
//             onClick={() => {
//               setProfileOpen((v) => !v);
//               setNotifOpen(false);
//             }}
//           >
//             <div className="w-6 h-6 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center font-heading text-[10px] font-bold text-gold-500">
//               {initials}
//             </div>
//             <span className="hidden md:inline text-xs text-gray-600 dark:text-white/70">
//               {adminInfo?.name?.split(" ")[0] || "Admin"}
//             </span>
//             <ChevronDown className="w-3 h-3 text-gray-400 dark:text-white/30" />
//           </button>

//           <AnimatePresence>
//             {profileOpen && (
//               <motion.div
//                 className="absolute top-full right-0 mt-2 w-[220px] bg-white dark:bg-navy-800 border border-gold-500/20 rounded-lg shadow-2xl z-[200] overflow-hidden"
//                 initial={{ opacity: 0, y: -8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -8 }}
//                 transition={{ duration: 0.18 }}
//               >
//                 <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
//                   <div className="font-heading text-sm font-bold text-navy-900 dark:text-white">
//                     {adminInfo?.name || adminInfo?.username || "Administrator"}
//                   </div>
//                   <div className="text-[10px] text-gray-400 dark:text-white/30 truncate">
//                     {adminInfo?.email || "admin@dubanhotel.com"}
//                   </div>
//                 </div>
//                 <div className="py-1">
//                   <Link
//                     to="/admin/profile"
//                     className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 dark:text-white/70 hover:text-gold-500 hover:bg-gold-500/5 transition-colors"
//                     onClick={() => setProfileOpen(false)}
//                   >
//                     <User className="w-3.5 h-3.5 opacity-70" /> My Profile
//                   </Link>
//                   <Link
//                     to="/admin/settings"
//                     className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 dark:text-white/70 hover:text-gold-500 hover:bg-gold-500/5 transition-colors"
//                     onClick={() => setProfileOpen(false)}
//                   >
//                     <Settings className="w-3.5 h-3.5 opacity-70" /> Settings
//                   </Link>
//                   <div className="h-px bg-gray-200 dark:bg-white/5 my-1" />
//                   <button
//                     className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full text-left"
//                     onClick={handleLogout}
//                   >
//                     <LogOut className="w-3.5 h-3.5 opacity-70" /> Sign Out
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </header>
//   );
// }
// src/components/admin/AdminHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import NotificationBell from "../NotificationBelll";
import { adminLogout } from "../../features/Auth/AdminAuth/adminAuthActions";

export default function AdminHeader({
  onMenuClick,
  isCollapsed,
  onToggleCollapse,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { adminInfo } = useSelector((s) => s.adminAuth);
  const { unreadCount } = useSelector((s) => s.notifications);

  const [isDark, setIsDark] = useState(() =>
    JSON.parse(localStorage.getItem("darkMode") || "false"),
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [hasNew, setHasNew] = useState(false);
  const prevCount = useRef(0);
  const profileRef = useRef(null);

  // Detect count increase for pulse ring
  useEffect(() => {
    if (prevCount.current !== 0 && unreadCount > prevCount.current)
      setHasNew(true);
    prevCount.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", JSON.stringify(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/");
    setProfileOpen(false);
  };

  const initials = adminInfo?.name
    ? adminInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  const crumbs = location.pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  return (
    <header className="h-[60px] bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-white/10 px-4 sm:px-5 flex items-center justify-between gap-3 flex-shrink-0 relative z-30 transition-colors duration-300">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-8 h-8 items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
          <input
            placeholder="Search bookings, guests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-gray-100 dark:bg-navy-800 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-gold-500/50 focus:outline-none transition-all w-[200px] focus:w-[260px]"
          />
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-[11px]">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="text-gray-300 dark:text-white/15 text-[10px]">
                  /
                </span>
              )}
              <span
                className={
                  i === crumbs.length - 1
                    ? "text-gold-500"
                    : "text-gray-400 dark:text-white/40"
                }
              >
                {c}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 dark:border-white/10 text-[9px] tracking-wider uppercase text-gray-400 dark:text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </div>

        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Bell — fully self-contained, just pass path + hasNew */}
        <NotificationBell
          notificationsPath="/admin/notifications"
          dropdownAlign="right"
          hasNew={hasNew}
        />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 border border-gray-200 dark:border-white/10 hover:border-gold-500/30 rounded-lg transition-colors"
          >
            <div className="w-6 h-6 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center font-heading text-[10px] font-bold text-gold-500">
              {initials}
            </div>
            <span className="hidden md:inline text-xs text-gray-600 dark:text-white/70">
              {adminInfo?.name?.split(" ")[0] || "Admin"}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 dark:text-white/30" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                className="absolute top-full right-0 mt-2 w-[220px] bg-white dark:bg-navy-800 border border-gold-500/20 rounded-xl shadow-2xl z-[200] overflow-hidden"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.17 }}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10">
                  <div className="font-heading text-sm font-bold text-navy-900 dark:text-white">
                    {adminInfo?.name || adminInfo?.username || "Administrator"}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-white/30 truncate">
                    {adminInfo?.email || "admin@dubanhotel.com"}
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 dark:text-white/70 hover:text-gold-500 hover:bg-gold-500/5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 opacity-70" /> My Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-600 dark:text-white/70 hover:text-gold-500 hover:bg-gold-500/5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 opacity-70" /> Settings
                  </Link>
                  <div className="h-px bg-gray-200 dark:bg-white/5 my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 opacity-70" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
