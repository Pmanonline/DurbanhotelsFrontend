import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Info,
  Shield,
  CheckCheck,
  Check,
  Trash2,
  Filter,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Calendar,
  DoorOpen,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../features/notification&log/Notificationslice";

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "hotel", label: "Hotel & Bookings", icon: BedDouble },
  { key: "restaurant", label: "Food & Restaurant", icon: UtensilsCrossed },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

// Events that belong to the restaurant tab
const RESTAURANT_EVENTS = [
  "NEW_ORDER",
  "ORDER_STATUS_CHANGED",
  "ORDER_CANCELLED",
  "PAYMENT_RECEIVED",
  "PAYMENT_STATUS_CHANGED",
  "MENU_CREATED",
  "MENU_UPDATED",
  "MENU_DELETED",
  "MENU_PUBLISHED",
  "MENU_UNPUBLISHED",
  "CATEGORY_ADDED",
  "CATEGORY_UPDATED",
  "CATEGORY_DELETED",
  "SUBCATEGORY_ADDED",
  "SUBCATEGORY_UPDATED",
  "SUBCATEGORY_DELETED",
  "ITEM_ADDED",
  "ITEM_UPDATED",
  "ITEM_DELETED",
  "ITEM_TOGGLED",
];

// Events that belong to the hotel tab
const HOTEL_EVENTS = [
  "NEW_BOOKING",
  "BOOKING_CONFIRMED",
  "BOOKING_CANCELLED",
  "BOOKING_CHECKED_IN",
  "BOOKING_CHECKED_OUT",
  "BOOKING_MODIFIED",
  "BOOKING_PAYMENT_RECEIVED",
  "BOOKING_REMINDER",
  "ROOM_AVAILABILITY_CHANGED",
];

function isRestaurantEvent(event = "") {
  return RESTAURANT_EVENTS.some((e) => event.toUpperCase().includes(e));
}

function isHotelEvent(event = "") {
  return HOTEL_EVENTS.some((e) => event.toUpperCase().includes(e));
}

// ── Visual metadata per event ─────────────────────────────────────────────────

function notifMeta(event = "") {
  const e = event.toUpperCase();

  // Restaurant events
  if (e.includes("NEW_ORDER"))
    return {
      Icon: ShoppingBag,
      iconColor: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      tag: "New Order",
      tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  if (e.includes("ORDER_CANCELLED"))
    return {
      Icon: AlertTriangle,
      iconColor: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      tag: "Cancelled",
      tagColor: "bg-red-500/10 text-red-600 dark:text-red-400",
    };
  if (e.includes("ORDER_STATUS"))
    return {
      Icon: UtensilsCrossed,
      iconColor: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      tag: "Order Update",
      tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  if (e.includes("PAYMENT"))
    return {
      Icon: CreditCard,
      iconColor: "text-gold-500",
      bg: "bg-gold-500/10",
      border: "border-gold-500/20",
      tag: "Payment",
      tagColor: "bg-gold-500/10 text-yellow-700 dark:text-gold-400",
    };
  if (e.includes("MENU") || e.includes("ITEM") || e.includes("CATEGORY"))
    return {
      Icon: UtensilsCrossed,
      iconColor: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      tag: "Menu",
      tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    };

  // Hotel booking events
  if (e.includes("NEW_BOOKING"))
    return {
      Icon: BedDouble,
      iconColor: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      tag: "New Booking",
      tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  if (e.includes("BOOKING_CONFIRMED"))
    return {
      Icon: CheckCircle,
      iconColor: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      tag: "Confirmed",
      tagColor: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
  if (e.includes("BOOKING_CANCELLED"))
    return {
      Icon: AlertTriangle,
      iconColor: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      tag: "Cancelled",
      tagColor: "bg-red-500/10 text-red-600 dark:text-red-400",
    };
  if (e.includes("BOOKING_CHECKED_IN"))
    return {
      Icon: LogIn,
      iconColor: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      tag: "Checked In",
      tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    };
  if (e.includes("BOOKING_CHECKED_OUT"))
    return {
      Icon: LogOut,
      iconColor: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      tag: "Checked Out",
      tagColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    };
  if (e.includes("BOOKING_MODIFIED"))
    return {
      Icon: Edit,
      iconColor: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      tag: "Modified",
      tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  if (e.includes("BOOKING_PAYMENT_RECEIVED"))
    return {
      Icon: CreditCard,
      iconColor: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      tag: "Payment",
      tagColor: "bg-green-500/10 text-green-600 dark:text-green-400",
    };
  if (e.includes("BOOKING_REMINDER"))
    return {
      Icon: Clock,
      iconColor: "text-cyan-500",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      tag: "Reminder",
      tagColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    };
  if (e.includes("ROOM_AVAILABILITY"))
    return {
      Icon: DoorOpen,
      iconColor: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      tag: "Room Status",
      tagColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    };

  // Auth events
  if (e.includes("USER") || e.includes("PASSWORD"))
    return {
      Icon: Shield,
      iconColor: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      tag: "Auth",
      tagColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    };

  // Default
  return {
    Icon: Info,
    iconColor: "text-gray-400",
    bg: "bg-gray-100 dark:bg-white/5",
    border: "border-gray-200 dark:border-white/10",
    tag: "System",
    tagColor: "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40",
  };
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

const PAGE_SIZE = 15;

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ tab, filter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center">
        <Inbox className="w-7 h-7 text-gray-300 dark:text-white/20" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-navy-900 dark:text-white/60">
          {filter === "unread" ? "All caught up!" : "No notifications"}
        </p>
        <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
          {filter === "unread"
            ? `No unread ${tab === "hotel" ? "hotel" : "restaurant"} notifications`
            : `No ${tab === "hotel" ? "hotel & booking" : "food & restaurant"} notifications yet`}
        </p>
      </div>
    </motion.div>
  );
}

// ── Notification row ──────────────────────────────────────────────────────────
function NotifRow({ notif, onRead, onDelete, index }) {
  const [deleting, setDeleting] = useState(false);
  const { Icon, iconColor, bg, border, tag, tagColor } = notifMeta(notif.event);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setDeleting(true);
    await onDelete(notif._id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: deleting ? 0 : 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ delay: index * 0.03, duration: 0.22 }}
      onClick={() => !notif.isRead && onRead(notif._id)}
      className={`group relative flex gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]
        transition-all duration-200 cursor-pointer select-none
        hover:bg-gold-500/[0.04] dark:hover:bg-white/[0.03]
        ${!notif.isRead ? "bg-gold-500/[0.025]" : ""}`}
    >
      {/* Unread bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-r transition-all duration-300
          ${!notif.isRead ? "bg-gold-500" : "bg-transparent"}`}
      />

      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl border ${bg} ${border} flex items-center justify-center flex-shrink-0 mt-0.5`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm leading-snug
            ${
              !notif.isRead
                ? "font-semibold text-navy-900 dark:text-white"
                : "font-normal text-gray-600 dark:text-white/55"
            }`}
          >
            {notif.message}
          </p>

          {/* Actions — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
            {!notif.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRead(notif._id);
                }}
                title="Mark as read"
                className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleDelete}
              title="Delete"
              className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide ${tagColor}`}
          >
            {tag}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-white/30">
            {timeAgo(notif.createdAt)}
          </span>
          {!notif.isRead && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-gold-500">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              New
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminNotifications() {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, pagination } = useSelector(
    (s) => s.notifications,
  );

  const [activeTab, setActiveTab] = useState("hotel");
  const [activeFilter, setActiveFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // ── Fetch on tab / filter / page change ──────────────────────────────────
  const load = useCallback(
    (pg = 1) => {
      const params = { page: pg, limit: PAGE_SIZE };
      if (activeFilter === "unread") params.isRead = false;
      if (activeFilter === "read") params.isRead = true;
      dispatch(fetchNotifications(params));
    },
    [dispatch, activeFilter],
  );

  useEffect(() => {
    setPage(1);
    load(1);
  }, [activeTab, activeFilter, load]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications({ page, limit: PAGE_SIZE }));
    setRefreshing(false);
  };

  const handleRead = (id) => dispatch(markNotificationRead(id));
  const handleDelete = (id) => dispatch(deleteNotification(id));
  const handleMarkAllRead = () => dispatch(markAllNotificationsRead());

  const handlePage = (dir) => {
    const next = page + dir;
    if (next < 1 || next > pagination.pages) return;
    setPage(next);
    load(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Client-side tab split
  const tabFiltered = notifications.filter((n) =>
    activeTab === "restaurant"
      ? isRestaurantEvent(n.event)
      : !isRestaurantEvent(n.event),
  );

  // Counts for tab badges
  const hotelUnread = notifications.filter(
    (n) => isHotelEvent(n.event) && !n.isRead,
  ).length;
  const restaurantUnread = notifications.filter(
    (n) => isRestaurantEvent(n.event) && !n.isRead,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 p-4 sm:p-6 lg:p-8">
      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:border-gold-500/30 hover:text-gold-500 rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-gold-500 hover:bg-gold-400 rounded-lg transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main card ────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        {/* ── Tab bar ────────────────────────────────────────────────────── */}
        <div className="flex border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-navy-900/50">
          {TABS.map(({ key, label, icon: Icon }) => {
            const badge = key === "hotel" ? hotelUnread : restaurantUnread;
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setActiveFilter("all");
                }}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "text-gold-500 border-b-2 border-gold-500 bg-white dark:bg-navy-800"
                      : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60 border-b-2 border-transparent"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {key === "hotel" ? "Hotel" : "Food"}
                </span>
                {badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                    ${active ? "bg-gold-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Filter row ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 dark:border-white/[0.06] bg-white dark:bg-navy-800">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
            <div className="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-white/5 rounded-lg">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all
                    ${
                      activeFilter === key
                        ? "bg-white dark:bg-navy-700 text-navy-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60"
                    }`}
                >
                  {label}
                  {key === "unread" && unreadCount > 0 && (
                    <span className="ml-1 text-[9px] font-bold text-gold-500">
                      ({unreadCount})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-gray-400 dark:text-white/30">
            {tabFiltered.length} shown
          </span>
        </div>

        {/* ── Notifications list ──────────────────────────────────────────── */}
        {loading && tabFiltered.length === 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/5 flex-shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-100 dark:bg-white/[0.03] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : tabFiltered.length === 0 ? (
          <EmptyState tab={activeTab} filter={activeFilter} />
        ) : (
          <AnimatePresence mode="popLayout">
            <div>
              {tabFiltered.map((n, i) => (
                <NotifRow
                  key={n._id}
                  notif={n}
                  index={i}
                  onRead={handleRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-white/[0.06]">
            <p className="text-xs text-gray-400 dark:text-white/30">
              Page {pagination.page} of {pagination.pages} · {pagination.total}{" "}
              total
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePage(-1)}
                disabled={page <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-gold-500/40 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {/* Page numbers */}
              {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => {
                      setPage(pg);
                      load(pg);
                    }}
                    className={`w-8 h-8 text-xs font-medium rounded-lg border transition-colors
                      ${
                        pg === page
                          ? "bg-gold-500 border-gold-500 text-white"
                          : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-gold-500/40 hover:text-gold-500"
                      }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => handlePage(1)}
                disabled={page >= pagination.pages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-gold-500/40 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
