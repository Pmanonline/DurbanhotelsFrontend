import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaMoon, FaSun, FaChevronDown } from "react-icons/fa";
import { FaXTwitter, FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa6";
// ADD these two lines
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/Theme/themeSlice";

import DubanLogo from "../assets/images/DubanLogoWhite.png";
import DubanLogoWhite from "../assets/images/DubanLogoWhite.png";
import HeroImage1 from "../assets/images/heroImage1.jpg";

/* ── nav data ─────────────────────────────────────────────────── */
const leftNav = [
  { name: "HOME", link: "/" },
  { name: "ABOUT", link: "/about" },
  { name: "SERVICES", link: "/services" },
];
const rightNav = [
  { name: "ROOMS", link: "/rooms" },
  { name: "MENU", link: "/menu" },
];
const moreLinks = [
  { name: "Contact", link: "/contact" },
  { name: "Gallery", link: "/gallery" },
  { name: "Testimonials", link: "/testimonials" },
  { name: "Events", link: "/events" },
  { name: "Gym & Wellness", link: "/wellness" },
  { name: "FAQ", link: "/faq" },
];
const overlayNav = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Services", link: "/services" },
  { name: "Rooms", link: "/rooms" },
  { name: "Menu", link: "/menu" },
  { name: "Contact", link: "/contact" },
  { name: "Gallery", link: "/gallery" },
  { name: "Testimonials", link: "/testimonials" },
  { name: "Events", link: "/events" },
  { name: "Gym & Wellness", link: "/wellness" },
  { name: "FAQ", link: "/faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [location]);

  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.mode === "dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close More dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDark = () => dispatch(toggleTheme());

  const isActive = (link) => location.pathname === link;
  const isMoreActive = moreLinks.some((m) => location.pathname === m.link);

  const deskLink = (link) =>
    `relative text-[11px] tracking-[0.2em] font-semibold transition-colors duration-200
     after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-gold-400
     after:transition-all after:duration-300
     ${
       isActive(link)
         ? "text-gold-400 after:w-full"
         : "text-white/80 hover:text-white after:w-0 hover:after:w-full"
     }`;

  return (
    <>
      {/* ════ MAIN NAV ════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
          ${
            scrolled
              ? "bg-navy-600/95 backdrop-blur-md shadow-lg py-3"
              : "bg-transparent py-4 sm:py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="relative flex items-center justify-between">
            {/* LEFT: hamburger + desktop links */}
            <div className="flex items-center gap-6 lg:gap-10 flex-1">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="flex flex-col gap-[5px] p-1 group flex-shrink-0"
              >
                <span className="block w-6 h-px bg-white/80 group-hover:bg-gold-400 transition-colors" />
                <span className="block w-4 h-px bg-white/80 group-hover:bg-gold-400 transition-colors" />
                <span className="block w-6 h-px bg-white/80 group-hover:bg-gold-400 transition-colors" />
              </button>
              <div className="hidden lg:flex items-center gap-8">
                {leftNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className={deskLink(item.link)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* CENTER: Logo — absolutely centered */}
            <Link
              to="/"
              className="absolute left-1/2 -translate-x-1/2"
              aria-label="DubanInternational Hotel"
            >
              <img
                src={isDark ? DubanLogoWhite : DubanLogo}
                alt="DubanInternational Hotel"
                className="h-10 sm:h-12 w-auto"
              />
            </Link>

            {/* RIGHT: desktop links + More dropdown + controls */}
            <div className="flex items-center gap-6 lg:gap-10 flex-1 justify-end">
              <div className="hidden lg:flex items-center gap-8">
                {rightNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className={deskLink(item.link)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* ── MORE DROPDOWN ── */}
                <div ref={moreRef} className="relative">
                  <button
                    onClick={() => setMoreOpen((p) => !p)}
                    className={`flex items-center gap-1 relative text-[11px] tracking-[0.2em] font-semibold
                                transition-colors duration-200
                                after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-gold-400
                                after:transition-all after:duration-300
                                ${
                                  isMoreActive || moreOpen
                                    ? "text-gold-400 after:w-full"
                                    : "text-white/80 hover:text-white after:w-0 hover:after:w-full"
                                }`}
                  >
                    MORE
                    <FaChevronDown
                      className={`w-2.5 h-2.5 transition-transform duration-300 ${moreOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {moreOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 top-[calc(100%+12px)] w-44
                                   bg-navy-900/97 backdrop-blur-md
                                   border border-white/10
                                   shadow-xl shadow-black/40
                                   py-2 z-50"
                      >
                        {/* Gold top accent */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

                        {moreLinks.map((item, i) => (
                          <Link
                            key={item.name}
                            to={item.link}
                            onClick={() => setMoreOpen(false)}
                            className={` bg-navy-600 flex items-center gap-2.5 px-4 py-2.5 text-[11px] tracking-[0.18em]
                                         font-semibold transition-all duration-150 group/item
                                         ${
                                           isActive(item.link)
                                             ? "text-gold-400 bg-gold-500/8"
                                             : "text-white font-bold hover:text-gray-700 hover:bg-white"
                                         }`}
                          >
                            {isActive(item.link) && (
                              <span className="w-1 h-1 rounded-full bg-gold-400 flex-shrink-0" />
                            )}
                            <span
                              className={
                                isActive(item.link) ? "" : "ml-3 font-bold "
                              }
                            >
                              {item.name}
                            </span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* ── END MORE ── */}
              </div>

              <button
                onClick={toggleDark}
                aria-label="Toggle dark mode"
                className="hidden sm:flex text-white/60 hover:text-gold-400 transition-colors"
              >
                {isDark ? (
                  <FaSun className="w-4 h-4" />
                ) : (
                  <FaMoon className="w-4 h-4" />
                )}
              </button>

              <Link to="/booking" className="flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-[10px] sm:text-[11px] tracking-[0.22em] font-semibold
                             text-white border border-white/50
                             hover:border-gold-400 hover:text-gold-400
                             px-3 sm:px-5 py-2 transition-all duration-300 whitespace-nowrap"
                >
                  BOOK NOW
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ════ FULLSCREEN OVERLAY MENU ═════════════════════════════ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#080808] flex flex-col overflow-y-auto"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-white/50 hover:text-gold-400 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
              <Link to="/" onClick={() => setOpen(false)}>
                <img src={DubanLogoWhite} alt="Duban" className="h-10 w-auto" />
              </Link>
              <Link to="/booking" onClick={() => setOpen(false)}>
                <span
                  className="text-[10px] sm:text-[11px] tracking-[0.22em] font-semibold
                                 text-white border border-white/30
                                 hover:border-gold-400 hover:text-gold-400
                                 px-3 sm:px-5 py-2 transition-all duration-300 whitespace-nowrap"
                >
                  BOOK NOW
                </span>
              </Link>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              {/* COL 1: Nav links */}
              <div
                className="flex flex-col justify-center
                              px-8 sm:px-14 lg:px-16 xl:px-20
                              py-6 lg:py-0
                              lg:w-[36%]"
              >
                <p className="text-gold-400 text-[10px] tracking-[0.3em] mb-5 lg:mb-8">
                  DUBAN INTERNATIONAL HOTEL
                </p>
                <nav className="space-y-0.5">
                  {overlayNav.map((item, i) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.07 + i * 0.05,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        to={item.link}
                        onClick={() => setOpen(false)}
                        className={`block text-[18px] sm:text-2xl lg:text-[1.6rem] xl:text-3xl
            font-light leading-snug tracking-wide py-[2px]
                                    transition-colors duration-200
                                    ${isActive(item.link) ? "text-gold-400" : "text-white/70 hover:text-white"}`}
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                        }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* COL 2: Hotel image — desktop only */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="hidden lg:flex flex-1 items-center justify-center px-6 py-8"
              >
                <div className="w-full max-w-[420px] h-[62vh] overflow-hidden">
                  <img
                    src={HeroImage1}
                    alt="DubanInternational Hotel"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* COL 3: Contact info — desktop only */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden lg:flex flex-col justify-center
                           px-10 xl:px-14 py-8
                           lg:w-[27%]
                           border-l border-white/[0.06]"
              >
                <div className="space-y-8">
                  <div>
                    <p
                      className="text-white text-xl font-light mb-5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Contact Info
                    </p>
                    <div className="space-y-4 text-white/45 text-sm leading-relaxed">
                      <div className="flex gap-3 items-start">
                        <span className="flex-shrink-0 mt-0.5 text-white/30">
                          📍
                        </span>
                        <p>
                          61-63 Ogunnusi Rd, Ogba,
                          <br />
                          Ikeja, Lagos
                        </p>
                      </div>
                      <div className="border-t border-white/[0.07] pt-4 flex gap-3 items-center">
                        <span className="flex-shrink-0 text-white/30">📞</span>
                        <a
                          href="tel:+2348103785017"
                          className="hover:text-gold-400 transition-colors"
                        >
                          +234 81 0378 5017
                        </a>
                      </div>
                      <div className="border-t border-white/[0.07] pt-4 flex gap-3 items-start">
                        <span className="flex-shrink-0 mt-0.5 text-white/30">
                          ✉️
                        </span>
                        <a
                          href="mailto:bookings@dubaninternationalhotel.com"
                          className="hover:text-gold-400 transition-colors text-xs break-all"
                        >
                          bookings@dubaninternationalhotel.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p
                      className="text-white text-xl font-light mb-4"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Stay Connected
                    </p>
                    <div className="flex items-center gap-4">
                      {[FaXTwitter, FaFacebook, FaYoutube, FaLinkedin].map(
                        (Icon, i) => (
                          <a
                            key={i}
                            href="#"
                            className="text-white/35 hover:text-gold-400 transition-colors text-lg"
                          >
                            <Icon />
                          </a>
                        ),
                      )}
                    </div>
                  </div>

                  <button
                    onClick={toggleDark}
                    className="flex items-center gap-3 text-white/25 hover:text-gold-400 transition-colors"
                  >
                    {isDark ? (
                      <FaSun className="w-4 h-4" />
                    ) : (
                      <FaMoon className="w-4 h-4" />
                    )}
                    <span className="text-[10px] tracking-widest">
                      {isDark ? "LIGHT MODE" : "DARK MODE"}
                    </span>
                  </button>
                </div>
              </motion.div>

              {/* Mobile bottom contact strip */}
              <div className="lg:hidden px-8 py-6 border-t border-white/[0.07] flex-shrink-0">
                <p className="text-white/25 text-[10px] tracking-[0.25em] mb-4">
                  CONTACT
                </p>
                <div className="flex flex-col gap-3 text-white/45 text-sm">
                  <a
                    href="tel:+2348103785017"
                    className="hover:text-gold-400 transition-colors"
                  >
                    +234 81 0378 5017
                  </a>
                  <a
                    href="mailto:bookings@dubaninternationalhotel.com"
                    className="hover:text-gold-400 transition-colors text-xs"
                  >
                    bookings@dubaninternationalhotel.com
                  </a>
                </div>
                <div className="flex items-center gap-5 mt-5">
                  {[FaXTwitter, FaFacebook, FaYoutube, FaLinkedin].map(
                    (Icon, i) => (
                      <a
                        key={i}
                        href="#"
                        className="text-white/30 hover:text-gold-400 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    ),
                  )}
                  {/* <button
                    onClick={toggleDark}
                    className="ml-auto text-white/25 hover:text-gold-400 transition-colors"
                  >
                    {isDark ? (
                      <FaSun className="w-4 h-4" />
                    ) : (
                      <FaMoon className="w-4 h-4" />
                    )}
                  </button> */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
