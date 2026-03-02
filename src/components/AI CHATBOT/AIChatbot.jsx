import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaPaperPlane,
  FaTrash,
  FaMicrophone,
  FaCommentDots,
} from "react-icons/fa";
import { MdHotel } from "react-icons/md";

// ── Hotel Branding Config ─────────────────────────────────────────────────────
const HOTEL = {
  name: "Duban Help Assistant",
  tagline: "Online",
  whatsapp: "https://wa.me/2348103785017",
  phone: "tel:+2348103785017",
  bookingUrl: "/rooms",
};

const API_CONFIG = {
  url: "https://personal-brand-agentic-chatbot.onrender.com/chat",
  apiKey: "sk-d8ngvPonimkUI3Nm4f8drh709TwcgdBh",
};

const QUICK_REPLIES = [
  "View rooms",
  "Explore amenities",
  "Dining options",
  "Event spaces",
];

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#FDF8EE";
const GOLD_BORDER = "#E8D5A0";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

const formatMessageContent = (content) => {
  const parts = [];
  let formatted = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^[\-\*\+]\s+/gm, "• ")
    .replace(/\n\n/g, "\n")
    .trim();

  const urlRegex =
    /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s<]+)/g;
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(formatted)) !== null) {
    if (match.index > lastIndex)
      parts.push({
        type: "text",
        content: formatted.substring(lastIndex, match.index),
      });
    parts.push(
      match[1]
        ? { type: "link", text: match[2], url: match[3] }
        : { type: "link", text: match[4], url: match[4] },
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < formatted.length)
    parts.push({ type: "text", content: formatted.substring(lastIndex) });
  return parts.length > 0 ? parts : [{ type: "text", content: formatted }];
};

// ── Sub-components (defined OUTSIDE main component to prevent remounting) ─────

const HotelAvatar = ({ size = "md" }) => (
  <div
    style={{
      width: size === "sm" ? 32 : 40,
      height: size === "sm" ? 32 : 40,
      borderRadius: "50%",
      background: "#1a1a1a",
      border: `2px solid ${GOLD}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
    }}
  >
    <MdHotel style={{ color: GOLD, width: "55%", height: "55%" }} />
  </div>
);

const TypingDots = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "10px 14px",
    }}
  >
    {[0, 150, 300].map((delay, i) => (
      <motion.div
        key={i}
        style={{ width: 8, height: 8, borderRadius: "50%", background: GOLD }}
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.7,
          delay: delay / 1000,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
);

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
      }}
    >
      {!isUser && (
        <div style={{ marginBottom: 4 }}>
          <HotelAvatar size="sm" />
        </div>
      )}
      <div
        style={{
          maxWidth: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={
            isUser
              ? {
                  background: GOLD,
                  color: "#3D2B00",
                  borderRadius: "18px 18px 4px 18px",
                  padding: "10px 16px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontWeight: 500,
                }
              : msg.isError
                ? {
                    background: "#fff5f5",
                    border: "1px solid #fca5a5",
                    color: "#b91c1c",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "10px 16px",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }
                : {
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    color: "#1f2937",
                    borderRadius: "18px 18px 18px 4px",
                    padding: "10px 16px",
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }
          }
        >
          {formatMessageContent(msg.content).map((part, i) =>
            part.type === "link" ? (
              <a
                key={i}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "underline",
                  wordBreak: "break-all",
                  color: isUser ? "#7a5200" : GOLD,
                }}
              >
                {part.text}
              </a>
            ) : (
              <span
                key={i}
                dangerouslySetInnerHTML={{ __html: part.content }}
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              />
            ),
          )}
        </div>
        <span
          style={{
            fontSize: 10,
            color: "#9ca3af",
            marginTop: 4,
            paddingLeft: 4,
          }}
        >
          {isUser
            ? `${formatTime(msg.timestamp)} · Delivered`
            : formatTime(msg.timestamp)}
        </span>
      </div>
      {isUser && <div style={{ width: 8, flexShrink: 0 }} />}
    </div>
  );
};

const QuickChip = ({ label, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        border: `1.5px solid ${GOLD}`,
        color: GOLD,
        background: hov ? GOLD_LIGHT : "transparent",
        fontSize: 12,
        fontWeight: 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
};

// ── Chat Panel (also outside, receives all state as props) ────────────────────
const ChatPanel = ({
  messages,
  inputMessage,
  isLoading,
  showQuickReplies,
  onInput,
  onKeyPress,
  onSend,
  onClear,
  onClose,
  inputRef,
  messagesEndRef,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "#f8f6f2",
      overflow: "hidden",
    }}
  >
    {/* Header */}
    <div
      style={{
        flexShrink: 0,
        background: "#fff",
        borderBottom: `1px solid ${GOLD_BORDER}`,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <HotelAvatar size="md" />
          <span
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #fff",
            }}
          />
        </div>
        <div>
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
              lineHeight: 1.3,
            }}
          >
            {HOTEL.name}
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#22c55e",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                display: "inline-block",
              }}
            />
            {HOTEL.tagline}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[
          {
            icon: <FaTrash style={{ width: 12, height: 12 }} />,
            onClick: onClear,
            title: "Clear chat",
          },
          {
            icon: <FaTimes style={{ width: 14, height: 14 }} />,
            onClick: onClose,
            title: "Close",
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            title={btn.title}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
              e.currentTarget.style.color = "#374151";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>

    {/* Messages */}
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        scrollbarWidth: "thin",
        scrollbarColor: `${GOLD_BORDER} transparent`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span
          style={{
            fontSize: 10,
            color: "#9ca3af",
            background: "#ede8dc",
            padding: "3px 12px",
            borderRadius: 999,
          }}
        >
          Today
        </span>
      </div>

      {messages.map((msg, idx) => (
        <MessageBubble key={idx} msg={msg} />
      ))}

      {showQuickReplies && messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 40 }}
        >
          {QUICK_REPLIES.map((r) => (
            <QuickChip key={r} label={r} onClick={() => onSend(r)} />
          ))}
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
        >
          <HotelAvatar size="sm" />
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "18px 18px 18px 4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <TypingDots />
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <div
      style={{
        flexShrink: 0,
        background: "#fff",
        borderTop: `1px solid ${GOLD_BORDER}`,
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#f3f4f6",
          borderRadius: 999,
          border: "1.5px solid #e5e7eb",
          padding: "8px 16px",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={onInput}
          onKeyPress={onKeyPress}
          placeholder="Inquire about our promo price slash"
          disabled={isLoading}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 14,
            color: "#1f2937",
          }}
        />
        <FaMicrophone
          style={{ width: 15, height: 15, color: "#9ca3af", flexShrink: 0 }}
        />
        {inputMessage.trim() && (
          <motion.button
            onClick={() => onSend()}
            disabled={isLoading}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.88 }}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: GOLD,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <FaPaperPlane style={{ width: 11, height: 11, color: "#fff" }} />
          </motion.button>
        )}
      </div>
      <p
        style={{
          fontSize: 10,
          color: "#d1d5db",
          textAlign: "center",
          marginTop: 8,
        }}
      >
        ⚡ by Botpress
      </p>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello and welcome to Duban International Hotel's website! How can I assist you today?\nWould you like to learn about our rooms, amenities, dining options, or event spaces?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionId] = useState(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const sendMessage = async (text = inputMessage) => {
    if (!text.trim() || isLoading) return;
    setShowQuickReplies(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: new Date() },
    ]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const response = await fetch(API_CONFIG.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_CONFIG.apiKey,
          Accept: "application/json",
        },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ||
            data.message ||
            data.answer ||
            "I received your message but got an unexpected response.",
          timestamp: new Date(),
        },
      ]);
      if (!isOpen) setUnreadCount((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again, or reach us directly via WhatsApp or phone.",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello and welcome to Duban International Hotel's website! How can I assist you today?\nWould you like to learn about our rooms, amenities, dining options, or event spaces?",
        timestamp: new Date(),
      },
    ]);
    setShowQuickReplies(true);
  };

  const panelProps = {
    messages,
    inputMessage,
    isLoading,
    showQuickReplies,
    onInput: (e) => setInputMessage(e.target.value),
    onKeyPress: handleKeyPress,
    onSend: sendMessage,
    onClear: clearChat,
    onClose: () => setIsOpen(false),
    inputRef,
    messagesEndRef,
  };

  // ── Mobile fullscreen ──────────────────────────────────────────────────────
  if (isMobile && isOpen) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{
            type: "tween",
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
        >
          <ChatPanel {...panelProps} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Gold FAB with message icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          zIndex: 50,
          width: isMobile ? 40 : 56,
          height: isMobile ? 40 : 56,
          borderRadius: "50%",
          background: GOLD,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(201,168,76,0.45)",
        }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <FaTimes
                style={{
                  width: isMobile ? 13 : 20,
                  height: isMobile ? 13 : 20,
                  color: "#fff",
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <FaCommentDots
                style={{
                  width: isMobile ? 15 : 22,
                  height: isMobile ? 15 : 22,
                  color: "#fff",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 20,
              height: 20,
              background: "#ef4444",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{
              type: "tween",
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              position: "fixed",
              right: 24,
              bottom: 92,
              zIndex: 50,
              width: 380,
              maxWidth: "calc(100vw - 48px)",
              height: Math.min(560, window.innerHeight - 110),
              maxHeight: "calc(100vh - 110px)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              border: `1px solid ${GOLD_BORDER}`,
            }}
          >
            <ChatPanel {...panelProps} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
