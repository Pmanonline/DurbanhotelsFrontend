import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome, FaBed, FaConciergeBell, FaPhone } from "react-icons/fa";

// Quick links to redirect lost visitors usefully
const QUICK_LINKS = [
  { to: "/rooms", icon: <FaBed className="w-4 h-4" />, label: "Our Rooms" },
  {
    to: "/gallery",
    icon: <FaConciergeBell className="w-4 h-4" />,
    label: "Gallery",
  },
  {
    to: "/contact",
    icon: <FaPhone className="w-4 h-4" />,
    label: "Contact Us",
  },
];

const NotFound = () => {
  // Animated counter for the "404"
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* ── Background dot texture ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Ambient gold glow ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[120px] pointer-events-none" />

      {/* ── Top gold line ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      {/* ── Main content ── */}
      <div className="relative z-10 text-center max-w-xl mx-auto">
        {/* Giant 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-2 select-none"
        >
          <p
            className="text-[140px] sm:text-[180px] font-bold leading-none tracking-tighter"
            style={{
              fontFamily: "'Playfair Display', serif",
              WebkitTextStroke: "2px rgba(201,168,76,0.25)",
              color: "transparent",
            }}
          >
            404
          </p>
          {/* Solid overlay text slightly offset */}
          <p
            className="absolute inset-0 flex items-center justify-center text-[140px] sm:text-[180px] font-bold leading-none tracking-tighter text-white/5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            404
          </p>
        </motion.div>

        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={visible ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="w-16 h-px bg-gold-500/50" />
          <span className="w-2 h-2 bg-gold-500 rotate-45 flex-shrink-0" />
          <span className="w-16 h-px bg-gold-500/50" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Page Not Found
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-white/40 text-sm sm:text-base leading-relaxed mb-10"
        >
          It seems you've wandered into an uncharted wing of the hotel. The page
          you're looking for may have been moved, renamed, or simply doesn't
          exist.
        </motion.p>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-8 py-4
                         bg-gold-500 hover:bg-gold-400 text-white
                         text-[11px] tracking-[0.28em] font-bold transition-all duration-300 shadow-lg"
            >
              <FaHome className="w-3.5 h-3.5" />
              BACK TO HOME
            </motion.button>
          </Link>
          <Link to="/rooms">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2.5 px-8 py-4
                         border border-white/20 hover:border-gold-500
                         text-white/60 hover:text-gold-400
                         text-[11px] tracking-[0.28em] font-bold transition-all duration-300"
            >
              <FaBed className="w-3.5 h-3.5" />
              VIEW ROOMS
            </motion.button>
          </Link>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="text-[10px] tracking-[0.3em] text-white/25 uppercase font-semibold mb-4">
            Or explore
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {QUICK_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>
                <motion.span
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(201,168,76,0.6)",
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-white/10
                             text-white/35 hover:text-gold-400 text-[11px] font-semibold tracking-wide
                             transition-colors duration-200 cursor-pointer"
                >
                  <span className="text-gold-500/60">{link.icon}</span>
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom branding ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 text-[10px] text-white/15 tracking-[0.3em] uppercase"
      >
        © Duban International Hotel · Lagos, Nigeria
      </motion.div>
    </div>
  );
};

export default NotFound;
