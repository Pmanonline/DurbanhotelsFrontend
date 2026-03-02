import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSlidersH,
} from "react-icons/fa";
import { MdKingBed } from "react-icons/md";
import { fetchRooms } from "../features/Room/Roomslice";
import RoomCard from "../components/RommCard";
import LobbyImage from "../assets/images/heroImage3.jpg";

// ── Constants ─────────────────────────────────────────────────────────────────
const ROOMS_PER_PAGE = 6;

const CATEGORIES = [
  "All",
  "Executive",
  "Imperial Suite",
  "Deluxe",
  "Annex - Classic",
  "Annex - Studio",
  "Superior Twin",
];
const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating", label: "Highest Rated" },
];
const GUEST_OPTIONS = ["Any", "1", "2", "3", "4+"];
const BED_OPTIONS = ["Any", "Single", "Double", "Queen", "King", "Twin"];
const MIN_PRICE = 0;
const MAX_PRICE = 65000;

// ── Helpers ───────────────────────────────────────────────────────────────────
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const DEFAULT_FILTERS = {
  category: "All",
  sort: "default",
  priceRange: [MIN_PRICE, MAX_PRICE],
  guests: "Any",
  bed: "Any",
  search: "",
};

const SORT_MAP = {
  default: { sortBy: "createdAt", sortOrder: "desc" },
  price_asc: { sortBy: "pricePerNight", sortOrder: "asc" },
  price_desc: { sortBy: "pricePerNight", sortOrder: "desc" },
  rating: { sortBy: "rating", sortOrder: "desc" },
};

const toDateStr = (date) => date.toISOString().split("T")[0];
const addDays = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
const todayStr = toDateStr(new Date());

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="text-gold-400">ROOMS</span>
  </nav>
);

// ── FilterSelect ──────────────────────────────────────────────────────────────
const FilterSelect = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none w-full bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10
        text-gray-700 dark:text-white/80 text-xs tracking-wide px-4 py-3 pr-8 outline-none
        focus:border-gold-500 transition-colors cursor-pointer"
    >
      {options.map((o) => (
        <option
          key={typeof o === "string" ? o : o.value}
          value={typeof o === "string" ? o : o.value}
        >
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
    <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 w-2.5 h-2.5 pointer-events-none" />
  </div>
);

// ── Price Range Slider ────────────────────────────────────────────────────────
const PriceRange = ({ value, onChange }) => {
  const [lo, hi] = value;
  const pct = (v) => ((v - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] text-gray-500 dark:text-white/40 tracking-wide">
        <span>₦{lo.toLocaleString()}</span>
        <span>₦{hi.toLocaleString()}</span>
      </div>
      <div className="relative h-1.5 bg-gray-200 dark:bg-white/10 rounded-full">
        <div
          className="absolute h-full bg-gold-500 rounded-full"
          style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
        />
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={500}
          value={lo}
          onChange={(e) => {
            const v = +e.target.value;
            if (v < hi) onChange([v, hi]);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={500}
          value={hi}
          onChange={(e) => {
            const v = +e.target.value;
            if (v > lo) onChange([lo, v]);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        {[lo, hi].map((v, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold-500 border-2 border-white shadow-md pointer-events-none"
            style={{ left: `${pct(v)}%` }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Quick Availability Bar ────────────────────────────────────────────────────
const QuickFilterBar = ({ onSearch, isSearching, defaultValues }) => {
  const tmrw = addDays(todayStr, 1);

  const [checkIn, setCheckIn] = useState(defaultValues?.checkIn || todayStr);
  const [checkOut, setCheckOut] = useState(defaultValues?.checkOut || tmrw);
  const [adults, setAdults] = useState(String(defaultValues?.adults ?? "2"));
  const [children, setChildren] = useState(
    String(defaultValues?.children ?? "0"),
  );
  const [dateError, setDateError] = useState("");

  // Sync if defaultValues change (e.g. on hero navigation)
  useEffect(() => {
    if (defaultValues?.checkIn) setCheckIn(defaultValues.checkIn);
    if (defaultValues?.checkOut) setCheckOut(defaultValues.checkOut);
    if (defaultValues?.adults != null) setAdults(String(defaultValues.adults));
    if (defaultValues?.children != null)
      setChildren(String(defaultValues.children));
  }, [defaultValues]);

  const nights = Math.round(
    (new Date(checkOut) - new Date(checkIn)) / 86400000,
  );

  const handleCheckInChange = (val) => {
    setDateError("");
    setCheckIn(val);
    if (val >= checkOut) setCheckOut(addDays(val, 1));
  };

  const handleCheckOutChange = (val) => {
    setDateError("");
    if (val <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    setCheckOut(val);
  };

  const handleSearch = () => {
    if (checkOut <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    setDateError("");
    onSearch({ checkIn, checkOut, adults: +adults, children: +children });
  };

  return (
    <div className="bg-white dark:bg-navy-800 shadow-[0_4px_30px_rgba(0,0,0,0.10)] border-b border-gray-100 dark:border-white/8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5">
        <div className="flex flex-wrap lg:flex-nowrap items-end gap-4">
          {/* Check In */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-[10px] text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase mb-1.5">
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              min={todayStr}
              onChange={(e) => handleCheckInChange(e.target.value)}
              className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900
                text-gray-700 dark:text-white text-sm px-3 py-2.5 outline-none focus:border-gold-500
                transition-colors [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          {/* Check Out */}
          <div className="flex-1 min-w-[140px]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase">
                Check Out
              </label>
              {nights > 0 && (
                <span className="text-gold-500 text-[10px] font-bold tracking-wide">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <input
              type="date"
              value={checkOut}
              min={addDays(checkIn, 1)}
              onChange={(e) => handleCheckOutChange(e.target.value)}
              className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900
                text-gray-700 dark:text-white text-sm px-3 py-2.5 outline-none focus:border-gold-500
                transition-colors [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>

          {/* Adults */}
          {[
            {
              label: "Adults",
              val: adults,
              set: setAdults,
              opts: ["1", "2", "3", "4", "5", "6"],
            },
            {
              label: "Children",
              val: children,
              set: setChildren,
              opts: ["0", "1", "2", "3", "4"],
            },
          ].map(({ label, val, set, opts }) => (
            <div key={label} className="w-32">
              <label className="block text-[10px] text-gray-400 dark:text-white/40 tracking-[0.2em] uppercase mb-1.5">
                {label}
              </label>
              <div className="relative">
                <select
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className="appearance-none w-full border border-gray-200 dark:border-white/10
                    bg-white dark:bg-navy-900 text-gray-700 dark:text-white text-sm
                    px-3 py-2.5 pr-7 outline-none focus:border-gold-500 transition-colors cursor-pointer"
                >
                  {opts.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-2.5 h-2.5 pointer-events-none" />
              </div>
            </div>
          ))}

          {/* Search button */}
          <div className="flex flex-col items-start gap-1 flex-shrink-0">
            {dateError && (
              <span className="text-red-500 text-[10px] tracking-wide">
                {dateError}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-2.5 px-8 py-3
                bg-gold-500 hover:bg-gold-400 disabled:opacity-70 text-white
                text-xs tracking-[0.22em] font-bold transition-all duration-300"
            >
              {isSearching ? (
                <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <FaSearch className="w-3 h-3" />
              )}
              {isSearching ? "searching..." : "check availability"}
            </motion.button>
          </div>
        </div>

        {/* Quick-pick nights */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-gray-400 dark:text-white/30 text-[10px] tracking-widest">
            QUICK:
          </span>
          {[1, 2, 3, 5, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                setDateError("");
                setCheckOut(addDays(checkIn, n));
              }}
              className={`px-2.5 py-1 text-[10px] font-bold tracking-wide border transition-all duration-200
                ${
                  nights === n
                    ? "bg-gold-500 border-gold-500 text-white"
                    : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-gold-400 hover:text-gold-500"
                }`}
            >
              {n}N
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Filter Panel ──────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters, onReset, total, loading }) => (
  <div className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/8 p-6 sticky top-28 space-y-7">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FaSlidersH className="text-gold-500 w-4 h-4" />
        <span className="text-navy-900 dark:text-white font-bold text-sm tracking-wide">
          Filters
        </span>
      </div>
      <button
        onClick={onReset}
        className="text-[10px] text-gray-400 dark:text-white/30 hover:text-gold-500 tracking-widest transition-colors"
      >
        RESET ALL
      </button>
    </div>

    <p className="text-xs text-gray-400 dark:text-white/30 -mt-4">
      {loading ? "Loading..." : `${total} room${total !== 1 ? "s" : ""} found`}
    </p>

    {[{ label: "Category", key: "category", opts: CATEGORIES }].map(
      ({ label, key, opts }) => (
        <div key={key}>
          <p className="text-[10px] tracking-[0.22em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-3">
            {label}
          </p>
          <div className="flex flex-wrap gap-2">
            {opts.map((o) => (
              <button
                key={o}
                onClick={() => setFilters((f) => ({ ...f, [key]: o }))}
                className={`px-3.5 py-1.5 text-[11px] font-semibold tracking-wide border transition-all duration-200
                ${filters[key] === o ? "bg-gold-500 border-gold-500 text-white" : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:border-gold-400"}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      ),
    )}

    <div>
      <p className="text-[10px] tracking-[0.22em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-3">
        Price Range / Night
      </p>
      <PriceRange
        value={filters.priceRange}
        onChange={(v) => setFilters((f) => ({ ...f, priceRange: v }))}
      />
    </div>

    <div>
      <p className="text-[10px] tracking-[0.22em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-3">
        Sort By
      </p>
      <FilterSelect
        value={filters.sort}
        onChange={(v) => setFilters((f) => ({ ...f, sort: v }))}
        options={SORT_OPTIONS}
      />
    </div>

    <div>
      <p className="text-[10px] tracking-[0.22em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-3">
        Guests
      </p>
      <div className="flex flex-wrap gap-2">
        {GUEST_OPTIONS.map((g) => (
          <button
            key={g}
            onClick={() => setFilters((f) => ({ ...f, guests: g }))}
            className={`px-3.5 py-1.5 text-[11px] font-semibold tracking-wide border transition-all duration-200
              ${filters.guests === g ? "bg-gold-500 border-gold-500 text-white" : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:border-gold-400"}`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>

    <div>
      <p className="text-[10px] tracking-[0.22em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-3">
        Bed Type
      </p>
      <div className="flex flex-wrap gap-2">
        {BED_OPTIONS.map((b) => (
          <button
            key={b}
            onClick={() => setFilters((f) => ({ ...f, bed: b }))}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border transition-all duration-200
              ${filters.bed === b ? "bg-gold-500 border-gold-500 text-white" : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:border-gold-400"}`}
          >
            <MdKingBed className="w-3 h-3" /> {b}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ── Mobile Filter Drawer ──────────────────────────────────────────────────────
const MobileFilterDrawer = ({
  open,
  onClose,
  filters,
  setFilters,
  onReset,
  total,
  loading,
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "tween",
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed right-0 top-0 bottom-0 w-[320px] z-50 overflow-y-auto bg-white dark:bg-navy-800 shadow-2xl lg:hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
            <span className="font-bold text-navy-900 dark:text-white text-sm">
              Filters
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gold-500 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onReset={onReset}
              total={total}
              loading={loading}
            />
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-navy-800 animate-pulse overflow-hidden">
    <div className="h-[220px] bg-gray-200 dark:bg-white/10" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
      <div className="flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 dark:bg-white/5 rounded w-12"
          />
        ))}
      </div>
      <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-4/5" />
      <div className="flex gap-2 pt-2">
        <div className="h-9 flex-1 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-9 w-16 bg-gray-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ current, total, onChange }) => {
  const range = [];
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  )
    range.push(i);
  if (current - 1 > 2) range.unshift("...");
  if (current + 1 < total - 1) range.push("...");
  range.unshift(1);
  if (total > 1) range.push(total);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-white/10
          text-gray-500 hover:border-gold-500 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <FaChevronLeft className="w-3 h-3" />
      </button>
      {range.map((p, i) =>
        p === "..." ? (
          <span
            key={`e${i}`}
            className="w-10 h-10 flex items-center justify-center text-sm text-gray-400"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-10 h-10 text-sm font-semibold border transition-all duration-200
              ${p === current ? "bg-gold-500 border-gold-500 text-white" : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:border-gold-500 hover:text-gold-500"}`}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-white/10
          text-gray-500 hover:border-gold-500 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <FaChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
};

// ── Active Chip ───────────────────────────────────────────────────────────────
const ActiveChip = ({ label, onRemove }) => (
  <span
    className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold
    bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-200 dark:border-gold-500/30"
  >
    {label}
    <button
      onClick={onRemove}
      className="hover:text-red-500 transition-colors ml-0.5"
    >
      <FaTimes className="w-2.5 h-2.5" />
    </button>
  </span>
);

// ══════════════════════════════════════════════════════════════════════════════
// Main Page
// ══════════════════════════════════════════════════════════════════════════════
const RoomsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // ← reads Hero's navigate state
  const {
    rooms = [],
    loading,
    pagination: reduxPagination,
  } = useSelector((s) => s.rooms);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [availMode, setAvailMode] = useState(false);

  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, margin: "-40px" });
  const debouncedSearch = useDebounce(filters.search, 400);

  // ── Fetch builder ─────────────────────────────────────────────────────────
  // Accepts ALL data explicitly so it is never affected by stale closures.
  // Always call with full overrides: doFetch(page, { filters, availability })
  const buildParams = (p, f, avail) => {
    const sort = SORT_MAP[f.sort] || SORT_MAP.default;
    const params = {
      page: p,
      limit: ROOMS_PER_PAGE,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };

    if (f.search?.trim()) params.search = f.search.trim();
    if (f.category !== "All") params.category = f.category;
    if (f.priceRange[0] > MIN_PRICE) params.minPrice = f.priceRange[0];
    if (f.priceRange[1] < MAX_PRICE) params.maxPrice = f.priceRange[1];
    if (f.guests !== "Any") params.guests = f.guests === "4+" ? 4 : +f.guests;
    if (f.bed !== "Any") params.bedType = f.bed;

    if (avail?.checkIn && avail?.checkOut) {
      params.checkIn = avail.checkIn;
      params.checkOut = avail.checkOut;
      if (avail.adults > 0)
        params.guests = avail.adults + (avail.children || 0);
    }

    return params;
  };

  // Stable dispatch ref so callbacks never go stale
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const doFetch = useCallback(
    (p = 1, f = null, avail = null) => {
      const activeFilters = f ?? filters;
      const activeAvail = avail !== undefined ? avail : availability;
      dispatchRef.current(
        fetchRooms(buildParams(p, activeFilters, activeAvail)),
      );
    },
    [filters, availability],
  ); // eslint-disable-line

  // ── ✅ KEY FIX: Read Hero's navigate state on mount ───────────────────────
  // We dispatch DIRECTLY here — never via doFetch — to avoid any stale closure.
  useEffect(() => {
    const incoming = location.state?.availability;

    if (incoming?.checkIn && incoming?.checkOut) {
      setAvailability(incoming);
      setAvailMode(true);
      setFilters(DEFAULT_FILTERS);
      setPage(1);
      // ✅ Build params manually and dispatch directly — zero closure risk
      dispatchRef.current(
        fetchRooms(buildParams(1, DEFAULT_FILTERS, incoming)),
      );
    } else {
      dispatchRef.current(fetchRooms(buildParams(1, DEFAULT_FILTERS, null)));
    }

    // Wipe router state so F5 doesn't re-trigger
    window.history.replaceState({}, document.title);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounced search re-fetch ─────────────────────────────────────────────
  useEffect(() => {
    setPage(1);
    doFetch(1, { ...filters, search: debouncedSearch }, availability);
  }, [debouncedSearch]); // eslint-disable-line

  // ── Filter change re-fetch ────────────────────────────────────────────────
  useEffect(() => {
    setPage(1);
    doFetch(1, filters, availability);
  }, [
    filters.category,
    filters.sort,
    filters.priceRange,
    filters.guests,
    filters.bed,
  ]); // eslint-disable-line

  // ── Availability handlers ─────────────────────────────────────────────────
  const handleAvailabilitySearch = (avail) => {
    setAvailability(avail);
    setAvailMode(true);
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    // Dispatch directly — state setters are async
    dispatchRef.current(fetchRooms(buildParams(1, DEFAULT_FILTERS, avail)));
  };

  const handleClearAvailability = () => {
    setAvailability(null);
    setAvailMode(false);
    setPage(1);
    dispatchRef.current(fetchRooms(buildParams(1, filters, null)));
  };

  const handlePageChange = (p) => {
    setPage(p);
    doFetch(p, filters, availability);
    window.scrollTo({
      top: gridRef.current?.offsetTop - 100,
      behavior: "smooth",
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
    dispatchRef.current(
      fetchRooms(buildParams(1, DEFAULT_FILTERS, availability)),
    );
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalRooms = reduxPagination?.total ?? rooms.length;
  const totalPages =
    reduxPagination?.pages ?? Math.ceil(totalRooms / ROOMS_PER_PAGE);
  const activeCount = [
    filters.category !== "All",
    filters.priceRange[0] > MIN_PRICE || filters.priceRange[1] < MAX_PRICE,
    filters.guests !== "Any",
    filters.bed !== "Any",
    filters.search.trim() !== "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* ── Hero Banner ── */}
      <div className="relative h-[280px] sm:h-[450px] overflow-hidden">
        <img
          src={LobbyImage}
          alt="Rooms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore Our Rooms
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div>

      {/* ── Availability Bar — pre-filled from Hero if navigated with state ── */}
      <QuickFilterBar
        onSearch={handleAvailabilitySearch}
        isSearching={availMode && loading}
        defaultValues={availability}
      />

      {/* ── Availability active banner ── */}
      <AnimatePresence>
        {availMode && availability && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-gold-500/10 border-b border-gold-500/20"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-3 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-sm text-gold-600 dark:text-gold-400 font-medium">
                ✓ Showing available rooms ·{" "}
                <span className="font-semibold">
                  {new Date(availability.checkIn).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                  {" → "}
                  {new Date(availability.checkOut).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>{" "}
                · {availability.adults} adult
                {availability.adults > 1 ? "s" : ""}
                {availability.children > 0 &&
                  `, ${availability.children} child${availability.children > 1 ? "ren" : ""}`}
              </p>
              <button
                onClick={handleClearAvailability}
                className="flex items-center gap-1.5 text-xs text-gold-600 dark:text-gold-400 hover:text-gold-800 font-semibold transition-colors"
              >
                <FaTimes className="w-3 h-3" /> Clear availability search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page body ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-[20px] tracking-[0.3em] font-bold uppercase">
              Our Rooms
            </span>
            <span className="w-8 h-px bg-gold-500" />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 w-3 h-3" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                className="pl-8 pr-8 py-2.5 text-xs border border-gray-200 dark:border-white/10
                  bg-white dark:bg-navy-800 text-gray-700 dark:text-white w-44 outline-none focus:border-gold-500 transition-colors"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((f) => ({ ...f, search: "" }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="hidden md:block w-44">
              <FilterSelect
                value={filters.sort}
                onChange={(v) => setFilters((f) => ({ ...f, sort: v }))}
                options={SORT_OPTIONS}
              />
            </div>

            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/10
                text-gray-600 dark:text-white/60 hover:border-gold-500 hover:text-gold-500 text-xs font-semibold tracking-wide transition-all relative"
            >
              <FaFilter className="w-3 h-3" />
              FILTERS
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-8">
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <FilterPanel
              filters={filters}
              setFilters={(updater) => {
                setFilters(updater);
                setPage(1);
              }}
              onReset={resetFilters}
              total={totalRooms}
              loading={loading}
            />
          </aside>

          <div ref={gridRef} className="flex-1 min-w-0">
            {/* Active chips */}
            {(activeCount > 0 || availMode) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {availMode && (
                  <ActiveChip
                    label={`${availability?.checkIn} → ${availability?.checkOut}`}
                    onRemove={handleClearAvailability}
                  />
                )}
                {filters.category !== "All" && (
                  <ActiveChip
                    label={`Category: ${filters.category}`}
                    onRemove={() =>
                      setFilters((f) => ({ ...f, category: "All" }))
                    }
                  />
                )}
                {(filters.priceRange[0] > MIN_PRICE ||
                  filters.priceRange[1] < MAX_PRICE) && (
                  <ActiveChip
                    label={`₦${filters.priceRange[0].toLocaleString()} – ₦${filters.priceRange[1].toLocaleString()}`}
                    onRemove={() =>
                      setFilters((f) => ({
                        ...f,
                        priceRange: [MIN_PRICE, MAX_PRICE],
                      }))
                    }
                  />
                )}
                {filters.guests !== "Any" && (
                  <ActiveChip
                    label={`${filters.guests} Guest(s)`}
                    onRemove={() =>
                      setFilters((f) => ({ ...f, guests: "Any" }))
                    }
                  />
                )}
                {filters.bed !== "Any" && (
                  <ActiveChip
                    label={`Bed: ${filters.bed}`}
                    onRemove={() => setFilters((f) => ({ ...f, bed: "Any" }))}
                  />
                )}
                {filters.search && (
                  <ActiveChip
                    label={`"${filters.search}"`}
                    onRemove={() => setFilters((f) => ({ ...f, search: "" }))}
                  />
                )}
                <button
                  onClick={resetFilters}
                  className="text-[10px] text-gray-400 hover:text-gold-500 tracking-widest transition-colors underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 dark:text-white/30 mb-6">
              {loading
                ? "Loading rooms..."
                : `Showing ${rooms.length} of ${totalRooms} room${totalRooms !== 1 ? "s" : ""}${page > 1 ? ` · Page ${page} of ${totalPages}` : ""}`}
            </p>

            {loading && rooms.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mb-4">
                  <FaSearch className="text-gold-500 w-6 h-6" />
                </div>
                <p
                  className="text-navy-900 dark:text-white font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {availMode
                    ? "No rooms available for those dates"
                    : "No rooms found"}
                </p>
                <p className="text-gray-400 dark:text-white/40 text-sm mb-6">
                  {availMode
                    ? "Try different dates or fewer guests"
                    : "Try adjusting your filters"}
                </p>
                <button
                  onClick={availMode ? handleClearAvailability : resetFilters}
                  className="px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-widest font-bold transition-all"
                >
                  {availMode ? "SHOW ALL ROOMS" : "RESET FILTERS"}
                </button>
              </div>
            ) : (
              <div
                className={`transition-opacity duration-150 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rooms.map((room, i) => (
                    <RoomCard
                      key={room._id}
                      room={room}
                      index={i}
                      inView={inView}
                    />
                  ))}
                </div>
              </div>
            )}

            {!loading && totalPages > 1 && (
              <Pagination
                current={page}
                total={totalPages}
                onChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        setFilters={(updater) => {
          setFilters(updater);
          setPage(1);
        }}
        onReset={resetFilters}
        total={totalRooms}
        loading={loading}
      />
    </div>
  );
};

export default RoomsPage;
