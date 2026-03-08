import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaQuoteRight,
  FaChevronLeft,
  FaChevronRight,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";
import HeroImage from "../assets/images/heroImage3.jpg";

// ── Testimonial data ──────────────────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Snr. High Chief Felix O.",
    role: "Business Mogul",
    rating: 5,
    text: "This place hasn't gotten the recognition it deserves. I've been to many hotels and I can confidently say this place offers one of the best accommodation services in Lagos and even the whole of Nigeria.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    source: "google",
    date: "1 month ago",
  },
  {
    id: 2,
    name: "KEHINDE Similoluwa Joseph",
    role: "Software Developer",
    rating: 5,
    text: "From the airport to my suite, I felt like the president because their services was top-notch. Every single detail was attended to with professionalism and warmth.",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    source: "google",
    date: "3 weeks ago",
  },
  {
    id: 3,
    name: "Tokoni Peter Igoni",
    role: "S.A. to Presidency",
    rating: 5,
    text: "I was treated like a king, literally. A nice place, really. The ambience, the staff, the food — everything was on point. Will definitely be returning with my family.",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    source: "google",
    date: "2 weeks ago",
  },
  {
    id: 4,
    name: "Wilson Sakpere",
    role: "Verified Guest",
    rating: 5,
    text: "Home away from home. The room was spotless, the staff incredibly welcoming, and the breakfast exceeded every expectation. Best hotel stay I've had in Lagos.",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    source: "google",
    date: "4 days ago",
  },
  {
    id: 5,
    name: "Olorunobafemi James",
    role: "Corporate Traveller",
    rating: 4,
    text: "Absolute excellence. The business centre facilities are outstanding and the WiFi never dropped once across my 5-day stay. Perfect for executive travel.",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    source: "google",
    date: "2 weeks ago",
  },
  {
    id: 6,
    name: "Simon Olatunji",
    role: "Hospitality Consultant",
    rating: 4,
    text: "It's a nice place for friends to hang out, for teams, and for family. The reception and services are excellent. Also, the staff there are professionals and well dressed.",
    avatar: "https://randomuser.me/api/portraits/men/78.jpg",
    source: "google",
    date: "2 weeks ago",
  },
  {
    id: 7,
    name: "Adaeze Okonkwo",
    role: "Event Planner",
    rating: 5,
    text: "We hosted our company retreat here and everything was seamlessly organised. The event team went above and beyond. Our guests couldn't stop complimenting the venue.",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    source: "direct",
    date: "1 week ago",
  },
  {
    id: 8,
    name: "Emeka Nwachukwu",
    role: "Diplomat",
    rating: 5,
    text: "For international visitors, DubanInternational sets a standard that rivals properties I've stayed at globally. The airport transfer alone was worth every naira.",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    source: "direct",
    date: "5 days ago",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Stars = ({ rating, size = "w-3.5 h-3.5" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={`${size} ${s <= Math.floor(rating) ? "text-gold-500" : "text-gray-200 dark:text-white/15"}`}
      />
    ))}
  </div>
);

// ── Single quote card (used in slider + grid) ─────────────────────────────────
const TestimonialCard = ({ t, variant = "light" }) => {
  const isDark = variant === "dark";
  return (
    <div
      className={`relative flex flex-col h-full p-5 sm:p-6 md:p-7 border rounded-lg transition-all duration-300
        ${
          isDark
            ? "bg-white/5 border-white/10 hover:border-gold-500/30 hover:bg-white/8"
            : "bg-white dark:bg-navy-800 border-gray-100 dark:border-white/8 hover:border-gold-400 dark:hover:border-gold-500/30 shadow-sm hover:shadow-md"
        }`}
    >
      {/* Large quote mark */}
      <FaQuoteRight
        className={`absolute bottom-4 right-4 w-8 h-8 sm:w-10 sm:h-10
          ${isDark ? "text-gold-500/10" : "text-gold-500/10"}`}
      />

      {/* Stars */}
      <Stars rating={t.rating} size="w-3.5 h-3.5" />

      {/* Review text */}
      <p
        className={`mt-3 mb-4 text-xs sm:text-sm leading-relaxed flex-1 line-clamp-4
          ${isDark ? "text-white/70" : "text-gray-600 dark:text-white/60"}`}
      >
        "{t.text}"
      </p>

      {/* Divider */}
      <div
        className={`h-px mb-4 ${isDark ? "bg-white/5" : "bg-gray-100 dark:bg-white/5"}`}
      />

      {/* Author */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gold-500/30"
            />
            {t.source === "google" && (
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white
                  flex items-center justify-center shadow-sm"
              >
                <FaGoogle className="w-2 h-2 text-[#4285F4]" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-xs font-bold tracking-wide truncate
                ${isDark ? "text-white" : "text-navy-900 dark:text-white"}`}
            >
              {t.name}
            </p>
            <p
              className={`text-[10px] truncate ${isDark ? "text-white/40" : "text-gray-400 dark:text-white/30"}`}
            >
              {t.role}
            </p>
          </div>
        </div>
        <span
          className={`text-[9px] sm:text-[10px] tracking-wide whitespace-nowrap flex-shrink-0
            ${isDark ? "text-white/20" : "text-gray-300 dark:text-white/20"}`}
        >
          {t.date}
        </span>
      </div>
    </div>
  );
};

// ── REUSABLE TestimonialsSlider — for page footers ────────────────────────────
export const TestimonialsSlider = ({ limit = 6 }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAuto, setIsAuto] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const PER_PAGE = 2;
  const slides = TESTIMONIALS.slice(0, limit);
  const totalPages = Math.ceil(slides.length / PER_PAGE);

  const go = useCallback(
    (dir) => {
      setDirection(dir);
      setIsAuto(false);
      setCurrent((p) => (p + dir + totalPages) % totalPages);
      setTimeout(() => setIsAuto(true), 5000);
    },
    [totalPages],
  );

  useEffect(() => {
    if (!isAuto) return;
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(id);
  }, [isAuto, totalPages]);

  const visiblePair = [
    slides[current * PER_PAGE],
    slides[current * PER_PAGE + 1],
  ].filter(Boolean);

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d) => ({
      opacity: 0,
      x: d > 0 ? -60 : 60,
      transition: { duration: 0.35 },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-navy-900 transition-colors duration-300"
    >
      {/* Dot grid texture - adjusted for both modes */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle top & bottom accent lines - gold in both modes */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="flex items-center gap-3 justify-center mb-3">
            <span className="w-8 h-px bg-gold-500/50" />
            <span className="text-gold-500 text-[10px] sm:text-[11px] tracking-[0.25em] font-bold uppercase">
              Guest Reviews
            </span>
            <span className="w-8 h-px bg-gold-500/50" />
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white px-4 transition-colors duration-300"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Stars rating={5} size="w-4 h-4" />
            <span className="text-gray-500 dark:text-white/40 text-xs transition-colors duration-300">
              4.8 average · 346+ reviews
            </span>
          </div>
        </motion.div>

        {/* Slider */}
        <div className="relative">
          {/* Prev */}
          <button
            onClick={() => go(-1)}
            className="absolute -left-3 sm:left-0 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-gold-500 hover:bg-gold-400 text-white
              flex items-center justify-center rounded-full transition-all duration-200 shadow-lg"
          >
            <FaChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* Cards */}
          <div className="overflow-hidden mx-8 sm:mx-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
              >
                {visiblePair.map((t) => (
                  <TestimonialCard
                    key={t.id}
                    t={t}
                    variant={
                      document.documentElement.classList.contains("dark")
                        ? "dark"
                        : "light"
                    }
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next */}
          <button
            onClick={() => go(1)}
            className="absolute -right-3 sm:right-0 top-1/2 -translate-y-1/2 z-20
              w-8 h-8 sm:w-10 sm:h-10 bg-gold-500 hover:bg-gold-400 text-white
              flex items-center justify-center rounded-full transition-all duration-200 shadow-lg"
          >
            <FaChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`rounded-full transition-all duration-300
                ${
                  i === current
                    ? "w-5 h-1.5 sm:w-6 sm:h-2 bg-gold-500"
                    : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400 dark:hover:bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* See all link */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-6 sm:mt-8"
        >
          <Link to="/testimonials">
            <span
              className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-[0.2em]
                uppercase text-gold-500 hover:text-gold-400 transition-colors group"
            >
              READ ALL REVIEWS
              <FaArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ── STANDALONE TestimonialsPage ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-[10px] sm:text-xs tracking-widest flex-wrap justify-center">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="text-white/30">PAGES</span>
    <span>/</span>
    <span className="text-gold-400">TESTIMONIALS</span>
  </nav>
);

const TestimonialsPage = () => {
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  // Google review aggregate
  const avg = (
    TESTIMONIALS.reduce((s, t) => s + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] overflow-hidden bg-navy-900">
        <img
          src={HeroImage}
          alt="Testimonials"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-navy-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/30" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Guest Reviews
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] sm:h-[3px]
            bg-gradient-to-r from-transparent via-gold-500 to-transparent"
        />
      </div>

      {/* ── Aggregate score banner ───────────────────────────────────────── */}
      <div className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-8"
          >
            {/* Score */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="text-center">
                <p
                  className="text-4xl sm:text-5xl font-bold text-gold-500"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {avg}
                </p>
                <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-white/30 tracking-widest uppercase mt-1">
                  out of 5
                </p>
              </div>
              <div>
                <Stars rating={5} size="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-gray-500 dark:text-white/40 text-[11px] sm:text-xs mt-1.5">
                  Based on {TESTIMONIALS.length} verified reviews
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <FaGoogle className="text-[#4285F4] w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="text-gray-400 dark:text-white/30 text-[9px] sm:text-[10px]">
                    Google · Direct
                  </span>
                </div>
              </div>
            </div>

            {/* Rating bars */}
            <div className="space-y-2 w-full max-w-sm">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = TESTIMONIALS.filter(
                  (t) => Math.floor(t.rating) === star,
                ).length;
                const pct = Math.round((count / TESTIMONIALS.length) * 100);
                return (
                  <div key={star} className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-white/40 w-3 text-right">
                      {star}
                    </span>
                    <FaStar className="text-gold-500 w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.9,
                          delay: 0.3 + (5 - star) * 0.08,
                        }}
                        className="h-full bg-gold-500 rounded-full"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-gray-400 dark:text-white/30 w-6 sm:w-8">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <a
              href="https://www.google.com/travel/search?q=Duban%20hotel%20ogba&g2lb=4965990%2C72471280%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73249150%2C121522131&hl=en-NG&gl=ng&ssta=1&ts=CAEaRgooEiYyJDB4MTAzYjkzOGE4YWIxZTY4NToweDkxNzE4YmNmNmIxM2E2YhIaEhQKBwjqDxACGBoSBwjqDxACGBsYATICEAA&qs=CAEyE0Nnb0k2X1RFdGMtWHhvc0pFQUU4AkIJCWs6sfa8GBcJQgkJazqx9rwYFwk&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwiQhfjL-vaSAxUAAAAAHQAAAAAQBw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5
                bg-gold-500 hover:bg-gold-400 text-navy-900
                text-[9px] sm:text-[10px] tracking-[0.2em] font-bold
                transition-all duration-200 whitespace-nowrap rounded-lg"
            >
              <FaGoogle className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> LEAVE A REVIEW
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Section header ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 justify-center mb-3">
            <span className="w-8 h-px bg-gold-500/50" />
            <span className="text-gold-500 text-[10px] sm:text-[11px] tracking-[0.25em] font-bold uppercase">
              Testimonials
            </span>
            <span className="w-8 h-px bg-gold-500/50" />
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What Our <span className="text-gold-500">Guests Say</span>
          </h2>
          <p className="text-gray-500 dark:text-white/40 text-xs sm:text-sm mt-2 max-w-lg mx-auto px-4">
            Real experiences from real guests — every word unedited and genuine.
          </p>
        </motion.div>
      </div>

      {/* ── Reviews grid ─────────────────────────────────────────────────── */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-16 sm:pb-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={gridInView ? "visible" : "hidden"}
            >
              <TestimonialCard t={t} variant="light" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA strip ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-navy-900 dark:bg-navy-950 py-12 sm:py-16 px-4 text-center">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-gold-500 text-[9px] sm:text-[10px] tracking-[0.3em] font-bold uppercase mb-3 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-gold-500/50" /> Join Our Happy Guests{" "}
            <span className="w-6 h-px bg-gold-500/50" />
          </p>
          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-5 sm:mb-6 px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Experience It For Yourself
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/rooms" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gold-500 hover:bg-gold-400 text-navy-900
                  text-[10px] sm:text-xs tracking-[0.2em] font-bold transition-all duration-300 shadow-lg rounded-lg"
              >
                BOOK YOUR STAY
              </motion.button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/20 hover:border-gold-500
                  text-white/70 hover:text-gold-400
                  text-[10px] sm:text-xs tracking-[0.2em] font-bold transition-all duration-300 rounded-lg"
              >
                CONTACT US
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
