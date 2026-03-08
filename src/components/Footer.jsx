import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaApple,
  FaGooglePay,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import DubanLogoWhite from "../assets/images/DubanLogoWhite.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "CONTACT",
      items: [
        {
          icon: <FaMapMarkerAlt className="w-4 h-4 text-gold-500" />,
          content: "63, Ogunnusi Road, Ogba, Ikeja, Lagos, Nigeria",
          href: "https://maps.google.com/?q=61-65+Ogunnusi+Road+Ogba+Ikeja+Lagos",
        },
        {
          icon: <FaPhone className="w-4 h-4 text-gold-500" />,
          content: "+234 701 415 1460",
          href: "tel:+2347014151460",
        },
        {
          icon: <FaEnvelope className="w-4 h-4 text-gold-500" />,
          content: "bookings@dubaninternationalhotel.com",
          href: "mailto:bookings@dubaninternationalhotel.com",
        },
      ],
    },
    {
      title: "COMPANY",
      items: [
        { name: "About Us", link: "/about" },
        { name: "Rooms", link: "/rooms" },
        { name: "Gallery", link: "/gallery" }, // Fixed typo
        { name: "Nearby places", link: "/nearbyPlaces" },
        { name: "Contact Us", link: "/contact" },
      ],
    },
    {
      title: "SERVICES",
      items: [
        { name: "Food & Restaurant", link: "/menu" },
        { name: "Meetings & Events", link: "/events" },
        { name: "Gym & Wellness", link: "/wellness" },
        { name: "Swimming pool" }, // Fixed typo
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
    { icon: <FaXTwitter />, href: "https://twitter.com", label: "X (Twitter)" },
    {
      icon: <FaInstagram />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    { icon: <FaYoutube />, href: "https://youtube.com", label: "YouTube" },
  ];

  const paymentMethods = [
    { icon: <FaCcVisa />, label: "Visa" },
    { icon: <FaCcMastercard />, label: "Mastercard" },
    { icon: <FaCcPaypal />, label: "PayPal" },
    { icon: <FaApple />, label: "Apple Pay" },
    { icon: <FaGooglePay />, label: "Google Pay" },
  ];

  return (
    <footer className="relative bg-navy-600 dark:bg-navy-700 text-white overflow-hidden">
      {/* Decorative gold gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(245,166,35,0.1) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {/* Newsletter Section - Top */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 pb-12 border-b border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3
                className="text-2xl lg:text-3xl font-light mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Subscribe Our
                <span className="text-gold-500 font-medium ml-2">
                  NEWSLETTER
                </span>
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                Stay updated with our latest offers, events, and exclusive
                deals.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="min-w-[280px] sm:w-[350px] px-5 py-3 bg-navy-700/50 border border-white/10 rounded-lg 
                           text-white placeholder-white/40 focus:outline-none focus:border-gold-500 
                           transition-colors duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold 
                           rounded-lg transition-all duration-300 hover:shadow-gold-glow"
                >
                  SUBMIT
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div> */}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Logo and Description - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Link to="/" className="inline-block mb-6">
              <img
                src={DubanLogoWhite}
                alt="DUBAN International Hotel"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Experience luxury and comfort in the heart of Ogba. Where
              contemporary design meets the vibrant heartbeat of Lagos.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center
                           text-white/60 hover:text-gold-500 hover:border-gold-500 
                           transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <h4 className="text-gold-500 text-xs tracking-[0.2em] font-semibold mb-6">
                {section.title}
              </h4>

              {section.title === "CONTACT" ? (
                <div className="space-y-4">
                  {section.items.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      className="flex items-start gap-3 group"
                      target={
                        item.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                    >
                      <span className="flex-shrink-0 mt-1 group-hover:text-gold-500 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-white/70 group-hover:text-white text-sm leading-relaxed transition-colors">
                        {item.content}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <ul className="space-y-3">
                  {section.items.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={item.link}
                        className="text-white/70 hover:text-gold-500 text-sm transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-white/40 text-xs text-center lg:text-left">
              © {currentYear} DubanInternational Hotel. All Rights Reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-white/40 text-xs tracking-wider">
                PAYMENT METHODS:
              </span>
              <div className="flex items-center gap-3">
                {paymentMethods.map((method, index) => (
                  <span
                    key={index}
                    className="text-white/30 hover:text-gold-500 text-xl transition-colors cursor-default"
                    aria-label={method.label}
                  >
                    {method.icon}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-4 text-white/40 text-xs">
              <Link
                to="/privacy-policy"
                className="hover:text-gold-500 transition-colors"
              >
                Privacy
              </Link>
              <span className="text-white/20">|</span>
              <Link
                to="/terms"
                className="hover:text-gold-500 transition-colors"
              >
                Terms
              </Link>
              <span className="text-white/20">|</span>
              <Link
                to="/sitemap"
                className="hover:text-gold-500 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
