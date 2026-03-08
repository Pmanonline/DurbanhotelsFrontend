import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useLocation,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUser,
  FaPhone,
  FaCheck,
  FaChevronDown,
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaCreditCard,
  FaStar,
  FaRulerCombined,
  FaBath,
  FaClock,
  FaLock,
  FaWhatsapp,
  FaInfoCircle,
  FaBolt,
  FaDownload,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPrint,
  FaPhone as FaPhoneIcon,
  FaExclamationTriangle,
  FaCopy,
  FaSpinner,
} from "react-icons/fa";
import { MdKingBed } from "react-icons/md";
import {
  fetchRoomBySlug,
  getRoomPriceEstimate,
  createBooking,
  clearRoomError,
} from "../features/Room/Roomslice";
import { ReserveSuccess, DepositSuccess } from "../components/Bookingoutcomes";

// ─── Config ───────────────────────────────────────────────────────────────────
const PAYSTACK_PUBLIC_KEY = "pk_test_f0a7e900e3367840ca8ac7d6ddff3720f122ee28";
const BANK_DETAILS = {
  companyName: "DubanInternational Hotel Ltd",
  bankName: "First Bank of Nigeria",
  bankAddress: "Lagos, Nigeria",
  beneficiaryName: "DubanInternational Hotels & Resorts",
  accountNumber: "2012345678",
  sortCode: "011",
  swiftCode: "FBNINGLA",
  email: "reservations@dubanhotel.com",
  whatsapp: "2348103785017",
  phone: "+234 810 378 5017",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayStr = new Date().toISOString().split("T")[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
const nightsBetween = (a, b) =>
  Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));
const fmt = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;
const genRef = () =>
  `DBN-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const fmtShort = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ─── Paystack loader ──────────────────────────────────────────────────────────
const loadPaystack = () =>
  new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => resolve(window.PaystackPop);
    document.head.appendChild(s);
  });

// ─── PDF download (jsPDF + html2canvas) ───────────────────────────────────────
const loadJsPDF = () =>
  new Promise((resolve) => {
    if (window.jspdf) {
      resolve(window.jspdf.jsPDF);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf.jsPDF);
    document.head.appendChild(s);
  });

const loadHtml2Canvas = () =>
  new Promise((resolve) => {
    if (window.html2canvas) {
      resolve(window.html2canvas);
      return;
    }
    const s = document.createElement("script");
    s.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => resolve(window.html2canvas);
    document.head.appendChild(s);
  });

const downloadPDF = async (elementId, filename) => {
  const [jsPDF, html2canvas] = await Promise.all([
    loadJsPDF(),
    loadHtml2Canvas(),
  ]);
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    ignoreElements: (el) => el.classList?.contains("no-print"),
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();
  const imgH = (canvas.height * pdfW) / canvas.width;
  let heightLeft = imgH;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfW, imgH);
  heightLeft -= pdfH;
  while (heightLeft > 0) {
    position -= pdfH;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfW, imgH);
    heightLeft -= pdfH;
  }
  pdf.save(filename);
};

// ─── Small reusable components ────────────────────────────────────────────────
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-auto text-gray-400 hover:text-gold-500 transition-colors flex-shrink-0"
      title="Copy"
    >
      {copied ? (
        <FaCheck className="w-3 h-3 text-green-500" />
      ) : (
        <FaCopy className="w-3 h-3" />
      )}
    </button>
  );
};

const SummaryRow = ({ label, value, highlight, bold, copyable }) => (
  <div
    className={`flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-white/6 last:border-0 ${bold ? "font-bold" : ""}`}
  >
    <span className="text-xs text-gray-400 dark:text-white/35 tracking-wide flex-shrink-0">
      {label}
    </span>
    <span
      className={`text-sm font-semibold flex items-center gap-2 text-right ${highlight ? "text-gold-500" : bold ? "text-navy-900 dark:text-white text-base" : "text-gray-800 dark:text-white/80"}`}
    >
      {value}
      {copyable && <CopyBtn text={String(value)} />}
    </span>
  </div>
);

const Stars = ({ rating = 0 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={`w-3 h-3 ${s <= Math.floor(rating) ? "text-gold-500" : "text-gray-300 dark:text-white/15"}`}
      />
    ))}
  </div>
);

const Field = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  placeholder,
}) => (
  <div>
    <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-1.5">
      {label}
      {required && <span className="text-gold-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || label}
      className={`w-full px-4 py-3 text-sm outline-none transition-all bg-white dark:bg-navy-800 text-gray-800 dark:text-white border
        ${error ? "border-red-400 bg-red-50 dark:bg-red-900/10" : "border-gray-200 dark:border-white/10 focus:border-gold-500"}`}
    />
    {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required,
  error,
}) => (
  <div>
    <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-1.5">
      {label}
      {required && <span className="text-gold-500 ml-0.5">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`appearance-none w-full px-4 py-3 text-sm outline-none cursor-pointer bg-white dark:bg-navy-800 text-gray-800 dark:text-white border
          ${error ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-gold-500"}`}
      >
        {options.map((o) => (
          <option
            key={typeof o === "string" ? o : o.value}
            value={typeof o === "string" ? o : o.value}
            className="bg-white dark:bg-navy-800"
          >
            {typeof o === "string" ? o : o.label}
          </option>
        ))}
      </select>
      <FaChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-2.5 h-2.5 pointer-events-none" />
    </div>
    {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
  </div>
);

const FormSection = ({ icon, title, step, optional, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/8 p-6 sm:p-8 mb-5"
  >
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100 dark:border-white/8">
      <div className="w-9 h-9 bg-gold-500 flex items-center justify-center text-white text-sm flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3
          className="font-bold text-navy-900 dark:text-white text-base"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h3>
        <p className="text-[10px] text-gray-400 dark:text-white/30 tracking-widest">
          STEP {step}
          {optional && " · OPTIONAL"}
        </p>
      </div>
    </div>
    {children}
  </motion.div>
);

const PaymentCard = ({
  selected,
  onClick,
  icon,
  title,
  badge,
  badgeColor,
  description,
  highlight,
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    className={`relative w-full text-left p-5 border-2 transition-all duration-200 flex flex-col gap-2
      ${selected ? "border-gold-500 bg-gold-50 dark:bg-gold-500/10" : "border-gray-200 dark:border-white/10 hover:border-gold-300 bg-white dark:bg-navy-800"}`}
  >
    {badge && (
      <span
        className={`absolute top-3 right-3 text-[9px] font-bold tracking-widest px-2 py-0.5 ${badgeColor}`}
      >
        {badge}
      </span>
    )}
    <div className="flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${selected ? "bg-gold-500 text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50"}`}
      >
        {icon}
      </div>
      <p
        className={`font-bold text-sm ${selected ? "text-navy-900 dark:text-white" : "text-gray-700 dark:text-white/70"}`}
      >
        {title}
      </p>
      {selected && (
        <div className="ml-auto w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
          <FaCheck className="text-white w-2.5 h-2.5" />
        </div>
      )}
    </div>
    <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed pl-[52px]">
      {description}
    </p>
    {highlight && selected && (
      <div className="pl-[52px]">
        <span className="text-[11px] font-bold text-gold-600 dark:text-gold-400">
          {highlight}
        </span>
      </div>
    )}
  </motion.button>
);

const HoldCountdown = ({ expiresAt }) => {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setRemaining("EXPIRED");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(
        `${h > 0 ? `${h}h ` : ""}${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return (
    <span
      className={`font-bold tabular-nums ${expiresAt - Date.now() < 600000 ? "text-red-500" : "text-gold-500"}`}
    >
      {remaining}
    </span>
  );
};

const InfoCard = ({ title, icon, children, className = "", id }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    id={id}
    className={`bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/8 overflow-hidden mb-5 ${className}`}
  >
    {title && (
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/2">
        {icon && <span className="text-gold-500">{icon}</span>}
        <h3 className="text-[11px] font-bold tracking-[0.22em] text-gray-500 dark:text-white/40 uppercase">
          {title}
        </h3>
      </div>
    )}
    <div className="px-6 py-5">{children}</div>
  </motion.div>
);

const ConfirmationHero = ({
  icon,
  iconBg,
  title,
  subtitle,
  ref_,
  refLabel = "Booking Ref",
}) => (
  <div className="text-center mb-10">
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
      className={`w-24 h-24 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-5 shadow-xl`}
    >
      {icon}
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <h1
        className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h1>
      <p className="text-gray-500 dark:text-white/45 text-sm max-w-md mx-auto leading-relaxed">
        {subtitle}
      </p>
      {ref_ && (
        <div className="mt-4 inline-flex items-center gap-2.5 px-5 py-2.5 bg-navy-900 dark:bg-white/6 border border-navy-700 dark:border-white/10">
          <span className="text-[10px] text-white/40 tracking-[0.22em] uppercase">
            {refLabel}:
          </span>
          <span className="text-gold-400 font-bold tracking-widest text-sm">
            {ref_}
          </span>
          <CopyBtn text={ref_} />
        </div>
      )}
    </motion.div>
  </div>
);

const HotelInfoBlock = () => (
  <InfoCard
    title="Hotel Information"
    icon={<FaMapMarkerAlt className="w-4 h-4" />}
  >
    <div className="space-y-3">
      {[
        {
          icon: (
            <FaMapMarkerAlt className="w-3.5 h-3.5 text-gold-500 flex-shrink-0 mt-0.5" />
          ),
          text: "DubanInternational Hotel, Ogba, Lagos State, Nigeria",
        },
        {
          icon: (
            <FaPhoneIcon className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          ),
          text: BANK_DETAILS.phone,
        },
        {
          icon: (
            <FaEnvelope className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
          ),
          text: BANK_DETAILS.email,
        },
      ].map(({ icon, text }, i) => (
        <div
          key={i}
          className="flex items-start gap-3 text-sm text-gray-600 dark:text-white/55"
        >
          {icon}
          {text}
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/8">
      <p className="text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/30 uppercase font-semibold mb-2.5">
        Terms & Conditions
      </p>
      <div className="space-y-2 text-xs text-gray-500 dark:text-white/40 leading-relaxed">
        <p>
          <strong className="text-gray-600 dark:text-white/55">
            Cancellation:
          </strong>{" "}
          Free cancellation 24 hours before check-in. Penalty applies after
          that.
        </p>
        <p>
          <strong className="text-gray-600 dark:text-white/55">
            City Tax:
          </strong>{" "}
          May apply for foreign visitors — payable at check-in.
        </p>
        <p>
          <strong className="text-gray-600 dark:text-white/55">
            Check-in:
          </strong>{" "}
          From 14:00 ·{" "}
          <strong className="text-gray-600 dark:text-white/55">
            Check-out:
          </strong>{" "}
          Until 11:00.
        </p>
      </div>
    </div>
  </InfoCard>
);

const BankTransferBlock = ({ ref_ }) => (
  <InfoCard
    title="Bank Transfer Instructions"
    icon={<FaCreditCard className="w-4 h-4" />}
  >
    <div className="space-y-0">
      {[
        ["Hotel Company Name", BANK_DETAILS.companyName, false],
        ["Bank Name", BANK_DETAILS.bankName, false],
        ["Bank Address", BANK_DETAILS.bankAddress, false],
        ["Beneficiary Name", BANK_DETAILS.beneficiaryName, false],
        ["Account Number", BANK_DETAILS.accountNumber, true],
        ["Sort Code", BANK_DETAILS.sortCode, false],
        ["SWIFT Code", BANK_DETAILS.swiftCode, true],
      ].map(([k, v, copyable]) => (
        <SummaryRow key={k} label={k} value={v} copyable={copyable} />
      ))}
    </div>
    <div className="mt-5 p-4 border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/8">
      <div className="flex items-start gap-2.5">
        <FaExclamationTriangle className="text-amber-500 w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
            IMPORTANT
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Send proof of payment with reference{" "}
            <strong className="text-amber-900 dark:text-amber-200">
              {ref_}
            </strong>{" "}
            to <strong>{BANK_DETAILS.email}</strong>. Bookings without a clearly
            marked reference cannot be validated.
          </p>
        </div>
      </div>
    </div>
    <a
      href={`mailto:${BANK_DETAILS.email}?subject=Proof of Payment — ${ref_}&body=Please find attached my proof of payment for booking reference: ${ref_}`}
      className="mt-4 flex items-center justify-center gap-2.5 w-full py-3 border border-gold-400 text-gold-600 dark:text-gold-400
        hover:bg-gold-500 hover:text-white hover:border-gold-500 transition-all text-xs font-bold tracking-[0.18em]"
    >
      <FaEnvelope className="w-3.5 h-3.5" /> EMAIL PROOF OF PAYMENT
    </a>
  </InfoCard>
);

// ─── Nightly price breakdown ──────────────────────────────────────────────────
const NightlyBreakdown = ({ checkIn, checkOut, pricePerNight }) => {
  const nights = nightsBetween(checkIn, checkOut);
  return (
    <>
      {Array.from({ length: nights }, (_, i) => {
        const d = new Date(checkIn);
        d.setDate(d.getDate() + i);
        return (
          <div
            key={i}
            className="flex justify-between text-sm py-1.5 border-b border-gray-100 dark:border-white/6"
          >
            <span className="text-gray-500 dark:text-white/40">
              {d.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="font-medium text-gray-800 dark:text-white/70">
              {fmt(pricePerNight)}
            </span>
          </div>
        );
      })}
    </>
  );
};

// ─── Booking details block (shared between outcomes) ─────────────────────────
const BookingDetailsBlock = ({ room, form, nights, priceBreakdown }) => {
  const images = room.images?.length
    ? room.images
    : room.thumbnailImage
      ? [room.thumbnailImage]
      : [];
  const bedLabel = [
    room.bedCount > 1 ? room.bedCount : null,
    room.bedType,
    room.bedCount > 1 ? "Beds" : "Bed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <InfoCard title="Room & Rate Details">
      <div className="flex gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-white/8">
        {images[0] && (
          <img
            src={images[0]}
            alt={room.displayName || room.name}
            className="w-20 h-16 object-cover flex-shrink-0 border border-gray-100 dark:border-white/10"
          />
        )}
        <div>
          <p className="text-[10px] font-bold tracking-[0.22em] text-gold-500 uppercase mb-0.5">
            {room.category}
          </p>
          <h3
            className="font-bold text-navy-900 dark:text-white text-base leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {room.displayName || room.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5">
            {[room.view, room.size, bedLabel].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-white/8">
        {[
          { label: "Check-In", date: form.checkIn, note: "from 14:00" },
          { label: "Check-Out", date: form.checkOut, note: "until 11:00" },
        ].map(({ label, date, note }) => (
          <div key={label}>
            <p className="text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/30 uppercase font-semibold mb-1">
              {label}
            </p>
            <p className="font-bold text-navy-900 dark:text-white text-sm">
              {fmtShort(date)}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">
              {note}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-5 pb-5 border-b border-gray-100 dark:border-white/8 space-y-0">
        <SummaryRow label="Guest Name" value={form.name} />
        <SummaryRow label="Email" value={form.email} />
        <SummaryRow label="Phone" value={form.phone} />
        <SummaryRow
          label="Nights"
          value={`${nights} night${nights !== 1 ? "s" : ""}`}
        />
        <SummaryRow
          label="Guests"
          value={`${form.adults} Adult${+form.adults > 1 ? "s" : ""}${+form.children > 0 ? `, ${form.children} Child${+form.children > 1 ? "ren" : ""}` : ""}`}
        />
        {+form.rooms > 1 && (
          <SummaryRow label="Rooms" value={`${form.rooms} rooms`} />
        )}
      </div>

      <div className="mb-4">
        <p className="text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/30 uppercase font-semibold mb-2">
          Price Breakdown
        </p>
        <NightlyBreakdown
          checkIn={form.checkIn}
          checkOut={form.checkOut}
          pricePerNight={room.pricePerNight}
        />
      </div>

      <div className="space-y-0">
        {priceBreakdown?.vatAmount > 0 && (
          <SummaryRow
            label={`VAT (${((room.taxRate ?? 0.075) * 100).toFixed(0)}%)`}
            value={fmt(priceBreakdown.vatAmount)}
          />
        )}
        {priceBreakdown?.serviceChargeAmount > 0 && (
          <SummaryRow
            label="Service Charge"
            value={fmt(priceBreakdown.serviceChargeAmount)}
          />
        )}
        <div className="flex justify-between items-center pt-3 mt-1 border-t-2 border-gray-100 dark:border-white/10">
          <span className="text-sm font-bold text-gray-600 dark:text-white/50">
            Total Price
          </span>
          <span className="text-xl font-bold text-navy-900 dark:text-white">
            {fmt(priceBreakdown?.grandTotal)}
          </span>
        </div>
      </div>
    </InfoCard>
  );
};

// ─── PDF Download button component ───────────────────────────────────────────
const PDFDownloadBtn = ({ bookingRef, downloadingPDF, onDownload }) => (
  <button
    onClick={onDownload}
    disabled={downloadingPDF}
    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 border border-navy-900 dark:border-white/20
      text-navy-900 dark:text-white/70 hover:bg-navy-900 hover:text-white dark:hover:bg-white/10
      text-xs tracking-[0.2em] font-bold transition-all duration-200 disabled:opacity-60"
  >
    {downloadingPDF ? (
      <>
        <FaSpinner className="w-3.5 h-3.5 animate-spin" /> GENERATING PDF…
      </>
    ) : (
      <>
        <FaDownload className="w-3.5 h-3.5" /> DOWNLOAD PDF
      </>
    )}
  </button>
);

// ══════════════════════════════════════════════════════════════════════════════
// ─── MAIN BOOKING PAGE ───────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ── Get slug from ?room=slug or from navigation state ────────────────────
  const slugFromQuery = searchParams.get("room");
  const state = location.state || {};
  const slugFromState = state.slug;
  const slug = slugFromQuery || slugFromState;

  const {
    currentRoom: room,
    priceEstimate,
    loading: roomLoading,
    error: roomError,
  } = useSelector((s) => s.rooms);
  const { loading: bookingLoading } = useSelector((s) => s.rooms);

  // ── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    checkIn: state.checkIn || todayStr,
    checkOut: state.checkOut || tomorrowStr,
    rooms: state.roomCount?.toString() || "1",
    adults: state.adults?.toString() || "2",
    children: state.children?.toString() || "0",
    altDates: "no",
    payment: "deposit",
    special: "",
    extras: state.extras || {},
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState(null); // "reserved" | "paid"
  const [bookingRef, setBookingRef] = useState("");
  const [holdExpiry, setHoldExpiry] = useState(null);
  const [depositPaid, setDepositPaid] = useState(0);
  const [savedPriceBreakdown, setSavedPriceBreakdown] = useState(null);

  // ── Fetch room by slug ────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    dispatch(fetchRoomBySlug(slug));
  }, [slug, dispatch]);

  // If no slug, redirect to rooms
  useEffect(() => {
    if (!slug && !roomLoading) navigate("/rooms", { replace: true });
  }, [slug, roomLoading, navigate]);

  // ── Debounced price estimate ──────────────────────────────────────────────
  useEffect(() => {
    if (!room?._id) return;
    const t = setTimeout(() => {
      const selectedExtras = Object.entries(form.extras)
        .filter(([, v]) => v)
        .map(([k]) => ({ label: k }));
      dispatch(
        getRoomPriceEstimate({
          roomId: room._id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          roomCount: +form.rooms,
          extras: selectedExtras,
        }),
      );
    }, 400);
    return () => clearTimeout(t);
  }, [
    room?._id,
    form.checkIn,
    form.checkOut,
    form.rooms,
    form.extras,
    dispatch,
  ]);

  useEffect(() => () => dispatch(clearRoomError()), [dispatch]);

  // ── Derived pricing ───────────────────────────────────────────────────────
  const nights = nightsBetween(form.checkIn, form.checkOut);
  const baseNightly = room?.pricePerNight ?? 0;
  const baseTotal =
    priceEstimate?.totalBase ?? baseNightly * nights * +form.rooms;
  const vatAmount =
    priceEstimate?.vatAmount ?? baseTotal * (room?.taxRate ?? 0.075);
  const svcAmount =
    priceEstimate?.serviceChargeAmount ??
    baseTotal * (room?.serviceChargeRate ?? 0.05);
  const grandTotal =
    priceEstimate?.grandTotal ?? baseTotal + vatAmount + svcAmount;
  // Deposit: use field from room if present, else default to 30%
  const deposit = room?.depositAmount ?? Math.ceil(grandTotal * 0.3);
  const balanceDue = Math.max(0, grandTotal - deposit);

  const currentBreakdown = {
    totalBase: baseTotal,
    vatAmount,
    serviceChargeAmount: svcAmount,
    grandTotal,
  };

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
  };
  const toggleExtra = (label) =>
    setForm((f) => ({
      ...f,
      extras: { ...f.extras, [label]: !f.extras[label] },
    }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.email !== form.confirmEmail)
      e.confirmEmail = "Emails do not match";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.checkIn) e.checkIn = "Check-in date required";
    if (!form.checkOut) e.checkOut = "Check-out date required";
    if (new Date(form.checkOut) <= new Date(form.checkIn))
      e.checkOut = "Check-out must be after check-in";
    return e;
  };

  const handlePaystackDeposit = useCallback(
    async (ref) => {
      const PS = await loadPaystack();
      const handler = PS.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: deposit * 100,
        currency: "NGN",
        ref,
        metadata: {
          custom_fields: [
            {
              display_name: "Room",
              variable_name: "room",
              value: room?.displayName || room?.name,
            },
            {
              display_name: "Check In",
              variable_name: "check_in",
              value: form.checkIn,
            },
            {
              display_name: "Check Out",
              variable_name: "check_out",
              value: form.checkOut,
            },
            {
              display_name: "Guest",
              variable_name: "guest_name",
              value: form.name,
            },
            {
              display_name: "Phone",
              variable_name: "phone",
              value: form.phone,
            },
          ],
        },
        callback: async (response) => {
          // Save booking to backend
          await dispatch(
            createBooking({
              roomId: room._id,
              guestName: form.name,
              guestEmail: form.email,
              guestPhone: form.phone,
              checkIn: form.checkIn,
              checkOut: form.checkOut,
              adults: +form.adults,
              children: +form.children,
              roomCount: +form.rooms,
              specialRequests: form.special,
              extras: Object.entries(form.extras)
                .filter(([, v]) => v)
                .map(([k]) => ({ label: k })),
              paymentMethod: "paystack",
              paymentStatus: "deposit_paid",
              paymentRef: response.reference,
              depositAmount: deposit,
              totalAmount: grandTotal,
              bookingRef: ref,
            }),
          );
          setSavedPriceBreakdown({ ...currentBreakdown });
          setDepositPaid(deposit);
          setBookingRef(ref);
          setOutcome("paid");
          setSubmitting(false);
        },
        onClose: () => setSubmitting(false),
      });
      handler.openIframe();
    },
    [form, deposit, room, grandTotal, currentBreakdown, dispatch],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const ref = genRef();
    setSubmitting(true);

    if (form.payment === "deposit") {
      await handlePaystackDeposit(ref);
    } else {
      // Reserve — save to backend
      await dispatch(
        createBooking({
          roomId: room._id,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          adults: +form.adults,
          children: +form.children,
          roomCount: +form.rooms,
          specialRequests: form.special,
          extras: Object.entries(form.extras)
            .filter(([, v]) => v)
            .map(([k]) => ({ label: k })),
          paymentMethod: "bank-transfer",
          paymentStatus: "pending",
          totalAmount: grandTotal,
          bookingRef: ref,
          altDates: form.altDates === "yes",
        }),
      );
      const holdHours = room?.holdHours ?? 24;
      setSavedPriceBreakdown({ ...currentBreakdown });
      setBookingRef(ref);
      setHoldExpiry(Date.now() + holdHours * 3600 * 1000);
      setOutcome("reserved");
      setSubmitting(false);
    }
  };

  // ── Outcome screens ───────────────────────────────────────────────────────
  if (outcome === "reserved" && room)
    return (
      <ReserveSuccess
        room={room}
        form={form}
        nights={nights}
        ref_={bookingRef}
        expiresAt={holdExpiry}
        priceBreakdown={savedPriceBreakdown}
      />
    );

  if (outcome === "paid" && room)
    return (
      <DepositSuccess
        room={room}
        form={form}
        nights={nights}
        ref_={bookingRef}
        depositPaid={depositPaid}
        priceBreakdown={savedPriceBreakdown}
      />
    );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (roomLoading && !room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 dark:text-white/40 text-sm tracking-wide">
            Loading room details…
          </p>
        </div>
      </div>
    );
  }

  if (roomError || (!roomLoading && !room)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex flex-col items-center justify-center px-6">
        <FaExclamationTriangle className="text-red-400 w-10 h-10 mb-4" />
        <p
          className="text-navy-900 dark:text-white text-xl font-semibold mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Room not found
        </p>
        <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
          The room "{slug}" could not be found. Please select a room and try
          again.
        </p>
        <Link
          to="/rooms"
          className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-widest font-bold transition-all"
        >
          BROWSE ROOMS
        </Link>
      </div>
    );
  }

  // ── Normalise room fields ──────────────────────────────────────────────────
  const displayName = room.displayName || room.name || "Room";
  const images = room.images?.length
    ? room.images
    : room.thumbnailImage
      ? [room.thumbnailImage]
      : [];
  const bedLabel = [
    room.bedCount > 1 ? room.bedCount : null,
    room.bedType,
    room.bedCount > 1 ? "Beds" : "Bed",
  ]
    .filter(Boolean)
    .join(" ");
  const holdHours = room.holdHours ?? 24;

  // ── Main form ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* Hero */}
      <div className="relative bg-navy-900 pt-24 pb-14 px-6 sm:px-10 lg:px-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f5a623 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <Link
            to={`/rooms/roomdetail/${slug}`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-gold-400 text-xs tracking-[0.2em] mb-6 transition-colors"
          >
            <FaArrowLeft className="w-3 h-3" /> BACK TO ROOM
          </Link>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Complete Your <span className="text-gold-400">Reservation</span>
          </h1>
          <p className="text-white/40 text-sm">
            You're one step away from an unforgettable Lagos experience
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-14">
          {/* ══ FORM ══════════════════════════════════════════════════════════ */}
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Step 01 – Guest details */}
            <FormSection icon={<FaUser />} title="Guest Details" step="01">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={set("name")}
                  error={errors.name}
                  required
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  error={errors.phone}
                  required
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                  required
                />
                <Field
                  label="Confirm Email"
                  name="confirmEmail"
                  type="email"
                  value={form.confirmEmail}
                  onChange={set("confirmEmail")}
                  error={errors.confirmEmail}
                  required
                  placeholder="Re-type email address"
                />
              </div>
            </FormSection>

            {/* Step 02 – Stay details */}
            <FormSection
              icon={<FaCalendarAlt />}
              title="Stay Details"
              step="02"
            >
              {/* Selected room pill */}
              <div className="mb-4">
                <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-1.5">
                  Selected Room
                </label>
                <div className="flex items-center gap-3 px-4 py-3 border border-gold-300 dark:border-gold-500/40 bg-gold-50 dark:bg-gold-500/10">
                  <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
                  <span className="text-navy-900 dark:text-white font-semibold text-sm">
                    {displayName}
                  </span>
                  <span className="ml-auto text-gold-500 font-bold text-sm">
                    {fmt(baseNightly)}/night
                  </span>
                  <Link
                    to="/rooms"
                    className="text-[10px] text-gray-400 hover:text-gold-500 tracking-widest transition-colors underline ml-2"
                  >
                    Change
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Check-in */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-1.5">
                    Check In<span className="text-gold-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20 w-3.5 h-3.5" />
                    <input
                      type="date"
                      value={form.checkIn}
                      min={todayStr}
                      onChange={set("checkIn")}
                      className={`w-full pl-10 pr-4 py-3 text-sm outline-none [color-scheme:light] dark:[color-scheme:dark] bg-white dark:bg-navy-800 text-gray-800 dark:text-white border transition-colors
                        ${errors.checkIn ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-gold-500"}`}
                    />
                  </div>
                  {errors.checkIn && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {errors.checkIn}
                    </p>
                  )}
                </div>
                {/* Check-out */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-1.5">
                    Check Out<span className="text-gold-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/20 w-3.5 h-3.5" />
                    <input
                      type="date"
                      value={form.checkOut}
                      min={form.checkIn}
                      onChange={set("checkOut")}
                      className={`w-full pl-10 pr-4 py-3 text-sm outline-none [color-scheme:light] dark:[color-scheme:dark] bg-white dark:bg-navy-800 text-gray-800 dark:text-white border transition-colors
                        ${errors.checkOut ? "border-red-400" : "border-gray-200 dark:border-white/10 focus:border-gold-500"}`}
                    />
                  </div>
                  {errors.checkOut && (
                    <p className="text-red-400 text-[10px] mt-1">
                      {errors.checkOut}
                    </p>
                  )}
                </div>

                <SelectField
                  label="Number of Rooms"
                  name="rooms"
                  value={form.rooms}
                  onChange={set("rooms")}
                  options={["1", "2", "3", "4"]}
                />
                <div />
                <SelectField
                  label="No. of Adults"
                  name="adults"
                  value={form.adults}
                  onChange={set("adults")}
                  options={["1", "2", "3", "4", "5", "6"]}
                  required
                />
                <SelectField
                  label="No. of Children"
                  name="children"
                  value={form.children}
                  onChange={set("children")}
                  options={["0", "1", "2", "3", "4"]}
                />
              </div>

              <div className="mt-5">
                <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-3">
                  Open to alternative dates if first choice unavailable?
                </label>
                <div className="flex gap-3">
                  {["yes", "no"].map((v) => (
                    <label
                      key={v}
                      className={`flex items-center gap-2.5 px-5 py-3 border cursor-pointer transition-all flex-1 ${form.altDates === v ? "border-gold-500 bg-gold-50 dark:bg-gold-500/10" : "border-gray-200 dark:border-white/10 hover:border-gold-300"}`}
                    >
                      <input
                        type="radio"
                        name="altDates"
                        value={v}
                        checked={form.altDates === v}
                        onChange={set("altDates")}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.altDates === v ? "border-gold-500" : "border-gray-300 dark:border-white/20"}`}
                      >
                        {form.altDates === v && (
                          <div className="w-2 h-2 rounded-full bg-gold-500" />
                        )}
                      </div>
                      <span className="text-sm font-semibold capitalize text-gray-700 dark:text-white/70">
                        {v}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </FormSection>

            {/* Step 03 – Extra services */}
            {room.extraServices?.length > 0 && (
              <FormSection
                icon={<FaShieldAlt />}
                title="Extra Services"
                step="03"
                optional
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.extraServices.map((svc) => (
                    <label
                      key={svc.label}
                      className={`flex items-center justify-between gap-3 p-3 border cursor-pointer transition-all ${!!form.extras[svc.label] ? "border-gold-500 bg-gold-50 dark:bg-gold-500/10" : "border-gray-200 dark:border-white/10 hover:border-gold-300"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => toggleExtra(svc.label)}
                          className={`w-4 h-4 border flex items-center justify-center transition-colors flex-shrink-0 ${!!form.extras[svc.label] ? "bg-gold-500 border-gold-500" : "border-gray-300 dark:border-white/20"}`}
                        >
                          {!!form.extras[svc.label] && (
                            <FaCheck className="text-white w-2.5 h-2.5" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${!!form.extras[svc.label] ? "text-navy-900 dark:text-white" : "text-gray-600 dark:text-white/60"}`}
                        >
                          {svc.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-white/30 flex-shrink-0">
                        {svc.price ? fmt(svc.price) : svc.note || ""}
                      </span>
                    </label>
                  ))}
                </div>
              </FormSection>
            )}

            {/* Step 04 – Payment */}
            <FormSection
              icon={<FaCreditCard />}
              title="How to Secure Your Room"
              step="04"
            >
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-5">
                <FaInfoCircle className="text-blue-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                  A deposit <strong>guarantees</strong> your booking instantly.
                  A free reservation holds the room for up to{" "}
                  <strong>{holdHours} hours</strong> while our team contacts
                  you.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PaymentCard
                  selected={form.payment === "deposit"}
                  onClick={() => setForm((f) => ({ ...f, payment: "deposit" }))}
                  icon={<FaBolt />}
                  title="Pay Deposit Now"
                  badge="RECOMMENDED"
                  badgeColor="bg-gold-500 text-white"
                  description={`Pay ${fmt(deposit)} via Paystack to instantly lock your room. Balance of ${fmt(balanceDue)} due on arrival.`}
                  highlight={`Deposit: ${fmt(deposit)}`}
                />
                <PaymentCard
                  selected={form.payment === "reserve"}
                  onClick={() => setForm((f) => ({ ...f, payment: "reserve" }))}
                  icon={<FaClock />}
                  title="Reserve — No Payment"
                  badge={`${holdHours}HR HOLD`}
                  badgeColor="bg-amber-400 text-white"
                  description={`Room held for ${holdHours} hrs. Our team will WhatsApp you to arrange payment.`}
                  highlight="Full amount due on arrival"
                />
              </div>

              {/* Payment breakdown preview */}
              <AnimatePresence>
                {form.payment === "deposit" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-white/4 border border-gray-200 dark:border-white/8 space-y-2">
                      <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-semibold mb-3">
                        Payment Summary
                      </p>
                      {[
                        [
                          "Room rate",
                          `${fmt(baseNightly)} × ${nights} night${nights > 1 ? "s" : ""} × ${form.rooms} room${+form.rooms > 1 ? "s" : ""}`,
                        ],
                        ["Total stay", fmt(grandTotal)],
                        ["Deposit (pay now)", fmt(deposit)],
                        ["Balance (on arrival)", fmt(balanceDue)],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-gray-400">{k}</span>
                          <span
                            className={`font-semibold ${k === "Deposit (pay now)" ? "text-gold-500" : "text-navy-900 dark:text-gray-400"}`}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </FormSection>

            {/* Step 05 – Special requests */}
            <FormSection
              icon={<FaUsers />}
              title="Special Requests"
              step="05"
              optional
            >
              <label className="block text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/40 uppercase font-semibold mb-1.5">
                Any special requests or notes
              </label>
              <textarea
                name="special"
                value={form.special}
                onChange={set("special")}
                rows={4}
                placeholder="e.g. early check-in, anniversary setup, dietary requirements, airport pickup..."
                className="w-full px-4 py-3 text-sm outline-none resize-none bg-white dark:bg-navy-800 text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 focus:border-gold-500 transition-colors"
              />
            </FormSection>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting || bookingLoading}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              className={`w-full py-4 text-white text-sm tracking-[0.25em] font-bold transition-all shadow-lg flex items-center justify-center gap-3 mt-2
                ${form.payment === "deposit" ? "bg-gold-500 hover:bg-gold-400 disabled:bg-gold-400/60" : "bg-navy-900 hover:bg-navy-700 disabled:bg-navy-900/60 dark:bg-white/15"}`}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  {form.payment === "deposit"
                    ? "OPENING PAYSTACK..."
                    : "SECURING HOLD..."}
                </>
              ) : form.payment === "deposit" ? (
                <>
                  <FaLock className="w-3.5 h-3.5" /> PAY {fmt(deposit)} DEPOSIT
                  & CONFIRM
                </>
              ) : (
                <>
                  <FaClock className="w-3.5 h-3.5" /> RESERVE FOR {holdHours}{" "}
                  HOURS — FREE
                </>
              )}
            </motion.button>

            <p className="text-center text-[10px] text-gray-400 dark:text-white/25 tracking-wide mt-4">
              By proceeding, you agree to our{" "}
              <Link to="/terms" className="text-gold-500 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="text-gold-500 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </motion.form>

          {/* ══ SIDEBAR ═══════════════════════════════════════════════════════ */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/8 overflow-hidden sticky top-28"
            >
              {/* Room image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={images[0] || ""}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/65 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="bg-gold-500 text-white text-[10px] font-bold px-3 py-1.5 tracking-wide">
                    {room.category}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3
                      className="font-bold text-navy-900 dark:text-white text-lg"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {displayName}
                    </h3>
                    <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5">
                      {room.view}
                    </p>
                  </div>
                  <Stars rating={room.rating} />
                </div>

                <div className="flex flex-wrap gap-3 pb-4 mb-4 border-b border-gray-100 dark:border-white/8">
                  {room.size && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                      <FaRulerCombined className="w-3 h-3 text-gold-500" />
                      {room.size}
                    </span>
                  )}
                  {room.maxGuests && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                      <FaUsers className="w-3 h-3 text-gold-500" />
                      {room.maxGuests} Guests
                    </span>
                  )}
                  {room.bedType && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                      <MdKingBed className="w-4 h-4 text-gold-500" />
                      {bedLabel}
                    </span>
                  )}
                  {room.bathrooms != null && (
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50">
                      <FaBath className="w-3 h-3 text-gold-500" />
                      {room.bathrooms} Bath
                    </span>
                  )}
                </div>

                {/* Live price */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500 dark:text-white/40">
                    <span>
                      {fmt(baseNightly)} × {nights} night
                      {nights !== 1 ? "s" : ""}
                    </span>
                    <span>{fmt(baseNightly * nights)}</span>
                  </div>
                  {+form.rooms > 1 && (
                    <div className="flex justify-between text-gray-500 dark:text-white/40">
                      <span>× {form.rooms} rooms</span>
                      <span>{fmt(baseTotal)}</span>
                    </div>
                  )}
                  {vatAmount > 0 && (
                    <div className="flex justify-between text-gray-400 dark:text-white/30 text-xs">
                      <span>VAT</span>
                      <span>{fmt(vatAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 dark:border-white/8">
                    <span className="text-gray-500 dark:text-white/50">
                      Total Stay
                    </span>
                    <span className="text-navy-900 dark:text-white">
                      {fmt(grandTotal)}
                    </span>
                  </div>
                  <AnimatePresence>
                    {form.payment === "deposit" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pt-3 border-t border-gray-100 dark:border-white/8 space-y-1.5"
                      >
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400 dark:text-white/30">
                            Pay now (deposit)
                          </span>
                          <span className="font-bold text-gold-500">
                            {fmt(deposit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400 dark:text-white/30">
                            Balance on arrival
                          </span>
                          <span className="font-semibold text-navy-900 dark:text-white">
                            {fmt(balanceDue)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {form.checkIn && form.checkOut && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {[
                      form.checkIn,
                      `→ ${form.checkOut}`,
                      `${nights} night${nights !== 1 ? "s" : ""}`,
                    ].map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/50 border border-gray-200 dark:border-white/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/8 p-5 space-y-3"
            >
              {[
                { icon: "🔒", text: "Payments secured via Paystack" },
                { icon: "⚡", text: "Instant confirmation on deposit" },
                { icon: "📱", text: "WhatsApp follow-up within 30 min" },
                { icon: "🏨", text: "Free cancellation 24hrs before arrival" },
                { icon: "📞", text: `${BANK_DETAILS.phone} — 24/7 support` },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/50"
                >
                  <span className="text-base flex-shrink-0">{icon}</span>
                  {text}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
