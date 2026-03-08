import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import CustomerCareImage from "../../assets/images/customercare.jpg";

// ── Replace these with your actual imports ────────────────────────────────────
// import HotelMedia from "../../assets/images/luxury-living.jpg";
// import HotelVideo from "../../assets/videos/hotel-tour.mp4";

// Placeholder for demo — swap with your import
const HotelMedia = CustomerCareImage;
const HotelVideo = null; // Set to your video import when ready

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] },
  }),
};

const HotelCustomerCare = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ minHeight: "460px" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[460px]">
        {/* ── LEFT: Dark Content Panel ── */}
        <div className="relative bg-navy-900 dark:bg-[#0d1117] flex flex-col justify-center px-10 sm:px-14 lg:px-16 py-16 lg:py-20 overflow-hidden">
          {/* Subtle corner accent */}
          <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-gold-500/20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-gold-500/20 pointer-events-none" />

          {/* Gold dot texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #b8860b 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Label */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center gap-3 mb-6"
          >
            <span
              className="text-gold-500 text-xs font-black tracking-[0.35em] uppercase"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Luxury Living
            </span>
            <span className="w-10 h-[2px] bg-gold-500" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white leading-[1.15] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Discover A Brand
            <br />
            <span className="text-white">Luxurious Hotel</span>
          </motion.h2>

          {/* Divider */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="w-12 h-[2px] bg-gold-500/50 mb-6"
          />

          {/* Body */}
          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-white/55 text-sm sm:text-base leading-relaxed mb-10 max-w-md"
          >
            From executive suites to tranquil wellness spaces, every room detail
            is crafted to keep you connected, restored, and inspired.
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Link to="/rooms">
              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#c9972a" }}
                whileTap={{ scale: 0.97 }}
                className="px-9 py-4 bg-gold-500 text-white text-xs tracking-[0.28em] font-bold uppercase transition-all duration-300 shadow-lg"
                style={{ letterSpacing: "0.25em" }}
              >
                OUR ROOMS
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT: Media Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-navy-800"
          style={{ minHeight: "420px" }}
        >
          {/* Image or Video */}
          {HotelVideo ? (
            <video
              ref={videoRef}
              src={HotelVideo}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            <img
              src={HotelMedia}
              alt="Luxury Hotel"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-navy-900/20" />

          {/* Play Button — shown if video exists or always for video experience */}
          {HotelVideo && !isPlaying && (
            <motion.button
              onClick={handlePlay}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5, ease: "backOut" }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.93 }}
              className="absolute inset-0 flex items-center justify-center z-10 group"
              aria-label="Play video"
            >
              {/* Ripple ring */}
              <span className="absolute w-24 h-24 rounded-full bg-gold-500/20 animate-ping" />
              <span className="relative w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center shadow-2xl group-hover:bg-gold-400 transition-colors duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={{ marginLeft: "3px" }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </motion.button>
          )}

          {/* Static play button hint (for image-only mode) */}
          {!HotelVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5, ease: "backOut" }}
              className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            >
              <span className="absolute w-24 h-24 rounded-full bg-gold-500/20 animate-ping" />
              <span className="relative w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center shadow-2xl">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  style={{ marginLeft: "3px" }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </motion.div>
          )}

          {/* Bottom caption bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-navy-900/80 to-transparent"
          >
            <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase font-medium">
              Duban International Hotel — Ogba, Lagos
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HotelCustomerCare;
