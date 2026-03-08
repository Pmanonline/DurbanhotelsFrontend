import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BedDouble,
  CalendarCheck,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  UtensilsCrossed,
  Star,
  Percent,
  Calendar,
  Coffee,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Info,
  Shield,
  Activity,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { fetchActivityLogs } from "../../features/notification&log/Activitylogslice";
import { fetchNotifications } from "../../features/notification&log/Notificationslice";

// ── Static / mock data (replace with real API slices as they're built) ────────
const STATS = [
  {
    title: "Total Bookings",
    value: "148",
    change: "+12",
    trend: "up",
    icon: CalendarCheck,
    color: "gold",
  },
  {
    title: "Occupancy",
    value: "76%",
    change: "+4",
    trend: "up",
    icon: BedDouble,
    color: "blue",
  },
  {
    title: "Revenue",
    value: "₦4.2M",
    change: "+8",
    trend: "up",
    icon: TrendingUp,
    color: "green",
  },
  {
    title: "Guests",
    value: "86",
    change: "-3",
    trend: "down",
    icon: Users,
    color: "purple",
  },
  {
    title: "Avg. Rating",
    value: "4.7",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "gold",
  },
  {
    title: "F&B Orders",
    value: "32",
    change: "+6",
    trend: "up",
    icon: Coffee,
    color: "orange",
  },
];

const UPCOMING = [
  {
    id: 1,
    guest: "Ngozi Eze",
    room: "Standard 308",
    checkIn: "Today, 14:00",
    checkOut: "01 Mar",
    status: "pending",
  },
  {
    id: 2,
    guest: "Tunde Adeyemi",
    room: "Executive 202",
    checkIn: "Today, 16:00",
    checkOut: "26 Feb",
    status: "confirmed",
  },
  {
    id: 3,
    guest: "Funke Balogun",
    room: "Deluxe 115",
    checkIn: "Tomorrow, 12:00",
    checkOut: "02 Mar",
    status: "confirmed",
  },
  {
    id: 4,
    guest: "Emeka Peters",
    room: "Executive 305",
    checkIn: "28 Feb, 14:00",
    checkOut: "02 Mar",
    status: "pending",
  },
];

const ROOM_STATUS = [
  { number: "101", status: "available", type: "standard" },
  { number: "102", status: "occupied", type: "standard", guest: "Mr. Johnson" },
  { number: "103", status: "available", type: "standard" },
  { number: "104", status: "cleaning", type: "standard" },
  { number: "105", status: "occupied", type: "deluxe", guest: "Dr. Adebayo" },
  { number: "106", status: "reserved", type: "deluxe", guest: "Mrs. Obi" },
  {
    number: "201",
    status: "occupied",
    type: "executive",
    guest: "Chief Okonkwo",
  },
  { number: "202", status: "available", type: "executive" },
  { number: "203", status: "occupied", type: "deluxe", guest: "Mr. Ibrahim" },
  {
    number: "204",
    status: "occupied",
    type: "executive",
    guest: "Mrs. Okafor",
  },
  { number: "205", status: "reserved", type: "deluxe" },
  { number: "206", status: "cleaning", type: "standard" },
];

const QUICK_ACTIONS = [
  {
    icon: CalendarCheck,
    label: "New Booking",
    to: "/admin/bookings/new",
    color: "gold",
  },
  { icon: BedDouble, label: "Add Room", to: "/admin/rooms/add", color: "blue" },
  {
    icon: UtensilsCrossed,
    label: "Food Orders",
    to: "/admin/menu/orders",
    color: "orange",
  },
  {
    icon: Percent,
    label: "Promotions",
    to: "/admin/promotions",
    color: "purple",
  },
  { icon: Users, label: "Add Guest", to: "/admin/guests/add", color: "green" },
  {
    icon: Calendar,
    label: "Block Dates",
    to: "/admin/availability/block",
    color: "red",
  },
];

const STATUS_STYLES = {
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  pending: "bg-gold-500/10 text-gold-500 border-gold-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  available: "bg-green-500/10 text-green-500 border-green-500/20",
  occupied: "bg-gold-500/10 text-gold-500 border-gold-500/20",
  reserved: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  cleaning: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

// ── Activity log helpers ───────────────────────────────────────────────────────
function logMeta(action = "", severity = "info") {
  if (action.includes("ORDER_CANCELLED") || severity === "critical")
    return {
      Icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  if (action.includes("ORDER_CREATED") || action.includes("NEW_ORDER"))
    return {
      Icon: ShoppingBag,
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    };
  if (action.includes("ORDER_STATUS"))
    return {
      Icon: UtensilsCrossed,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  if (action.includes("PAYMENT"))
    return {
      Icon: CreditCard,
      color: "text-gold-500",
      bg: "bg-gold-500/10",
      border: "border-gold-500/20",
    };
  if (action.includes("BOOKING"))
    return {
      Icon: CalendarCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    };
  if (action.includes("ROOM") || action.includes("STATUS"))
    return {
      Icon: BedDouble,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    };
  if (
    action.includes("MENU") ||
    action.includes("ITEM") ||
    action.includes("CATEGORY")
  )
    return {
      Icon: UtensilsCrossed,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    };
  if (action.includes("USER") || action.includes("PASSWORD"))
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

const SEVERITY_BADGE = {
  info: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
  warning: "bg-gold-500/10 text-gold-500",
  critical: "bg-red-500/10 text-red-500",
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Notification helpers ──────────────────────────────────────────────────────
function notifMeta(event = "") {
  const e = event.toUpperCase();
  if (e.includes("NEW_ORDER") || e.includes("ORDER_CREATED"))
    return { Icon: ShoppingBag, color: "text-green-500" };
  if (e.includes("ORDER_CANCELLED") || e.includes("BOOKING_CANCELLED"))
    return { Icon: AlertTriangle, color: "text-red-500" };
  if (e.includes("ORDER_STATUS") || e.includes("BOOKING_MODIFIED"))
    return { Icon: Clock, color: "text-blue-500" };
  if (e.includes("PAYMENT") || e.includes("PAYMENT_RECEIVED"))
    return { Icon: CreditCard, color: "text-gold-500" };
  if (e.includes("NEW_BOOKING") || e.includes("BOOKING_CONFIRMED"))
    return { Icon: CalendarCheck, color: "text-purple-500" };
  if (e.includes("BOOKING_CHECKED_IN"))
    return { Icon: CheckCircle, color: "text-green-500" };
  if (e.includes("BOOKING_CHECKED_OUT"))
    return { Icon: XCircle, color: "text-orange-500" };
  return { Icon: Info, color: "text-gray-400" };
}

// ═════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const { logs, loading: logsLoading } = useSelector((s) => s.activityLog);
  const { notifications, loading: notifLoading } = useSelector(
    (s) => s.notifications,
  );

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchActivityLogs({ limit: 8, page: 1 }));
    dispatch(fetchNotifications({ limit: 6, page: 1 }));
  }, [dispatch]);

  const handleRefreshLogs = () =>
    dispatch(fetchActivityLogs({ limit: 8, page: 1 }));

  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 p-4 sm:p-6 lg:p-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gold-500 text-xs font-bold tracking-[0.3em] uppercase">
                DubanInternational Hotel
              </span>
              <span className="w-1 h-1 rounded-full bg-gold-500/50" />
              <span className="text-xs text-gray-400 dark:text-white/30">
                Admin Portal
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
              {greeting}, Administrator
            </h1>
            <p className="text-sm text-gray-400 dark:text-white/30 mt-1">
              {dateStr}
            </p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 rounded-lg">
            {["day", "week", "month"].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-4 py-2 text-xs font-medium rounded-md transition-all capitalize
                  ${
                    selectedPeriod === p
                      ? "bg-gold-500 text-white shadow-gold-glow"
                      : "text-gray-400 dark:text-white/40 hover:text-gold-500"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group relative bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 hover:border-gold-500/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 group-hover:bg-gold-500/[0.03] transition-all duration-500" />
              <div className="relative p-4 flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
                >
                  <action.icon className={`w-5 h-5 text-${action.color}-500`} />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-white/70 group-hover:text-gold-500 transition-colors">
                  {action.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-5 hover:border-gold-500/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/30 flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
              >
                {stat.change}%
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1">
              {stat.title}
            </p>
            <p className="font-heading text-2xl font-bold text-navy-900 dark:text-white">
              {stat.value}
            </p>
            <div className="flex items-center gap-1 mt-2">
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500" />
              )}
              <span className="text-xs text-gray-400 dark:text-white/30">
                vs last {selectedPeriod}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left column (spans 2) ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Log ─────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold-500" />
                <div>
                  <h2 className="font-heading text-lg font-bold text-navy-900 dark:text-white leading-none">
                    Activity Log
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                    Real-time system actions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshLogs}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${logsLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <Link
                  to="/admin/activity-logs"
                  className="flex items-center gap-1 text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Log rows */}
            {logsLoading && logs.length === 0 ? (
              <div className="flex items-center justify-center py-16 gap-2 text-gray-400 dark:text-white/30">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading activity logs…</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Activity className="w-8 h-8 text-gray-300 dark:text-white/15" />
                <span className="text-sm text-gray-400 dark:text-white/30">
                  No activity yet
                </span>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {logs.map((log) => {
                  const { Icon, color, bg, border } = logMeta(
                    log.action,
                    log.severity,
                  );
                  return (
                    <div
                      key={log._id}
                      className="flex gap-3 px-6 py-3.5 hover:bg-gold-500/[0.03] transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className={`w-8 h-8 rounded-lg border ${bg} ${border} flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-navy-900 dark:text-white/80 leading-snug">
                          {log.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {log.performedByName && (
                            <span className="text-[10px] font-medium text-gray-500 dark:text-white/40">
                              by {log.performedByName}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 dark:text-white/25">
                            {timeAgo(log.createdAt)}
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${SEVERITY_BADGE[log.severity] || SEVERITY_BADGE.info}`}
                          >
                            {log.severity}
                          </span>
                        </div>
                      </div>

                      {/* Resource tag */}
                      {log.resourceType && (
                        <span className="self-start text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30 rounded uppercase tracking-wide flex-shrink-0 mt-0.5">
                          {log.resourceType}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Room Status ───────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-900 dark:text-white">
                  Room Status
                </h2>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                  Live room availability overview
                </p>
              </div>
              <Link
                to="/admin/availability"
                className="flex items-center gap-1 text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors"
              >
                Manage <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-4">
                {["available", "occupied", "reserved", "cleaning"].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${s === "available" ? "bg-green-500" : s === "occupied" ? "bg-gold-500" : s === "reserved" ? "bg-blue-500" : "bg-purple-500"}`}
                    />
                    <span className="text-xs text-gray-400 dark:text-white/30 capitalize">
                      {s} ({ROOM_STATUS.filter((r) => r.status === s).length})
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {ROOM_STATUS.map((room) => (
                  <div
                    key={room.number}
                    className={`group relative p-2 border rounded-lg text-center cursor-default transition-all
                      ${room.status === "available" ? "border-green-500/30 bg-green-500/5 hover:border-green-500" : ""}
                      ${room.status === "occupied" ? "border-gold-500/30 bg-gold-500/5 hover:border-gold-500" : ""}
                      ${room.status === "reserved" ? "border-blue-500/30 bg-blue-500/5 hover:border-blue-500" : ""}
                      ${room.status === "cleaning" ? "border-purple-500/30 bg-purple-500/5 hover:border-purple-500" : ""}`}
                  >
                    <span
                      className={`text-xs font-bold
                      ${room.status === "available" ? "text-green-500" : ""}
                      ${room.status === "occupied" ? "text-gold-500" : ""}
                      ${room.status === "reserved" ? "text-blue-500" : ""}
                      ${room.status === "cleaning" ? "text-purple-500" : ""}`}
                    >
                      {room.number}
                    </span>
                    {room.guest && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-navy-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {room.guest}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right column ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Live Notifications feed ───────────────────────────────────── */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-navy-900 dark:text-white">
                  Notifications
                </h2>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                  Latest alerts
                </p>
              </div>
              <Link
                to="/admin/notifications"
                className="flex items-center gap-1 text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors"
              >
                All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[320px] overflow-y-auto">
              {notifLoading && notifications.length === 0 ? (
                <div className="flex items-center justify-center py-10 gap-2 text-gray-400 dark:text-white/30">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Loading…</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-1">
                  <span className="text-xs text-gray-400 dark:text-white/30">
                    No notifications
                  </span>
                </div>
              ) : (
                notifications.slice(0, 6).map((n) => {
                  const { Icon, color } = notifMeta(n.event);
                  return (
                    <div
                      key={n._id}
                      className={`flex gap-3 px-4 py-3 hover:bg-gold-500/5 transition-colors ${!n.isRead ? "bg-gold-500/[0.02]" : ""}`}
                    >
                      <Icon
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs leading-snug ${!n.isRead ? "text-navy-900 dark:text-white font-medium" : "text-gray-500 dark:text-white/50"}`}
                        >
                          {n.message}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400 dark:text-white/25">
                            {timeAgo(n.createdAt)}
                          </span>
                          {!n.isRead && (
                            <span className="w-1 h-1 rounded-full bg-gold-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Arrivals ─────────────────────────────────────────── */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
              <h2 className="font-heading text-lg font-bold text-navy-900 dark:text-white">
                Upcoming Arrivals
              </h2>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                Today's expected check-ins
              </p>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[280px] overflow-y-auto">
              {UPCOMING.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-4 hover:bg-gold-500/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-navy-900 dark:text-white">
                        {item.guest}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
                        {item.room} · Check-in: {item.checkIn}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/30">
                        Check-out: {item.checkOut}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-1 rounded-full border ${STATUS_STYLES[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10">
              <Link
                to="/admin/bookings"
                className="flex items-center justify-center gap-2 text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors w-full"
              >
                View All Bookings <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Today's Summary ────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10">
              <h2 className="font-heading text-lg font-bold text-navy-900 dark:text-white">
                Today's Summary
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  label: "Check-ins Today",
                  value: "12",
                  color: "text-green-500",
                },
                {
                  label: "Check-outs Today",
                  value: "8",
                  color: "text-gold-500",
                },
                {
                  label: "Room Service Orders",
                  value: "24",
                  color: "text-blue-500",
                },
                {
                  label: "Pending Requests",
                  value: "6",
                  color: "text-orange-500",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-400 dark:text-white/30">
                    {row.label}
                  </span>
                  <span
                    className={`font-heading text-xl font-bold ${row.color}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 dark:text-white/30">
                    Today's Revenue
                  </span>
                  <span className="text-sm font-bold text-gold-500">
                    ₦842,500
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full" />
                </div>
                <p className="text-xs text-gray-400 dark:text-white/30 mt-2">
                  75% of daily target (₦1.12M)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
