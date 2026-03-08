import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";

import gridImage1 from "../assets/images/gridImage1.jpg";
import gridImage2 from "../assets/images/gridImage2.avif";
import gridImage3 from "../assets/images/gridImage3.jpg";
import gridImage4 from "../assets/images/gridImage4.avif";
import heroImage3 from "../assets/images/heroImage3.jpg";

const CATEGORIES = ["ALL", "HOTEL", "ROOMS", "POOL & SPA", "DINING", "EVENTS"];

const GALLERY_ITEMS = [
  {
    id: 1,
    category: "HOTEL",
    src: heroImage3,
    alt: "Hotel Facade",
    caption: "Hotel Exterior",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    category: "HOTEL",
    src: gridImage1,
    alt: "Grand Lobby",
    caption: "Grand Lobby",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    category: "HOTEL",
    src: gridImage3,
    alt: "Reception Area",
    caption: "Reception",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    category: "HOTEL",
    src: gridImage4,
    alt: "Hotel Corridor",
    caption: "Executive Corridor",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    category: "HOTEL",
    src: gridImage2,
    alt: "Hotel Entrance",
    caption: "Entrance & Gardens",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    category: "ROOMS",
    src: gridImage3,
    alt: "Deluxe Room",
    caption: "Deluxe Room",
    span: "col-span-2 row-span-2",
  },
  {
    id: 7,
    category: "ROOMS",
    src: gridImage1,
    alt: "Executive Suite",
    caption: "Executive Suite",
    span: "col-span-1 row-span-1",
  },
  {
    id: 8,
    category: "ROOMS",
    src: gridImage4,
    alt: "Presidential Suite",
    caption: "Presidential Suite",
    span: "col-span-1 row-span-2",
  },
  {
    id: 9,
    category: "ROOMS",
    src: heroImage3,
    alt: "Room View",
    caption: "Skyline View Room",
    span: "col-span-1 row-span-1",
  },
  {
    id: 10,
    category: "ROOMS",
    src: gridImage2,
    alt: "Room Bathroom",
    caption: "Luxury Ensuite",
    span: "col-span-1 row-span-1",
  },
  {
    id: 11,
    category: "POOL & SPA",
    src: gridImage2,
    alt: "Swimming Pool",
    caption: "Outdoor Pool",
    span: "col-span-2 row-span-2",
  },
  {
    id: 12,
    category: "POOL & SPA",
    src: gridImage4,
    alt: "Pool Cabana",
    caption: "Pool Cabanas",
    span: "col-span-1 row-span-1",
  },
  {
    id: 13,
    category: "POOL & SPA",
    src: gridImage1,
    alt: "Spa Treatment",
    caption: "Spa Treatment",
    span: "col-span-1 row-span-1",
  },
  {
    id: 14,
    category: "POOL & SPA",
    src: gridImage3,
    alt: "Fitness Centre",
    caption: "Technogym Fitness",
    span: "col-span-1 row-span-1",
  },
  {
    id: 15,
    category: "POOL & SPA",
    src: heroImage3,
    alt: "Pool at Night",
    caption: "Pool by Night",
    span: "col-span-1 row-span-1",
  },
  {
    id: 16,
    category: "DINING",
    src: gridImage1,
    alt: "Restaurant",
    caption: "Main Restaurant",
    span: "col-span-2 row-span-2",
  },
  {
    id: 17,
    category: "DINING",
    src: gridImage3,
    alt: "Bar Lounge",
    caption: "Signature Bar",
    span: "col-span-1 row-span-1",
  },
  {
    id: 18,
    category: "DINING",
    src: gridImage2,
    alt: "Fine Dining",
    caption: "Fine Dining",
    span: "col-span-1 row-span-1",
  },
  {
    id: 19,
    category: "DINING",
    src: gridImage4,
    alt: "Private Dining",
    caption: "Private Dining",
    span: "col-span-2 row-span-1",
  },
  {
    id: 20,
    category: "EVENTS",
    src: gridImage4,
    alt: "Banquet Hall",
    caption: "Grand Banquet Hall",
    span: "col-span-2 row-span-2",
  },
  {
    id: 21,
    category: "EVENTS",
    src: gridImage1,
    alt: "Conference Room",
    caption: "Business Centre",
    span: "col-span-1 row-span-1",
  },
  {
    id: 22,
    category: "EVENTS",
    src: heroImage3,
    alt: "Wedding Setup",
    caption: "Wedding Receptions",
    span: "col-span-1 row-span-1",
  },
  {
    id: 23,
    category: "EVENTS",
    src: gridImage2,
    alt: "Corporate Event",
    caption: "Corporate Events",
    span: "col-span-2 row-span-1",
  },
];

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="text-white/30">PAGES</span>
    <span>/</span>
    <span className="text-gold-400">GALLERY</span>
  </nav>
);

// ══════════════════════════════════════════════════════════════════════════════
// ── FULL-SCREEN LIGHTBOX WITH TOUCH SWIPE ────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const Lightbox = ({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  setIndex,
}) => {
  const item = items[currentIndex];

  // Touch swipe tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isHorizontal = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  // Thumbnail auto-scroll
  const thumbRef = useRef(null);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  // Keep active thumbnail visible
  useEffect(() => {
    if (!thumbRef.current) return;
    const el = thumbRef.current.children[currentIndex];
    if (el)
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  }, [currentIndex]);

  // ── Touch handlers ──────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontal.current = false;
    setDragX(0);
    setDragging(false);
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    // Decide direction on first meaningful move
    if (!isHorizontal.current && !dragging) {
      if (Math.abs(dx) < Math.abs(dy) && Math.abs(dy) > 6) return; // vertical — let it scroll
      if (Math.abs(dx) > 6) isHorizontal.current = true;
    }

    if (!isHorizontal.current) return;

    // Block vertical scroll while swiping image
    e.preventDefault();
    setDragging(true);
    setDragX(dx);
  };

  const onTouchEnd = () => {
    if (!dragging) {
      touchStartX.current = null;
      return;
    }

    const threshold = window.innerWidth * 0.22; // 22% of screen = commit swipe
    if (dragX < -threshold && currentIndex < items.length - 1) onNext();
    else if (dragX > threshold && currentIndex > 0) onPrev();

    setDragX(0);
    setDragging(false);
    touchStartX.current = null;
    isHorizontal.current = false;
  };

  if (!item) return null;

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < items.length - 1;

  // How far the image should visually shift (rubber-band at edges)
  const visualDrag = (() => {
    if (!dragging) return 0;
    if (dragX < 0 && !canNext) return dragX * 0.15; // rubber-band right edge
    if (dragX > 0 && !canPrev) return dragX * 0.15; // rubber-band left edge
    return dragX;
  })();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col"
    >
      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent z-30" />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 pt-safe pt-4 pb-2 flex-shrink-0">
        <span className="text-[11px] tracking-[0.28em] text-white/40 font-bold tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
        <span className="text-[10px] tracking-[0.3em] text-gold-400 font-bold uppercase absolute left-1/2 -translate-x-1/2">
          {item.category}
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-white/20
                     text-white border border-white/15 transition-all active:scale-90"
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Image area ───────────────────────────────────────────────────── */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden min-h-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: dragging ? "none" : "pan-y" }}
      >
        {/* The image — translates with finger drag */}
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translateX(${visualDrag}px)`,
            transition: dragging
              ? "none"
              : "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
            willChange: "transform",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={item.id}
              src={item.src}
              alt={item.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="max-w-full max-h-full w-full h-full object-contain select-none pointer-events-none"
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* Desktop arrows */}
        {canPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="hidden sm:flex absolute left-4 z-20 w-12 h-12 items-center justify-center
                       border border-white/15 bg-black/40 hover:bg-gold-500/25 hover:border-gold-500/50
                       text-white transition-all backdrop-blur-sm"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
        )}
        {canNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="hidden sm:flex absolute right-4 z-20 w-12 h-12 items-center justify-center
                       border border-white/15 bg-black/40 hover:bg-gold-500/25 hover:border-gold-500/50
                       text-white transition-all backdrop-blur-sm"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Mobile invisible tap zones */}
        <button
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous"
          className="sm:hidden absolute left-0 top-0 bottom-0 w-[30%] z-20 opacity-0 cursor-pointer"
        />
        <button
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next"
          className="sm:hidden absolute right-0 top-0 bottom-0 w-[30%] z-20 opacity-0 cursor-pointer"
        />

        {/* Swipe edge glow (visual feedback) */}
        {dragging && dragX < -20 && (
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gold-500/50 pointer-events-none" />
        )}
        {dragging && dragX > 20 && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500/50 pointer-events-none" />
        )}
      </div>

      {/* ── Caption + dot indicator ──────────────────────────────────────── */}
      <div
        className="relative z-30 flex-shrink-0 px-5 py-3 flex items-center justify-between
                      bg-black/70 backdrop-blur-sm border-t border-white/6"
      >
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-white font-semibold text-sm truncate">
            {item.caption}
          </p>
          <p className="text-[10px] text-white/30 tracking-[0.2em] mt-0.5 uppercase">
            DubanInternational Hotel
          </p>
        </div>

        {/* Dot indicators (mobile only, up to 15 items) */}
        <div className="flex items-center gap-1.5 sm:hidden flex-shrink-0">
          {items.length <= 15 ? (
            items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`rounded-full transition-all duration-250 ${
                  idx === currentIndex
                    ? "w-4 h-[5px] bg-gold-500"
                    : "w-[5px] h-[5px] bg-white/25 hover:bg-white/45"
                }`}
              />
            ))
          ) : (
            <span className="text-[11px] text-white/35 tabular-nums">
              {currentIndex + 1} / {items.length}
            </span>
          )}
        </div>
      </div>

      {/* ── Thumbnail strip ──────────────────────────────────────────────── */}
      <div className="relative z-30 flex-shrink-0 bg-black pb-safe pb-2 border-t border-white/5">
        <div
          ref={thumbRef}
          className="flex gap-1.5 overflow-x-auto py-2 px-3"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => setIndex(idx)}
              style={{ width: 42, height: 30, flexShrink: 0 }}
              className={`overflow-hidden transition-all duration-200 ${
                idx === currentIndex
                  ? "border-2 border-gold-500 opacity-100"
                  : "border border-white/10 opacity-35 hover:opacity-60"
              }`}
            >
              <img
                src={it.src}
                alt={it.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryItem = ({ item, index, inView, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{
      duration: 0.6,
      delay: Math.min(index * 0.07, 0.4),
      ease: [0.22, 1, 0.36, 1],
    }}
    onClick={onClick}
    className={`relative overflow-hidden group cursor-pointer ${item.span}`}
    style={{ minHeight: "170px" }}
  >
    <img
      src={item.src}
      alt={item.alt}
      className="absolute inset-0 w-full h-full object-cover
                 group-hover:scale-105 transition-transform duration-700 ease-out"
    />
    <div
      className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-400"
    />
    <div className="absolute inset-0 border-2 border-gold-500/0 group-hover:border-gold-500/60 transition-all duration-400" />
    <div
      className="absolute bottom-0 left-0 right-0 p-3 sm:p-4
                    translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
    >
      <p className="text-[9px] text-gold-400 tracking-[0.3em] font-bold uppercase mb-0.5">
        {item.category}
      </p>
      <p className="text-white font-bold text-xs sm:text-sm leading-tight">
        {item.caption}
      </p>
    </div>
    <div
      className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center
                    bg-white/10 border border-white/20 text-white
                    opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                    transition-all duration-300 backdrop-blur-sm"
    >
      <FaExpand className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
    </div>
  </motion.div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, margin: "-60px" });

  const filteredItems =
    activeCategory === "ALL"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const nextImage = useCallback(
    () => setLightboxIndex((i) => Math.min(filteredItems.length - 1, i + 1)),
    [filteredItems.length],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900">
      {/* Hero */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden bg-navy-900">
        <motion.img
          src={heroImage3}
          alt="Gallery"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-transparent to-navy-900/30" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="w-12 h-px bg-gold-500" />
            <span className="text-gold-400 text-[11px] tracking-[0.42em] font-bold uppercase">
              Visual Journey
            </span>
            <span className="w-12 h-px bg-gold-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gallery
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div>

      {/* Category tabs */}
      <div
        className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md
                      border-b border-gray-100 dark:border-white/8 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-10 lg:px-16">
          <div
            className="flex items-center overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.97 }}
                className="relative flex-shrink-0 px-3 sm:px-6 py-5 text-[10px] sm:text-[11px] font-bold
                           tracking-[0.2em] uppercase transition-all duration-300 border-b-2"
                style={{
                  borderBottomColor:
                    activeCategory === cat ? "#c9a84c" : "transparent",
                }}
              >
                <span
                  className={
                    activeCategory === cat
                      ? "text-gold-500"
                      : "text-gray-400 dark:text-white/40"
                  }
                >
                  {cat}
                </span>
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeDot"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500"
                  />
                )}
                <span
                  className={`ml-1 text-[9px] ${activeCategory === cat ? "text-gold-500/60" : "text-gray-300 dark:text-white/15"}`}
                >
                  (
                  {cat === "ALL"
                    ? GALLERY_ITEMS.length
                    : GALLERY_ITEMS.filter((g) => g.category === cat).length}
                  )
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Label row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 pt-10 pb-5">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-[11px] tracking-[0.35em] font-bold uppercase">
              {activeCategory === "ALL" ? "Full Collection" : activeCategory}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 dark:text-white/30 tracking-[0.2em]">
            {filteredItems.length} PHOTO{filteredItems.length !== 1 ? "S" : ""}
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto px-2 sm:px-10 lg:px-16 pb-20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-3"
            style={{ gridAutoRows: "170px" }}
          >
            {filteredItems.map((item, index) => (
              <GalleryItem
                key={`${activeCategory}-${item.id}`}
                item={item}
                index={index}
                inView={inView}
                onClick={() => openLightbox(index)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative overflow-hidden bg-navy-900 py-16 px-6 text-center">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-gold-400 text-[11px] tracking-[0.42em] font-bold uppercase mb-3 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-400" />
            Experience the Difference
            <span className="w-8 h-px bg-gold-400" />
          </p>
          <h3
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Stay at DubanInternational
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/rooms">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-[0.28em] font-bold transition-all duration-300 shadow-lg"
              >
                BOOK A ROOM
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 border border-white/20 hover:border-gold-500 text-white/70 hover:text-gold-400 text-xs tracking-[0.28em] font-bold transition-all duration-300"
              >
                CONTACT US
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={filteredItems}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
            setIndex={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
