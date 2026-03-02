// src/components/NotificationBell.jsx
import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  UtensilsCrossed,
  CreditCard,
  AlertTriangle,
  Info,
  Shield,
  BedDouble,
  CheckCheck,
  Check,
  Trash2,
  Loader2,
  Inbox,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../features/notification&log/Notificationslice";
import { useClickOutside } from "../components/useClickOutside";

// ── Helpers ───────────────────────────────────────────────────────────────────
function notifMeta(event = "") {
  const e = event.toUpperCase();
  if (e.includes("ORDER_CREATED"))
    return {
      Icon: ShoppingBag,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
  if (e.includes("ORDER_CANCELLED"))
    return {
      Icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  if (e.includes("ORDER_STATUS"))
    return {
      Icon: UtensilsCrossed,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  if (e.includes("PAYMENT"))
    return {
      Icon: CreditCard,
      color: "text-gold-500",
      bg: "bg-gold-500/10",
      border: "border-gold-500/20",
    };
  if (e.includes("MENU") || e.includes("ITEM") || e.includes("CATEGORY"))
    return {
      Icon: UtensilsCrossed,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    };
  if (e.includes("BOOKING"))
    return {
      Icon: BedDouble,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  if (e.includes("USER") || e.includes("PASSWORD"))
    return {
      Icon: Shield,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    };
  return {
    Icon: Info,
    color: "text-gray-400",
    bg: "bg-gray-100 dark:bg-white/5",
    border: "border-gray-200 dark:border-white/10",
  };
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Props ─────────────────────────────────────────────────────────────────────
/**
 * NotificationBell
 *
 * @param {string}  notificationsPath  - Route to full notifications page (default: "/notifications")
 * @param {string}  buttonClassName    - Extra classes for the trigger button
 * @param {string}  dropdownAlign      - "right" | "left" (default: "right")
 * @param {boolean} hasNew             - Drives the pulse ring (pass from parent or NotificationProvider)
 */
export default function NotificationBell({
  notificationsPath = "/notifications",
  buttonClassName = "",
  dropdownAlign = "right",
  hasNew = false,
}) {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(
    (s) => s.notifications,
  );

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click — if you don't have this hook, use the inline useEffect pattern
  useClickOutside(ref, () => setOpen(false));

  const toggle = useCallback(() => {
    setOpen((v) => {
      if (!v) dispatch(fetchNotifications({ limit: 8 }));
      return !v;
    });
  }, [dispatch]);

  const handleRead = (id) => dispatch(markNotificationRead(id));
  const handleDelete = (id) => dispatch(deleteNotification(id));
  const handleMarkAll = (e) => {
    e.stopPropagation();
    dispatch(markAllNotificationsRead());
  };

  const badge = unreadCount > 99 ? "99+" : unreadCount;
  const alignClass = dropdownAlign === "left" ? "left-0" : "right-0";

  return (
    <div ref={ref} className="relative">
      {/* ── Bell trigger ───────────────────────────────────────────────── */}
      <button
        onClick={toggle}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors
          ${open ? "text-gold-500 bg-gold-500/10" : "text-gray-500 dark:text-white/60 hover:text-gold-500 hover:bg-gold-500/10"}
          ${buttonClassName}`}
      >
        {/* Pulse ring when new notifications arrive */}
        {hasNew && !open && (
          <span className="absolute inset-0 rounded-lg animate-ping bg-gold-500/20 pointer-events-none" />
        )}

        <Bell className="w-[18px] h-[18px] relative z-[1]" />

        {/* Badge */}
        {unreadCount > 0 && (
          <motion.span
            key={unreadCount}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-0.5 bg-red-500 rounded-full text-[8px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-gray-900 z-10 leading-none"
          >
            {badge}
          </motion.span>
        )}
      </button>

      {/* ── Dropdown ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className={`absolute top-full ${alignClass} mt-2 w-[340px] max-w-[calc(100vw-2rem)]
              bg-white dark:bg-navy-800 border border-gold-500/20 rounded-xl shadow-2xl z-[200] overflow-hidden`}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.17, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-navy-900 dark:text-white">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full">
                    {badge} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/30 hover:text-gold-500 uppercase tracking-wider transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-12 gap-2 text-gray-400 dark:text-white/30">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Loading…</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <Inbox className="w-5 h-5 text-gray-300 dark:text-white/20" />
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/30">
                    All caught up!
                  </span>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map((n) => {
                    const { Icon, color, bg, border } = notifMeta(n.event);
                    return (
                      <motion.div
                        key={n._id}
                        layout
                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                        onClick={() => !n.isRead && handleRead(n._id)}
                        className={`group relative flex gap-3 px-4 py-3.5 cursor-pointer transition-colors
                          hover:bg-gold-500/[0.04] ${!n.isRead ? "bg-gold-500/[0.025]" : ""}`}
                      >
                        {/* Unread strip */}
                        <div
                          className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-r transition-colors
                          ${!n.isRead ? "bg-gold-500" : "bg-transparent"}`}
                        />

                        {/* Icon */}
                        <div
                          className={`w-8 h-8 rounded-lg border ${bg} ${border} flex items-center justify-center flex-shrink-0 mt-0.5`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs leading-snug
                            ${!n.isRead ? "font-semibold text-navy-900 dark:text-white" : "text-gray-500 dark:text-white/50"}`}
                          >
                            {n.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400 dark:text-white/25">
                              {timeAgo(n.createdAt)}
                            </span>
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-center">
                          {!n.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRead(n._id);
                              }}
                              title="Mark as read"
                              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(n._id);
                            }}
                            title="Delete"
                            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <Link
              to={notificationsPath}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 px-4 py-3 text-[11px] font-bold text-gold-500 hover:text-gold-400 hover:bg-gold-500/5 uppercase tracking-wider transition-colors border-t border-gray-200 dark:border-white/10"
            >
              View all notifications →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
