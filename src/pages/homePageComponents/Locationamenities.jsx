import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaMapMarkerAlt, FaSpa, FaBriefcase } from "react-icons/fa";

// ── Images ────────────────────────────────────────────────────────────────────
import LobbyImage from "../../assets/images/gridImage1.jpg";
import PoolImage from "../../assets/images/gridImage2.avif";
import RoomImage from "../../assets/images/gridImage3.jpg";
import GymImage from "../../assets/images/gridImage4.avif";

const features = [
  {
    icon: <FaMapMarkerAlt className="w-5 h-5 text-white" />,
    title: "Effortless Arrival",
    desc: "Dedicated airport transfers, secured parking, and concierge logistics for meetings across Lagos.",
  },
  {
    icon: <FaSpa className="w-5 h-5 text-white" />,
    title: "Wellness & Rejuvenation",
    desc: "24/7 bar and club, swimming pool, and private treatment suites for restorative downtime.",
  },
  {
    icon: <FaBriefcase className="w-5 h-5 text-white" />,
    title: "Business Ready",
    desc: "Smart meeting rooms, hybrid conferencing tech, and executive lounge access for focused collaborations.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Desktop spread — larger offsets
const cardDeckDesktop = [
  { src: GymImage, alt: "Gym", rotate: -13, x: -115, y: -115, z: 1 },
  { src: PoolImage, alt: "Pool", rotate: 11, x: 115, y: -100, z: 2 },
  { src: RoomImage, alt: "Suite", rotate: -9, x: -105, y: 110, z: 3 },
  { src: LobbyImage, alt: "Lobby", rotate: 10, x: 108, y: 118, z: 4 },
];

// Mobile spread — tighter offsets + smaller cards
const cardDeckMobile = [
  { src: GymImage, alt: "Gym", rotate: -10, x: -75, y: -80, z: 1 },
  { src: PoolImage, alt: "Pool", rotate: 8, x: 75, y: -68, z: 2 },
  { src: RoomImage, alt: "Suite", rotate: -7, x: -70, y: 72, z: 3 },
  { src: LobbyImage, alt: "Lobby", rotate: 8, x: 72, y: 80, z: 4 },
];

// ── Card Deck (shared renderer) ───────────────────────────────────────────────
const CardDeck = ({ deck, cardW, cardH, containerH, inView }) => (
  <div
    className="relative flex items-center justify-center w-full"
    style={{ height: containerH }}
  >
    {/* Soft glow */}
    <div className="absolute w-48 h-48 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />

    {deck.map((card, i) => (
      <motion.div
        key={card.alt}
        initial={{ opacity: 0, y: 60, scale: 0.82, rotate: 0 }}
        animate={
          inView
            ? {
                opacity: 1,
                y: card.y,
                x: card.x,
                rotate: card.rotate,
                scale: 1,
              }
            : {}
        }
        transition={{
          duration: 0.8,
          delay: 0.1 + i * 0.11,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{
          y: card.y - 18,
          rotate: card.rotate * 0.3,
          scale: 1.06,
          zIndex: 30,
          transition: { duration: 0.28, ease: "easeOut" },
        }}
        style={{ zIndex: card.z, width: cardW, height: cardH }}
        className="absolute rounded-2xl overflow-hidden cursor-pointer
                   border-[4px] border-white dark:border-navy-700
                   shadow-[0_16px_50px_rgba(0,0,0,0.28)]"
      >
        <img
          src={card.src}
          alt={card.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2.5 bg-gradient-to-t from-black/75 to-transparent">
          <p className="text-white text-[9px] tracking-[0.22em] font-bold uppercase">
            {card.alt}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────
const LocationAmenities = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-50 dark:bg-navy-800 py-20 lg:py-28 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* ══════ Card Deck ══════ */}
          {/* Mobile: compact deck */}
          <div className="block lg:hidden">
            <CardDeck
              deck={cardDeckMobile}
              cardW={130}
              cardH={175}
              containerH={340}
              inView={inView}
            />
          </div>

          {/* Desktop: full-size deck */}
          <div className="hidden lg:block">
            <CardDeck
              deck={cardDeckDesktop}
              cardW={220}
              cardH={300}
              containerH={580}
              inView={inView}
            />
          </div>

          {/* ══════ Text content ══════ */}
          <div>
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
                Location &amp; Amenities
              </span>
              <span className="w-12 h-px bg-gold-500" />
            </motion.div>

            <motion.h2
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-navy-900 dark:text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              In the Heart of
              <br />
              Ogba's Energy
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="text-gray-600 dark:text-white/60 text-sm sm:text-base leading-relaxed mb-10 max-w-lg"
            >
              Moments from the Ikeja business district and a short drive from
              Murtala Muhammed International Airport, our address on 61-63
              Ogunnusi Road, Ogba, Ikeja keeps you close to Lagos' corporate
              corridors, cultural escapes, and nightlife. Within the hotel,
              curated art, quiet coworking lounges, and spa-inspired wellness
              zones create the perfect balance between productivity and pause.
            </motion.p>

            <div className="space-y-7">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  custom={3 + i}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  className="flex items-start gap-5 group"
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 bg-gold-500 group-hover:bg-gold-400
                                flex items-center justify-center transition-colors duration-300"
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4
                      className="text-navy-900 dark:text-white font-semibold text-base mb-1
                                 group-hover:text-gold-500 transition-colors duration-200"
                    >
                      {f.title}
                    </h4>
                    <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationAmenities;
