import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MdKingBed,
  MdSpa,
  MdRestaurant,
  MdPool,
  MdCelebration,
  MdFitnessCenter,
  MdAirportShuttle,
  MdMeetingRoom,
} from "react-icons/md";
import { FaArrowRight, FaCheck } from "react-icons/fa";

// ── Service data ──────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    id: "rooms",
    icon: <MdKingBed className="w-8 h-8" />,
    title: "Rooms & Suites",
    shortDesc:
      "Comfortable rooms and suites with modern amenities, tailored for both business and leisure travellers.",
    fullDesc:
      "86 thoughtfully appointed rooms and executive suites offering skyline views, plush king beds, dedicated work lounges, and premium bath amenities. Every stay is personalised from the moment you arrive.",
    highlights: [
      "King & Queen beds",
      "Skyline & garden views",
      "Smart TV & high-speed WiFi",
      "24-hr room service",
    ],
    link: "/rooms",
    cta: "View Rooms",
  },
  {
    id: "dining",
    icon: <MdRestaurant className="w-8 h-8" />,
    title: "Food & Restaurant",
    shortDesc:
      "Savour local and international dishes crafted by our culinary team, available for dine-in and room service.",
    fullDesc:
      "Our chef-led restaurant celebrates Lagos' global palate — from contemporary Nigerian cuisine to continental favourites. The poolside bar and in-room dining complete the full flavour journey.",
    highlights: [
      "Nigerian & continental menu",
      "Poolside bar & lounge",
      "Private dining available",
      "Room service 24/7",
    ],
    link: "/services#dining",
    cta: "See Menu",
  },
  {
    id: "sports",
    icon: <MdPool className="w-8 h-8" />,
    title: "Sports & Gaming",
    shortDesc:
      "Enjoy our swimming pool, billiards area and leisure activities curated for family and friends.",
    fullDesc:
      "Unwind at our temperature-controlled outdoor pool, challenge friends at the billiards lounge, or enjoy curated leisure programmes for families and corporate groups — all within the hotel grounds.",
    highlights: [
      "Outdoor swimming pool",
      "Billiards & table tennis",
      "Family leisure programmes",
      "Pool cabanas",
    ],
    link: "/services#sports",
    cta: "Explore",
  },
  {
    id: "events",
    icon: <MdCelebration className="w-8 h-8" />,
    title: "Events & Party",
    shortDesc:
      "Versatile event spaces, professional catering, and AV support to host memorable celebrations and corporate meetings.",
    fullDesc:
      "From intimate boardroom gatherings to grand banquet receptions, our dedicated events team handles every detail — décor, catering, AV, and coordination — so you can focus on the moment.",
    highlights: [
      "Up to 300-guest capacity",
      "Banquet & boardroom options",
      "Full AV & staging",
      "Bespoke catering",
    ],
    link: "/services#events",
    cta: "Plan Event",
  },
  {
    id: "spa",
    icon: <MdSpa className="w-8 h-8" />,
    title: "Spa & Wellness",
    shortDesc:
      "Recharge with spa-inspired treatments, a Technogym fitness studio and dedicated wellness programmes.",
    fullDesc:
      "Our full-service wellness floor features massage therapy, beauty treatments, a Technogym-equipped fitness centre, and curated wellness itineraries designed to restore mind and body.",
    highlights: [
      "Massage & body treatments",
      "Beauty salon",
      "Technogym fitness centre",
      "Wellness packages",
    ],
    link: "/services#spa",
    cta: "Book Treatment",
  },
  {
    id: "transport",
    icon: <MdAirportShuttle className="w-8 h-8" />,
    title: "Airport Transfer",
    shortDesc:
      "Seamless door-to-door airport pickup and drop-off service, available around the clock.",
    fullDesc:
      "Arrive and depart stress-free with our premium airport transfer service. Our professional drivers monitor flight schedules, ensuring you're met on time — day or night — in a clean, air-conditioned vehicle.",
    highlights: [
      "24/7 availability",
      "Flight tracking",
      "Meet & greet service",
      "Corporate fleet options",
    ],
    link: "/services#transport",
    cta: "Book Transfer",
  },
  {
    id: "meetings",
    icon: <MdMeetingRoom className="w-8 h-8" />,
    title: "Business Centre",
    shortDesc:
      "Fully equipped meeting rooms and business services to keep you connected and productive.",
    fullDesc:
      "State-of-the-art meeting rooms with high-speed fibre, video conferencing, printing, and dedicated secretarial support — everything the modern executive needs without leaving the hotel.",
    highlights: [
      "Video conferencing",
      "High-speed fibre",
      "Printing & scanning",
      "Secretarial support",
    ],
    link: "/services#business",
    cta: "Reserve Room",
  },
  {
    id: "fitness",
    icon: <MdFitnessCenter className="w-8 h-8" />,
    title: "Fitness Centre",
    shortDesc:
      "State-of-the-art gym equipment and personal training available to all guests at any hour.",
    fullDesc:
      "Our Technogym-equipped fitness centre is open 24 hours with treadmills, free weights, resistance machines, and optional personal training sessions tailored to your goals.",
    highlights: [
      "Open 24 hours",
      "Technogym equipment",
      "Personal training available",
      "Complimentary for guests",
    ],
    link: "/services#fitness",
    cta: "Explore",
  },
];

// ── Fade variants ─────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Single Service Card ───────────────────────────────────────────────────────
const ServiceCard = ({ service, index, inView }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    animate={inView ? "visible" : "hidden"}
    className="group relative flex flex-col p-7 cursor-pointer h-full
               border-2 border-gray-200 dark:border-white/10
               bg-white dark:bg-navy-800
               hover:bg-gold-500 hover:border-gold-500
               transition-all duration-400 ease-out
               shadow-sm hover:shadow-xl hover:shadow-gold-500/25"
    style={{ "--tw-transition-duration": "400ms" }}
  >
    {/* Dot pattern — visible on hover */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
        backgroundSize: "20px 20px",
      }}
    />

    {/* Icon box */}
    <div
      className="w-14 h-14 flex items-center justify-center mb-6 flex-shrink-0
                    bg-gold-50 dark:bg-gold-500/10 text-gold-500
                    group-hover:bg-white/20 group-hover:text-white
                    transition-all duration-400"
    >
      {service.icon}
    </div>

    {/* Title */}
    <h3
      className="text-base font-bold mb-3
                 text-navy-900 dark:text-white
                 group-hover:text-white
                 transition-colors duration-300"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      {service.title}
    </h3>

    {/* Description */}
    <p
      className="text-sm leading-relaxed flex-1
                  text-gray-500 dark:text-white/50
                  group-hover:text-white/85
                  transition-colors duration-300"
    >
      {service.shortDesc}
    </p>

    {/* Highlights — always rendered, revealed on hover via opacity+translate */}
    <ul
      className="mt-4 space-y-1.5 max-h-0 overflow-hidden opacity-0
                   group-hover:max-h-40 group-hover:opacity-100
                   transition-all duration-400 ease-out"
    >
      {service.highlights.map((h) => (
        <li key={h} className="flex items-center gap-2 text-xs text-white/80">
          <FaCheck className="w-2.5 h-2.5 text-white/50 flex-shrink-0" />
          {h}
        </li>
      ))}
    </ul>

    {/* Divider */}
    <div
      className="mt-5 mb-4 h-px bg-gray-100 dark:bg-white/8
                    group-hover:bg-white/20 transition-colors duration-300"
    />

    {/* CTA */}
    <Link to={service.link} onClick={(e) => e.stopPropagation()}>
      <span
        className="inline-flex items-center gap-2
                       text-[10px] font-bold tracking-[0.22em] uppercase
                       text-gold-500 dark:text-gold-400
                       group-hover:text-white
                       transition-colors duration-300"
      >
        {service.cta}
        <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
      </span>
    </Link>
  </motion.div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ── REUSABLE ServicesSection — cards only (no header, no footer CTA)
// Drop on homepage or any page: <ServicesSection limit={4} />
// ══════════════════════════════════════════════════════════════════════════════
export const ServicesSection = ({ limit = 4 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const displayed = SERVICES.slice(0, limit);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16   text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex items-center gap-3 justify-center mb-3">
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-500 text-[11px] tracking-[0.35em] font-bold uppercase">
              Our Services
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore Our <span className="text-gold-500">SERVICES</span>
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Hover over any service to discover more — every detail crafted
            around your comfort and convenience.
          </p>
        </motion.div>
      </div>
      <section
        ref={ref}
        className="py-8 lg:py-6 bg-gray-50 dark:bg-navy-900/50"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayed.map((svc, i) => (
              <ServiceCard
                key={svc.id}
                service={svc}
                index={i}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ── STANDALONE ServicesPage ───────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
import HeroImage from "../assets/images/heroImage3.jpg";

const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="text-white/30">PAGES</span>
    <span>/</span>
    <span className="text-gold-400">SERVICES</span>
  </nav>
);

const ServicesPage = () => {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden bg-navy-900">
        <img
          src={HeroImage}
          alt="DubanServices"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-navy-900/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-navy-900/25" />
        {/* Dot-grid */}
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
            Services
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

      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex items-center gap-3 justify-center mb-3">
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-500 text-[11px] tracking-[0.35em] font-bold uppercase">
              Our Services
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore Our <span className="text-gold-500">SERVICES</span>
          </h2>
          <p className="text-gray-400 dark:text-white/40 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
            Hover over any service to discover more — every detail crafted
            around your comfort and convenience.
          </p>
        </motion.div>
      </div>

      {/* ── Full grid ───────────────────────────────────────────────────── */}
      <div
        ref={gridRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 pb-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((svc, i) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              index={i}
              inView={gridInView}
            />
          ))}
        </div>
      </div>

      {/* ── CTA strip ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-navy-900 py-16 px-6 text-center">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-gold-400 text-[11px] tracking-[0.4em] font-bold uppercase mb-3 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-400" /> Ready To Experience It?{" "}
            <span className="w-8 h-px bg-gold-400" />
          </p>
          <h3
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Book Your Stay & Services
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/rooms">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-white
                           text-xs tracking-[0.28em] font-bold transition-all duration-300 shadow-lg"
              >
                BOOK A ROOM
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

export default ServicesPage;
