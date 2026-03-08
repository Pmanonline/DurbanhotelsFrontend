import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBed,
  FaUsers,
  FaHeart,
  FaAward,
  FaSwimmingPool,
  FaDumbbell,
  FaUtensils,
  FaCar,
  FaWifi,
  FaConciergeBell,
  FaArrowRight,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import { MdSpa } from "react-icons/md";

// ── Import hotel images ───────────────────────────────────────────────────────
import LobbyImage from "../assets/images/gridImage1.jpg";
import PoolImage from "../assets/images/gridImage2.avif";
import RoomImage from "../assets/images/gridImage3.jpg";
import GymImage from "../assets/images/gridImage4.avif";
import HeroImage from "../assets/images/heroImage3.jpg"; // reuse existing hero

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  { icon: <FaBed className="w-7 h-7" />, value: "86", label: "Rooms & Suites" },
  {
    icon: <FaUsers className="w-7 h-7" />,
    value: "50",
    label: "Hospitality Experts",
  },
  {
    icon: <FaHeart className="w-7 h-7" />,
    value: "12,511",
    label: "Annual Guests Hosted",
  },
  {
    icon: <FaAward className="w-7 h-7" />,
    value: "4.3★",
    label: "Average Guest Rating",
  },
];

// ── About sections ────────────────────────────────────────────────────────────
const ABOUT_ITEMS = [
  {
    label: "Overview",
    text: "DubanInternational Hotel is Ogba/Ikeja's contemporary hospitality hub, uniting cosmopolitan design with heartfelt Nigerian service to create a seamless experience for business leaders, diplomats, and lifestyle seekers.",
  },
  {
    label: "Location & Connectivity",
    text: "Situated on Ogunnusi Road in Aguda Ogba, we place guests minutes from Murtala Muhammed International Airport and the Ikeja business district while offering direct access to convention centres, tech corridors, and Lagos' cultural hotspots.",
  },
  {
    label: "Luxury Narrative",
    text: "From the double-height lobby to curated Nigerian artworks, every corner narrates the Dubanstory — timeless finishes, intuitive technology, and personalised hosts who anticipate needs around the clock.",
  },
  {
    label: "Accommodations",
    text: "Our 120+ rooms and expansive executive suites feature skyline views, dedicated work lounges, and plush residential comforts tailored to extended-stay executives and destination travellers alike.",
  },
  {
    label: "Wellness & Dining",
    text: "Recharge on the dedicated wellness floor with spa-inspired treatments, a Technogym studio, and pool cabanas before savouring chef-led dining concepts that celebrate Lagos' global palate.",
  },
  {
    label: "Curated Experiences",
    text: "Concierge-designed art walks, market immersions, convention transfers, and private aviation coordination ensure every stay is as purposeful as it is indulgent.",
  },
];

// ── Hotel amenities ───────────────────────────────────────────────────────────
const AMENITIES = [
  { icon: <FaSwimmingPool />, label: "Swimming Pool" },
  { icon: <MdSpa />, label: "Spa & Wellness" },
  { icon: <FaDumbbell />, label: "Fitness Centre" },
  { icon: <FaUtensils />, label: "Fine Dining" },
  { icon: <FaCar />, label: "Airport Transfer" },
  { icon: <FaWifi />, label: "High-Speed WiFi" },
  { icon: <FaConciergeBell />, label: "24/7 Concierge" },
  { icon: <FaBed />, label: "Premium Bedding" },
];

// ── Fade-up variant ───────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="hover:text-gold-400 transition-colors cursor-pointer">
      PAGES
    </span>
    <span>/</span>
    <span className="text-gold-400">ABOUT</span>
  </nav>
);

// ── Animated counter ──────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, index, inView }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    animate={inView ? "visible" : "hidden"}
    className="flex flex-col items-center text-center p-6 bg-white dark:bg-navy-800
               border border-gray-100 dark:border-white/8
               hover:border-gold-400 dark:hover:border-gold-500/50
               transition-all duration-300 group"
  >
    <div
      className="w-14 h-14 bg-gold-500/10 dark:bg-gold-500/15 flex items-center justify-center
                    text-gold-500 mb-4 group-hover:bg-gold-500 group-hover:text-white
                    transition-all duration-300"
    >
      {icon}
    </div>
    <p
      className="text-3xl font-bold text-navy-900 dark:text-white mb-1"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {value}
    </p>
    <p className="text-[11px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold">
      {label}
    </p>
  </motion.div>
);

// ── Main AboutUs component ────────────────────────────────────────────────────
const AboutUs = () => {
  const bodyRef = useRef(null);
  const statsRef = useRef(null);
  const amenRef = useRef(null);
  const gridRef = useRef(null);

  const bodyInView = useInView(bodyRef, { once: true, margin: "-50px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const amenInView = useInView(amenRef, { once: true, margin: "-60px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  // Parallax on hero image
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden bg-navy-900">
        <motion.img
          src={HeroImage}
          alt="DubanInternational Hotel"
          style={{ y: heroY }}
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-navy-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/30" />
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            About Us
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>

        {/* Gold bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px]
                        bg-gradient-to-r from-transparent via-gold-500 to-transparent"
        />
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 xl:gap-20 items-start">
          {/* ── LEFT: Text content ─────────────────────────────────────── */}
          <div>
            {/* Section eyebrow */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={bodyInView ? "visible" : "hidden"}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-gold-500" />
                <span className="text-gold-500 text-[11px] tracking-[0.35em] font-bold uppercase">
                  About Us
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-navy-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Discover <span className="text-gold-500">DUBAN</span>
                <br />
                INTERNATIONAL HOTEL
              </h2>
            </motion.div>

            {/* About items */}
            <div className="space-y-4 mb-10">
              {ABOUT_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  custom={i + 1}
                  variants={fadeUp}
                  initial="hidden"
                  animate={bodyInView ? "visible" : "hidden"}
                  className="group"
                >
                  <p className="text-sm text-gray-700 dark:text-white/65 leading-relaxed">
                    <span className="font-bold text-navy-900 dark:text-white">
                      {item.label}:{" "}
                    </span>
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Explore CTA */}
            <motion.div
              custom={8}
              variants={fadeUp}
              initial="hidden"
              animate={bodyInView ? "visible" : "hidden"}
            >
              <Link to="/rooms">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-4
                             bg-gold-500 hover:bg-gold-400 text-white
                             text-xs tracking-[0.28em] font-bold
                             transition-all duration-300 shadow-lg group"
                >
                  EXPLORE THE DUBAN EXPERIENCE
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Photo grid ──────────────────────────────────────── */}
          <div ref={gridRef}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-2 gap-3"
            >
              {/* Large top-left */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="col-span-1 row-span-2 overflow-hidden relative group"
                style={{ height: "380px" }}
              >
                <img
                  src={LobbyImage}
                  alt="Hotel Lobby"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent opacity-0
                                group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-bold tracking-widest text-white bg-gold-500/90 px-2.5 py-1">
                    LOBBY
                  </span>
                </div>
              </motion.div>

              {/* Top-right */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden relative group"
                style={{ height: "185px" }}
              >
                <img
                  src={PoolImage}
                  alt="Swimming Pool"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent opacity-0
                                group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-bold tracking-widest text-white bg-gold-500/90 px-2.5 py-1">
                    POOL
                  </span>
                </div>
              </motion.div>

              {/* Bottom-right: two small images side by side */}
              <div
                className="grid grid-cols-2 gap-3"
                style={{ height: "185px" }}
              >
                {[
                  { src: RoomImage, label: "ROOMS" },
                  { src: GymImage, label: "FITNESS" },
                ].map(({ src, label }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden relative group h-full"
                  >
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent opacity-0
                                    group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[9px] font-bold tracking-widest text-white bg-gold-500/90 px-2 py-0.5">
                        {label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="mt-4 flex items-center gap-3 px-5 py-3.5
                         bg-navy-900 dark:bg-navy-950 border border-navy-700 dark:border-white/8"
            >
              <FaMapMarkerAlt className="text-gold-500 w-4 h-4 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-white/35 tracking-widest uppercase">
                  Location
                </p>
                <p className="text-sm text-white font-semibold">
                  63 Ogunnusi Rd, Aguda, Lagos, Nigeria
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1 text-gold-400">
                <FaStar className="w-3 h-3" />
                <span className="text-xs font-bold text-white/70">4.3</span>
                <span className="text-[10px] text-white/30">· 346 reviews</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="bg-gray-50 dark:bg-navy-800 border-y border-gray-100 dark:border-white/8 py-14"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            className="flex items-center gap-3 justify-center mb-10"
          >
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-500 text-[11px] tracking-[0.35em] font-bold uppercase">
              By The Numbers
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} inView={statsInView} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Amenities ───────────────────────────────────────────────────── */}
      <div
        ref={amenRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20"
      >
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={amenInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <div className="flex items-center gap-3 justify-center mb-3">
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-500 text-[11px] tracking-[0.35em] font-bold uppercase">
              What We Offer
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hotel Amenities
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Every detail at DubanInternational is curated to exceed expectations
            — from world-class facilities to bespoke personal service.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {AMENITIES.map((a, i) => (
            <motion.div
              key={a.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={amenInView ? "visible" : "hidden"}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-6
                         bg-white dark:bg-navy-800
                         border border-gray-100 dark:border-white/8
                         hover:border-gold-400 dark:hover:border-gold-500/50
                         transition-all duration-300 group cursor-default"
            >
              <div className="text-2xl text-gold-500 mb-3 group-hover:scale-110 transition-transform duration-200">
                {a.icon}
              </div>
              <p className="text-xs font-semibold tracking-wide text-gray-600 dark:text-white/60">
                {a.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA strip ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-navy-900 py-16 px-6 sm:px-10 text-center">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-transparent to-navy-900 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-gold-400 text-[11px] tracking-[0.4em] font-bold uppercase mb-3 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-400" /> Ready To Experience Duban?{" "}
            <span className="w-8 h-px bg-gold-400" />
          </p>
          <h3
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Book Your Stay Today
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/rooms">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-white
                           text-xs tracking-[0.28em] font-bold transition-all duration-300 shadow-lg"
              >
                EXPLORE ROOMS
              </motion.button>
            </Link>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 border border-white/20 hover:border-gold-500
                           text-white/70 hover:text-gold-400
                           text-xs tracking-[0.28em] font-bold transition-all duration-300"
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

export default AboutUs;
