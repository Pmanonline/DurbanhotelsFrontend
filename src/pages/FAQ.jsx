import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaChevronDown,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaSearch,
} from "react-icons/fa";

import heroImage3 from "../assets/images/heroImage3.jpg";

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <span className="text-white/30">PAGES</span>
    <span>/</span>
    <span className="text-gold-400">FAQ</span>
  </nav>
);

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    id: "reservations",
    label: "Reservations",
    emoji: "📅",
    questions: [
      {
        q: "How do I make a reservation at DurbanInternational Hotel?",
        a: "You can book directly through our website by visiting the Rooms page and selecting your preferred room. You can also call us at +234 810 378 5017, email bookings@dubaninternationalhotel.com, or message us on WhatsApp. Booking directly with us guarantees the best available rate.",
      },
      {
        q: "What is the minimum age to check in?",
        a: "Guests must be at least 18 years old to book and check in independently. Guests under 18 may stay when accompanied by a parent or legal guardian who assumes full responsibility for the reservation.",
      },
      {
        q: "Can I make a reservation for same-day check-in?",
        a: "Yes, subject to availability. We recommend calling us directly at +234 810 378 5017 or messaging via WhatsApp for same-day bookings so we can confirm availability and prepare your room as quickly as possible.",
      },
      {
        q: "Do you accommodate group bookings?",
        a: "Absolutely. We offer special group rates for 5 or more rooms. Please contact our reservations team directly with your group size, preferred dates, and any special requirements. We'll prepare a tailored quote within 24 hours.",
      },
      {
        q: "Is a deposit required to confirm my booking?",
        a: "Yes. A deposit equivalent to one night's stay (or 40% for multi-night bookings) is required to secure your reservation. The balance is payable upon check-in. For events and conference bookings, a 40% deposit is required, with the balance due 14 days before the event date.",
      },
    ],
  },
  {
    id: "checkin",
    label: "Check-In & Check-Out",
    emoji: "🗝️",
    questions: [
      {
        q: "What are the standard check-in and check-out times?",
        a: "Standard check-in is from 2:00 PM, and check-out is by 12:00 PM (noon). Early check-in and late check-out can be requested and are subject to availability and may attract an additional charge.",
      },
      {
        q: "Can I request early check-in or late check-out?",
        a: "Yes. Early check-in (from 9:00 AM) and late check-out (up to 4:00 PM) can be arranged subject to room availability. Please make your request at least 24 hours in advance. Late check-out beyond 4:00 PM may be charged at a half-day rate.",
      },
      {
        q: "What documents do I need at check-in?",
        a: "Please present a valid government-issued photo ID (National ID, International Passport, or Driver's Licence) and a payment method for your balance and any incidental charges. Corporate guests should bring their company booking reference.",
      },
      {
        q: "Is there a 24-hour reception desk?",
        a: "Yes. Our front desk is staffed 24 hours a day, 7 days a week — including public holidays. Our team is always available to assist with check-in, room requests, local recommendations, and any concerns during your stay.",
      },
    ],
  },
  {
    id: "rooms",
    label: "Rooms & Amenities",
    emoji: "🛏️",
    questions: [
      {
        q: "What types of rooms are available?",
        a: "We offer a range of accommodation to suit every guest — from our well-appointed Deluxe Rooms to spacious Junior Suites and our prestigious Presidential Suite. All rooms feature en-suite bathrooms, premium bedding, flat-screen TV, in-room safe, minibar, and complimentary high-speed WiFi.",
      },
      {
        q: "Is WiFi available and is it free?",
        a: "Yes. Complimentary high-speed WiFi is available throughout the hotel — in all guest rooms, the lobby, restaurant, pool area, and all event spaces. No passwords required; simply connect to the DurbanInternational network.",
      },
      {
        q: "Do all rooms have air conditioning?",
        a: "Yes. All 86 rooms and suites are fully air-conditioned with individually controlled climate systems, allowing you to set your preferred temperature.",
      },
      {
        q: "Are interconnecting rooms available for families?",
        a: "Yes, we have a limited number of interconnecting rooms suitable for families or groups who wish to stay in adjacent rooms with an internal connecting door. Please request this at the time of booking.",
      },
      {
        q: "What in-room amenities are included?",
        a: "Every room includes premium Egyptian cotton bedding, a flat-screen smart TV, minibar, in-room safe, tea and coffee making facilities, a hairdryer, iron and ironing board, daily housekeeping, and 24-hour room service.",
      },
      {
        q: "Is the hotel accessible for guests with disabilities?",
        a: "Yes. We have ground-floor accessible rooms and public areas designed to accommodate guests with mobility challenges. Please inform us of any specific requirements at the time of booking so we can make the necessary arrangements.",
      },
    ],
  },
  {
    id: "dining",
    label: "Dining & Bar",
    emoji: "🍽️",
    questions: [
      {
        q: "What dining options are available at the hotel?",
        a: "DurbanInternational Hotel features a full-service restaurant offering a rich blend of Nigerian and continental cuisine, a signature cocktail bar, and 24-hour room service. Our chefs use fresh, locally sourced ingredients to craft dishes that celebrate the best of Lagos flavours.",
      },
      {
        q: "What are the restaurant's opening hours?",
        a: "The restaurant is open daily: Breakfast 6:30 AM – 10:30 AM, Lunch 12:00 PM – 3:00 PM, and Dinner 6:00 PM – 11:00 PM. The bar is open from 11:00 AM to 1:00 AM. Room service is available 24 hours.",
      },
      {
        q: "Can the hotel accommodate dietary requirements and allergies?",
        a: "Absolutely. Our kitchen team is experienced in preparing meals for various dietary needs including vegetarian, vegan, halal, gluten-free, and specific allergy requirements. Please inform us of your dietary needs at the time of booking or when ordering.",
      },
      {
        q: "Can non-residents dine at the restaurant?",
        a: "Yes, our restaurant and bar are open to non-residents. We welcome walk-in guests, though reservations are recommended, especially for dinner and weekends. Please call us or WhatsApp to reserve a table.",
      },
    ],
  },
  {
    id: "facilities",
    label: "Facilities & Services",
    emoji: "🏊",
    questions: [
      {
        q: "Is there a swimming pool?",
        a: "Yes. Guests enjoy access to our outdoor swimming pool, which is open daily from 7:00 AM to 9:00 PM. The pool area features sun loungers, towel service, and easy access to poolside refreshments from the bar.",
      },
      {
        q: "Is there a gym or fitness centre?",
        a: "Yes. Our 24-hour Technogym-equipped Fitness Centre is complimentary for all in-house guests and features treadmills, free weights, resistance equipment, and cardio machines. Towels and drinking water are provided.",
      },
      {
        q: "Is there parking available?",
        a: "Yes. We offer complimentary secure on-site parking for all hotel guests. Our car park is monitored 24 hours a day by CCTV and security personnel.",
      },
      {
        q: "Do you offer airport transfer services?",
        a: "Yes. We offer private airport transfer services to and from Murtala Muhammed International Airport (MMIA) and other locations in Lagos. Transfers can be arranged through the front desk or at the time of booking. Charges apply based on distance.",
      },
      {
        q: "Is there a laundry service?",
        a: "Yes. Same-day laundry and dry-cleaning services are available Monday through Saturday. Items submitted before 9:00 AM are returned by 6:00 PM the same day. Express service is also available for an additional charge.",
      },
      {
        q: "Do you have a business centre?",
        a: "Yes. Our Business Centre is equipped with computers, a printer/scanner, and private workstations. High-speed WiFi is available throughout. The Business Centre is open 24 hours for hotel guests.",
      },
    ],
  },
  {
    id: "events",
    label: "Events & Meetings",
    emoji: "🎉",
    questions: [
      {
        q: "What event spaces does the hotel offer?",
        a: "We have four distinct event spaces: the DurbanGrand Hall (580 m², up to 400 guests), the Executive Boardroom (85 m², up to 18 guests), the Ogba Conference Suite (220 m², up to 150 guests), and the Poolside Event Terrace (300 m², up to 250 guests for receptions).",
      },
      {
        q: "How far in advance should I book an event space?",
        a: "We recommend booking at least 4–6 weeks in advance for corporate events and 3–6 months for weddings and large private functions. For urgent bookings, contact us directly — we'll do our best to accommodate you.",
      },
      {
        q: "Does the hotel provide catering for events?",
        a: "Yes. Our in-house culinary team provides bespoke catering for all events — from cocktail canapés to multi-course gala dinners. We curate menus based on your event type, dietary requirements, and budget. External catering is not permitted.",
      },
      {
        q: "Can the Grand Hall be divided for smaller events?",
        a: "Yes. The DurbanGrand Hall can be partitioned into up to three independent zones, making it ideal for simultaneous breakout sessions, exhibitions alongside plenary rooms, or pre-function receptions before a gala.",
      },
      {
        q: "Do you host weddings?",
        a: "Yes. Weddings are among our most celebrated events at DurbanInternational. Our dedicated wedding coordinator will guide you from venue selection through to décor, menu design, entertainment, and day-of management. We accommodate ceremonies and receptions for up to 300 guests.",
      },
    ],
  },
  {
    id: "policies",
    label: "Policies",
    emoji: "📋",
    questions: [
      {
        q: "What is the cancellation policy?",
        a: "Cancellations made more than 48 hours before check-in receive a full refund of the deposit. Cancellations within 48 hours of check-in forfeit the deposit. No-shows are charged the full first night's rate. Group bookings and event reservations have separate cancellation terms.",
      },
      {
        q: "Is the hotel pet-friendly?",
        a: "We apologise, but pets are not permitted inside the hotel or any of our facilities, with the exception of registered guide dogs and service animals. Please notify us in advance if you will be accompanied by a service animal.",
      },
      {
        q: "Is smoking permitted in the hotel?",
        a: "DurbanInternational Hotel is a non-smoking property. Smoking is strictly prohibited in all indoor areas, including guest rooms, corridors, and public spaces. Designated smoking areas are available outside the hotel. A cleaning fee applies for smoking in guest rooms.",
      },
      {
        q: "What is your noise policy?",
        a: "We observe quiet hours between 11:00 PM and 7:00 AM in all guest room areas. We ask all guests to be considerate of fellow guests during these hours. Any disturbances should be reported to the front desk, who will respond promptly.",
      },
      {
        q: "Do you accept all major payment methods?",
        a: "Yes. We accept cash (Nigerian Naira), all major debit and credit cards (Visa, Mastercard, Verve), and bank transfers. Online bookings are processed securely via Paystack. American Express is not currently accepted.",
      },
    ],
  },
];

// ── Accordion Item ────────────────────────────────────────────────────────────
const AccordionItem = ({ q, a, isOpen, onToggle, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{
      duration: 0.45,
      delay: index * 0.04,
      ease: [0.22, 1, 0.36, 1],
    }}
    className={`border-b transition-colors duration-200 ${
      isOpen
        ? "border-gold-400/30 dark:border-gold-500/20"
        : "border-gray-100 dark:border-white/8"
    }`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-5 py-5 text-left group"
    >
      <span
        className={`font-semibold text-sm sm:text-base leading-snug transition-colors duration-200 ${
          isOpen
            ? "text-gold-500"
            : "text-navy-900 dark:text-white group-hover:text-gold-500 dark:group-hover:text-gold-400"
        }`}
      >
        {q}
      </span>
      <span
        className={`flex-shrink-0 w-7 h-7 flex items-center justify-center border transition-all duration-300 ${
          isOpen
            ? "border-gold-500 bg-gold-500 text-white rotate-180"
            : "border-gray-200 dark:border-white/15 text-gray-400 dark:text-white/30 group-hover:border-gold-400 group-hover:text-gold-400"
        }`}
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
          <p className="pb-5 text-sm text-gray-500 dark:text-white/50 leading-relaxed border-l-2 border-gold-500/40 pl-4">
            {a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// ══════════════════════════════════════════════════════════════════════════════
const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("reservations");
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");
  const contentRef = useRef(null);

  const currentCat = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

  // Search across all categories
  const searchResults =
    search.trim().length > 1
      ? FAQ_CATEGORIES.flatMap((cat) =>
          cat.questions
            .filter(
              (item) =>
                item.q.toLowerCase().includes(search.toLowerCase()) ||
                item.a.toLowerCase().includes(search.toLowerCase()),
            )
            .map((item) => ({
              ...item,
              catLabel: cat.label,
              catEmoji: cat.emoji,
            })),
        )
      : null;

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setOpenIndex(0);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-[48vh] sm:h-[55vh] overflow-hidden bg-navy-900">
        <motion.img
          src={heroImage3}
          alt="DurbanInternational Hotel FAQ"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy-900/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-transparent to-navy-900/25" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <span className="w-10 h-px bg-gold-500" />
            <span className="text-gold-400 text-[11px] tracking-[0.42em] font-bold uppercase">
              Help Centre
            </span>
            <span className="w-10 h-px bg-gold-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Frequently Asked
            <br />
            <span className="text-gold-400">Questions</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Breadcrumb />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-navy-800/60 border-b border-gray-100 dark:border-white/8 py-6 px-6">
        <div className="max-w-2xl mx-auto relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/25 w-3.5 h-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions — e.g. check-in time, pool, parking…"
            className="w-full pl-11 pr-5 py-3.5 bg-white dark:bg-navy-900
                       border border-gray-200 dark:border-white/10
                       focus:border-gold-400 dark:focus:border-gold-500/60 outline-none
                       text-sm text-navy-900 dark:text-white
                       placeholder:text-gray-300 dark:placeholder:text-white/25
                       transition-colors duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:text-white/25 dark:hover:text-white/50 text-xs transition-colors"
            >
              CLEAR
            </button>
          )}
        </div>
        {search.trim().length > 1 && (
          <p className="text-center text-[11px] text-gray-400 dark:text-white/30 tracking-[0.2em] mt-3 uppercase">
            {searchResults?.length ?? 0} result
            {searchResults?.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-10 lg:px-16 py-14 lg:py-18">
        {searchResults ? (
          /* ── Search results ─────────────────────────────────────────── */
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-gold-500" />
              <span className="text-gold-500 text-[11px] tracking-[0.32em] font-bold uppercase">
                Search Results
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-navy-900 dark:text-white font-semibold mb-2">
                  No results found
                </p>
                <p className="text-sm text-gray-400 dark:text-white/35">
                  Try different keywords, or browse the categories below.
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="mt-5 text-[10px] tracking-[0.25em] font-bold text-gold-500 hover:text-gold-400 transition-colors uppercase"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-0">
                {searchResults.map((item, i) => {
                  const [isOpen, setIsOpen] = useState(i === 0);
                  return (
                    <div key={i}>
                      <div className="mb-0.5 mt-4 first:mt-0">
                        <span className="text-[10px] tracking-[0.2em] font-bold text-gold-500/70 uppercase">
                          {item.catEmoji} {item.catLabel}
                        </span>
                      </div>
                      <AccordionItem
                        q={item.q}
                        a={item.a}
                        isOpen={isOpen}
                        onToggle={() => setIsOpen(!isOpen)}
                        index={i}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ── Category layout ─────────────────────────────────────────── */
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
            {/* Sidebar category nav */}
            <div className="lg:w-56 flex-shrink-0">
              <p className="text-[10px] tracking-[0.3em] text-gray-400 dark:text-white/30 font-bold uppercase mb-4">
                Browse Topics
              </p>
              <nav
                className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0"
                style={{ scrollbarWidth: "none" }}
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200
                                text-xs font-semibold tracking-wide border-l-2
                                ${
                                  activeCategory === cat.id
                                    ? "border-gold-500 bg-gold-500/6 dark:bg-gold-500/8 text-gold-600 dark:text-gold-400"
                                    : "border-transparent text-gray-400 dark:text-white/35 hover:text-navy-900 dark:hover:text-white/65 hover:border-gray-200 dark:hover:border-white/15"
                                }`}
                  >
                    <span className="text-base leading-none">{cat.emoji}</span>
                    <span className="whitespace-nowrap">{cat.label}</span>
                    <span
                      className={`ml-auto text-[10px] font-bold hidden lg:block ${
                        activeCategory === cat.id
                          ? "text-gold-500/60"
                          : "text-gray-200 dark:text-white/15"
                      }`}
                    >
                      {cat.questions.length}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Questions panel */}
            <div className="flex-1 min-w-0" ref={contentRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Panel header */}
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl">{currentCat?.emoji}</span>
                    <div>
                      <p className="text-[10px] tracking-[0.3em] text-gold-500 font-bold uppercase mb-0.5">
                        {currentCat?.questions.length} Questions
                      </p>
                      <h2
                        className="text-xl sm:text-2xl font-bold text-navy-900 dark:text-white"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {currentCat?.label}
                      </h2>
                    </div>
                  </div>

                  {/* Accordion */}
                  <div>
                    {currentCat?.questions.map((item, i) => (
                      <AccordionItem
                        key={i}
                        q={item.q}
                        a={item.a}
                        isOpen={openIndex === i}
                        onToggle={() =>
                          setOpenIndex(openIndex === i ? null : i)
                        }
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* ── Still have questions? ─────────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-navy-800/40 border-y border-gray-100 dark:border-white/8 py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gold-500 text-[11px] tracking-[0.38em] font-bold uppercase mb-3 flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-gold-500" />
            Still have questions?
            <span className="w-8 h-px bg-gold-500" />
          </p>
          <h3
            className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our team is available 24 / 7
          </h3>
          <p className="text-gray-400 dark:text-white/40 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Can't find what you're looking for? Reach out directly — we're
            always happy to help.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="tel:+2348103785017">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5
                           bg-gold-500 hover:bg-gold-400 text-white
                           text-[10px] tracking-[0.25em] font-bold transition-all duration-300"
              >
                <FaPhone className="w-3 h-3" />
                CALL US NOW
              </motion.button>
            </a>
            <a
              href="https://wa.me/2348103785017"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5
                           bg-green-500 hover:bg-green-400 text-white
                           text-[10px] tracking-[0.25em] font-bold transition-all duration-300"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                WHATSAPP
              </motion.button>
            </a>
            <a href="mailto:info@dubaninternationalhotel.com">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5
                           border border-gray-200 dark:border-white/15
                           text-gray-500 dark:text-white/50 hover:border-gold-500 hover:text-gold-500
                           text-[10px] tracking-[0.25em] font-bold transition-all duration-300"
              >
                <FaEnvelope className="w-3 h-3" />
                EMAIL US
              </motion.button>
            </a>
          </div>

          {/* Contact info strip */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 dark:text-white/30">
            <span>📍 63 Ogunnusi Rd, Aguda, Ogba, Lagos</span>
            <span className="hidden sm:block text-gray-200 dark:text-white/10">
              |
            </span>
            <span>📞 +234 810 378 5017</span>
            <span className="hidden sm:block text-gray-200 dark:text-white/10">
              |
            </span>
            <span>✉️ info@dubaninternationalhotel.com</span>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-navy-900 py-14 px-6 text-center">
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
            Ready to Book?
            <span className="w-8 h-px bg-gold-400" />
          </p>
          <h3
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Experience DurbanInternational
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/rooms">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-[0.28em] font-bold transition-all duration-300 shadow-lg"
              >
                BOOK A ROOM
              </motion.button>
            </Link>
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

export default FAQPage;
