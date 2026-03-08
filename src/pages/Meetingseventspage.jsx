import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

import HeroImage from "../assets/images/eventimage.png";
import LobbyImage from "../assets/images/gridImage1.jpg";
import PoolImage from "../assets/images/gridImage2.avif";
import RoomImage from "../assets/images/gridImage3.jpg";
import GymImage from "../assets/images/gridImage4.avif";

const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest flex-wrap justify-center">
    <Link
      to="/"
      className="hover:text-gold-400 transition-colors whitespace-nowrap"
    >
      HOME
    </Link>
    <span>/</span>
    <span className="text-white/30 whitespace-nowrap">PAGES</span>
    <span>/</span>
    <span className="text-gold-400 whitespace-nowrap">MEETINGS & EVENTS</span>
  </nav>
);

const TABS = ["Venues", "Corporate Events", "Private Events"];

const VENUES = [
  {
    name: "DubanGrand Hall",
    size: "580 m²",
    image: LobbyImage,
    capacity: [
      { label: "Banquet", value: 300 },
      { label: "Theatre", value: 350 },
      { label: "Reception", value: 400 },
    ],
    features: [
      "Full AV & LED screen",
      "Stage & podium",
      "Partitionable into 3 zones",
      "Dedicated catering kitchen",
    ],
  },
  {
    name: "Executive Boardroom",
    size: "85 m²",
    image: GymImage,
    capacity: [
      { label: "Boardroom", value: 18 },
      { label: "Classroom", value: 20 },
      { label: "Theatre", value: 30 },
    ],
    features: [
      '65" 4K display',
      "Video conferencing",
      "Fibre WiFi",
      "Executive catering",
    ],
  },
  {
    name: "Ogba Conference Suite",
    size: "220 m²",
    image: RoomImage,
    capacity: [
      { label: "Banquet", value: 80 },
      { label: "Classroom", value: 60 },
      { label: "Theatre", value: 120 },
    ],
    features: [
      "Dual projector & screen",
      "Integrated PA system",
      "Flexible layout",
      "Dedicated WiFi SSID",
    ],
  },
  {
    name: "Poolside Event Terrace",
    size: "300 m²",
    image: PoolImage,
    capacity: [
      { label: "Banquet", value: 120 },
      { label: "Reception", value: 250 },
    ],
    features: [
      "Open-air terrace",
      "LED mood lighting",
      "DJ booth & dance floor",
      "Poolside bar access",
    ],
  },
];

const CORPORATE = [
  {
    title: "Full-Day Conference",
    desc: "A complete turnkey package — venue, AV, meals, and a dedicated event coordinator — so you can focus entirely on your agenda.",
    includes: [
      "Venue hire",
      "Arrival refreshments",
      "Working lunch",
      "Full AV & tech support",
      "On-site event manager",
    ],
  },
  {
    title: "Hybrid Conference",
    desc: "Seamlessly connect in-person and remote attendees via our studio-grade broadcast setup.",
    includes: [
      "HD live streaming",
      "Zoom / Teams setup",
      "Dedicated tech operator",
      "Recording files delivered",
    ],
  },
  {
    title: "Exhibition & Launch",
    desc: "Product reveals, brand activations, and expos in our 580 m² Grand Hall — Lagos Mainland's largest hotel event space.",
    includes: [
      "Grand Hall exclusive hire",
      "Stage & LED backdrop",
      "Cocktail reception",
      "Branded signage",
    ],
  },
];

const PRIVATE = [
  {
    emoji: "💍",
    title: "Weddings & Receptions",
    desc: "Up to 300 guests. Bespoke menus, décor, and a dedicated coordinator from first enquiry to last dance.",
  },
  {
    emoji: "🎂",
    title: "Birthday & Milestone Galas",
    desc: "Custom décor themes, signature cocktails, and a private dining experience tailored to your celebration.",
  },
  {
    emoji: "🏆",
    title: "Award Ceremonies",
    desc: "Red-carpet setup, stage & podium, gala dinner, and optional live streaming for your black-tie occasion.",
  },
  {
    emoji: "🎓",
    title: "Graduation & Valedictory",
    desc: "Dignified spaces for convocation ceremonies, alumni dinners, and departmental farewell functions.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const MeetingsEventsPage = () => {
  const [activeTab, setActiveTab] = useState("Venues");
  const contentRef = useRef(null);
  const inView = useInView(contentRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 overflow-x-hidden w-full">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-[50vh] sm:h-[60vh] overflow-hidden bg-navy-900 w-full">
        <motion.img
          src={HeroImage}
          alt="Meetings & Events"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-navy-900/58" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-transparent to-navy-900/20" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 gap-4 max-w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center"
          >
            <span className="w-8 sm:w-10 h-px bg-gold-500" />
            <span className="text-gold-400 text-[9px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.42em] font-bold uppercase whitespace-nowrap">
              DubanInternational Hotel
            </span>
            <span className="w-8 sm:w-10 h-px bg-gold-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight px-2 font-heading"
          >
            Meetings &amp; <span className="text-gold-400">Events</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-white/50 text-xs sm:text-sm max-w-md leading-relaxed px-4 font-body"
          >
            Four versatile event spaces. Seamless planning. Exceptional
            experiences — in the heart of Lagos Mainland.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="px-4"
          >
            <Breadcrumb />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] sm:h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div>

      {/* ── Sticky Tab Nav ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white/97 dark:bg-navy-900/97 backdrop-blur-md border-b border-gray-100 dark:border-white/8 shadow-sm w-full">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center overflow-x-auto scrollbar-hide py-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-shrink-0 px-4 sm:px-7 md:px-10 py-4 sm:py-5 text-[9px] sm:text-[11px] font-bold tracking-[0.15em] sm:tracking-[0.22em] uppercase transition-all duration-200 border-b-2 whitespace-nowrap"
                style={{
                  borderBottomColor:
                    activeTab === tab ? "#F5A623" : "transparent",
                }}
              >
                <span
                  className={`${
                    activeTab === tab
                      ? "text-gold-500"
                      : "text-gray-400 dark:text-white/35 hover:text-navy-800 dark:hover:text-white/60"
                  }`}
                >
                  {tab}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabDot"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        ref={contentRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 w-full overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {/* ════ VENUES ════ */}
          {activeTab === "Venues" && (
            <motion.div
              key="venues"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="w-6 sm:w-8 h-px bg-gold-500" />
                  <span className="text-gold-500 text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.32em] font-bold uppercase">
                    Our Spaces
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white font-heading">
                  Four Distinct Event Spaces
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {VENUES.map((venue, i) => (
                  <motion.div
                    key={venue.name}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="group border border-gray-100 dark:border-white/8 bg-white dark:bg-navy-800
                               overflow-hidden hover:border-gold-400 dark:hover:border-gold-500/40 transition-all duration-300 w-full"
                  >
                    {/* Image */}
                    <div className="relative h-48 sm:h-52 overflow-hidden">
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <h3 className="text-white font-bold text-base sm:text-lg leading-tight font-heading pr-2">
                          {venue.name}
                        </h3>
                        <span className="bg-gold-500 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-1 tracking-wide flex-shrink-0 whitespace-nowrap">
                          {venue.size}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 sm:p-6">
                      {/* Capacity pills */}
                      <div className="flex gap-2 sm:gap-3 flex-wrap mb-4 sm:mb-5">
                        {venue.capacity.map((cap) => (
                          <div
                            key={cap.label}
                            className="flex flex-col items-center bg-gray-50 dark:bg-navy-900/60
                                       border border-gray-100 dark:border-white/8 px-2 sm:px-4 py-1.5 sm:py-2 min-w-[60px] sm:min-w-[70px]"
                          >
                            <span className="text-base sm:text-lg font-bold text-navy-900 dark:text-white font-heading">
                              {cap.value}
                            </span>
                            <span className="text-[7px] sm:text-[9px] tracking-[0.12em] sm:tracking-[0.18em] text-gray-400 dark:text-white/35 uppercase font-semibold whitespace-nowrap">
                              {cap.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {/* Features */}
                      <ul className="space-y-1 sm:space-y-1.5 mb-4 sm:mb-5">
                        {venue.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-gray-500 dark:text-white/50"
                          >
                            <FaCheck className="text-gold-500 w-2 h-2 sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Link to="/contact">
                        <span
                          className="inline-flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] font-bold
                                         text-gold-500 hover:text-gold-400 transition-colors cursor-pointer"
                        >
                          REQUEST PROPOSAL{" "}
                          <FaArrowRight className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════ CORPORATE ════ */}
          {activeTab === "Corporate Events" && (
            <motion.div
              key="corporate"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="w-6 sm:w-8 h-px bg-gold-500" />
                  <span className="text-gold-500 text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.32em] font-bold uppercase">
                    Corporate
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-2 sm:mb-3 font-heading">
                  Where Business Gets Done
                </h2>
                <p className="text-gray-400 dark:text-white/40 text-xs sm:text-sm max-w-xl leading-relaxed font-body">
                  Every package includes a dedicated event manager and full AV
                  support.
                </p>
              </div>

              {/* Packages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
                {CORPORATE.map((pkg, i) => (
                  <motion.div
                    key={pkg.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="group flex flex-col border border-gray-100 dark:border-white/8
                               bg-white dark:bg-navy-800 p-5 sm:p-7
                               hover:border-gold-400 dark:hover:border-gold-500/40 transition-all duration-300"
                  >
                    <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] text-gold-500 font-bold uppercase mb-1 font-body">
                      Package {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-navy-900 dark:text-white mb-2 sm:mb-3 font-heading">
                      {pkg.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-white/45 leading-relaxed mb-4 sm:mb-5 flex-1 font-body">
                      {pkg.desc}
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
                      {pkg.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-gray-500 dark:text-white/50"
                        >
                          <FaCheck className="text-gold-500 w-2 h-2 sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/contact" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-2.5 sm:py-3 bg-navy-900 dark:bg-white/8 hover:bg-gold-500 dark:hover:bg-gold-500
                                   text-white text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] font-bold transition-all duration-300 font-body"
                      >
                        GET A QUOTE
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Capacity table */}
              <div className="border border-gray-100 dark:border-white/8 bg-white dark:bg-navy-800 overflow-hidden w-full">
                <div className="px-4 sm:px-7 py-4 sm:py-5 border-b border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-navy-900/50">
                  <h3 className="text-sm sm:text-base font-bold text-navy-900 dark:text-white font-heading">
                    Venue Capacity at a Glance
                  </h3>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-xs sm:text-sm min-w-[600px] sm:min-w-0">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/8">
                        <th className="text-left px-3 sm:px-7 py-3 sm:py-4 text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-gray-400 dark:text-white/30 uppercase font-bold font-body">
                          Venue
                        </th>
                        <th className="px-2 sm:px-5 py-3 sm:py-4 text-[8px] sm:text-[10px] text-gray-400 dark:text-white/30 uppercase font-bold text-center tracking-[0.15em] sm:tracking-[0.18em] font-body">
                          m²
                        </th>
                        {["Banquet", "Classroom", "Theatre", "Reception"].map(
                          (h) => (
                            <th
                              key={h}
                              className="px-2 sm:px-5 py-3 sm:py-4 text-[8px] sm:text-[10px] text-gray-400 dark:text-white/30 uppercase font-bold text-center tracking-[0.15em] sm:tracking-[0.18em] font-body whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          name: "DubanGrand Hall",
                          size: 580,
                          banquet: 300,
                          classroom: 200,
                          theatre: 350,
                          reception: 400,
                        },
                        {
                          name: "Executive Boardroom",
                          size: 85,
                          banquet: null,
                          classroom: 20,
                          theatre: 30,
                          reception: null,
                        },
                        {
                          name: "Ogba Conference Suite",
                          size: 220,
                          banquet: 80,
                          classroom: 60,
                          theatre: 120,
                          reception: 150,
                        },
                        {
                          name: "Poolside Terrace",
                          size: 300,
                          banquet: 120,
                          classroom: null,
                          theatre: null,
                          reception: 250,
                        },
                      ].map((row) => (
                        <tr
                          key={row.name}
                          className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                        >
                          <td className="px-3 sm:px-7 py-3 sm:py-4 font-semibold text-navy-900 dark:text-white text-[11px] sm:text-sm font-body">
                            {row.name}
                          </td>
                          <td className="px-2 sm:px-5 py-3 sm:py-4 text-center font-bold text-navy-900 dark:text-white text-[11px] sm:text-sm font-body">
                            {row.size}
                          </td>
                          {[
                            row.banquet,
                            row.classroom,
                            row.theatre,
                            row.reception,
                          ].map((v, j) => (
                            <td
                              key={j}
                              className="px-2 sm:px-5 py-3 sm:py-4 text-center text-[11px] sm:text-sm font-body"
                            >
                              {v !== null ? (
                                <span className="font-bold text-navy-900 dark:text-white">
                                  {v}
                                </span>
                              ) : (
                                <span className="text-gray-200 dark:text-white/15">
                                  —
                                </span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ PRIVATE ════ */}
          {activeTab === "Private Events" && (
            <motion.div
              key="private"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <span className="w-6 sm:w-8 h-px bg-gold-500" />
                  <span className="text-gold-500 text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.32em] font-bold uppercase">
                    Private Events
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-2 sm:mb-3 font-heading">
                  Unforgettable Occasions,{" "}
                  <span className="text-gold-500">Perfectly Crafted</span>
                </h2>
                <p className="text-gray-400 dark:text-white/40 text-xs sm:text-sm max-w-xl leading-relaxed font-body">
                  Our events team handles every detail so you can be fully
                  present in the moment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-10 sm:mb-12">
                {PRIVATE.map((event, i) => (
                  <motion.div
                    key={event.title}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="flex gap-3 sm:gap-5 p-4 sm:p-6 border border-gray-100 dark:border-white/8
                               bg-white dark:bg-navy-800
                               hover:border-gold-400 dark:hover:border-gold-500/40 transition-all duration-300 group"
                  >
                    <div
                      className="w-8 h-8 sm:w-11 sm:h-11 bg-gold-500/8 dark:bg-gold-500/10 flex items-center justify-center
                                    text-xl sm:text-2xl flex-shrink-0 group-hover:bg-gold-500/15 transition-colors duration-300"
                    >
                      {event.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-navy-900 dark:text-white mb-1 sm:mb-1.5 text-sm sm:text-base font-heading">
                        {event.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-gray-500 dark:text-white/45 leading-relaxed font-body">
                        {event.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Poolside strip */}
              <div className="relative h-56 sm:h-72 overflow-hidden group w-full">
                <img
                  src={PoolImage}
                  alt="Poolside Events"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-navy-900/68" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <p className="text-gold-400 text-[9px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.38em] font-bold uppercase mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
                    <span className="w-6 sm:w-8 h-px bg-gold-400" />
                    Poolside Terrace
                    <span className="w-6 sm:w-8 h-px bg-gold-400" />
                  </p>
                  <p className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 font-heading">
                    Under the Lagos Stars
                  </p>
                  <a
                    href="https://wa.me/2348103785017?text=Hi%2C%20I%27d%20like%20to%20enquire%20about%20a%20private%20event%20at%20Duban%20Hotel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto max-w-[280px] sm:max-w-none"
                  >
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-green-500 hover:bg-green-400 text-white
                                 text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] font-bold transition-all duration-300 font-body"
                    >
                      <FaWhatsapp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      ENQUIRE ON WHATSAPP
                    </motion.button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-navy-900 py-12 sm:py-16 px-4 text-center w-full">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #F5A623 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-gold-400 text-[9px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.4em] font-bold uppercase mb-2 sm:mb-3 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="w-6 sm:w-8 h-px bg-gold-400" />
            Start Planning
            <span className="w-6 sm:w-8 h-px bg-gold-400" />
          </p>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 font-heading">
            Ready to Host Your Event?
          </h3>
          <p className="text-white/40 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed font-body">
            Contact our events team — we'll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <a
              href="tel:+2348103785017"
              className="flex items-center gap-2 text-white/50 hover:text-gold-400 transition-colors text-xs sm:text-sm font-body"
            >
              <FaPhone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-500" />
              +234 810 378 5017
            </a>
            <span className="text-white/20 hidden sm:block">|</span>
            <a
              href="mailto:bookings@dubaninternationalhotel.com"
              className="flex items-center gap-2 text-white/50 hover:text-gold-400 transition-colors text-xs sm:text-sm font-body"
            >
              <FaEnvelope className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gold-500" />
              bookings@dubaninternationalhotel.com
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/contact" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gold-500 hover:bg-gold-400 text-white text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.28em] font-bold transition-all duration-300 shadow-lg font-body"
              >
                REQUEST A PROPOSAL
              </motion.button>
            </Link>
            <a
              href="https://wa.me/2348103785017"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/20 hover:border-gold-500 text-white/60 hover:text-gold-400
                           text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.28em] font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 font-body"
              >
                <FaWhatsapp className="w-3 h-3 sm:w-4 sm:h-4" />
                WHATSAPP US
              </motion.button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsEventsPage;
