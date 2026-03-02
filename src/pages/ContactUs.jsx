import React, { useState, useCallback, useRef } from "react";
import emailjs from "emailjs-com";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaCheck,
  FaExclamationCircle,
  FaChevronRight,
  FaClock,
  FaConciergeBell,
  FaHeadset,
  FaCalendarAlt,
} from "react-icons/fa";

// ── EmailJS config (from existing integration) ─────────────────────────────
const EJS_SERVICE = "service_mfruavt";
const EJS_TEMPLATE = "template_cst1uc9";
const EJS_USER_ID = "9Tp4XEvOsWGi69ktz";

// ── Contact departments ─────────────────────────────────────────────────────
const DEPARTMENTS = [
  {
    icon: <FaCalendarAlt className="w-5 h-5" />,
    label: "RESERVATIONS",
    email: "bookings@dubaninternationalhotel.com",
    description: "Room bookings & availability",
  },
  {
    icon: <FaConciergeBell className="w-5 h-5" />,
    label: "GUEST RELATIONS",
    email: "frontdesk@dubaninternationalhotel.com",
    description: "In-stay requests & concierge",
  },
  {
    icon: <FaHeadset className="w-5 h-5" />,
    label: "TECHNICAL SUPPORT",
    email: "support@dubaninternationalhotel.com",
    description: "Website & digital enquiries",
  },
];

// ── Quick contact info ──────────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: (
      <FaMapMarkerAlt className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
    ),
    label: "Address",
    value: "63 Ogunnusi Rd, Aguda, Lagos 101233, Nigeria",
  },
  {
    icon: <FaPhone className="w-4 h-4 text-gold-500 flex-shrink-0" />,
    label: "Phone",
    value: "+234 810 378 5017",
  },
  {
    icon: <FaWhatsapp className="w-4 h-4 text-gold-500 flex-shrink-0" />,
    label: "WhatsApp",
    value: "+234 810 378 5017",
  },
  {
    icon: <FaEnvelope className="w-4 h-4 text-gold-500 flex-shrink-0" />,
    label: "Email",
    value: "bookings@dubaninternationalhotel.com",
  },
  {
    icon: <FaClock className="w-4 h-4 text-gold-500 flex-shrink-0" />,
    label: "Reception Hours",
    value: "24 hours · 7 days a week",
  },
];

// ── Fade-up variant ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Input field ─────────────────────────────────────────────────────────────
const InputField = ({
  label,
  id,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-[10px] tracking-[0.22em] uppercase font-semibold
                 text-gray-400 dark:text-white/40 mb-1.5"
    >
      {label}
      {required && <span className="text-gold-500 ml-0.5">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 text-sm outline-none transition-all duration-200
                  bg-white dark:bg-navy-800
                  text-gray-800 dark:text-white
                  placeholder-gray-300 dark:placeholder-white/20
                  border ${
                    error
                      ? "border-red-400 dark:border-red-500/70"
                      : "border-gray-200 dark:border-white/10 focus:border-gold-500 dark:focus:border-gold-500"
                  }`}
    />
    {error && (
      <p className="mt-1 text-[10px] text-red-400 flex items-center gap-1">
        <FaExclamationCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// ── Main ContactUs component ─────────────────────────────────────────────────
const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null

  const bodyRef = useRef(null);
  const inView = useInView(bodyRef, { once: true, margin: "-50px" });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Your name is required";
    if (!formData.email.includes("@")) e.email = "A valid email is required";
    if (!formData.subject.trim()) e.subject = "Please enter a subject";
    if (!formData.message.trim()) e.message = "Message cannot be empty";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const templateParams = {
        to_name: "Segun Umoru",
        from_name: formData.fullName,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      };

      const result = await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        templateParams,
        EJS_USER_ID,
      );

      if (result.status === 200) {
        setStatus("success");
        setFormData({ fullName: "", email: "", subject: "", message: "" });
      } else {
        throw new Error("Send failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-navy-900 text-gray-800 dark:text-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative h-[45vh] sm:h-[55vh] overflow-hidden bg-navy-900">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #c9a84c 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Gold gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/20" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-gold-400 text-[11px] tracking-[0.4em] font-bold uppercase mb-3 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-gold-400" />
            CONTACT US
            <span className="w-8 h-px bg-gold-400" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-gold-400">CONTACT</span> For Any Query
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-white/50 text-sm max-w-lg"
          >
            We're always delighted to hear from you — reach out and we'll
            respond promptly.
          </motion.p>
        </div>

        {/* Gold bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      </div>

      {/* ── Department cards ──────────────────────────────────────────────── */}
      <div className="bg-gray-50 dark:bg-navy-800 border-b border-gray-100 dark:border-white/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {DEPARTMENTS.map((dept, i) => (
              <motion.a
                key={dept.label}
                href={`mailto:${dept.email}`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3 }}
                className="group flex flex-col gap-3 p-5 bg-white dark:bg-navy-900
                           border border-gray-100 dark:border-white/8
                           hover:border-gold-400 dark:hover:border-gold-500/60
                           transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 bg-gold-500 flex items-center justify-center text-white flex-shrink-0
                                  group-hover:bg-gold-400 transition-colors duration-200"
                  >
                    {dept.icon}
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.25em] text-gold-500 dark:text-gold-400">
                    {dept.label}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-white/30">
                  {dept.description}
                </p>
                <div
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-white/60
                                group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors"
                >
                  <FaEnvelope className="w-3 h-3 text-gold-500 flex-shrink-0" />
                  <span className="truncate">{dept.email}</span>
                  <FaChevronRight className="w-2.5 h-2.5 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: Map + Form ──────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14 lg:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 xl:gap-16 items-start">
          {/* ── LEFT: Map + Contact info ──────────────────────────────────── */}
          <div>
            {/* Section label */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="mb-7"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-gold-500" />
                <span className="text-gold-500 text-[11px] tracking-[0.3em] font-bold uppercase">
                  Find Us
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Location
              </h2>
            </motion.div>

            {/* Live draggable Google Map */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="w-full h-[340px] sm:h-[420px] overflow-hidden border border-gray-100 dark:border-white/8
                         shadow-md mb-8 relative"
            >
              <iframe
                title="DurbanInternational Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.4013504295!2d3.3360376749039917!3d6.622839293361065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b9226c0f7af0b%3A0x45fb9f3a68fb19b7!2sDuban%20International%20Hotel!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[20%]"
              />
              {/* Map overlay badge */}
              <div
                className="absolute bottom-4 left-4 bg-navy-900/90 dark:bg-navy-900 text-white
                              px-4 py-2.5 flex items-center gap-2.5 backdrop-blur-sm
                              border border-white/10 pointer-events-none"
              >
                <FaMapMarkerAlt className="text-gold-400 w-3.5 h-3.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold tracking-wide">
                    DurbanInternational Hotel
                  </p>
                  <p className="text-[10px] text-white/45">
                    63 Ogunnusi Rd, Aguda, Lagos
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact info cards */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="bg-navy-900 dark:bg-navy-950 p-6 sm:p-8"
            >
              <p className="text-[10px] tracking-[0.28em] text-gold-500/70 uppercase font-bold mb-5">
                Quick Contact
              </p>
              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3.5">
                    <div className="mt-0.5">{icon}</div>
                    <div>
                      <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase font-semibold mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm text-white/75 leading-relaxed">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/2348103785017"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-2.5 w-full py-3.5
                           bg-green-500 hover:bg-green-400 text-white
                           text-xs tracking-[0.22em] font-bold transition-all duration-300"
              >
                <FaWhatsapp className="w-4 h-4" /> CHAT ON WHATSAPP
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Contact Form ───────────────────────────────────────── */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="bg-white dark:bg-navy-800 border border-gray-100 dark:border-white/8
                       shadow-sm p-7 sm:p-10"
          >
            {/* Form header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-px bg-gold-500" />
                <span className="text-gold-500 text-[11px] tracking-[0.3em] font-bold uppercase">
                  Get In Touch
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Send Us A <span className="text-gold-500">Message</span> Today.
              </h2>
              <p className="text-sm text-gray-400 dark:text-white/40 mt-2 leading-relaxed">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Your Name"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  error={errors.fullName}
                />
                <InputField
                  label="Your Email"
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  error={errors.email}
                />
              </div>

              {/* Subject */}
              <InputField
                label="Subject"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                error={errors.subject}
              />

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] tracking-[0.22em] uppercase font-semibold
                             text-gray-400 dark:text-white/40 mb-1.5"
                >
                  Message<span className="text-gold-500 ml-0.5">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Tell us about your enquiry, special requests, or anything you'd like us to know..."
                  className={`w-full px-4 py-3 text-sm outline-none resize-none transition-all duration-200
                              bg-white dark:bg-navy-900
                              text-gray-800 dark:text-white
                              placeholder-gray-300 dark:placeholder-white/20
                              border ${
                                errors.message
                                  ? "border-red-400"
                                  : "border-gray-200 dark:border-white/10 focus:border-gold-500"
                              }`}
                />
                {errors.message && (
                  <p className="mt-1 text-[10px] text-red-400 flex items-center gap-1">
                    <FaExclamationCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                className={`w-full py-4 text-white text-xs tracking-[0.28em] font-bold
                            transition-all duration-300 flex items-center justify-center gap-3
                            ${
                              loading
                                ? "bg-gold-400/70 cursor-not-allowed"
                                : "bg-gold-500 hover:bg-gold-400 shadow-lg"
                            }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="3"
                        strokeDasharray="60"
                        strokeDashoffset="20"
                      />
                    </svg>
                    SENDING MESSAGE...
                  </>
                ) : (
                  <>
                    <FaEnvelope className="w-3.5 h-3.5" /> SEND MESSAGE
                  </>
                )}
              </motion.button>
            </form>

            {/* Status toast */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35 }}
                  className={`mt-4 flex items-start gap-3 p-4 border
                              ${
                                status === "success"
                                  ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30"
                                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
                              }`}
                >
                  {status === "success" ? (
                    <FaCheck className="text-green-500 w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FaExclamationCircle className="text-red-400 w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-semibold mb-0.5
                                  ${
                                    status === "success"
                                      ? "text-green-800 dark:text-green-300"
                                      : "text-red-700 dark:text-red-300"
                                  }`}
                    >
                      {status === "success"
                        ? "Message sent successfully!"
                        : "Failed to send message"}
                    </p>
                    <p
                      className={`text-xs
                                  ${
                                    status === "success"
                                      ? "text-green-700 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                    >
                      {status === "success"
                        ? "Thank you for reaching out — our team will respond within 24 hours."
                        : "Something went wrong. Please try again or contact us via WhatsApp."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
