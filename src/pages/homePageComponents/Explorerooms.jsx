import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { rooms } from "./Rommdata";
import RoomCard from "../../components/RommCard";

const ExploreRooms = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  // Show only first 3 rooms on the homepage section
  const featured = rooms.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white dark:bg-navy-900 py-20 lg:py-28 overflow-hidden"
    >
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #b8860b 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <span className="w-10 h-px bg-gold-500" />
            <span
              className="text-gold-500 text-xs font-bold tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Rooms
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Explore Our <span className="text-gold-500">ROOMS</span>
          </motion.h2>
        </div>

        {/* ── Cards grid — uses shared RoomCard ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featured.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} inView={inView} />
          ))}
        </div>

        {/* ── View All button ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex justify-center mt-12"
        >
          <Link to="/rooms">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-10 py-4
                         border-2 border-navy-900 dark:border-white/30
                         hover:border-gold-500 hover:bg-gold-500
                         text-navy-900 dark:text-white hover:text-white
                         text-xs tracking-[0.25em] font-bold
                         transition-all duration-300"
            >
              VIEW ALL ROOMS
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreRooms;
