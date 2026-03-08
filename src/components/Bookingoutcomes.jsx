import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaEnvelope,
  FaWhatsapp,
  FaDownload,
  FaClock,
  FaCheckCircle,
  FaPrint,
  FaPhone as FaPhoneIcon,
  FaExclamationTriangle,
  FaCopy,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";
import BookingPDFTemplate, {
  downloadBookingPDF,
} from "../components/Bookingpdftemplate ";

// ─── Config ───────────────────────────────────────────────────────────────────
const BANK_DETAILS = {
  companyName: "Duban International Hotel Ltd",
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
const fmt = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;
const fmtShort = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ─── CopyBtn ──────────────────────────────────────────────────────────────────
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
    >
      {copied ? (
        <FaCheck className="w-3 h-3 text-green-500" />
      ) : (
        <FaCopy className="w-3 h-3" />
      )}
    </button>
  );
};

// ─── SummaryRow ───────────────────────────────────────────────────────────────
const SummaryRow = ({ label, value, highlight, bold, copyable }) => (
  <div
    className={`flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-white/6 last:border-0 ${bold ? "font-bold" : ""}`}
  >
    <span className="text-xs text-gray-400 dark:text-white/35 tracking-wide flex-shrink-0">
      {label}
    </span>
    <span
      className={`text-sm font-semibold flex items-center gap-2 text-right
      ${highlight ? "text-gold-500" : bold ? "text-navy-900 dark:text-white text-base" : "text-gray-800 dark:text-white/80"}`}
    >
      {value}
      {copyable && <CopyBtn text={String(value)} />}
    </span>
  </div>
);

// ─── HoldCountdown ────────────────────────────────────────────────────────────
const HoldCountdown = ({ expiresAt }) => {
  const [remaining, setRemaining] = useState("");
  React.useEffect(() => {
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

// ─── InfoCard ─────────────────────────────────────────────────────────────────
const InfoCard = ({ title, icon, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

// ─── ConfirmationHero ─────────────────────────────────────────────────────────
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

// ─── NightlyBreakdown ─────────────────────────────────────────────────────────
const NightlyBreakdown = ({ checkIn, checkOut, pricePerNight }) => {
  const n = Math.max(
    1,
    Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000),
  );
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
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

// ─── BookingDetailsBlock ──────────────────────────────────────────────────────
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

      <div className="mb-5 pb-5 border-b border-gray-100 dark:border-white/8">
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

      <div>
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

// ─── BankTransferBlock ────────────────────────────────────────────────────────
const BankTransferBlock = ({ ref_ }) => (
  <InfoCard
    title="Bank Transfer Instructions"
    icon={<FaCreditCard className="w-4 h-4" />}
  >
    <div>
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
      className="mt-4 flex items-center justify-center gap-2.5 w-full py-3 border border-gold-400
        text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white hover:border-gold-500
        transition-all text-xs font-bold tracking-[0.18em]"
    >
      <FaEnvelope className="w-3.5 h-3.5" /> EMAIL PROOF OF PAYMENT
    </a>
  </InfoCard>
);

// ─── HotelInfoBlock ───────────────────────────────────────────────────────────
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

// ─── Step breadcrumb ──────────────────────────────────────────────────────────
const StepBreadcrumb = ({ activeColor }) => (
  <div className="flex items-center justify-center gap-2 mb-12 text-[10px] tracking-[0.2em] text-gray-400 dark:text-white/30">
    {["ROOM SELECTED", "DETAILS", "CONFIRMED"].map((s, i) => (
      <React.Fragment key={s}>
        <span className={i === 2 ? `${activeColor} font-bold` : ""}>{s}</span>
        {i < 2 && <span className="text-gray-300 dark:text-white/15">›</span>}
      </React.Fragment>
    ))}
  </div>
);

// ─── Top nav bar ──────────────────────────────────────────────────────────────
const TopNav = ({ statusDot, statusLabel }) => (
  <div
    className="bg-navy-900 dark:bg-navy-950 border-b border-white/8 
                  px-6 sm:px-10 lg:px-16 
                  h-[20vh] flex items-center"
  >
    <div className="max-w-4xl mx-auto w-full flex items-center justify-between mt-12">
      <Link
        to="/"
        className="text-gold-400 text-xs tracking-[0.25em] font-bold hover:text-gold-300 transition-colors"
      >
        ← DUBRAN INTERNATIONAL HOTEL
      </Link>

      <div className="flex items-center gap-2 text-white/40 text-xs tracking-widest">
        <span className={`w-2 h-2 rounded-full ${statusDot}`} />
        {statusLabel}
      </div>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ─── RESERVE SUCCESS ──────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export const ReserveSuccess = ({
  room,
  form,
  nights,
  ref_,
  expiresAt,
  priceBreakdown,
}) => {
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const waMsg = `https://wa.me/${BANK_DETAILS.whatsapp}?text=Hi%2C%20I%20just%20made%20a%20reservation%20for%20*${encodeURIComponent(room.displayName || room.name)}*%20(Ref%3A%20*${ref_}*).%20Check-in%3A%20${form.checkIn}.%20Please%20confirm%20my%20booking.`;

  const handleDownload = async () => {
    setDownloadingPDF(true);
    try {
      await downloadBookingPDF(
        "pdf-reservation",
        `Duban-Reservation-${ref_}.pdf`,
      );
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* Hidden PDF template — off-screen, captured on demand */}
      <BookingPDFTemplate
        id="pdf-reservation"
        type="reservation"
        room={room}
        form={form}
        ref_={ref_}
        priceBreakdown={priceBreakdown}
        expiresAt={expiresAt}
      />

      <TopNav
        statusDot="bg-amber-400 animate-pulse"
        statusLabel="RESERVATION PENDING"
      />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 lg:py-16">
        <StepBreadcrumb activeColor="text-amber-500" />

        {/* Hero */}
        <ConfirmationHero
          icon={<FaClock className="text-white w-10 h-10" />}
          iconBg="bg-gradient-to-br from-amber-400 to-amber-600"
          title="Room Reserved!"
          subtitle={
            <>
              Your room is held temporarily.{" "}
              <strong className="text-navy-900 dark:text-white">
                No payment collected
              </strong>{" "}
              — our team will contact you to arrange payment.
            </>
          }
          ref_={ref_}
          refLabel="Reservation Ref"
        />

        {/* Hold countdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30"
        >
          <div className="flex items-start gap-4">
            <FaClock className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                <p className="text-amber-800 dark:text-amber-300 font-bold text-sm">
                  Room hold expires in:
                </p>
                <HoldCountdown expiresAt={expiresAt} />
              </div>
              <p className="text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
                Hold expires{" "}
                <strong>{new Date(expiresAt).toLocaleString("en-GB")}</strong>.
                If payment is not confirmed, the room will be automatically
                released.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={handleDownload}
            disabled={downloadingPDF}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5
              border border-navy-900 dark:border-white/20 text-navy-900 dark:text-white/70
              hover:bg-navy-900 hover:text-white dark:hover:bg-white/10
              text-xs tracking-[0.2em] font-bold transition-all duration-200 disabled:opacity-60"
          >
            {downloadingPDF ? (
              <>
                <FaSpinner className="w-3.5 h-3.5 animate-spin" /> GENERATING
                PDF…
              </>
            ) : (
              <>
                <FaDownload className="w-3.5 h-3.5" /> DOWNLOAD BOOKING PDF
              </>
            )}
          </button>
          <a
            href={`mailto:${form.email}?subject=Reservation — ${ref_}`}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 border border-gold-500
              text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white
              text-xs tracking-[0.2em] font-bold transition-all duration-200"
          >
            <FaEnvelope className="w-3.5 h-3.5" /> EMAIL CONFIRMATION
          </a>
          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5
              bg-green-500 hover:bg-green-600 text-white text-xs tracking-[0.2em] font-bold transition-all duration-200"
          >
            <FaWhatsapp className="w-4 h-4" /> WHATSAPP HOTEL
          </a>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left */}
          <div>
            <BookingDetailsBlock
              room={room}
              form={form}
              nights={nights}
              priceBreakdown={priceBreakdown}
            />
            <BankTransferBlock ref_={ref_} />
            <HotelInfoBlock />
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <InfoCard
              title="Next Steps"
              icon={<FaCheckCircle className="w-4 h-4" />}
            >
              <div className="space-y-4">
                {[
                  {
                    emoji: "📞",
                    step: "Our team will call or WhatsApp you within 30 minutes to confirm your reservation.",
                  },
                  {
                    emoji: "💳",
                    step: "Complete payment via bank transfer or inform us you'll pay on arrival.",
                  },
                  {
                    emoji: "📧",
                    step: "You'll receive a confirmed booking email with your receipt and check-in details.",
                  },
                  {
                    emoji: "🏨",
                    step: "Arrive, show your booking reference, and enjoy your stay!",
                  },
                ].map(({ emoji, step }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 text-base">
                      {emoji}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-white/55 leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </InfoCard>

            {/* WhatsApp CTA */}
            <a href={waMsg} target="_blank" rel="noopener noreferrer">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 hover:bg-green-600 text-white
                  text-xs tracking-[0.2em] font-bold transition-all cursor-pointer"
              >
                <FaWhatsapp className="w-5 h-5" /> CONFIRM VIA WHATSAPP NOW
              </motion.div>
            </a>

            <InfoCard>
              <div className="space-y-3">
                {[
                  { icon: "🔒", text: "Reservation reference secured" },
                  { icon: "📱", text: "WhatsApp follow-up within 30 min" },
                  {
                    icon: "🏨",
                    text: "Free cancellation 24 hrs before arrival",
                  },
                  { icon: "📞", text: `${BANK_DETAILS.phone} — 24/7 support` },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40"
                  >
                    <span className="text-base flex-shrink-0">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </InfoCard>

            <div className="flex gap-3">
              <Link to="/" className="flex-1">
                <button
                  className="w-full py-3 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50
                  hover:border-gold-500 hover:text-gold-500 text-xs tracking-[0.2em] font-bold transition-all"
                >
                  ← HOME
                </button>
              </Link>
              <Link to="/rooms" className="flex-1">
                <button
                  className="w-full py-3 bg-navy-900 dark:bg-white/8 hover:bg-navy-700 text-white
                  text-xs tracking-[0.2em] font-bold transition-all"
                >
                  VIEW ROOMS
                </button>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-white/20 tracking-wider mt-10">
          A copy of this reservation has been sent to {form.email} · Ref: {ref_}
        </p>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ─── DEPOSIT SUCCESS ──────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export const DepositSuccess = ({
  room,
  form,
  nights,
  ref_,
  depositPaid,
  priceBreakdown,
}) => {
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  const grandTotal = priceBreakdown?.grandTotal ?? 0;
  const balanceDue = Math.max(0, grandTotal - depositPaid);

  const waMsg = `https://wa.me/${BANK_DETAILS.whatsapp}?text=Hi%2C%20I%20just%20completed%20my%20deposit%20for%20*${encodeURIComponent(room.displayName || room.name)}*%20(Ref%3A%20*${ref_}*).%20Check-in%3A%20${form.checkIn}.%20Deposit%3A%20${fmt(depositPaid)}.`;

  const handleDownload = async () => {
    setDownloadingPDF(true);
    try {
      await downloadBookingPDF("pdf-deposit", `Duban-Booking-${ref_}.pdf`);
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* Hidden PDF template */}
      <BookingPDFTemplate
        id="pdf-deposit"
        type="deposit"
        room={room}
        form={form}
        ref_={ref_}
        depositPaid={depositPaid}
        priceBreakdown={priceBreakdown}
      />

      <TopNav statusDot="bg-green-400" statusLabel="BOOKING CONFIRMED" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 lg:py-16">
        <StepBreadcrumb activeColor="text-gold-500" />

        {/* Hero */}
        <ConfirmationHero
          icon={<FaCheckCircle className="text-white w-11 h-11" />}
          iconBg="bg-gradient-to-br from-gold-400 to-gold-600"
          title="Your booking is confirmed"
          subtitle={
            <>
              We look forward to welcoming you. Deposit of{" "}
              <strong className="text-gold-500">{fmt(depositPaid)}</strong>{" "}
              received successfully.
            </>
          }
          ref_={ref_}
          refLabel="Booking Number"
        />

        {/* Confirmed banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-5 bg-green-50 dark:bg-green-500/8 border border-green-200 dark:border-green-500/25"
        >
          <div className="flex items-start gap-4">
            <FaCheckCircle className="text-green-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 dark:text-green-300 font-bold text-sm mb-1">
                {form.name} — Booking Secured
              </p>
              <p className="text-green-700 dark:text-green-400 text-xs leading-relaxed">
                Confirmation sent to <strong>{form.email}</strong>. Your room is{" "}
                <strong>guaranteed</strong>. Balance of{" "}
                <strong className="text-green-800 dark:text-green-200">
                  {fmt(balanceDue)}
                </strong>{" "}
                is payable on arrival.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={handleDownload}
            disabled={downloadingPDF}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5
              border border-navy-900 dark:border-white/20 text-navy-900 dark:text-white/70
              hover:bg-navy-900 hover:text-white dark:hover:bg-white/10
              text-xs tracking-[0.2em] font-bold transition-all duration-200 disabled:opacity-60"
          >
            {downloadingPDF ? (
              <>
                <FaSpinner className="w-3.5 h-3.5 animate-spin" /> GENERATING
                PDF…
              </>
            ) : (
              <>
                <FaDownload className="w-3.5 h-3.5" /> DOWNLOAD BOOKING PDF
              </>
            )}
          </button>
          <a
            href={`mailto:${form.email}?subject=Booking Confirmation — ${ref_}`}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 border border-gold-500
              text-gold-600 dark:text-gold-400 hover:bg-gold-500 hover:text-white
              text-xs tracking-[0.2em] font-bold transition-all duration-200"
          >
            <FaEnvelope className="w-3.5 h-3.5" /> EMAIL CONFIRMATION
          </a>
          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5
              bg-green-500 hover:bg-green-600 text-white text-xs tracking-[0.2em] font-bold transition-all duration-200"
          >
            <FaWhatsapp className="w-4 h-4" /> WHATSAPP HOTEL
          </a>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left */}
          <div>
            <BookingDetailsBlock
              room={room}
              form={form}
              nights={nights}
              priceBreakdown={priceBreakdown}
            />

            <InfoCard
              title="Payment Summary"
              icon={<FaCreditCard className="w-4 h-4" />}
            >
              <div>
                <SummaryRow label="Total Stay" value={fmt(grandTotal)} />
                <SummaryRow
                  label="Deposit Paid (via Paystack)"
                  value={fmt(depositPaid)}
                  highlight
                />
                <SummaryRow
                  label="Balance Due on Arrival"
                  value={fmt(balanceDue)}
                />
              </div>
              <div className="mt-4 p-4 bg-navy-900 dark:bg-white/4 border border-navy-700 dark:border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mb-0.5">
                      Deposit amount
                    </p>
                    <p className="text-white font-bold text-lg">
                      {fmt(depositPaid)}
                    </p>
                    <p className="text-white/40 text-[10px]">
                      Paystack · NGN · Ref: {ref_}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-400 text-xs font-bold tracking-widest">
                      ✓ PAYMENT RECEIVED
                    </p>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      Balance of {fmt(balanceDue)} on arrival
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>

            <HotelInfoBlock />
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-navy-900 dark:bg-white/4 border border-navy-700 dark:border-white/10 p-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt className="text-gold-400 w-6 h-6" />
              </div>
              <p
                className="text-white font-bold text-base mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Room Guaranteed
              </p>
              <p className="text-white/40 text-xs leading-relaxed">
                Your deposit has secured this room. Balance of{" "}
                <span className="text-gold-400 font-semibold">
                  {fmt(balanceDue)}
                </span>{" "}
                is due at check-in.
              </p>
            </motion.div>

            {room.includes?.length > 0 && (
              <InfoCard
                title="What's Included"
                icon={<FaCheckCircle className="w-4 h-4" />}
              >
                <ul className="space-y-2">
                  {room.includes.map((inc) => (
                    <li
                      key={inc}
                      className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-white/55"
                    >
                      <FaCheck className="text-green-500 w-3 h-3 flex-shrink-0" />{" "}
                      {inc}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            )}

            <InfoCard>
              <div className="space-y-3">
                {[
                  { icon: "🔒", text: "Payments secured via Paystack" },
                  { icon: "⚡", text: "Instant confirmation on deposit" },
                  { icon: "📱", text: "WhatsApp us anytime" },
                  {
                    icon: "🏨",
                    text: "Free cancellation 24 hrs before arrival",
                  },
                  { icon: "📞", text: `${BANK_DETAILS.phone} — 24/7 support` },
                ].map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40"
                  >
                    <span className="text-base flex-shrink-0">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </InfoCard>

            <div className="flex gap-3">
              <Link to="/" className="flex-1">
                <button
                  className="w-full py-3 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50
                  hover:border-gold-500 hover:text-gold-500 text-xs tracking-[0.2em] font-bold transition-all"
                >
                  ← HOME
                </button>
              </Link>
              <Link to="/rooms" className="flex-1">
                <button className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-white text-xs tracking-[0.2em] font-bold transition-all">
                  VIEW ROOMS
                </button>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-400 dark:text-white/20 tracking-wider mt-10">
          Confirmation sent to {form.email} · Ref: {ref_} · Need help? Call{" "}
          {BANK_DETAILS.phone}
        </p>
      </div>
    </div>
  );
};

export default { ReserveSuccess, DepositSuccess };
