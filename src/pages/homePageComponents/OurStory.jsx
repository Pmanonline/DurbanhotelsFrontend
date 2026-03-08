import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MdHotel } from "react-icons/md";
import { FaUsers, FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

import LobbyImage from "../../assets/images/gridImage1.jpg";
import PoolImage from "../../assets/images/gridImage2.avif";
import RoomImage from "../../assets/images/gridImage3.jpg";
import GymImage from "../../assets/images/gridImage4.avif";

// ── Animated Counter — driven by external `start` boolean ─────────────────────
const CountUp = ({ target, duration = 2000, suffix = "", start }) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    // Only run once when start becomes true
    if (!start || started.current) return;
    started.current = true;

    let current = 0;
    const totalSteps = duration / 16;
    const step = target / totalSteps;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, target, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// ── Stat cards data ───────────────────────────────────────────────────────────
const stats = [
  {
    icon: <MdHotel className="w-8 h-8 text-gold-500" />,
    value: 86,
    label: "Rooms & Suites",
  },
  {
    icon: <FaUserTie className="w-8 h-8 text-gold-500" />,
    value: 50,
    label: "Hospitality Experts",
  },
  {
    icon: <FaUsers className="w-8 h-8 text-gold-500" />,
    value: 12511,
    label: "Annual Guests Hosted",
  },
];

// ── Framer variants ───────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const imgVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.75,
      delay: 0.15 + i * 0.13,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────
const OurStory = () => {
  const sectionRef = useRef(null);
  // Use 0px margin and a low threshold so it triggers reliably on mobile
  const inView = useInView(sectionRef, {
    once: true,
    margin: "0px",
    amount: 0.1,
  });

  // Separate ref just for the stats row — triggers when stats scroll into view
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, {
    once: true,
    margin: "0px",
    amount: 0.1,
  });

  // CountUp starts when EITHER the section or stats row is in view
  const startCounting = inView || statsInView;

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-navy-900 py-20 lg:py-28 overflow-hidden"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #b8860b 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* ── LEFT: Text + Stats ── */}
          <div>
            {/* Label */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex items-center gap-3 mb-5"
            >
              <span
                className="text-gold-500 text-sm font-black tracking-[0.3em] uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Story
              </span>
              <span className="flex-1 max-w-[60px] h-px bg-gold-500" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-4xl sm:text-5xl font-bold leading-tight mb-6 dark:text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Welcome to{" "}
              <span className="text-gold-500">
                DUBAN
                <br />
                INTERNATIONAL HOTEL
              </span>
            </motion.h2>

            {/* Body */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-gray-600 dark:text-white/60 text-sm sm:text-base leading-relaxed mb-10 max-w-lg"
            >
              Rooted in the vibrant Ogba district, Ikeja, Duban International
              Hotel has become the trusted address for C-suite travellers,
              weekend explorers, and global delegations seeking Lagos at its
              best. Our concierge-led experiences, award-winning dining, and
              technology-enabled conveniences ensure every stay feels effortless
              yet unforgettable.
            </motion.p>

            {/* Stat Cards — own ref so counting starts when these are visible */}
            <div ref={statsRef} className="grid grid-cols-3 gap-4 mb-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={3 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="border border-gray-200 dark:border-white/10 rounded-sm p-5
                             flex flex-col items-center text-center
                             hover:border-gold-400 hover:shadow-md transition-all duration-300
                             group bg-white dark:bg-navy-800"
                >
                  <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <p
                    className="text-2xl font-bold text-navy-900 dark:text-white mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    <CountUp
                      target={stat.value}
                      duration={2000}
                      start={startCounting}
                    />
                  </p>
                  <p className="text-gray-500 dark:text-white/50 text-xs tracking-wide">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              custom={6}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 bg-gold-500 hover:bg-gold-400 text-white text-xs
                             tracking-[0.25em] font-bold uppercase transition-all duration-300
                             shadow-lg hover:shadow-gold-glow"
                >
                  Explore More
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Image Grid ── */}
          <div className="grid grid-cols-2 grid-rows-[200px_200px_200px] gap-3 h-[600px] mid:hidden">
            <motion.div
              custom={0}
              variants={imgVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="overflow-hidden rounded-sm"
            >
              <img
                src={LobbyImage}
                alt="Hotel Lobby"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              custom={1}
              variants={imgVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="overflow-hidden rounded-sm row-span-2"
            >
              <img
                src={PoolImage}
                alt="Swimming Pool"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              custom={2}
              variants={imgVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="overflow-hidden rounded-sm"
            >
              <img
                src={RoomImage}
                alt="Hotel Room"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              custom={3}
              variants={imgVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="overflow-hidden rounded-sm mid:hidden"
            >
              <img
                src={GymImage}
                alt="Gym & Wellness"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div
              custom={4}
              variants={imgVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="overflow-hidden mid:hidden rounded-sm bg-gold-500 flex flex-col items-center justify-center text-white"
            >
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Since
              </p>
              <p
                className="text-5xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                2010
              </p>
              <p className="text-xs tracking-[0.2em] mt-1 opacity-80">
                LAGOS, NIGERIA
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
