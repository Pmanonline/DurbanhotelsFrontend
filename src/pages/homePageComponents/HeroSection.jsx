import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";
import BookingModal from "../../components/Modals/BookingModal";

import HeroImage1 from "../../assets/images/heroImage1.jpg";
import HeroImage2 from "../../assets/images/heroImage2.jpg";
import HeroImage3 from "../../assets/images/heroImage3.jpg";

const heroImages = [HeroImage1, HeroImage2, HeroImage3];
const IMAGE_INTERVAL_MS = 12000;

/* ─── Helpers ─────────────────────────────────────────────────── */
const toDateStr = (date) => date.toISOString().split("T")[0];
const addDays = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
const today = toDateStr(new Date());
const tomorrow = addDays(today, 1);

/* ─── Slide data ─────────────────────────────────────────────── */
const slides = [
  {
    label: "BUSINESS & LEISURE",
    headline: ["Elevated", "Hospitality"],
    sub: "Experience DubanInternational Hotel—an oasis in Ogba where intuitive service, contemporary design, and the heartbeat of Lagos meet",
  },
  {
    label: "WELCOME TO DUBAN INTERNATIONAL",
    headline: ["An Oasis", "in Lagos"],
    sub: "From executive suites to tranquil wellness spaces, every detail is crafted to keep you connected, restored, and inspired",
  },
  {
    label: "CONCIERGE EXPERIENCE",
    headline: ["Effortless", "Unforgettable"],
    sub: "Over 86+ rooms & suites curated for excellence",
  },
];

/* ─── Component ───────────────────────────────────────────────── */
const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [barOpen, setBarOpen] = useState(false);
  const [dateError, setDateError] = useState("");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const navigate = useNavigate();

  /* ── image carousel ── */
  useEffect(() => {
    const id = setInterval(
      () => setCurrent((p) => (p + 1) % heroImages.length),
      IMAGE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, []);

  /* ── Smart date logic ──
     · Check-in cannot be in the past
     · Check-out is always at least check-in + 1 day
     · If user picks a check-in that is >= current check-out, auto-advance check-out
  ── */
  const handleCheckInChange = (val) => {
    setDateError("");
    setCheckIn(val);
    // Auto-advance check-out if it's no longer after check-in
    if (val >= checkOut) {
      setCheckOut(addDays(val, 1));
    }
  };

  const handleCheckOutChange = (val) => {
    setDateError("");
    if (val <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    setCheckOut(val);
  };

  /* ── Nights label ── */
  const nights = Math.round(
    (new Date(checkOut) - new Date(checkIn)) / 86400000,
  );

  /* ── Submit → navigate to /rooms with state ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkOut <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    navigate("/rooms", {
      state: {
        availability: { checkIn, checkOut, adults, children },
      },
    });
  };

  /* ── Variants ── */
  const imgVariants = {
    enter: { opacity: 0, scale: 1.04 },
    center: {
      opacity: 1,
      scale: 1,
      transition: { duration: 2.2, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.01,
      transition: { duration: 1.8, ease: "easeInOut" },
    },
  };

  const textUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-navy-900"
    >
      {/* ── Background carousel ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ backgroundImage: `url(${heroImages[current]})` }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        />
      </AnimatePresence>

      {/* ── Overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/40 via-navy-900/30 to-navy-900/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/50 via-transparent to-transparent" />

      {/* ── Slide counter ── */}
      <div className="absolute top-28 right-8 sm:right-12 flex items-center gap-3 z-10">
        <span className="text-gold-400 text-xs tracking-[0.25em] font-light">
          0{current + 1}
        </span>
        <span className="w-8 h-px bg-white/30" />
        <span className="text-white/40 text-xs tracking-[0.25em] font-light">
          0{heroImages.length}
        </span>
      </div>

      {/* ── Dot indicators ── */}
      <div className="absolute right-8 sm:right-12 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`block rounded-full transition-all duration-500 ${
              i === current
                ? "w-1.5 h-8 bg-gold-400"
                : "w-1.5 h-2 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 max-w-[90rem] mx-auto">
        <AnimatePresence mode="wait">
          <motion.p
            key={`label-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-gold-400 text-xs sm:text-sm tracking-[0.3em] font-medium mb-6 sm:mb-8"
          >
            {slides[current].label}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <div key={`headline-${current}`}>
            {slides[current].headline.map((line, i) => (
              <motion.h1
                key={line}
                custom={i}
                variants={textUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-light text-white leading-none tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {line}
              </motion.h1>
            ))}

            <motion.p
              custom={2}
              variants={textUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-white/60 text-base sm:text-lg font-light tracking-widest mt-4 sm:mt-6 uppercase"
            >
              {slides[current].sub}
            </motion.p>

            <motion.div
              custom={3}
              variants={textUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap items-center gap-5 mt-10 sm:mt-12"
            >
              <Link to="/rooms">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3.5 bg-gold-400 hover:bg-gold-300 text-navy-900 text-xs tracking-[0.2em] font-bold transition-all duration-300 shadow-gold-glow"
                >
                  OUR ROOMS
                </motion.button>
              </Link>

              <button
                onClick={() => setBarOpen(!barOpen)}
                className="px-8 py-3.5 border border-white/50 hover:border-gold-400 text-white hover:text-gold-400 text-xs tracking-[0.2em] font-semibold transition-all duration-300"
              >
                {barOpen ? "CLOSE" : "CHECK AVAILABILITY"}
              </button>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* ── Availability Bar ── */}
      <AnimatePresence>
        {barOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "tween",
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-navy-900/95 backdrop-blur-md border-t border-white/10"
          >
            <form
              onSubmit={handleSubmit}
              className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex flex-wrap lg:flex-nowrap items-end gap-4"
            >
              {/* Check In */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-white/40 text-xs tracking-[0.2em] mb-1">
                  CHECK IN
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => handleCheckInChange(e.target.value)}
                  required
                  className="w-full bg-white/5 border-b border-white/20 focus:border-gold-400 text-white text-sm py-2 outline-none transition-colors duration-200 [color-scheme:dark]"
                />
              </div>

              {/* Check Out */}
              <div className="flex-1 min-w-[140px]">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-white/40 text-xs tracking-[0.2em]">
                    CHECK OUT
                  </label>
                  {nights > 0 && (
                    <span className="text-gold-400 text-[10px] tracking-wide font-semibold">
                      {nights} night{nights > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  value={checkOut}
                  min={addDays(checkIn, 1)}
                  onChange={(e) => handleCheckOutChange(e.target.value)}
                  required
                  className="w-full bg-white/5 border-b border-white/20 focus:border-gold-400 text-white text-sm py-2 outline-none transition-colors duration-200 [color-scheme:dark]"
                />
              </div>

              {/* Adults */}
              <div className="w-28">
                <label className="block text-white/40 text-xs tracking-[0.2em] mb-1">
                  ADULTS
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(+e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 focus:border-gold-400 text-white text-sm py-2 outline-none transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option
                      key={n}
                      value={n}
                      className="bg-navy-800 text-white"
                    >
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Children */}
              <div className="w-28">
                <label className="block text-white/40 text-xs tracking-[0.2em] mb-1">
                  CHILDREN
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(+e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 focus:border-gold-400 text-white text-sm py-2 outline-none transition-colors"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option
                      key={n}
                      value={n}
                      className="bg-navy-800 text-white"
                    >
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <div className="flex flex-col items-start gap-1 flex-shrink-0">
                {dateError && (
                  <span className="text-red-400 text-[10px] tracking-wide">
                    {dateError}
                  </span>
                )}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 bg-gold-400 hover:bg-gold-300 text-navy-900 text-xs tracking-[0.2em] font-bold transition-all duration-300 shadow-gold-glow"
                >
                  SEARCH
                </motion.button>
              </div>
            </form>

            {/* Quick-pick nights row */}
            <div className="max-w-5xl mx-auto px-6 sm:px-10 pb-4 flex items-center gap-2">
              <span className="text-white/30 text-[10px] tracking-widest mr-1">
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
                        ? "bg-gold-400 border-gold-400 text-navy-900"
                        : "border-white/20 text-white/40 hover:border-gold-400 hover:text-gold-400"
                    }`}
                >
                  {n}N
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ display: barOpen ? "none" : "flex" }}
      >
        <span className="text-white/40 text-xs tracking-[0.25em]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-gold-400/60 to-transparent"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.8,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1L5 5L9 1"
              stroke="rgba(245,166,35,0.6)"
              strokeWidth="1.5"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
