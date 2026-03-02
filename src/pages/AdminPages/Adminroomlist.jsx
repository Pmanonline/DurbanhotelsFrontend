import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../components/Toast";
import {
  fetchAllRoomsAdmin,
  deleteRoom,
  togglePublishRoom,
  updateRoomStatus,
  clearRoomError,
  clearRoomSuccess,
} from "../../features/Room/Roomslice";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Globe,
  Lock,
  RefreshCw,
  AlertTriangle,
  X,
  CheckCircle,
  ExternalLink,
  BedDouble,
  Users,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Wrench,
  CircleDot,
  CheckCheck,
  Filter,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  available: { label: "Available", color: "green", icon: CheckCheck },
  occupied: { label: "Occupied", color: "blue", icon: CircleDot },
  maintenance: { label: "Maintenance", color: "orange", icon: Wrench },
  reserved: { label: "Reserved", color: "purple", icon: Star },
};

const CATEGORY_ICON = {
  Executive: "👑",
  Deluxe: "💎",
  "Imperial Suite": "🏅",
  "Annex - Classic": "🏠",
  "Annex - Studio": "🏡",
  "Superior Twin": "🛎️",
};

const STATUS_COLORS = {
  green: "border-green-500/30 bg-green-500/10 text-green-500",
  blue: "border-blue-500/30 bg-blue-500/10 text-blue-500",
  orange: "border-orange-500/30 bg-orange-500/10 text-orange-500",
  purple: "border-purple-500/30 bg-purple-500/10 text-purple-500",
};

// All known categories — static so filter bar always shows them even on an empty result
const ALL_CATEGORIES = [
  "Executive",
  "Imperial Suite",
  "Deluxe",
  "Annex - Classic",
  "Annex - Studio",
  "Superior Twin",
];

const ROOMS_PER_PAGE = 15;

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard({ room, onDelete, onStatusChange, onTogglePublish }) {
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = useState(false);
  const statusCfg = STATUS_CONFIG[room.status] || STATUS_CONFIG.available;
  const StatusIcon = statusCfg.icon;

  useEffect(() => {
    if (!statusOpen) return;
    const close = () => setStatusOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [statusOpen]);

  return (
    <motion.div
      className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10
        hover:border-gold-500/30 hover:shadow-sm transition-all duration-200 mb-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14">
            {room.thumbnailImage ? (
              <img
                src={room.thumbnailImage}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-xl sm:text-2xl">
                {CATEGORY_ICON[room.category] || "🛏️"}
              </div>
            )}
            {!room.isPublished && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-navy-800" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Row 1: Name + publish */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-navy-900 dark:text-white leading-tight">
                    {room.displayName || room.name}
                  </h3>
                  {room.roomNumber && (
                    <span className="flex-shrink-0 text-[9px] font-bold tracking-wider bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/40 px-1.5 py-0.5">
                      #{room.roomNumber}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider border border-gold-500/30 bg-gold-500/10 text-gold-500 px-1.5 py-0.5">
                    {room.category}
                  </span>
                  {room.view && (
                    <span className="text-[10px] text-gray-400 dark:text-white/40">
                      · {room.view}
                    </span>
                  )}
                  {room.floor && (
                    <span className="text-[10px] text-gray-400 dark:text-white/30">
                      · Floor {room.floor}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onTogglePublish(room._id)}
                className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold
                  uppercase tracking-wider border transition-all duration-200
                  ${
                    room.isPublished
                      ? "border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      : "border-gray-300/50 bg-gray-100/50 text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-white/30 hover:border-gold-500/30 hover:text-gold-500"
                  }`}
              >
                {room.isPublished ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                <span className="hidden xs:inline">
                  {room.isPublished ? "Live" : "Draft"}
                </span>
              </button>
            </div>

            {/* Row 2: Stats */}
            <div className="flex items-center gap-3 sm:gap-5 mt-2 flex-wrap">
              {[
                { icon: BedDouble, val: room.bedType || "—", label: "Bed" },
                { icon: Users, val: room.maxGuests ?? "—", label: "Guests" },
                {
                  icon: Star,
                  val: room.rating != null ? room.rating.toFixed(1) : "—",
                  label: "Rating",
                },
                {
                  icon: DollarSign,
                  val: `₦${(room.pricePerNight || 0).toLocaleString("en-NG")}`,
                  label: "/ Night",
                },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <Icon className="w-3 h-3 text-gold-500 flex-shrink-0" />
                  <span className="font-heading text-xs sm:text-sm font-bold text-navy-900 dark:text-white">
                    {val}
                  </span>
                  <span className="text-[9px] text-gray-400 dark:text-white/30 ml-0.5 hidden sm:inline">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Row 3: Status dropdown + actions */}
            <div className="flex items-center justify-between gap-2 mt-2.5 flex-wrap">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setStatusOpen((v) => !v)}
                  className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold
                    uppercase tracking-wider border transition-all duration-200 ${STATUS_COLORS[statusCfg.color]}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusCfg.label}
                  <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </button>
                <AnimatePresence>
                  {statusOpen && (
                    <motion.div
                      className="absolute left-0 top-full mt-1 z-50 min-w-[150px]
                      bg-white dark:bg-navy-800 border border-gold-500/30 shadow-xl overflow-hidden"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                    >
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                        const Icon = cfg.icon;
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              onStatusChange(room._id, key);
                              setStatusOpen(false);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 text-xs w-full
                              text-gray-600 dark:text-white/70 hover:bg-gold-500/10 hover:text-gold-500 transition-colors
                              ${room.status === key ? "bg-gold-500/10 text-gold-500 font-semibold" : ""}`}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                            {cfg.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => navigate(`/admin/rooms/${room._id}/edit`)}
                  title="Edit"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-200
                    dark:border-white/10 text-gray-400 dark:text-white/40
                    hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    window.open(`/rooms/roomdetail/${room.slug}`, "_blank")
                  }
                  title="Preview"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-200
                    dark:border-white/10 text-gray-400 dark:text-white/40
                    hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(room)}
                  title="Delete"
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-200
                    dark:border-white/10 text-gray-400 dark:text-white/40
                    hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {room.amenities?.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-white/[0.06] flex flex-wrap gap-1">
            {room.amenities.slice(0, 5).map((a) => (
              <span
                key={a.label}
                className="px-1.5 py-0.5 text-[9px] font-semibold text-gray-500 dark:text-white/40
                bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8"
              >
                {a.label}
              </span>
            ))}
            {room.amenities.length > 5 && (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold text-gold-500 bg-gold-500/10 border border-gold-500/30">
                +{room.amenities.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-3 sm:p-4 mb-3 animate-pulse">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 dark:bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between gap-2">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
            <div className="h-5 w-12 bg-gray-200 dark:bg-white/10 rounded" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-1/4" />
          <div className="flex gap-4 mt-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded"
              />
            ))}
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="h-5 w-20 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 bg-gray-200 dark:bg-white/10 rounded"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ room, onConfirm, onCancel, loading }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="bg-white dark:bg-navy-800 border border-red-500/30 p-5 sm:p-6 max-w-md w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.22 }}
      >
        <div className="w-11 h-11 mx-auto mb-4 bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold text-navy-900 dark:text-white text-center mb-2">
          Delete Room?
        </h3>
        <p className="text-xs text-gray-400 dark:text-white/30 text-center mb-2 leading-relaxed">
          Permanently delete{" "}
          <span className="font-semibold text-navy-900 dark:text-white">
            "{room?.displayName || room?.name}"
          </span>
          ?
        </p>
        <p className="text-xs text-red-400 text-center mb-5">
          ⚠️ This will fail if the room has active bookings.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 dark:border-white/10
            text-gray-600 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider
            hover:border-gold-500/30 hover:text-gold-500 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Forever"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, total, perPage, onPageChange }) {
  if (totalPages <= 1) return null;
  const range = [];
  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i++
  )
    range.push(i);
  if (currentPage - 1 > 2) range.unshift("...");
  if (currentPage + 1 < totalPages - 1) range.push("...");
  range.unshift(1);
  if (totalPages > 1) range.push(totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
      <p className="text-[10px] text-gray-400 dark:text-white/30 order-2 sm:order-1">
        Showing{" "}
        <span className="font-semibold text-navy-900 dark:text-white">
          {(currentPage - 1) * perPage + 1}–
          {Math.min(currentPage * perPage, total)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-navy-900 dark:text-white">
          {total}
        </span>{" "}
        rooms
      </p>
      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-200 dark:border-white/10
            text-gray-400 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {range.map((p, i) =>
          p === "..." ? (
            <span
              key={`e${i}`}
              className="w-7 h-7 flex items-center justify-center text-[10px] text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-[10px] sm:text-xs font-bold border transition-all
              ${
                currentPage === p
                  ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                  : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-200 dark:border-white/10
            text-gray-400 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Mobile Filter Sheet ───────────────────────────────────────────────────────
function FilterSheet({
  show,
  onClose,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-navy-800
            border-t border-gray-200 dark:border-white/10 p-5 pb-8 rounded-t-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-base font-bold text-navy-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 hover:text-gold-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-2">
                Category
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["all", ...ALL_CATEGORIES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(c)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all
                      ${categoryFilter === c ? "border-gold-500/30 bg-gold-500/10 text-gold-500" : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40"}`}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-white/30 mb-2">
                Status
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "all",
                  "available",
                  "occupied",
                  "maintenance",
                  "reserved",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all
                      ${statusFilter === s ? "border-gold-500/30 bg-gold-500/10 text-gold-500" : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              Apply Filters
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminRoomList() {
  const dispatch = useDispatch();
  const {
    rooms = [],
    loading,
    error,
    success,
    successMessage,
    pagination: reduxPagination,
  } = useSelector((s) => s.rooms);

  const [searchInput, setSearchInput] = useState(""); // raw (instant update)
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce the search input — API only called 400ms after user stops typing
  const debouncedSearch = useDebounce(searchInput, 400);

  // ── Core fetch helper — always passes all active filter params ────────────
  const doFetch = useCallback(
    (page, overrides = {}) => {
      dispatch(
        fetchAllRoomsAdmin({
          page: page ?? currentPage,
          limit: ROOMS_PER_PAGE,
          sortBy: "createdAt",
          sortOrder: "desc",
          search:
            overrides.search !== undefined ? overrides.search : debouncedSearch,
          category:
            overrides.category !== undefined
              ? overrides.category
              : categoryFilter,
          status:
            overrides.status !== undefined ? overrides.status : statusFilter,
        }),
      );
    },
    [dispatch, currentPage, debouncedSearch, categoryFilter, statusFilter],
  );

  // ── Debounced search → reset page, fire server search ────────────────────
  useEffect(() => {
    setCurrentPage(1);
    dispatch(
      fetchAllRoomsAdmin({
        page: 1,
        limit: ROOMS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
      }),
    );
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Category filter → reset page, fire server call ───────────────────────
  useEffect(() => {
    setCurrentPage(1);
    dispatch(
      fetchAllRoomsAdmin({
        page: 1,
        limit: ROOMS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
      }),
    );
  }, [categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Status filter → reset page, fire server call ─────────────────────────
  useEffect(() => {
    setCurrentPage(1);
    dispatch(
      fetchAllRoomsAdmin({
        page: 1,
        limit: ROOMS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
      }),
    );
  }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Page change (filters stay, just paginate) ─────────────────────────────
  const handlePageChange = (page) => {
    setCurrentPage(page);
    dispatch(
      fetchAllRoomsAdmin({
        page,
        limit: ROOMS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: debouncedSearch,
        category: categoryFilter,
        status: statusFilter,
      }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Clear all filters ─────────────────────────────────────────────────────
  const handleClearAll = () => {
    setSearchInput("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
    dispatch(
      fetchAllRoomsAdmin({
        page: 1,
        limit: ROOMS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    );
  };

  // ── Toast ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (success && successMessage) {
      setToast({ type: "success", message: successMessage });
      dispatch(clearRoomSuccess());
    }
  }, [success, successMessage, dispatch]);
  useEffect(() => {
    if (error) {
      setToast({ type: "error", message: error });
      dispatch(clearRoomError());
    }
  }, [error, dispatch]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirmDelete) return;
    await dispatch(deleteRoom(confirmDelete._id));
    setConfirmDelete(null);
    doFetch(currentPage);
  };

  const handleStatusChange = (id, status) =>
    dispatch(updateRoomStatus({ roomId: id, status }));
  const handleTogglePublish = (id) => dispatch(togglePublishRoom(id));

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalRooms = reduxPagination?.total ?? rooms.length;
  const totalPages =
    reduxPagination?.pages ?? Math.ceil(totalRooms / ROOMS_PER_PAGE);
  const hasFilters =
    searchInput || categoryFilter !== "all" || statusFilter !== "all";
  const activeFilterCount =
    (categoryFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);

  // Stats: total from server, breakdown from current page (best available without extra call)
  const stats = {
    total: totalRooms,
    published: rooms.filter((r) => r.isPublished).length,
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 p-3 sm:p-5 lg:p-8">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-end xs:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="text-gold-500 text-[9px] sm:text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
            Accommodation
          </div>
          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 dark:text-white">
            Room Management
          </h1>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
            Create, manage and monitor all hotel rooms
          </p>
        </div>
        <Link
          to="/admin/rooms/create"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5
            bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold
            uppercase tracking-wider transition-all self-start xs:self-auto whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add New Room
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          {
            icon: BedDouble,
            val: stats.total,
            lbl: "Total Rooms",
            color: "gold",
          },
          {
            icon: Globe,
            val: stats.published,
            lbl: "Published",
            color: "green",
          },
          {
            icon: CheckCircle,
            val: stats.available,
            lbl: "Available",
            color: "green",
          },
          { icon: Users, val: stats.occupied, lbl: "Occupied", color: "blue" },
        ].map(({ icon: Icon, val, lbl, color }) => (
          <div
            key={lbl}
            className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10
            p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-gold-500/30 transition-colors"
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0
              ${color === "gold" ? "bg-gold-500/10 border border-gold-500/30" : ""}
              ${color === "green" ? "bg-green-500/10 border border-green-500/30" : ""}
              ${color === "blue" ? "bg-blue-500/10 border border-blue-500/30" : ""}`}
            >
              <Icon
                className={`w-4 h-4 ${color === "gold" ? "text-gold-500" : color === "green" ? "text-green-500" : "text-blue-500"}`}
              />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-bold text-navy-900 dark:text-white leading-none">
                {val}
              </div>
              <div className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mt-0.5 leading-none">
                {lbl}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search all rooms by name, category, room #..."
            className="w-full pl-8 pr-8 py-2 text-xs bg-white dark:bg-navy-800
              border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white
              placeholder:text-gray-400 dark:placeholder:text-white/30
              focus:border-gold-500/30 focus:outline-none transition-colors"
          />
          {/* Spinner while debounce is pending */}
          {loading && searchInput && (
            <RefreshCw className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gold-500 animate-spin" />
          )}
          {searchInput && !loading && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Desktop category pills */}
        <div className="hidden md:flex items-center gap-1 flex-wrap">
          {["all", ...ALL_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all whitespace-nowrap
                ${categoryFilter === c ? "border-gold-500/30 bg-gold-500/10 text-gold-500" : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"}`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {/* Desktop status pills */}
        <div className="hidden md:flex items-center gap-1">
          {["all", "available", "occupied", "maintenance", "reserved"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all
                ${statusFilter === s ? "border-gold-500/30 bg-gold-500/10 text-gold-500" : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"}`}
              >
                {s}
              </button>
            ),
          )}
        </div>

        {/* Mobile filter button */}
        <button
          onClick={() => setShowFilters(true)}
          className={`md:hidden relative w-8 h-8 flex items-center justify-center border transition-all
            ${activeFilterCount > 0 ? "border-gold-500/30 bg-gold-500/10 text-gold-500" : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40"}`}
        >
          <Filter className="w-3.5 h-3.5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Refresh */}
        <button
          onClick={() => doFetch(currentPage)}
          disabled={loading}
          className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10
            text-gray-400 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10
            disabled:opacity-50 transition-all flex-shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Active filter pills + result info */}
      {hasFilters && (
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {searchInput && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold border border-blue-500/30 bg-blue-500/10 text-blue-500">
              <Search className="w-2.5 h-2.5" />"{searchInput}"
              <button onClick={() => setSearchInput("")}>
                <X className="w-2.5 h-2.5 ml-0.5" />
              </button>
            </span>
          )}
          {categoryFilter !== "all" && (
            <button
              onClick={() => setCategoryFilter("all")}
              className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold border border-gold-500/30 bg-gold-500/10 text-gold-500"
            >
              {categoryFilter} <X className="w-2.5 h-2.5" />
            </button>
          )}
          {statusFilter !== "all" && (
            <button
              onClick={() => setStatusFilter("all")}
              className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold border border-gold-500/30 bg-gold-500/10 text-gold-500"
            >
              {statusFilter} <X className="w-2.5 h-2.5" />
            </button>
          )}
          <span className="text-[9px] text-gray-400 dark:text-white/30 ml-1">
            {loading
              ? "Searching…"
              : `${totalRooms} result${totalRooms !== 1 ? "s" : ""}`}
          </span>
          <button
            onClick={handleClearAll}
            className="ml-auto text-[9px] font-bold text-gray-400 hover:text-gold-500 underline transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Room list */}
      {loading && rooms.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4 bg-white dark:bg-navy-800 border border-dashed border-gray-200 dark:border-white/10">
          <div className="text-4xl sm:text-5xl mb-3">
            {hasFilters ? "🔍" : "🛏️"}
          </div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-gray-400 dark:text-white/50 mb-2">
            {hasFilters ? "No rooms match your search" : "No rooms yet"}
          </h3>
          <p className="text-xs text-gray-400 dark:text-white/30 mb-5">
            {hasFilters
              ? "Try different keywords or clear your filters"
              : "Add your first room to get started"}
          </p>
          {hasFilters ? (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10
              text-gray-400 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          ) : (
            <Link
              to="/admin/rooms/create"
              className="inline-flex items-center gap-2 px-4 py-2.5
              bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              <Plus className="w-4 h-4" /> Add Room
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Dim list while loading next page / filter result */}
          <div
            className={`transition-opacity duration-150 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}
          >
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onDelete={setConfirmDelete}
                onStatusChange={handleStatusChange}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={totalRooms}
            perPage={ROOMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Overlays */}
      <FilterSheet
        show={showFilters}
        onClose={() => setShowFilters(false)}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <AnimatePresence>
        {confirmDelete && (
          <DeleteModal
            room={confirmDelete}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(null)}
            loading={loading}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
