import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaRulerCombined,
  FaBath,
  FaWifi,
  FaTv,
  FaSnowflake,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaCoffee,
  FaConciergeBell,
  FaHotTub,
} from "react-icons/fa";
import { MdKingBed } from "react-icons/md";

// ── Icon resolver (API stores icon names as strings) ─────────────────────────
const ICON_MAP = {
  FaWifi: FaWifi,
  FaTv: FaTv,
  FaSnowflake: FaSnowflake,
  FaParking: FaParking,
  FaSwimmingPool: FaSwimmingPool,
  FaDumbbell: FaDumbbell,
  FaCoffee: FaCoffee,
  FaConciergeBell: FaConciergeBell,
  FaHotTub: FaHotTub,
};
const AmenityIcon = ({ name }) => {
  const Icon = ICON_MAP[name];
  return Icon ? <Icon className="w-2.5 h-2.5 text-gold-500" /> : null;
};

// ── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={`w-3 h-3 ${
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

// ── Amenity chips ─────────────────────────────────────────────────────────────
const AmenityChips = ({ amenities, max = 3 }) => {
  if (!amenities?.length) return null;
  const visible = amenities.slice(0, max);
  const overflow = amenities.length - max;
  return (
    <div className="flex items-center flex-wrap gap-1.5">
      {visible.map((a, i) => (
        <span
          key={i}
          className="flex items-center gap-1 text-[10px] text-gray-600 dark:text-white/60
          bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-gray-200 dark:border-white/10"
        >
          <AmenityIcon name={a.icon} />
          {a.label}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="text-[10px] text-gold-500 font-semibold bg-amber-50 dark:bg-gold-500/10
          border border-amber-200 dark:border-gold-500/30 px-2.5 py-1 rounded-full"
        >
          +{overflow} more
        </span>
      )}
    </div>
  );
};

// ── Image Slider ──────────────────────────────────────────────────────────────
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23d1d5db' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

const ImageSlider = ({ images, name }) => {
  const [current, setCurrent] = useState(0);
  const imgs = images?.length ? images : [PLACEHOLDER];

  const prev = (e) => {
    e.preventDefault();
    setCurrent((p) => (p - 1 + imgs.length) % imgs.length);
  };
  const next = (e) => {
    e.preventDefault();
    setCurrent((p) => (p + 1) % imgs.length);
  };

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={imgs[current]}
          alt={`${name} ${current + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
      </AnimatePresence>

      {imgs.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
            bg-black/40 hover:bg-black/70 text-white flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={next}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
            bg-black/40 hover:bg-black/70 text-white flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(i);
                }}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── RoomCard ──────────────────────────────────────────────────────────────────
/**
 * Works with API room shape:
 *   room._id, room.slug, room.name / room.displayName
 *   room.images[], room.thumbnailImage
 *   room.pricePerNight, room.category, room.rating
 *   room.size, room.maxGuests, room.bedType, room.bedCount
 *   room.bathrooms, room.description, room.amenities[]
 *   room.view, room.floor, room.status
 */
const RoomCard = ({
  room,
  index = 0,
  inView = true,
  compact = false,
  animate = true,
}) => {
  if (!room) return null;

  // ── Normalise API fields ──────────────────────────────────────────────────
  const displayName = room.displayName || room.name || "Room";
  const images = room.images?.length
    ? room.images
    : room.thumbnailImage
      ? [room.thumbnailImage]
      : [];
  const price = room.pricePerNight ?? 0;
  const priceLabel = `₦${price.toLocaleString("en-NG")}`;
  const bedLabel = [
    room.bedCount > 1 ? room.bedCount : null,
    room.bedType,
    room.bedCount > 1 ? "Beds" : "Bed",
  ]
    .filter(Boolean)
    .join(" ");
  const detailPath = `/rooms/roomdetail/${room.slug}`;

  const wrapper = animate
    ? {
        initial: { opacity: 0, y: 44 },
        animate: inView ? { opacity: 1, y: 0 } : {},
        transition: {
          duration: 0.65,
          delay: 0.08 + index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        },
      }
    : {};

  return (
    <motion.div
      {...wrapper}
      className="bg-white dark:bg-navy-800 overflow-hidden flex flex-col
        shadow-[0_4px_24px_rgba(0,0,0,0.07)] hover:shadow-[0_14px_44px_rgba(0,0,0,0.13)]
        transition-shadow duration-300 group"
    >
      {/* Image */}
      <div
        className={`relative ${compact ? "h-[180px]" : "h-[220px]"} flex-shrink-0 overflow-hidden`}
      >
        <ImageSlider images={images} name={displayName} />

        {/* Price badge */}
        <div className="absolute top-3 left-3 z-10 bg-gold-500 text-white text-xs font-bold px-3 py-1.5 tracking-wide shadow">
          {priceLabel}
          <span className="font-normal opacity-85">/Night</span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3 z-10 bg-navy-900/80 backdrop-blur-sm text-white text-[10px] font-semibold tracking-[0.15em] px-3 py-1.5">
          {room.category}
        </div>

        {/* View badge (if present) */}
        {room.view && (
          <div className="absolute bottom-3 left-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[9px] font-semibold tracking-wider px-2.5 py-1">
            {room.view}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`flex flex-col flex-1 ${compact ? "p-4" : "p-5"}`}>
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3
            className={`text-navy-900 dark:text-white font-bold leading-tight ${compact ? "text-base" : "text-lg"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {displayName}
          </h3>
          {room.rating != null && <StarRating rating={room.rating} />}
        </div>

        {/* Specs */}
        {!compact && (
          <div className="flex items-center flex-wrap gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/8">
            {room.size && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                <FaRulerCombined className="text-gold-500 w-3 h-3" />{" "}
                {room.size}
              </span>
            )}
            {room.maxGuests && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                <FaUsers className="text-gold-500 w-3 h-3" /> {room.maxGuests}{" "}
                Guests
              </span>
            )}
            {room.bedType && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                <MdKingBed className="text-gold-500 w-4 h-4" /> {bedLabel}
              </span>
            )}
            {room.bathrooms != null && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                <FaBath className="text-gold-500 w-3 h-3" /> {room.bathrooms}{" "}
                Bath
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        {!compact && room.amenities?.length > 0 && (
          <div className="mb-5">
            <AmenityChips amenities={room.amenities} max={3} />
          </div>
        )}

        {/* CTAs */}
        <div className="mt-auto flex items-center gap-2.5">
          <Link to={detailPath} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-white
                text-xs tracking-[0.18em] font-bold transition-all duration-300"
            >
              VIEW MORE
            </motion.button>
          </Link>
          <Link to={`/booking?room=${room.slug}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2.5 bg-navy-900 dark:bg-white/10 hover:bg-navy-700
                text-white text-xs tracking-[0.18em] font-bold transition-all duration-300"
            >
              BOOK
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
