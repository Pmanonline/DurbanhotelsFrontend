import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaDumbbell,
  FaSwimmer,
  FaSpa,
  FaRunning,
  FaCheck,
  FaClock,
  FaPhone,
  FaWhatsapp,
  FaChevronDown,
} from "react-icons/fa";
import {
  MdFitnessCenter,
  MdSelfImprovement,
  MdSportsGymnastics,
} from "react-icons/md";

import GymImage from "../assets/images/gymimage.jpg";
import PoolImage from "../assets/images/gridImage4.avif";
import LobbyImage from "../assets/images/gridImage1.jpg";
import RoomImage from "../assets/images/gridImage3.jpg";
import HeroImage from "../assets/images/heroImage3.jpg";

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="text-white/30">PAGES</span>
    <span>/</span>
    <span className="text-gold-400">GYM & WELLNESS</span>
  </nav>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const FACILITIES = [
  {
    icon: <MdFitnessCenter className="w-7 h-7" />,
    title: "Technogym Fitness Centre",
    desc: "State-of-the-art Technogym equipment including treadmills, ellipticals, free weights, resistance machines, and functional training zones.",
    image: GymImage,
    hours: "24 Hours",
    tag: "COMPLIMENTARY",
    features: [
      "Treadmills & Ellipticals",
      "Free Weights (5–40kg)",
      "Resistance Machines",
      "Functional Training Zone",
      "Towel & Water Service",
    ],
  },
  {
    icon: <FaSwimmer className="w-7 h-7" />,
    title: "Outdoor Swimming Pool",
    desc: "A serene outdoor pool set against lush tropical greenery — perfect for morning laps or an evening unwind after a long Lagos day.",
    image: PoolImage,
    hours: "7:00 AM – 9:00 PM",
    tag: "COMPLIMENTARY",
    features: [
      "Temperature-controlled water",
      "Sun loungers & umbrellas",
      "Towel service",
      "Poolside refreshments",
      "Children's shallow zone",
    ],
  },
  {
    icon: <FaSpa className="w-7 h-7" />,
    title: "Spa & Treatment Suites",
    desc: "Private treatment rooms offering therapeutic massages, body treatments, and beauty services by certified wellness therapists.",
    image: RoomImage,
    hours: "9:00 AM – 9:00 PM",
    tag: "BOOKABLE",
    features: [
      "Deep tissue massage",
      "Swedish relaxation",
      "Facial treatments",
      "Body scrubs & wraps",
      "Couple's suite available",
    ],
  },
];

const WELLNESS_STATS = [
  { value: "24", unit: "HRS", label: "Fitness Centre" },
  { value: "86°F", unit: "", label: "Pool Temperature" },
  { value: "4", unit: "+", label: "Wellness Facilities" },
  { value: "100%", unit: "", label: "Certified Therapists" },
];

const SPA_MENU = [
  {
    category: "Massages",
    emoji: "🤲",
    treatments: [
      { name: "Swedish Full Body", duration: "60 min", price: "₦25,000" },
      { name: "Deep Tissue Therapy", duration: "75 min", price: "₦32,000" },
      { name: "Hot Stone Massage", duration: "90 min", price: "₦42,000" },
      { name: "Couples Retreat", duration: "90 min", price: "₦75,000" },
    ],
  },
  {
    category: "Body Treatments",
    emoji: "✨",
    treatments: [
      { name: "Exfoliating Body Scrub", duration: "45 min", price: "₦18,000" },
      { name: "Detox Body Wrap", duration: "60 min", price: "₦24,000" },
      { name: "Hydrating Cocoon", duration: "75 min", price: "₦30,000" },
    ],
  },
  {
    category: "Facials",
    emoji: "💆",
    treatments: [
      {
        name: "Classic Cleansing Facial",
        duration: "45 min",
        price: "₦15,000",
      },
      { name: "Brightening Treatment", duration: "60 min", price: "₦22,000" },
      { name: "Anti-Ageing Lift", duration: "75 min", price: "₦35,000" },
    ],
  },
];

const WELLNESS_TIPS = [
  {
    icon: "🌅",
    title: "Start with the Pool",
    tip: "Morning swim sessions between 7–9 AM are quietest. The pool is heated and calm — perfect for laps or simply floating.",
  },
  {
    icon: "💪",
    title: "Fitness at Your Pace",
    tip: "The gym is fully staffed 24 hours. Our fitness team can design a personalised programme for your stay duration.",
  },
  {
    icon: "🧘",
    title: "Book Ahead for Spa",
    tip: "Spa treatments and yoga sessions fill up quickly, especially on weekends. Reserve at check-in or via WhatsApp.",
  },
  {
    icon: "🍃",
    title: "In-Room Recovery",
    tip: "Ask our wellness team for in-room stretching guides, sleep aromatherapy kits, and recovery meal recommendations from the kitchen.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Accordion for spa menu ────────────────────────────────────────────────────
const SpaAccordion = ({ item, isOpen, onToggle }) => (
  <div
    className={`border-b transition-colors duration-200 ${isOpen ? "border-gold-400/30" : "border-gray-100 dark:border-white/8"}`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left group"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{item.emoji}</span>
        <span
          className={`font-bold text-base transition-colors ${isOpen ? "text-gold-500" : "text-navy-900 dark:text-white group-hover:text-gold-500"}`}
        >
          {item.category}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-white/30 tracking-wide">
          ({item.treatments.length} treatments)
        </span>
      </div>
      <span
        className={`w-7 h-7 flex items-center justify-center border transition-all duration-300 ${isOpen ? "border-gold-500 bg-gold-500 text-white rotate-180" : "border-gray-200 dark:border-white/15 text-gray-400 dark:text-white/30 group-hover:border-gold-400 group-hover:text-gold-400"}`}
      >
        <FaChevronDown className="w-2.5 h-2.5" />
      </span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="pb-5 space-y-0">
            {item.treatments.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/5 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-white/30 flex items-center gap-1 mt-0.5">
                    <FaClock className="w-2.5 h-2.5" /> {t.duration}
                  </p>
                </div>
                <span className="text-gold-500 font-bold text-sm">
                  {t.price}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
const GymWellnessPage = () => {
  const [openSpa, setOpenSpa] = useState(0);
  const statsRef = useRef(null);
  const facilitiesRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const facilitiesInView = useInView(facilitiesRef, {
    once: true,
    margin: "-60px",
  });

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {/* <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-navy-900">
        <motion.img
          src={GymImage}
          alt="Gym & Wellness"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/40 to-navy-900/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/60 via-transparent to-transparent" />
 
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-end pb-14 px-8 sm:px-16 lg:px-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-400 text-[11px] tracking-[0.42em] font-bold uppercase">
              Durban International Hotel
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-none mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gym &<br />
            <span className="text-gold-400">Wellness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/50 text-sm sm:text-base max-w-md leading-relaxed mb-6"
          >
            Restore, strengthen, and renew — our world-class wellness facilities
            are designed to keep you at your peak, even when you're away from
            home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div> */}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] sm:h-[65vh] overflow-hidden bg-navy-900">
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
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-5 mid:mt-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-400 text-[11px] tracking-[0.42em] font-bold uppercase">
              DurbanInternational Hotel
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gym &<span className="text-gold-400">Wellness</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/50 text-sm sm:text-base max-w-md leading-relaxed mb-6"
          >
            Restore, strengthen, and renew — our world-class wellness facilities
            are designed to keep you at your peak, even when you're away from
            home.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="bg-navy-900 dark:bg-navy-950 border-b border-white/8"
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/8">
          {WELLNESS_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
              className="bg-navy-900 dark:bg-navy-950 flex flex-col items-center justify-center py-6 px-4 text-center"
            >
              <p
                className="text-3xl sm:text-4xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {stat.value}
                <span className="text-gold-400 text-xl ml-0.5">
                  {stat.unit}
                </span>
              </p>
              <p className="text-[10px] tracking-[0.25em] text-white/35 uppercase font-semibold mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Intro text ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-5"
        >
          <span className="w-10 h-px bg-gold-500" />
          <span className="text-gold-500 text-[11px] tracking-[0.38em] font-bold uppercase">
            Your Wellness Journey
          </span>
          <span className="w-10 h-px bg-gold-500" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 dark:text-white mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Reclaim Your Balance
          <br />
          <span className="text-gold-500">in the Heart of Lagos</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-500 dark:text-white/45 text-base leading-relaxed max-w-2xl mx-auto"
        >
          Whether you're here for business or leisure, our wellness offerings
          are designed to fit your schedule and your goals. From an early
          morning gym session to a restorative poolside evening — Durban
          International keeps you feeling your best.
        </motion.p>
      </div>

      {/* ── Facilities ────────────────────────────────────────────────────── */}
      <div
        ref={facilitiesRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20"
      >
        <div className="space-y-5">
          {FACILITIES.map((facility, i) => (
            <motion.div
              key={facility.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={facilitiesInView ? "visible" : "hidden"}
              className={`group grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-gray-100 dark:border-white/8
                hover:border-gold-400/50 dark:hover:border-gold-500/30 transition-all duration-400
                ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
            >
              {/* Image */}
              <div className="relative h-64 sm:h-72 lg:h-auto lg:min-h-[340px] overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`text-[10px] tracking-[0.2em] font-bold px-3 py-1.5 ${facility.tag === "COMPLIMENTARY" ? "bg-gold-500 text-white" : "bg-white text-navy-900"}`}
                  >
                    {facility.tag}
                  </span>
                </div>

                {/* Hours */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <FaClock className="text-gold-400 w-3 h-3" />
                  <span className="text-white text-xs font-semibold tracking-wide">
                    {facility.hours}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-navy-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gold-500/10 dark:bg-gold-500/15 flex items-center justify-center text-gold-500">
                    {facility.icon}
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.28em] text-gold-500 font-bold uppercase">
                      Facility 0{i + 1}
                    </p>
                  </div>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white mb-4 leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {facility.title}
                </h3>

                <p className="text-gray-500 dark:text-white/45 text-sm leading-relaxed mb-7">
                  {facility.desc}
                </p>

                <ul className="space-y-2 mb-8">
                  {facility.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-white/50"
                    >
                      <FaCheck className="text-gold-500 w-2.5 h-2.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/2348103785017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.22em] font-bold text-gold-500 hover:text-gold-400 transition-colors"
                >
                  {facility.tag === "BOOKABLE"
                    ? "BOOK THIS SERVICE"
                    : "ENQUIRE NOW"}
                  <span className="text-base">→</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Wellness Tips ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-gold-500" />
            <span className="text-gold-500 text-[11px] tracking-[0.38em] font-bold uppercase">
              Insider Tips
            </span>
            <span className="w-8 h-px bg-gold-500" />
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Make the Most of Your Wellness Stay
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WELLNESS_TIPS.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group p-6 border border-gray-100 dark:border-white/8 bg-white dark:bg-navy-800
                hover:border-gold-400/50 dark:hover:border-gold-500/30 transition-all duration-300"
            >
              <span className="text-3xl block mb-4">{tip.icon}</span>
              <h4
                className="font-bold text-navy-900 dark:text-white text-base mb-2 group-hover:text-gold-500 transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {tip.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">
                {tip.tip}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
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
          <p className="text-gold-400 text-[11px] tracking-[0.4em] font-bold uppercase mb-3 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-400" />
            Ready to Restore?
            <span className="w-8 h-px bg-gold-400" />
          </p>
          <h3
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Experience An Unforgetable Treatment Today
          </h3>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">
            Our wellness team is available daily from 9:00 AM to 9:00 PM.
            Walk-ins welcome, advance booking preferred.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/2348103785017"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-green-500 hover:bg-green-400 text-white text-xs tracking-[0.28em] font-bold transition-all duration-300"
              >
                <FaWhatsapp className="w-4 h-4" />
                WHATSAPP US
              </motion.button>
            </a>
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
    </div>
  );
};

export default GymWellnessPage;
