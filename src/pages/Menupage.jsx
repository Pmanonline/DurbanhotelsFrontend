import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchAllMenus,
  fetchMenuById,
  createOrder,
  clearMenuError,
  clearMenuSuccess,
  clearOrderTracking,
} from "../features/Menu/menuSlice";
import { Link } from "react-router-dom";
import LobbyImage from "../assets/images/heroImage3.jpg";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

const SPICY_COLORS = {
  mild: "#16a34a",
  medium: "#ea580c",
  hot: "#dc2626",
  "extra-hot": "#b91c1c",
};
const SPICY_LABELS = {
  mild: "Mild 🌶",
  medium: "Medium 🌶🌶",
  hot: "Hot 🌶🌶🌶",
  "extra-hot": "🔥 Extra Hot",
};
const DIETARY_COLORS = {
  vegan: "#16a34a",
  vegetarian: "#4ade80",
  "alcohol-free": "#3b82f6",
  "dairy-free": "#a855f7",
  default: "#64748b",
};

function flattenItems(menu) {
  if (!menu?.categories) return [];
  const flat = [];
  for (const cat of menu.categories) {
    for (const sub of cat.subCategories || []) {
      for (const item of sub.items || []) {
        flat.push({
          ...item,
          categoryId: cat._id,
          categoryName: cat.name,
          subCategoryId: sub._id,
          subCategoryName: sub.name,
        });
      }
    }
  }
  return flat;
}

function findFoodCategory(categories = []) {
  return (
    categories.find((c) => c.name?.toLowerCase().includes("food")) ||
    categories[categories.length - 1] ||
    categories[0] ||
    null
  );
}

// ── Cart hook ─────────────────────────────────────────────────────────────────
function useCart() {
  const [cart, setCart] = useState([]);
  const add = useCallback(
    (item) =>
      setCart((p) => {
        const ex = p.find((c) => c._id === item._id);
        if (ex)
          return p.map((c) =>
            c._id === item._id ? { ...c, qty: c.qty + 1 } : c,
          );
        return [...p, { ...item, qty: 1, specialInstructions: "" }];
      }),
    [],
  );
  const remove = useCallback(
    (id) => setCart((p) => p.filter((c) => c._id !== id)),
    [],
  );
  const update = useCallback(
    (id, qty) => {
      if (qty <= 0) {
        remove(id);
        return;
      }
      setCart((p) => p.map((c) => (c._id === id ? { ...c, qty } : c)));
    },
    [remove],
  );
  const updateNote = useCallback(
    (id, note) =>
      setCart((p) =>
        p.map((c) => (c._id === id ? { ...c, specialInstructions: note } : c)),
      ),
    [],
  );
  const clear = useCallback(() => setCart([]), []);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  return { cart, add, remove, update, updateNote, clear, total, count };
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
function getCategoryIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("beer")) return "🍺";
  if (n.includes("spirit") || n.includes("whiskey")) return "🥃";
  if (n.includes("wine") || n.includes("champagne")) return "🍷";
  if (n.includes("cocktail") || n.includes("mocktail")) return "🍹";
  if (n.includes("soft") || n.includes("soda") || n.includes("juice"))
    return "🥤";
  if (n.includes("non-alcoholic") || n.includes("beverage")) return "☕";
  if (n.includes("food") || n.includes("grill") || n.includes("soup"))
    return "🍛";
  return "🍽️";
}

function getItemIcon(item) {
  const n = (
    (item.name || "") +
    " " +
    (item.subCategoryName || "") +
    " " +
    (item.categoryName || "")
  ).toLowerCase();
  if (
    n.includes("beer") ||
    n.includes("lager") ||
    n.includes("stout") ||
    n.includes("orijin")
  )
    return "🍺";
  if (
    n.includes("wine") ||
    n.includes("champagne") ||
    n.includes("moët") ||
    n.includes("veuve") ||
    n.includes("rosé")
  )
    return "🍷";
  if (
    n.includes("cognac") ||
    n.includes("whiskey") ||
    n.includes("brandy") ||
    n.includes("hennessy") ||
    n.includes("remy") ||
    n.includes("glenfiddich") ||
    n.includes("jameson") ||
    n.includes("jack")
  )
    return "🥃";
  if (
    n.includes("mojito") ||
    n.includes("margarita") ||
    n.includes("spritz") ||
    n.includes("cocktail") ||
    n.includes("long island") ||
    n.includes("passion cooler")
  )
    return "🍹";
  if (
    n.includes("vodka") ||
    n.includes("gin") ||
    n.includes("rum") ||
    n.includes("ciroc") ||
    n.includes("smirnoff")
  )
    return "🥃";
  if (
    n.includes("juice") ||
    n.includes("cola") ||
    n.includes("sprite") ||
    n.includes("pepsi") ||
    n.includes("water") ||
    n.includes("malta") ||
    n.includes("zobo") ||
    n.includes("kunun") ||
    n.includes("pineapple") ||
    n.includes("chivita") ||
    n.includes("hollandia")
  )
    return "🥤";
  if (
    n.includes("tea") ||
    n.includes("coffee") ||
    n.includes("chocolate") ||
    n.includes("nescafé") ||
    n.includes("lipton")
  )
    return "☕";
  if (n.includes("energy") || n.includes("red bull") || n.includes("monster"))
    return "⚡";
  if (
    n.includes("soup") ||
    n.includes("egusi") ||
    n.includes("pepper") ||
    n.includes("ogbono") ||
    n.includes("banga")
  )
    return "🍲";
  if (
    n.includes("rice") ||
    n.includes("jollof") ||
    n.includes("fried rice") ||
    n.includes("ofada")
  )
    return "🍚";
  if (
    n.includes("suya") ||
    n.includes("asun") ||
    n.includes("goat") ||
    n.includes("grill") ||
    n.includes("pomo")
  )
    return "🍖";
  if (n.includes("chicken") || n.includes("wings")) return "🍗";
  if (
    n.includes("puff") ||
    n.includes("spring roll") ||
    n.includes("samosa") ||
    n.includes("finger")
  )
    return "🥟";
  if (
    n.includes("yam") ||
    n.includes("eba") ||
    n.includes("amala") ||
    n.includes("semo") ||
    n.includes("garri")
  )
    return "🫓";
  if (n.includes("bitters") || n.includes("environ") || n.includes("herbal"))
    return "🌿";
  return "🍽️";
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
const Breadcrumb = () => (
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest">
    <Link to="/" className="hover:text-gold-400 transition-colors">
      HOME
    </Link>
    <span>/</span>
    <Link to="/rooms" className="hover:text-gold-400 transition-colors">
      PAGES
    </Link>
    <span>/</span>
    <span className="text-gold-400">MENU</span>
  </nav>
);

// ── Item Image ────────────────────────────────────────────────────────────────
function ItemImage({ item, size = 58 }) {
  const [err, setErr] = useState(false);
  const icon = getItemIcon(item);
  const base = {
    width: size,
    height: size,
    borderRadius: 8,
    overflow: "hidden",
    flexShrink: 0,
  };
  if (item.image && !err) {
    return (
      <div className="mn-img-wrap" style={base}>
        <img
          src={item.image}
          alt={item.name}
          onError={() => setErr(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }
  return (
    <div
      className="mn-icon-wrap"
      style={{
        ...base,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
      }}
    >
      {icon}
    </div>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────────────
function ItemCard({ item, onAdd, inCart, cartQty, onInc, onDec }) {
  return (
    <div
      className={`mn-card${inCart ? " mn-card--active" : ""}${!item.available ? " mn-card--dim" : ""}`}
    >
      {item.popular && item.available && <span className="mn-badge">⭐</span>}
      {!item.available && (
        <span className="mn-badge mn-badge--sold">SOLD OUT</span>
      )}
      <ItemImage item={item} size={58} />
      <div className="mn-card__body">
        <div className="mn-card__top">
          <p
            className="mn-card__name"
            style={{ paddingRight: item.popular || !item.available ? 70 : 0 }}
          >
            {item.name}
          </p>
          <span className="mn-card__price">{fmt(item.price)}</span>
        </div>
        {item.description && (
          <p className="mn-card__desc">{item.description}</p>
        )}
        <div className="mn-card__foot">
          <div className="mn-tags">
            {item.spicyLevel && (
              <span
                style={{
                  fontSize: 9.5,
                  color: SPICY_COLORS[item.spicyLevel],
                  background: `${SPICY_COLORS[item.spicyLevel]}18`,
                  padding: "2px 7px",
                  borderRadius: 20,
                  fontWeight: 700,
                }}
              >
                {SPICY_LABELS[item.spicyLevel]}
              </span>
            )}
            {item.dietaryInfo
              ?.filter(Boolean)
              .slice(0, 2)
              .map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: 9.5,
                    color: DIETARY_COLORS[d] || DIETARY_COLORS.default,
                    background: `${DIETARY_COLORS[d] || DIETARY_COLORS.default}18`,
                    padding: "2px 7px",
                    borderRadius: 20,
                    fontWeight: 700,
                  }}
                >
                  {d}
                </span>
              ))}
          </div>
          {item.available &&
            (inCart ? (
              <div className="mn-qty">
                <button className="mn-qty__btn" onClick={onDec}>
                  −
                </button>
                <span className="mn-qty__n">{cartQty}</span>
                <button className="mn-qty__btn" onClick={onInc}>
                  +
                </button>
              </div>
            ) : (
              <button className="mn-add" onClick={onAdd}>
                + ADD
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="mn-skel">
      <div className="mn-skel__img" />
      <div className="mn-skel__body">
        <div className="mn-skel__line" style={{ width: "60%" }} />
        <div className="mn-skel__line" style={{ width: "85%", opacity: 0.6 }} />
        <div className="mn-skel__line" style={{ width: "40%", opacity: 0.5 }} />
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ categories, activeCategory, onCategoryChange }) {
  return (
    <nav className="mn-sidebar">
      <p className="mn-sidebar__hd">Categories</p>
      {categories.map((cat) => {
        const count =
          cat.subCategories?.reduce(
            (s, sub) => s + (sub.items?.length || 0),
            0,
          ) || 0;
        const active = activeCategory === cat._id;
        return (
          <button
            key={cat._id}
            onClick={() => onCategoryChange(cat._id)}
            className={`mn-sidebar__btn${active ? " mn-sidebar__btn--active" : ""}`}
          >
            <span className="mn-sidebar__inner">
              <span style={{ fontSize: 15 }}>{getCategoryIcon(cat.name)}</span>
              <span className="mn-sidebar__label">{cat.name}</span>
            </span>
            <span
              className={`mn-sidebar__cnt${active ? " mn-sidebar__cnt--active" : ""}`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ── Mobile Dropdown ───────────────────────────────────────────────────────────
// ROOT CAUSE: the subbar has overflow-x:auto which forces overflow-y to auto
// too (CSS spec), clipping any absolutely-positioned child regardless of z-index.
//
// SOLUTION: measure the trigger button's viewport position with
// getBoundingClientRect() inside useLayoutEffect (runs synchronously after
// paint so coordinates are always fresh), then render the panel with
// position:fixed at those exact coordinates. Fixed positioning escapes ALL
// ancestor overflow/clip contexts — z-index then works as expected.
function MobileDropdown({
  categories,
  activeCategory,
  activeSubCategory,
  onCategoryChange,
  onSubCategoryChange,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const currentCat = categories.find((c) => c._id === activeCategory);

  // Recalculate position every time the panel opens or the window resizes
  const recalc = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    recalc();
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, true);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
  }, [open, recalc]);

  // Close on outside click / touch
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close, { passive: true });
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  return (
    <>
      {/* Trigger — lives inside the scrollable subbar, no special positioning needed */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="mn-pill mn-pill--active"
        style={{ gap: 6, flexShrink: 0 }}
      >
        <span style={{ fontSize: 14 }}>
          {getCategoryIcon(currentCat?.name)}
        </span>
        <span
          style={{
            maxWidth: 90,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {currentCat?.name || "Category"}
        </span>
        <span
          style={{
            fontSize: 9,
            opacity: 0.7,
            flexShrink: 0,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>

      {/* Panel — position:fixed, rendered via a portal-like pattern straight
          onto document.body so no ancestor can clip or cover it */}
      {open &&
        typeof document !== "undefined" &&
        (() => {
          // Panel is portalled to document.body — outside .mn-page —
          // so CSS custom properties won't cascade. Resolve colours directly.
          const isDark = document.documentElement.classList.contains("dark");
          const dropBg = isDark ? "#0c1a2e" : "#ffffff";
          const dropBdr = "rgba(245,166,35,0.28)";
          const panel = (
            <div
              ref={panelRef}
              className="mn-drop"
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                maxWidth: `min(280px, calc(100vw - ${coords.left}px - 8px))`,
                zIndex: 99999,
                /* ── Hard-coded colours (CSS vars fail outside .mn-page) ── */
                background: dropBg,
                border: `1px solid ${dropBdr}`,
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.16)",
                /* Inject vars so child classes like mn-drop__item still work */
                "--mn-drop-bg": dropBg,
                "--mn-text": isDark ? "#f0e6c0" : "#1a1206",
                "--mn-text-muted": isDark
                  ? "rgba(240,230,192,0.50)"
                  : "#6b5b3c",
                "--mn-text-dim": isDark ? "rgba(240,230,192,0.28)" : "#a08c68",
                "--mn-surface": isDark ? "rgba(15,29,58,0.55)" : "#f2ede6",
                "--mn-gold": "#F5A623",
                "--mn-gold-border": dropBdr,
                "--mn-gold-muted": "rgba(245,166,35,0.10)",
                "--mn-sd-cnt-bg": isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              }}
            >
              {categories.map((cat) => {
                const catCount =
                  cat.subCategories?.reduce(
                    (s, sub) => s + (sub.items?.length || 0),
                    0,
                  ) || 0;
                const isAct = cat._id === activeCategory;
                return (
                  <div key={cat._id}>
                    <button
                      onClick={() => {
                        onCategoryChange(cat._id);
                        if (cat._id !== activeCategory) setOpen(false);
                      }}
                      className={`mn-drop__item${isAct ? " mn-drop__item--active" : ""}`}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <span style={{ flexShrink: 0 }}>
                          {getCategoryIcon(cat.name)}
                        </span>
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cat.name}
                        </span>
                      </span>
                      <span className="mn-drop__cnt">{catCount}</span>
                    </button>
                    {isAct && cat.subCategories?.length > 0 && (
                      <div className="mn-drop__subs">
                        <button
                          onClick={() => {
                            onSubCategoryChange(null);
                            setOpen(false);
                          }}
                          className={`mn-drop__sub${!activeSubCategory ? " mn-drop__sub--active" : ""}`}
                        >
                          All in {cat.name}
                        </button>
                        {cat.subCategories.map((sub) => (
                          <button
                            key={sub._id}
                            onClick={() => {
                              onSubCategoryChange(sub._id);
                              setOpen(false);
                            }}
                            className={`mn-drop__sub${activeSubCategory === sub._id ? " mn-drop__sub--active" : ""}`}
                          >
                            · {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
          // Render into document.body so no ancestor overflow can clip it
          return createPortal(panel, document.body);
        })()}
    </>
  );
}

// ── Order Modal ───────────────────────────────────────────────────────────────
function OrderModal({
  cart,
  total,
  onClose,
  onUpdate,
  onRemove,
  onClear,
  menuId,
  dispatch,
}) {
  const { loading, error, orderTracking, success } = useSelector((s) => s.menu);
  const [orderType, setOrderType] = useState("room-service");
  const [roomNumber, setRoomNumber] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [localError, setLocalError] = useState("");
  const [view, setView] = useState("cart");

  const tax = parseFloat((total * 0.075).toFixed(2));
  const service = parseFloat((total * 0.05).toFixed(2));
  const grandTotal = parseFloat((total + tax + service).toFixed(2));

  useEffect(() => {
    if (success && orderTracking) {
      setView("success");
      onClear();
    }
  }, [success, orderTracking]);
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleSubmit = () => {
    if (!customerName.trim()) return setLocalError("Please enter your name");
    if (!customerPhone.trim())
      return setLocalError("Please enter your phone number");
    if (
      customerEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
    )
      return setLocalError("Please enter a valid email address");
    if (orderType === "room-service" && !roomNumber.trim())
      return setLocalError("Room number required");
    if (orderType === "dine-in" && !tableNumber.trim())
      return setLocalError("Table number required");
    setLocalError("");
    dispatch(clearMenuError());
    dispatch(
      createOrder({
        menuId,
        items: cart.map((c) => ({
          menuItemId: c._id,
          quantity: c.qty,
          specialInstructions: c.specialInstructions || "",
        })),
        orderType,
        tableNumber,
        roomNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        specialRequests,
        paymentMethod,
      }),
    );
  };

  const handleClose = () => {
    dispatch(clearMenuSuccess());
    dispatch(clearOrderTracking());
    onClose();
  };

  return (
    <div
      className="mn-backdrop"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="mn-modal">
        <div className="mn-modal__hdr">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {view === "form" && (
              <button onClick={() => setView("cart")} className="mn-icon-btn">
                ←
              </button>
            )}
            <span style={{ fontSize: 20 }}>
              {view === "success" ? "🎉" : "🛒"}
            </span>
            <div>
              <p className="mn-modal__title">
                {view === "cart"
                  ? "Your Order"
                  : view === "form"
                    ? "Checkout"
                    : "Order Confirmed!"}
              </p>
              {view === "cart" && (
                <p className="mn-modal__sub">
                  {cart.length} item type{cart.length !== 1 ? "s" : ""} in cart
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="mn-icon-btn">
            ✕
          </button>
        </div>

        <div className="mn-modal__body">
          {/* ── Success ── */}
          {view === "success" && (
            <div style={{ textAlign: "center", padding: "28px 12px" }}>
              <div style={{ fontSize: 60, marginBottom: 14 }}>🎉</div>
              <p className="mn-modal__success-title">Order Placed!</p>
              <p className="mn-modal__success-sub">
                Your order is confirmed. Use your tracking ID to follow its
                progress.
              </p>
              <div
                className="mn-infobox"
                style={{ marginBottom: 20, textAlign: "left" }}
              >
                {[
                  [
                    "TRACKING ID",
                    orderTracking?.guestId || orderTracking?.trackingId,
                    "var(--mn-gold)",
                  ],
                  ["STATUS", orderTracking?.status || "Pending", "#3b82f6"],
                  [
                    "TOTAL CHARGED",
                    fmt(orderTracking?.total || grandTotal),
                    "var(--mn-gold)",
                  ],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <p className="mn-field-label">{label}</p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: label === "TOTAL CHARGED" ? 22 : 13,
                        fontWeight: 700,
                        color,
                        wordBreak: "break-all",
                        textTransform:
                          label === "STATUS" ? "capitalize" : "none",
                        fontFamily:
                          label === "TOTAL CHARGED"
                            ? "'Cormorant Garamond',serif"
                            : label === "TRACKING ID"
                              ? "monospace"
                              : "inherit",
                      }}
                    >
                      {val}
                    </p>
                  </div>
                ))}
              </div>
              <button className="mn-submit" onClick={handleClose}>
                Done
              </button>
            </div>
          )}

          {/* ── Cart ── */}
          {view === "cart" && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "52px 0" }}>
                  <p style={{ fontSize: 46, margin: "0 0 12px" }}>🍽️</p>
                  <p className="mn-empty-title">Your cart is empty</p>
                  <p className="mn-empty-sub">
                    Add items from the menu to get started
                  </p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item._id} className="mn-cart-row">
                      <ItemImage item={item} size={44} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="mn-cart-name">{item.name}</p>
                        <p className="mn-cart-each">{fmt(item.price)} each</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          flexShrink: 0,
                        }}
                      >
                        <button
                          className="mn-qty__btn mn-qty__btn--sm"
                          onClick={() => onUpdate(item._id, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="mn-qty__n">{item.qty}</span>
                        <button
                          className="mn-qty__btn mn-qty__btn--sm"
                          onClick={() => onUpdate(item._id, item.qty + 1)}
                        >
                          +
                        </button>
                        <span className="mn-cart-sub">
                          {fmt(item.price * item.qty)}
                        </span>
                        <button
                          className="mn-rm-btn"
                          onClick={() => onRemove(item._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="mn-totals">
                    {[
                      ["Subtotal", total],
                      ["VAT (7.5%)", tax],
                      ["Service Charge (5%)", service],
                    ].map(([l, v]) => (
                      <div key={l} className="mn-totals__row">
                        <span className="mn-totals__lbl">{l}</span>
                        <span className="mn-totals__val">{fmt(v)}</span>
                      </div>
                    ))}
                    <div className="mn-totals__grand">
                      <span className="mn-totals__grand-lbl">Grand Total</span>
                      <span className="mn-totals__grand-val">
                        {fmt(grandTotal)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    <button className="mn-ghost" onClick={onClear}>
                      CLEAR
                    </button>
                    <button
                      className="mn-submit"
                      style={{ flex: 1 }}
                      onClick={() => setView("form")}
                    >
                      CHECKOUT →
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Form ── */}
          {view === "form" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="mn-label">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="mn-input"
                  >
                    <option value="room-service">🛎 Room Service</option>
                    <option value="dine-in">🪑 Dine In</option>
                    <option value="takeaway">🛍 Takeaway</option>
                  </select>
                </div>
                {orderType === "room-service" && (
                  <div>
                    <label className="mn-label">Room Number *</label>
                    <input
                      placeholder="e.g., 204"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="mn-input"
                    />
                  </div>
                )}
                {orderType === "dine-in" && (
                  <div>
                    <label className="mn-label">Table Number *</label>
                    <input
                      placeholder="e.g., T5"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="mn-input"
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label className="mn-label">Your Name *</label>
                  <input
                    placeholder="Full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mn-input"
                  />
                </div>
                <div>
                  <label className="mn-label">Phone *</label>
                  <input
                    placeholder="+234 800 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    type="tel"
                    className="mn-input"
                  />
                </div>
                <div>
                  <label className="mn-label text-gray-900">
                    Email (Optional)
                  </label>
                  <input
                    placeholder="you@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    type="email"
                    className="mn-input"
                  />
                </div>
              </div>
              <div>
                <label className="mn-label">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mn-input"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="bank-transfer">🏦 Bank Transfer</option>
                  <option value="room-charge">🏨 Room Charge</option>
                </select>
              </div>
              <div>
                <label className="mn-label">Special Requests (Optional)</label>
                <textarea
                  placeholder="Allergies, dietary needs, preferences..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                  className="mn-input"
                  style={{ resize: "vertical" }}
                />
              </div>
              <div className="mn-infobox">
                <p className="mn-field-label" style={{ marginBottom: 10 }}>
                  ORDER SUMMARY
                </p>
                {cart.slice(0, 4).map((c) => (
                  <div
                    key={c._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      className="mn-totals__lbl"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {c.name} ×{c.qty}
                    </span>
                    <span className="mn-totals__val" style={{ marginLeft: 8 }}>
                      {fmt(c.price * c.qty)}
                    </span>
                  </div>
                ))}
                {cart.length > 4 && (
                  <p className="mn-field-label" style={{ margin: "4px 0 8px" }}>
                    +{cart.length - 4} more item
                    {cart.length - 4 !== 1 ? "s" : ""}
                  </p>
                )}
                <div className="mn-totals__grand" style={{ marginTop: 8 }}>
                  <span className="mn-totals__grand-lbl">Total</span>
                  <span className="mn-totals__grand-val">
                    {fmt(grandTotal)}
                  </span>
                </div>
              </div>
              {(localError || error) && (
                <div className="mn-error">⚠️ {localError || error}</div>
              )}
              <button
                className="mn-submit"
                onClick={handleSubmit}
                disabled={loading}
                style={{ opacity: loading ? 0.65 : 1 }}
              >
                {loading
                  ? "PLACING ORDER..."
                  : `PLACE ORDER · ${fmt(grandTotal)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const MENU_CSS = `
  /* ══════════════════════════════════════════════════
     RESET: every element inside .mn-page uses
     border-box so padding never adds to width.
     This is the #1 cause of mobile overflow.
  ══════════════════════════════════════════════════ */
  .mn-page, .mn-page *, .mn-page *::before, .mn-page *::after {
    box-sizing: border-box;
  }

  /* ══ Light mode tokens ══ */
  .mn-page {
    --mn-gold:         #F5A623;
    --mn-gold-dk:      #E08B00;
    --mn-gold-muted:   rgba(245,166,35,0.10);
    --mn-gold-border:  rgba(245,166,35,0.28);
    --mn-gold-glow:    0 0 22px rgba(245,166,35,0.22);
    --mn-bg:           #f9f6f1;
    --mn-header-bg:    rgba(255,255,255,0.97);
    --mn-sidebar-bg:   #f2ede6;
    --mn-card-bg:      #ffffff;
    --mn-card-hover:   #fffcf5;
    --mn-card-active:  rgba(245,166,35,0.07);
    --mn-input-bg:     #ffffff;
    --mn-surface:      #f2ede6;
    --mn-modal-bg:     #ffffff;
    --mn-modal-hdr-bg: rgba(245,166,35,0.06);
    --mn-infobox-bg:   rgba(245,166,35,0.06);
    --mn-drop-bg:      #ffffff;
    --mn-skel-bg:      #ede8e1;
    --mn-skel-sh:      #e2ddd6;
    --mn-border:       rgba(0,0,0,0.08);
    --mn-border-sd:    rgba(0,0,0,0.06);
    --mn-text:         #1a1206;
    --mn-text-muted:   #6b5b3c;
    --mn-text-dim:     #a08c68;
    --mn-sd-lbl:       #5a4a2e;
    --mn-sd-cnt-bg:    rgba(0,0,0,0.05);
    --mn-sd-cnt-clr:   #9a8060;
    --mn-danger:       #dc2626;
    --mn-danger-bg:    rgba(220,38,38,0.06);
    --mn-danger-bdr:   rgba(220,38,38,0.16);
  }

  /* ══ Dark mode tokens ══ */
  .dark .mn-page {
    --mn-bg:           #060d1c;
    --mn-header-bg:    rgba(6,12,24,0.97);
    --mn-sidebar-bg:   rgba(6,12,24,0.55);
    --mn-card-bg:      rgba(15,29,58,0.35);
    --mn-card-hover:   rgba(245,166,35,0.04);
    --mn-card-active:  rgba(245,166,35,0.10);
    --mn-input-bg:     rgba(15,29,58,0.5);
    --mn-surface:      rgba(15,29,58,0.55);
    --mn-modal-bg:     #0a1428;
    --mn-modal-hdr-bg: rgba(245,166,35,0.08);
    --mn-infobox-bg:   rgba(245,166,35,0.06);
    --mn-drop-bg:      #0c1a2e;
    --mn-skel-bg:      rgba(255,255,255,0.02);
    --mn-skel-sh:      rgba(255,255,255,0.04);
    --mn-border:       rgba(255,255,255,0.08);
    --mn-border-sd:    rgba(255,255,255,0.06);
    --mn-text:         #f0e6c0;
    --mn-text-muted:   rgba(240,230,192,0.50);
    --mn-text-dim:     rgba(240,230,192,0.28);
    --mn-sd-lbl:       rgba(240,230,192,0.55);
    --mn-sd-cnt-bg:    rgba(255,255,255,0.05);
    --mn-sd-cnt-clr:   rgba(240,230,192,0.30);
    --mn-danger:       #ef4444;
    --mn-danger-bg:    rgba(239,68,68,0.07);
    --mn-danger-bdr:   rgba(239,68,68,0.20);
  }

  /* ══ Page root ══
     overflow-x:hidden here + on body prevents
     the classic "element 1px wider than viewport" scroll bug. */
  .mn-page {
    min-height: 100vh;
    width: 100%;
    /* CRITICAL: contain horizontal overflow */
    overflow-x: hidden;
    background: var(--mn-bg);
    font-family: 'DM Sans','Inter',sans-serif;
    color: var(--mn-text);
    transition: background 0.3s, color 0.3s;
  }

  /* ══ Header ══ */
  .mn-header {
    top: 0; z-index: 100; width: 100%;
    background: var(--mn-header-bg);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--mn-border);
    transition: background 0.3s, border-color 0.3s;
  }
  .mn-header__inner {
    max-width: 1200px; margin: 0 auto;
    /* inner content must never exceed parent width */
    overflow: hidden;
  }
  .mn-header__top {
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; padding: 12px 14px 0;
  }

  /* Brand: flex-shrink + min-width:0 so it can compress */
  .mn-brand {
    display: flex; align-items: center; gap: 8px;
    flex: 1; min-width: 0; /* CRITICAL: allows truncation */
    overflow: hidden;
  }
  .mn-brand__bar  { width: 18px; height: 2px; background: var(--mn-gold); flex-shrink: 0; display: inline-block; }
  .mn-brand__text {
    font-size: 10px; font-weight: 800; color: var(--mn-gold);
    letter-spacing: 0.20em; text-transform: uppercase;
    /* truncate instead of overflow */
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0;
  }

  /* Actions: never shrink, never wrap */
  .mn-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

  /* ══ Search ══ */
  .mn-srch-wrap { position: relative; }
  .mn-srch-ico  { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); font-size: 11px; opacity: 0.35; pointer-events: none; }
  .mn-srch {
    background: var(--mn-input-bg); border: 1px solid var(--mn-border);
    color: var(--mn-text); padding: 7px 26px 7px 28px;
    font-size: 12px; outline: none;
    /* Fixed width — no JS width change on mobile */
    width: 100px;
    transition: border-color 0.2s, background 0.3s, width 0.3s;
  }
  .mn-srch:focus { border-color: var(--mn-gold-border); width: 140px; }
  .mn-srch::placeholder { color: var(--mn-text-dim); }
  .mn-srch-clr  { position: absolute; right: 7px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--mn-text-dim); cursor: pointer; font-size: 11px; padding: 0; }

  /* ══ Cart button ══ */
  .mn-cart {
    border: 1px solid var(--mn-gold-border); cursor: pointer;
    font-size: 11px; font-weight: 800;
    display: flex; align-items: center; gap: 5px;
    letter-spacing: 0.08em; text-transform: uppercase;
    transition: all 0.22s; flex-shrink: 0;
    padding: 7px 10px; white-space: nowrap;
  }
  .mn-cart--empty  { background: var(--mn-gold-muted); color: var(--mn-gold); }
  .mn-cart--filled { background: var(--mn-gold); color: #fff; }
  .mn-cart--filled:hover { background: var(--mn-gold-dk); }
  .mn-cart-cnt { background: rgba(255,255,255,0.22); border-radius: 50%; width: 17px; height: 17px; font-size: 9px; font-weight: 900; display: flex; align-items: center; justify-content: center; }

  /* ══ Subbar ══
     Key: overflow-x:auto with no min-width on children
     so the bar scrolls internally, never pushes the page wider. */
  .mn-subbar {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px 10px;
    overflow-x: auto; overflow-y: visible;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  .mn-subbar::-webkit-scrollbar { display: none; }
  .mn-subbar-div { width: 1px; height: 16px; background: var(--mn-border); flex-shrink: 0; }

  /* ══ Pills ══ */
  .mn-pill {
    padding: 5px 12px; font-size: 10px; font-weight: 700; flex-shrink: 0;
    border: 1px solid var(--mn-border); background: transparent;
    color: var(--mn-text-muted); cursor: pointer;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: all 0.18s; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .mn-pill:hover   { border-color: var(--mn-gold-border); color: var(--mn-gold); }
  .mn-pill--active { border-color: var(--mn-gold-border) !important; background: var(--mn-gold-muted) !important; color: var(--mn-gold) !important; }

  /* ══ Dropdown panel ══
     position:fixed + top/left/zIndex/maxWidth are set via inline styles
     in the component using getBoundingClientRect() so the panel is always
     anchored to the trigger in viewport space, escaping any
     overflow:auto ancestor that would otherwise clip it. */
  .mn-drop {
    background: var(--mn-drop-bg);
    border: 1px solid var(--mn-gold-border);
    min-width: 200px;
    width: max-content;
    box-shadow: 0 20px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.14);
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    transition: background 0.3s;
    animation: mnDropIn 0.15s ease;
  }
  @keyframes mnDropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mn-drop__item {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 11px 14px;
    border: none; border-left: 3px solid transparent;
    background: transparent; color: var(--mn-text-muted);
    cursor: pointer; font-size: 13px; font-weight: 500;
    text-align: left; transition: all 0.18s;
    gap: 8px;
  }
  .mn-drop__item:active        { background: var(--mn-gold-muted); color: var(--mn-gold); }
  .mn-drop__item--active       { background: var(--mn-gold-muted); color: var(--mn-gold); border-left-color: var(--mn-gold); font-weight: 700; }
  .mn-drop__cnt  { font-size: 10px; color: var(--mn-text-dim); background: var(--mn-sd-cnt-bg); padding: 1px 7px; border-radius: 20px; flex-shrink: 0; }
  .mn-drop__subs { background: var(--mn-surface); }
  .mn-drop__sub  { display: block; width: 100%; padding: 8px 28px; border: none; background: transparent; color: var(--mn-text-dim); cursor: pointer; font-size: 12px; font-weight: 400; text-align: left; transition: all 0.18s; }
  .mn-drop__sub:active        { background: var(--mn-gold-muted); color: var(--mn-gold); }
  .mn-drop__sub--active       { background: var(--mn-gold-muted); color: var(--mn-gold); font-weight: 700; }

  /* ══ Sidebar ══ */
  .mn-sidebar {
    width: 220px; flex-shrink: 0;
    border-right: 1px solid var(--mn-border-sd);
    overflow-y: auto; padding: 24px 0;
    background: var(--mn-sidebar-bg);
    position: sticky; top: 0; align-self: flex-start;
    max-height: calc(100vh - 130px);
    transition: background 0.3s, border-color 0.3s;
  }
  .mn-sidebar::-webkit-scrollbar { width: 2px; }
  .mn-sidebar::-webkit-scrollbar-thumb { background: var(--mn-gold-border); }
  .mn-sidebar__hd  { margin: 0 0 10px; padding: 0 18px; font-size: 9.5px; font-weight: 800; color: var(--mn-text-dim); letter-spacing: 0.22em; text-transform: uppercase; }
  .mn-sidebar__btn {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; padding: 10px 18px;
    border: none; border-left: 3px solid transparent;
    background: transparent; cursor: pointer; text-align: left; transition: all 0.18s;
  }
  .mn-sidebar__btn:hover       { border-left-color: var(--mn-gold-border); background: var(--mn-gold-muted); }
  .mn-sidebar__btn--active     { border-left-color: var(--mn-gold) !important; background: var(--mn-gold-muted) !important; }
  .mn-sidebar__inner           { display: flex; align-items: center; gap: 9px; flex: 1; min-width: 0; }
  .mn-sidebar__label           { font-size: 12.5px; font-weight: 500; color: var(--mn-sd-lbl); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.18s; }
  .mn-sidebar__btn--active .mn-sidebar__label { font-weight: 700; color: var(--mn-gold); }
  .mn-sidebar__cnt             { font-size: 10px; font-weight: 700; flex-shrink: 0; color: var(--mn-sd-cnt-clr); background: var(--mn-sd-cnt-bg); padding: 1px 8px; border-radius: 20px; }
  .mn-sidebar__cnt--active     { color: var(--mn-gold); background: var(--mn-gold-muted); }

  /* ══ Card ══ */
  .mn-card {
    background: var(--mn-card-bg); border: 1px solid var(--mn-border);
    border-radius: 12px; padding: 13px 13px;
    display: flex; gap: 11px;
    transition: all 0.22s; position: relative;
    /* prevent content escaping card bounds */
    overflow: hidden; min-width: 0;
  }
  .mn-card:hover       { background: var(--mn-card-hover); border-color: var(--mn-gold-border); }
  .mn-card--active     { background: var(--mn-card-active) !important; border-color: var(--mn-gold-border) !important; box-shadow: var(--mn-gold-glow); }
  .mn-card--dim        { opacity: 0.5; }
  .mn-card__body       { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; overflow: hidden; }
  .mn-card__top        { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; }
  .mn-card__name       { margin: 0; font-size: 13px; font-weight: 700; color: var(--mn-text); font-family: 'Cormorant Garamond',serif; line-height: 1.3; flex: 1; min-width: 0; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .mn-card__price      { font-size: 13px; font-weight: 800; color: var(--mn-gold); white-space: nowrap; font-family: 'Cormorant Garamond',serif; flex-shrink: 0; }
  .mn-card__desc       { margin: 0; font-size: 11px; color: var(--mn-text-muted); line-height: 1.45; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .mn-card__foot       { display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
  .mn-tags             { display: flex; gap: 4px; flex-wrap: wrap; }

  /* ══ Badges ══ */
  .mn-badge      { position: absolute; top: 0px; right: 3px; font-size: 8px; font-weight: 900; letter-spacing: 0.14em; padding: 2px 7px; text-transform: uppercase; white-space: nowrap; }
  .mn-badge--pop { background: var(--mn-gold); color: #fff; }
  .mn-badge--sold{ background: var(--mn-danger-bg); color: var(--mn-danger); border: 1px solid var(--mn-danger-bdr); }

  /* ══ Image wrappers ══ */
  .mn-img-wrap  { border: 1px solid var(--mn-border); flex-shrink: 0; }
  .mn-icon-wrap { background: var(--mn-gold-muted); border: 1px solid var(--mn-gold-border); flex-shrink: 0; }

  /* ══ Add + Qty ══ */
  .mn-add { background: var(--mn-gold); border: none; color: #fff; font-size: 10px; font-weight: 800; padding: 5px 12px; cursor: pointer; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; flex-shrink: 0; transition: background 0.18s; }
  .mn-add:hover { background: var(--mn-gold-dk); }
  .mn-qty      { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }
  .mn-qty__btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--mn-gold-border); background: var(--mn-gold-muted); color: var(--mn-gold); font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; }
  .mn-qty__btn:hover { background: var(--mn-gold); color: #fff; }
  .mn-qty__btn--sm { width: 22px; height: 22px; font-size: 13px; border-radius: 5px; }
  .mn-qty__n   { font-size: 13px; font-weight: 800; color: var(--mn-gold); min-width: 18px; text-align: center; }

  /* ══ Skeleton ══ */
  .mn-skel       { background: var(--mn-skel-bg); border: 1px solid var(--mn-border); border-radius: 12px; padding: 13px 13px; display: flex; gap: 11px; animation: mnPulse 1.6s ease infinite; }
  .mn-skel__img  { width: 58px; height: 58px; border-radius: 8px; background: var(--mn-skel-sh); flex-shrink: 0; }
  .mn-skel__body { flex: 1; display: flex; flex-direction: column; gap: 8px; padding-top: 2px; }
  .mn-skel__line { height: 12px; background: var(--mn-skel-sh); border-radius: 3px; }

  /* ══ Section heading ══ */
  .mn-sh        { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .mn-sh__bar   { width: 16px; height: 2px; background: var(--mn-gold); flex-shrink: 0; }
  .mn-sh__title { margin: 0; font-size: 15px; font-weight: 700; color: var(--mn-text); font-family: 'Playfair Display',serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .mn-sh__rule  { flex: 1; height: 1px; background: linear-gradient(90deg, var(--mn-gold-border), transparent); min-width: 0; }
  .mn-sh__count { font-size: 10px; color: var(--mn-text-dim); flex-shrink: 0; white-space: nowrap; }

  /* ══ Form inputs ══ */
  .mn-input  { width: 100%; padding: 10px 12px; background: var(--mn-input-bg); border: 1px solid var(--mn-border); color: var(--mn-text); font-size: 13px; outline: none; font-family: inherit; transition: border-color 0.2s, background 0.3s; }
  .mn-input:focus { border-color: var(--mn-gold-border); }
  .mn-input::placeholder { color: var(--mn-text-dim); }
  .mn-label  { display: block; font-size: 10px; color: var(--mn-text-dim); letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 5px; font-weight: 600; }
  .dark .mn-page select option { background: #0a1428; color: #f0e6c0; }

  /* ══ Buttons ══ */
  .mn-submit { padding: 12px 16px; background: var(--mn-gold); border: none; color: #fff; font-size: 11px; font-weight: 800; cursor: pointer; letter-spacing: 0.18em; text-transform: uppercase; display: block; text-align: center; width: 100%; transition: background 0.18s; }
  .mn-submit:hover:not(:disabled) { background: var(--mn-gold-dk); }
  .mn-ghost  { padding: 11px 14px; background: transparent; border: 1px solid var(--mn-border); color: var(--mn-text-muted); font-size: 10px; font-weight: 800; cursor: pointer; letter-spacing: 0.12em; text-transform: uppercase; white-space: nowrap; transition: all 0.18s; }
  .mn-ghost:hover { border-color: var(--mn-gold-border); color: var(--mn-gold); }
  .mn-error  { background: var(--mn-danger-bg); border: 1px solid var(--mn-danger-bdr); border-radius: 6px; padding: 10px 14px; font-size: 12px; color: var(--mn-danger); }

  /* ══ Empty state ══ */
  .mn-empty       { text-align: center; padding: 60px 16px; }
  .mn-empty__icon { font-size: 44px; margin: 0 0 12px; }
  .mn-empty-title { font-size: 16px; font-weight: 700; color: var(--mn-text-muted); margin: 0 0 4px; }
  .mn-empty-sub   { font-size: 12px; color: var(--mn-text-dim); }
  .mn-reset       { margin-top: 18px; padding: 10px 22px; background: var(--mn-gold); border: none; color: #fff; font-size: 10px; font-weight: 800; cursor: pointer; letter-spacing: 0.16em; text-transform: uppercase; transition: background 0.18s; }
  .mn-reset:hover { background: var(--mn-gold-dk); }

  /* ══ Floating cart ══ */
  .mn-float     { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 500; animation: mnFloatIn 0.3s ease; }
  .mn-float-btn {
    background: var(--mn-gold); border: none; color: #fff;
    padding: 12px 22px; font-size: 11px; font-weight: 900; cursor: pointer;
    letter-spacing: 0.14em; text-transform: uppercase;
    box-shadow: 0 8px 32px rgba(245,166,35,0.40), 0 2px 8px rgba(0,0,0,0.14);
    display: flex; align-items: center; gap: 8px;
    white-space: nowrap; transition: background 0.18s;
    /* Never wider than viewport */
    max-width: calc(100vw - 28px);
  }
  .mn-float-btn:hover { background: var(--mn-gold-dk); }
  .mn-float-div  { width: 1px; height: 13px; background: rgba(255,255,255,0.3); flex-shrink: 0; }
  .mn-float-tot  { font-family: 'Playfair Display',serif; font-size: 14px; }

  /* ══ Modal ══ */
  .mn-backdrop { position: fixed; inset: 0; z-index: 2000; background: rgba(0,0,0,0.50); backdrop-filter: blur(12px); display: flex; align-items: flex-end; justify-content: center; }
  .mn-modal    { background: var(--mn-modal-bg); border: 1px solid var(--mn-gold-border); border-radius: 16px 16px 0 0; width: 100%; max-width: 600px; max-height: 94vh; display: flex; flex-direction: column; box-shadow: 0 -24px 80px rgba(0,0,0,0.18); transition: background 0.3s; overflow: hidden; }
  .mn-modal__hdr    { padding: 16px 18px; border-bottom: 1px solid var(--mn-border); display: flex; align-items: center; justify-content: space-between; background: var(--mn-modal-hdr-bg); flex-shrink: 0; border-radius: 16px 16px 0 0; }
  .mn-modal__title  { margin: 0; font-size: 15px; font-weight: 800; color: var(--mn-text); font-family: 'Cormorant Garamond',serif; }
  .mn-modal__sub    { margin: 0; font-size: 10px; color: var(--mn-text-dim); }
  .mn-modal__body   { overflow-y: auto; flex: 1; padding: 16px 18px; -webkit-overflow-scrolling: touch; }
  .mn-modal__success-title { font-size: 22px; font-weight: 800; color: var(--mn-gold); font-family: 'Cormorant Garamond',serif; margin: 0 0 8px; }
  .mn-modal__success-sub   { color: var(--mn-text-muted); font-size: 12px; margin: 0 0 20px; line-height: 1.6; }
  .mn-icon-btn { background: var(--mn-surface); border: none; color: var(--mn-text-muted); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 14px; transition: color 0.18s; }
  .mn-icon-btn:hover { color: var(--mn-gold); }
  .mn-infobox  { background: var(--mn-infobox-bg); border: 1px solid var(--mn-gold-border); border-radius: 8px; padding: 13px 14px; }
  .mn-field-label { font-size: 9.5px; color: var(--mn-text-dim); letter-spacing: 0.18em; text-transform: uppercase; font-weight: 700; margin: 0; }
  .mn-cart-row { display: flex; gap: 10px; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--mn-border); }
  .mn-cart-name { margin: 0 0 2px; font-size: 13px; font-weight: 700; color: var(--mn-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .mn-cart-each { margin: 0; font-size: 11px; color: var(--mn-text-muted); }
  .mn-cart-sub  { font-size: 12px; font-weight: 800; color: var(--mn-gold); min-width: 54px; text-align: right; font-family: 'Cormorant Garamond',serif; }
  .mn-rm-btn    { background: var(--mn-danger-bg); border: 1px solid var(--mn-danger-bdr); color: var(--mn-danger); width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 11px; flex-shrink: 0; }
  .mn-totals      { background: var(--mn-infobox-bg); border: 1px solid var(--mn-gold-border); border-radius: 8px; padding: 13px 14px; margin-top: 14px; }
  .mn-totals__row { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .mn-totals__lbl { font-size: 12px; color: var(--mn-text-muted); }
  .mn-totals__val { font-size: 12px; color: var(--mn-text-muted); }
  .mn-totals__grand     { display: flex; justify-content: space-between; border-top: 1px solid var(--mn-gold-border); padding-top: 10px; margin-top: 4px; }
  .mn-totals__grand-lbl { font-size: 14px; font-weight: 800; color: var(--mn-text); font-family: 'Cormorant Garamond',serif; }
  .mn-totals__grand-val { font-size: 17px; font-weight: 800; color: var(--mn-gold); font-family: 'Cormorant Garamond',serif; }

  /* ══ Animations ══ */
  @keyframes mnPulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes mnSlideUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes mnFloatIn { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .mn-anim { animation: mnSlideUp 0.3s ease; }

  .mn-page ::-webkit-scrollbar       { width: 3px; height: 3px; }
  .mn-page ::-webkit-scrollbar-thumb { background: var(--mn-gold-border); border-radius: 2px; }

  /* ══ Tiny screen adjustments ══ */
  @media (max-width: 380px) {
    .mn-header__top { padding: 10px 12px 0; gap: 6px; }
    .mn-subbar      { padding: 7px 12px 9px; }
    .mn-card        { padding: 10px 10px; gap: 9px; }
    .mn-srch        { width: 80px; }
    .mn-srch:focus  { width: 110px; }
  }
`;

// ── Main MenuPage ─────────────────────────────────────────────────────────────
export default function MenuPage() {
  const dispatch = useDispatch();
  const { menus, currentMenu, menuItems, loading, error } = useSelector(
    (s) => s.menu,
  );

  const { cart, add, remove, update, updateNote, clear, total, count } =
    useCart();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showOnlyPopular, setShowOnlyPopular] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    dispatch(fetchAllMenus({ is_public: true }));
  }, [dispatch]);

  const targetMenu = useMemo(() => menus?.[0] || null, [menus]);
  useEffect(() => {
    if (targetMenu?._id) dispatch(fetchMenuById(targetMenu._id));
  }, [dispatch, targetMenu?._id]);

  const menuWithCategories = useMemo(() => {
    if (currentMenu?.categories?.length) return currentMenu;
    if (targetMenu?.categories?.length) return targetMenu;
    return null;
  }, [currentMenu, targetMenu, menuItems]);

  useEffect(() => {
    if (!menuWithCategories?.categories?.length || activeCategory) return;
    const foodCat = findFoodCategory(menuWithCategories.categories);
    if (foodCat) setActiveCategory(foodCat._id);
  }, [menuWithCategories, activeCategory]);

  const allItems = useMemo(
    () => flattenItems(menuWithCategories),
    [menuWithCategories],
  );
  const currentCategory = useMemo(
    () => menuWithCategories?.categories?.find((c) => c._id === activeCategory),
    [menuWithCategories, activeCategory],
  );

  const displayedItems = useMemo(() => {
    let items = search.trim()
      ? allItems.filter(
          (i) =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.description?.toLowerCase().includes(search.toLowerCase()) ||
            i.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
            i.subCategoryName?.toLowerCase().includes(search.toLowerCase()),
        )
      : activeSubCategory
        ? allItems.filter((i) => i.subCategoryId === activeSubCategory)
        : allItems.filter((i) => i.categoryId === activeCategory);
    if (showOnlyAvailable) items = items.filter((i) => i.available);
    if (showOnlyPopular) items = items.filter((i) => i.popular);
    return items;
  }, [
    allItems,
    activeCategory,
    activeSubCategory,
    search,
    showOnlyAvailable,
    showOnlyPopular,
  ]);

  const grouped = useMemo(() => {
    if (search.trim())
      return [
        { id: "search", name: `Search: "${search}"`, items: displayedItems },
      ];
    const map = {};
    for (const item of displayedItems) {
      if (!map[item.subCategoryId])
        map[item.subCategoryId] = {
          id: item.subCategoryId,
          name: item.subCategoryName,
          items: [],
        };
      map[item.subCategoryId].items.push(item);
    }
    return Object.values(map);
  }, [displayedItems, search]);

  const cartMap = useMemo(() => {
    const m = {};
    cart.forEach((c) => {
      m[c._id] = c.qty;
    });
    return m;
  }, [cart]);

  const handleCategoryChange = useCallback((catId) => {
    setActiveCategory(catId);
    setActiveSubCategory(null);
    setSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleSubCategoryChange = useCallback((subId) => {
    setActiveSubCategory(subId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const menuId = currentMenu?._id || targetMenu?._id;
  const categories = menuWithCategories?.categories || [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MENU_CSS }} />

      <div className="mn-page">
        {/* ── Hero ── */}
        <div className="relative h-[280px] sm:h-[400px] overflow-hidden">
          <img
            src={LobbyImage}
            alt="Menu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy-900/65" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-6xl font-bold text-white text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Food &amp; Beverage
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Breadcrumb />
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>

        {/* ── Header ── */}
        <header className="mn-header">
          <div className="mn-header__inner">
            <div className="mn-header__top">
              <div className="mid:hidden">
                <div className="mn-brand">
                  <span className="mn-brand__bar" />
                  <span className="mn-brand__text">
                    Elevated Dining &amp; Signature Drinks
                  </span>
                  <span className="mn-brand__bar" />
                </div>
              </div>
              <div className="mn-actions">
                <div className="mn-srch-wrap">
                  <span className="mn-srch-ico">🔍</span>
                  <input
                    className="mn-srch"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="mn-srch-clr"
                      onClick={() => setSearch("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {/* <button
                  onClick={() => setShowCart(true)}
                  className={`mn-cart ${count > 0 ? "mn-cart--filled" : "mn-cart--empty"}`}
                >
                  <span>🛒</span>
                  {count > 0 ? (
                    <>
                      <span className="mn-cart-cnt">{count}</span>
                      <span>{fmt(total)}</span>
                    </>
                  ) : (
                    <span>Cart</span>
                  )}
                </button> */}
              </div>
            </div>

            {/* Filter bar — scrolls horizontally, never breaks page width */}
            <div className="mn-subbar">
              {isMobile && categories.length > 0 && (
                <>
                  {/* MobileDropdown renders trigger inline + panel via portal/fixed */}
                  <MobileDropdown
                    categories={categories}
                    activeCategory={activeCategory}
                    activeSubCategory={activeSubCategory}
                    onCategoryChange={handleCategoryChange}
                    onSubCategoryChange={handleSubCategoryChange}
                  />
                  <div className="mn-subbar-div" style={{ flexShrink: 0 }} />
                </>
              )}

              {!isMobile && currentCategory?.subCategories?.length > 0 && (
                <>
                  <button
                    onClick={() => setActiveSubCategory(null)}
                    className={`mn-pill${!activeSubCategory ? " mn-pill--active" : ""}`}
                  >
                    All
                  </button>
                  {currentCategory.subCategories.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() =>
                        setActiveSubCategory(
                          activeSubCategory === sub._id ? null : sub._id,
                        )
                      }
                      className={`mn-pill${activeSubCategory === sub._id ? " mn-pill--active" : ""}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                  <div className="mn-subbar-div" style={{ marginLeft: 2 }} />
                </>
              )}

              <button
                onClick={() => setShowOnlyAvailable((v) => !v)}
                className={`mn-pill${showOnlyAvailable ? " mn-pill--active" : ""}`}
              >
                ✓ Available
              </button>
              <button
                onClick={() => setShowOnlyPopular((v) => !v)}
                className={`mn-pill${showOnlyPopular ? " mn-pill--active" : ""}`}
              >
                ⭐ Popular
              </button>
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            width: "100%",
          }}
        >
          {!isMobile && categories.length > 0 && (
            <Sidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}
          <main
            style={{
              flex: 1,
              minWidth: 0,
              padding: isMobile ? "14px 14px 110px" : "20px 24px 110px",
            }}
          >
            {error && !loading && (
              <div className="mn-error" style={{ marginBottom: 16 }}>
                ⚠️ {error} —{" "}
                <button
                  onClick={() => dispatch(fetchAllMenus({ is_public: true }))}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--mn-gold)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: 0,
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {loading && allItems.length === 0 && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 28 }}
              >
                {[1, 2].map((g) => (
                  <div key={g}>
                    <div
                      className="mn-skel__line"
                      style={{ width: 110, height: 13, marginBottom: 12 }}
                    />
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(min(100%,280px),1fr))",
                        gap: 10,
                      }}
                    >
                      {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && grouped.length === 0 && allItems.length > 0 && (
              <div className="mn-empty">
                <p className="mn-empty__icon">🔍</p>
                <p className="mn-empty-title">Nothing found</p>
                <p className="mn-empty-sub">
                  Try adjusting your search or filters
                </p>
                <button
                  className="mn-reset"
                  onClick={() => {
                    setSearch("");
                    setShowOnlyAvailable(false);
                    setShowOnlyPopular(false);
                    setActiveSubCategory(null);
                  }}
                >
                  RESET FILTERS
                </button>
              </div>
            )}

            {grouped.length > 0 && (
              <div
                className="mn-anim"
                style={{ display: "flex", flexDirection: "column", gap: 28 }}
              >
                {grouped.map((group) => (
                  <section key={group.id}>
                    <div className="mn-sh">
                      <span className="mn-sh__bar" />
                      <h2 className="mn-sh__title">{group.name}</h2>
                      <div className="mn-sh__rule" />
                      <span className="mn-sh__count">
                        {group.items.length} item
                        {group.items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(min(100%,280px),1fr))",
                        gap: 10,
                      }}
                    >
                      {group.items.map((item) => (
                        <ItemCard
                          key={item._id}
                          item={item}
                          onAdd={() => add(item)}
                          inCart={!!cartMap[item._id]}
                          cartQty={cartMap[item._id] || 0}
                          onInc={() => add(item)}
                          onDec={() =>
                            update(item._id, (cartMap[item._id] || 1) - 1)
                          }
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* ── Floating cart ── */}
        {count > 0 && !showCart && (
          <div className="mn-float">
            <button onClick={() => setShowCart(true)} className="mn-float-btn">
              <span>🛒</span>
              <span>
                {count} item{count !== 1 ? "s" : ""}
              </span>
              <span className="mn-float-div" />
              <span className="mn-float-tot">{fmt(total)}</span>
            </button>
          </div>
        )}

        {/* ── Modal ── */}
        {showCart && (
          <OrderModal
            cart={cart}
            total={total}
            onClose={() => setShowCart(false)}
            onUpdate={update}
            onRemove={remove}
            onUpdateNote={updateNote}
            onClear={clear}
            menuId={menuId}
            dispatch={dispatch}
          />
        )}
      </div>
    </>
  );
}
