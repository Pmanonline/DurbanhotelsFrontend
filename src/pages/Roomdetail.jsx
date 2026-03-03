import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaUsers,
  FaRulerCombined,
  FaBath,
  FaArrowLeft,
  FaCheck,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaCoffee,
  FaConciergeBell,
  FaHotTub,
  FaCar,
  FaUtensils,
  FaShieldAlt,
  FaSpa,
  FaWind,
  FaPhone,
  FaBed,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdKingBed, MdElevator, MdBalcony } from "react-icons/md";
import {
  fetchRoomBySlug,
  fetchRooms,
  checkRoomAvailability,
  clearRoomError,
  // getRoomPriceEstimate intentionally removed — computed locally to prevent infinite loop
} from "../features/Room/Roomslice";
import { TestimonialsSlider } from "./testimonial";

const ICON_MAP = {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaCoffee,
  FaConciergeBell,
  FaHotTub,
  FaCar,
  FaUtensils,
  FaShieldAlt,
  FaSpa,
  FaWind,
  FaPhone,
  FaBed,
  MdElevator,
  MdBalcony,
};

const AmenityIcon = ({ name, className = "w-4 h-4" }) => {
  const Icon = ICON_MAP[name];
  return Icon ? (
    <Icon className={className} />
  ) : (
    <FaCheck className={className} />
  );
};

const StarRating = ({ rating = 0, size = "w-4 h-4" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={`${size} ${
          s <= Math.floor(rating)
            ? "text-gold-500"
            : s - 0.5 <= rating
              ? "text-gold-400"
              : "text-gray-300 dark:text-white/20"
        }`}
      />
    ))}
  </div>
);

const HeroSlider = ({ images = [], name = "" }) => {
  const [current, setCurrent] = useState(0);
  const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect fill='%231e2a45' width='800' height='500'/%3E%3C/svg%3E";
  const imgs = images.length ? images : [PLACEHOLDER];

  const prev = () => setCurrent((p) => (p - 1 + imgs.length) % imgs.length);
  const next = () => setCurrent((p) => (p + 1) % imgs.length);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[88vh] overflow-hidden bg-navy-900">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={imgs[current]}
          alt={`${name} ${current + 1}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-navy-900/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/20 to-transparent pointer-events-none" />
      {imgs.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-5 sm:left-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 z-10 border border-white/20 hover:border-white/50 group"
          >
            <FaChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={next}
            className="absolute right-5 sm:right-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-all duration-200 z-10 border border-white/20 hover:border-white/50 group"
          >
            <FaChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {imgs.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-7 h-2 bg-gold-400" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`}
          />
        ))}
      </div>
      <div className="absolute bottom-6 right-8 sm:right-12 text-white/50 text-xs tracking-widest z-10 font-light">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(imgs.length).padStart(2, "0")}
      </div>
    </div>
  );
};

// ── Booking Panel ─────────────────────────────────────────────────────────────
// Price is computed locally — NO getRoomPriceEstimate API call, NO useEffect loop
const BookingPanel = ({ room }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { availability } = useSelector((s) => s.rooms); // priceEstimate removed

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [roomCount, setRoomCount] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [extras, setExtras] = useState({});
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000),
  );

  // All price math done here — zero API calls, zero render loops
  const basePerNight = room?.pricePerNight ?? 0;
  const baseTotal = basePerNight * nights * roomCount;
  const vatAmount = baseTotal * (room?.taxRate ?? 0.075);
  const svcAmount = baseTotal * (room?.serviceChargeRate ?? 0.05);
  const grandTotal = baseTotal + vatAmount + svcAmount;

  const handleCheckAvailability = async () => {
    setChecking(true);
    setChecked(false);
    await dispatch(
      checkRoomAvailability({
        roomId: room._id,
        checkIn,
        checkOut,
        adults,
        children,
      }),
    );
    setChecking(false);
    setChecked(true);
  };

  const isAvailable = availability?.data?.available ?? null;
  const toggleExtra = (label) =>
    setExtras((prev) => ({ ...prev, [label]: !prev[label] }));

  const handleBook = () => {
    if (!room) return;
    navigate(`/booking?room=${room.slug}`, {
      state: {
        roomId: room._id,
        slug: room.slug,
        checkIn,
        checkOut,
        adults,
        children,
        roomCount,
        extras,
      },
    });
  };

  const isRoomAvailable = room?.status === "available" && room?.isAvailable;

  return (
    <div className="bg-navy-900 dark:bg-navy-950 text-white p-6 sm:p-8 sticky top-28">
      <div className="flex items-baseline justify-between mb-6 pb-5 border-b border-white/10">
        <div>
          <p className="text-white/40 text-[9px] tracking-[0.28em] uppercase mb-1">
            Reserve
          </p>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-gold-400">
              ₦{basePerNight.toLocaleString("en-NG")}
            </span>
            <span className="text-sm font-normal text-white/40 ml-1">
              /night
            </span>
          </p>
        </div>
        {room?.rating != null && (
          <div className="text-right">
            <StarRating rating={room.rating} size="w-3.5 h-3.5" />
            {room.reviewCount > 0 && (
              <p className="text-white/30 text-[9px] mt-1">
                {room.reviewCount} reviews
              </p>
            )}
          </div>
        )}
      </div>

      {!isRoomAvailable && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20">
          <FaExclamationTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-[10px] font-semibold tracking-wide">
            {room?.status === "maintenance"
              ? "Under Maintenance"
              : "Currently Unavailable"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: "Check In", value: checkIn, setter: setCheckIn },
          { label: "Check Out", value: checkOut, setter: setCheckOut },
        ].map(({ label, value, setter }) => (
          <div key={label}>
            <label className="block text-white/40 text-[9px] tracking-[0.2em] mb-1.5 uppercase">
              {label}
            </label>
            <input
              type="date"
              value={value}
              min={today}
              onChange={(e) => {
                setter(e.target.value);
                setChecked(false);
              }}
              className="w-full bg-white/5 border border-white/15 focus:border-gold-400 text-white text-xs px-3 py-2.5 outline-none transition-colors [color-scheme:dark]"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          {
            label: "Rooms",
            value: roomCount,
            setter: setRoomCount,
            opts: [1, 2, 3, 4],
          },
          {
            label: "Adults",
            value: adults,
            setter: setAdults,
            opts: [1, 2, 3, 4, 5, 6],
          },
          {
            label: "Children",
            value: children,
            setter: setChildren,
            opts: [0, 1, 2, 3, 4],
          },
        ].map(({ label, value, setter, opts }) => (
          <div key={label}>
            <label className="block text-white/40 text-[9px] tracking-[0.2em] mb-1.5 uppercase">
              {label}
            </label>
            <select
              value={value}
              onChange={(e) => {
                setter(+e.target.value);
                setChecked(false);
              }}
              className="w-full bg-white/5 border border-white/15 focus:border-gold-400 text-white text-xs px-2 py-2.5 outline-none transition-colors [color-scheme:dark]"
            >
              {opts.map((n) => (
                <option key={n} value={n} className="bg-navy-900">
                  {n}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={handleCheckAvailability}
        disabled={checking || !room}
        className="w-full py-2.5 mb-4 border border-white/20 hover:border-gold-400/50 text-white/70 hover:text-gold-400 text-[10px] tracking-[0.22em] font-bold uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {checking ? (
          <>
            <span className="w-3 h-3 border-2 border-white/30 border-t-white/70 rounded-full animate-spin" />
            Checking…
          </>
        ) : (
          "Check Availability"
        )}
      </button>

      <AnimatePresence>
        {checked && isAvailable !== null && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-4 px-3 py-2.5 border flex items-center gap-2 text-xs font-semibold ${
              isAvailable
                ? "bg-green-500/10 border-green-500/25 text-green-400"
                : "bg-red-500/10 border-red-500/25 text-red-400"
            }`}
          >
            <span>{isAvailable ? "✓" : "✗"}</span>
            {isAvailable
              ? `Available for ${nights} night${nights > 1 ? "s" : ""}`
              : "Not available for selected dates"}
          </motion.div>
        )}
      </AnimatePresence>

      {room?.extraServices?.length > 0 && (
        <div className="mb-5 pb-5 border-b border-white/10">
          <p className="text-white/60 text-[9px] font-bold tracking-[0.22em] uppercase mb-3">
            Extra Services
          </p>
          <div className="space-y-2">
            {room.extraServices.map((svc) => (
              <label
                key={svc.label}
                onClick={() => toggleExtra(svc.label)}
                className="flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${extras[svc.label] ? "bg-gold-500 border-gold-500" : "border-white/25 group-hover:border-gold-400"}`}
                  >
                    {extras[svc.label] && (
                      <FaCheck className="text-white w-2.5 h-2.5" />
                    )}
                  </div>
                  <span className="text-white/55 text-xs">{svc.label}</span>
                </div>
                <span className="text-white/35 text-[10px] flex-shrink-0">
                  {svc.price
                    ? `₦${svc.price.toLocaleString("en-NG")}`
                    : svc.note || ""}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 space-y-1.5 text-xs">
        <div className="flex justify-between text-white/40">
          <span>
            ₦{basePerNight.toLocaleString("en-NG")} × {nights} night
            {nights > 1 ? "s" : ""}
            {roomCount > 1 ? ` × ${roomCount} rooms` : ""}
          </span>
          <span>₦{baseTotal.toLocaleString("en-NG")}</span>
        </div>
        {vatAmount > 0 && (
          <div className="flex justify-between text-white/30">
            <span>VAT ({((room?.taxRate ?? 0.075) * 100).toFixed(0)}%)</span>
            <span>₦{vatAmount.toLocaleString("en-NG")}</span>
          </div>
        )}
        {svcAmount > 0 && (
          <div className="flex justify-between text-white/30">
            <span>
              Service Charge (
              {((room?.serviceChargeRate ?? 0.05) * 100).toFixed(0)}%)
            </span>
            <span>₦{svcAmount.toLocaleString("en-NG")}</span>
          </div>
        )}
        <div className="flex justify-between text-white font-bold text-base pt-2.5 border-t border-white/10 mt-1">
          <span>Total</span>
          <span className="text-gold-400">
            ₦{grandTotal.toLocaleString("en-NG")}
          </span>
        </div>
        <p className="text-white/20 text-[9px] tracking-wide">
          Estimated total for {nights} night{nights > 1 ? "s" : ""}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: isRoomAvailable ? 1.02 : 1 }}
        whileTap={{ scale: isRoomAvailable ? 0.97 : 1 }}
        onClick={handleBook}
        disabled={!isRoomAvailable}
        className={`w-full py-4 text-xs tracking-[0.28em] font-bold transition-all duration-300 shadow-lg ${
          isRoomAvailable
            ? "bg-gold-500 hover:bg-gold-400 text-white cursor-pointer"
            : "bg-white/10 text-white/30 cursor-not-allowed"
        }`}
      >
        {isRoomAvailable ? "BOOK YOUR STAY NOW" : "ROOM UNAVAILABLE"}
      </motion.button>

      {isRoomAvailable && (
        <p className="text-center text-white/25 text-[9px] tracking-wide mt-3">
          No charge until confirmation
        </p>
      )}
    </div>
  );
};

const DetailSkeleton = () => (
  <div className="min-h-screen bg-white dark:bg-navy-900 animate-pulse">
    <div className="w-full h-[55vh] sm:h-[65vh] lg:h-[88vh] bg-gray-200 dark:bg-white/10" />
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-6">
          <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="h-12 w-2/3 bg-gray-200 dark:bg-white/10 rounded" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-5 w-20 bg-gray-200 dark:bg-white/10 rounded"
              />
            ))}
          </div>
          <div className="space-y-2 pt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 bg-gray-100 dark:bg-white/5 rounded w-full"
              />
            ))}
          </div>
        </div>
        <div className="hidden lg:block h-96 bg-gray-200 dark:bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

const RelatedCard = ({ room }) => {
  const images = room.images?.length
    ? room.images
    : room.thumbnailImage
      ? [room.thumbnailImage]
      : [];
  const price = room.pricePerNight ?? 0;
  return (
    <Link
      to={`/rooms/roomdetail/${room.slug}`}
      className="group flex flex-col bg-white dark:bg-navy-800 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.07)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300"
    >
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={images[0] || ""}
          alt={room.displayName || room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-gold-500 text-white text-xs font-bold px-3 py-1.5 tracking-wide">
          ₦{price.toLocaleString("en-NG")}
          <span className="font-normal opacity-80">/Night</span>
        </div>
        <div className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-[0.12em] px-2.5 py-1.5">
          {room.category}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3
          className="text-navy-900 dark:text-white font-bold text-lg mb-2 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {room.displayName || room.name}
        </h3>
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-400 dark:text-white/40">
          {room.size && (
            <span>
              <FaRulerCombined className="inline mr-1 text-gold-500 w-3 h-3" />
              {room.size}
            </span>
          )}
          {room.maxGuests && (
            <span>
              <FaUsers className="inline mr-1 text-gold-500 w-3 h-3" />
              {room.maxGuests} Guests
            </span>
          )}
          {room.bedType && (
            <span>
              <MdKingBed className="inline mr-1 text-gold-500 w-3.5 h-3.5" />
              {room.bedType}
            </span>
          )}
        </div>
        <p className="text-gray-500 dark:text-white/40 text-sm line-clamp-2 mb-4">
          {room.description}
        </p>
        <div className="mt-auto w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-[0.18em] font-bold text-center transition-all duration-300">
          VIEW ROOM
        </div>
      </div>
    </Link>
  );
};

const RoomDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const {
    currentRoom: room,
    loading,
    error,
    rooms: relatedRooms,
  } = useSelector((s) => s.rooms);

  useEffect(() => {
    if (!slug) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    dispatch(fetchRoomBySlug(slug));
  }, [slug]); // eslint-disable-line

  useEffect(() => {
    if (!room?.category) return;
    dispatch(fetchRooms({ category: room.category, limit: 3, page: 1 }));
  }, [room?.category]); // eslint-disable-line

  useEffect(
    () => () => {
      dispatch(clearRoomError());
    },
    [],
  ); // eslint-disable-line

  if (error && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-navy-900 px-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <FaExclamationTriangle className="w-6 h-6 text-red-400" />
        </div>
        <p
          className="text-navy-900 dark:text-white text-xl mb-3 font-semibold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Room not found
        </p>
        <p className="text-gray-400 dark:text-white/40 text-sm mb-8 text-center max-w-xs">
          The room you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-[0.22em] font-bold transition-all"
        >
          <FaArrowLeft className="w-3 h-3" /> BROWSE ALL ROOMS
        </Link>
      </div>
    );
  }

  if (loading || !room || room.slug !== slug) return <DetailSkeleton />;

  const displayName = room.displayName || room.name || "Room";
  const images = room.images?.length
    ? room.images
    : room.thumbnailImage
      ? [room.thumbnailImage]
      : [];
  const bedLabel = [
    room.bedCount > 1 ? room.bedCount : null,
    room.bedType,
    room.bedCount > 1 ? "Beds" : "Bed",
  ]
    .filter(Boolean)
    .join(" ");
  const related = relatedRooms
    .filter((r) => r._id !== room._id && r.slug !== slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900">
      <HeroSlider images={images} name={displayName} />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-6">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-gray-400 dark:text-white/40 hover:text-gold-500 dark:hover:text-gold-400 text-xs tracking-[0.2em] transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" /> BACK TO ROOMS
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-16">
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {room.view && (
                  <p className="text-gold-500 text-xs tracking-[0.3em] font-semibold uppercase">
                    {room.view}
                  </p>
                )}
                {room.floor && (
                  <span className="text-gray-400 dark:text-white/30 text-xs">
                    · Floor {room.floor}
                  </span>
                )}
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 dark:text-white leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                {room.rating != null && <StarRating rating={room.rating} />}
                {room.reviewCount > 0 && (
                  <span className="text-gray-400 dark:text-white/40 text-sm">
                    {room.reviewCount} reviews
                  </span>
                )}
                {room.rating != null && room.reviewCount > 0 && (
                  <span className="w-px h-4 bg-gray-200 dark:bg-white/10" />
                )}
                <span className="text-gold-500 font-bold text-sm">
                  ₦{(room.pricePerNight || 0).toLocaleString("en-NG")}
                  <span className="text-gray-400 dark:text-white/40 font-normal text-xs ml-1">
                    /night
                  </span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] border border-gold-500/30 bg-gold-500/10 text-gold-500 px-2.5 py-1">
                  {room.category}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 mb-8 pb-8 border-b border-gray-100 dark:border-white/8">
              {[
                room.size && {
                  icon: <FaRulerCombined className="text-gold-500 w-4 h-4" />,
                  val: room.size,
                },
                room.maxGuests && {
                  icon: <FaUsers className="text-gold-500 w-4 h-4" />,
                  val: `${room.maxGuests} Guests`,
                },
                room.bedType && {
                  icon: <MdKingBed className="text-gold-500 w-5 h-5" />,
                  val: bedLabel,
                },
                room.bathrooms != null && {
                  icon: <FaBath className="text-gold-500 w-4 h-4" />,
                  val: `${room.bathrooms} Bathroom${room.bathrooms > 1 ? "s" : ""}`,
                },
              ]
                .filter(Boolean)
                .map(({ icon, val }) => (
                  <span
                    key={val}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60"
                  >
                    {icon} {val}
                  </span>
                ))}
            </div>

            <div className="mb-10">
              <h2
                className="text-navy-900 dark:text-white font-bold text-lg mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                About This Room
              </h2>
              {(room.longDescription || room.description || "")
                .split("\n\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p
                    key={i}
                    className="text-gray-600 dark:text-white/55 text-base leading-relaxed mb-4 last:mb-0"
                  >
                    {para}
                  </p>
                ))}
            </div>

            {room.amenities?.length > 0 && (
              <div className="mb-10">
                <h2
                  className="text-navy-900 dark:text-white font-bold text-lg mb-5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Room Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 hover:border-gold-400/50 transition-colors"
                    >
                      <span className="text-gold-500 flex-shrink-0">
                        <AmenityIcon name={a.icon} className="w-4 h-4" />
                      </span>
                      <span className="text-gray-600 dark:text-white/55 text-xs font-medium">
                        {a.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {room.includes?.length > 0 && (
              <div className="mb-10">
                <h2
                  className="text-navy-900 dark:text-white font-bold text-lg mb-5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  What's Included
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {room.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-gray-600 dark:text-white/55 text-sm py-2.5 border-b border-gray-100 dark:border-white/[0.06] last:border-0"
                    >
                      <div className="w-4 h-4 flex-shrink-0 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                        <FaCheck className="text-gold-500 w-2 h-2" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {room.tags?.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                {room.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 hover:border-gold-500/30 hover:text-gold-500 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="lg:hidden mb-10">
              <BookingPanel room={room} />
            </div>
          </div>

          <div className="hidden lg:block">
            <BookingPanel room={room} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-100 dark:border-white/8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                You Might Also Like
              </h2>
              <Link
                to="/rooms"
                className="text-gold-500 hover:text-gold-400 text-xs tracking-[0.2em] font-semibold transition-colors"
              >
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r) => (
                <RelatedCard key={r._id} room={r} />
              ))}
            </div>
          </div>
        )}

        <TestimonialsSlider />
      </div>
    </div>
  );
};

export default RoomDetail;
