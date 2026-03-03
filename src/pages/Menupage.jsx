import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  ShoppingCart,
  Check,
  AlertTriangle,
  Loader2,
  Coffee,
  Beer,
  Wine,
  GlassWater,
  Utensils,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

const SPICY_COLORS = {
  mild: "text-green-600 bg-green-500/10 border-green-500/20",
  medium: "text-orange-600 bg-orange-500/10 border-orange-500/20",
  hot: "text-red-600 bg-red-500/10 border-red-500/20",
  "extra-hot": "text-red-700 bg-red-600/10 border-red-600/20",
};
const SPICY_LABELS = {
  mild: "Mild 🌶",
  medium: "Medium 🌶🌶",
  hot: "Hot 🌶🌶🌶",
  "extra-hot": "🔥 Extra Hot",
};
const DIETARY_COLORS = {
  vegan: "text-green-600 bg-green-500/10 border-green-500/20",
  vegetarian: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  "alcohol-free": "text-blue-600 bg-blue-500/10 border-blue-500/20",
  "dairy-free": "text-purple-600 bg-purple-500/10 border-purple-500/20",
  default: "text-gray-600 bg-gray-500/10 border-gray-500/20",
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
  if (n.includes("beer")) return <Beer className="w-4 h-4" />;
  if (n.includes("spirit") || n.includes("whiskey"))
    return <Wine className="w-4 h-4" />;
  if (n.includes("wine") || n.includes("champagne"))
    return <Wine className="w-4 h-4" />;
  if (n.includes("cocktail") || n.includes("mocktail"))
    return <GlassWater className="w-4 h-4" />;
  if (n.includes("soft") || n.includes("soda") || n.includes("juice"))
    return <Coffee className="w-4 h-4" />;
  if (n.includes("non-alcoholic") || n.includes("beverage"))
    return <Coffee className="w-4 h-4" />;
  if (n.includes("food") || n.includes("grill") || n.includes("soup"))
    return <Utensils className="w-4 h-4" />;
  return <Utensils className="w-4 h-4" />;
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
  <nav className="flex items-center gap-2 text-white/50 text-xs tracking-widest font-body">
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

  if (item.image && !err) {
    return (
      <div
        className="flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10"
        style={{ width: size, height: size }}
      >
        <img
          src={item.image}
          alt={item.name}
          onError={() => setErr(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className="flex-shrink-0 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      <span>{icon}</span>
    </div>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────────────
function ItemCard({ item, onAdd, inCart, cartQty, onInc, onDec }) {
  return (
    <div
      className={`relative bg-white dark:bg-navy-800 border rounded-xl p-4 flex gap-3 transition-all duration-200
        ${inCart ? "border-gold-500/50 bg-gold-500/5 shadow-gold-glow/20" : "border-gray-200 dark:border-white/10 hover:border-gold-500/30 hover:bg-gold-500/5"}
        ${!item.available ? "opacity-50" : ""}`}
    >
      {item.popular && item.available && (
        <span className="absolute top-[1px] right-[2px] bg-gold-500 text-white text-[8px] font-black px-1 py-0.5 rounded-full uppercase z-10">
          ⭐
        </span>
      )}
      {!item.available && (
        <span className="absolute top-2 right-2 bg-red-500/10 text-red-500 text-[8px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 z-10">
          SOLD OUT
        </span>
      )}

      <ItemImage item={item} size={58} />

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-heading text-sm font-bold text-navy-900 dark:text-white line-clamp-2 flex-1">
            {item.name}
          </h4>
          <span className="text-gold-500 font-bold text-sm whitespace-nowrap font-body">
            {fmt(item.price)}
          </span>
        </div>

        {item.description && (
          <p className="text-xs text-gray-500 dark:text-white/50 line-clamp-2 font-body">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap mt-1">
          <div className="flex gap-1 flex-wrap">
            {item.spicyLevel && (
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border font-body ${SPICY_COLORS[item.spicyLevel]}`}
              >
                {SPICY_LABELS[item.spicyLevel]}
              </span>
            )}
            {item.dietaryInfo?.slice(0, 2).map((d) => (
              <span
                key={d}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border font-body ${DIETARY_COLORS[d] || DIETARY_COLORS.default}`}
              >
                {d}
              </span>
            ))}
            {(item.dietaryInfo?.length || 0) > 2 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 font-body">
                +{item.dietaryInfo.length - 2}
              </span>
            )}
          </div>

          {item.available && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {inCart ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={onDec}
                    className="w-7 h-7 rounded-lg border border-gold-500/30 bg-gold-500/10 text-gold-500 font-bold hover:bg-gold-500/20 transition-colors font-body"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold text-gold-500 min-w-[20px] text-center font-body">
                    {cartQty}
                  </span>
                  <button
                    onClick={onInc}
                    className="w-7 h-7 rounded-lg border border-gold-500/30 bg-gold-500/10 text-gold-500 font-bold hover:bg-gold-500/20 transition-colors font-body"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdd}
                  className="bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap font-body"
                >
                  + ADD
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-2/3" />
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ categories, activeCategory, onCategoryChange }) {
  return (
    <nav className="w-[220px] flex-shrink-0 border-r border-gray-200 dark:border-white/10 overflow-y-auto py-6 bg-gray-50/50 dark:bg-navy-900/50 sticky top-0 self-start max-h-[calc(100vh-130px)]">
      <p className="px-4 mb-2 text-[9px] font-bold text-gray-400 dark:text-white/30 tracking-wider uppercase font-body">
        Categories
      </p>
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
            className={`flex items-center justify-between w-full px-4 py-2.5 border-l-3 transition-all duration-200 font-body
              ${
                active
                  ? "border-gold-500 bg-gold-500/10 text-gold-500"
                  : "border-transparent text-gray-600 dark:text-white/60 hover:bg-gold-500/5 hover:text-gold-500"
              }`}
          >
            <span className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-gold-500 flex-shrink-0">
                {getCategoryIcon(cat.name)}
              </span>
              <span className="text-xs font-medium truncate">{cat.name}</span>
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 font-body
              ${
                active
                  ? "bg-gold-500/20 text-gold-500"
                  : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30"
              }`}
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
function MobileDropdown({
  categories,
  activeCategory,
  activeSubCategory,
  onCategoryChange,
  onSubCategoryChange,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);
  const currentCat = categories.find((c) => c._id === activeCategory);

  const recalc = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, left: r.left });
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
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs font-bold whitespace-nowrap flex-shrink-0 font-body"
      >
        <span className="text-sm">{getCategoryIcon(currentCat?.name)}</span>
        <span className="max-w-[80px] truncate">
          {currentCat?.name || "Category"}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-[99999] bg-white dark:bg-navy-800 border border-gold-500/30 rounded-lg shadow-2xl max-h-[65vh] overflow-y-auto font-body"
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth: `min(280px, calc(100vw - ${coords.left}px - 16px))`,
              minWidth: "200px",
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
                    className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors font-body
                    ${
                      isAct
                        ? "bg-gold-500/10 text-gold-500 border-l-3 border-gold-500"
                        : "text-gray-600 dark:text-white/70 hover:bg-gold-500/5"
                    }`}
                  >
                    <span className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-gold-500">
                        {getCategoryIcon(cat.name)}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-full font-body">
                      {catCount}
                    </span>
                  </button>
                  {isAct && cat.subCategories?.length > 0 && (
                    <div className="bg-gray-50/50 dark:bg-white/5 pl-8 pr-2 py-1">
                      <button
                        onClick={() => {
                          onSubCategoryChange(null);
                          setOpen(false);
                        }}
                        className={`block w-full text-left py-1.5 text-xs font-body ${
                          !activeSubCategory
                            ? "text-gold-500 font-medium"
                            : "text-gray-400 dark:text-white/40 hover:text-gold-500"
                        }`}
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
                          className={`block w-full text-left py-1.5 text-xs font-body ${
                            activeSubCategory === sub._id
                              ? "text-gold-500 font-medium"
                              : "text-gray-400 dark:text-white/40 hover:text-gold-500"
                          }`}
                        >
                          · {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>,
          document.body,
        )}
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
      className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-md flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white dark:bg-navy-800 border border-gold-500/30 rounded-t-2xl w-full max-w-[600px] max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gold-500/5">
          <div className="flex items-center gap-2">
            {view === "form" && (
              <button
                onClick={() => setView("cart")}
                className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gold-500 hover:text-white transition-colors font-body"
              >
                ←
              </button>
            )}
            <span className="text-2xl">{view === "success" ? "🎉" : "🛒"}</span>
            <div>
              <h3 className="font-heading text-sm font-bold text-navy-900 dark:text-white">
                {view === "cart"
                  ? "Your Order"
                  : view === "form"
                    ? "Checkout"
                    : "Order Confirmed!"}
              </h3>
              {view === "cart" && (
                <p className="text-[10px] text-gray-400 dark:text-white/30 font-body">
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-red-500 hover:text-white transition-colors font-body"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {view === "success" && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="font-heading text-xl font-bold text-gold-500 mb-2">
                Order Placed!
              </h4>
              <p className="text-sm text-gray-500 dark:text-white/50 mb-6 font-body">
                Your order is confirmed. Use your tracking ID to follow its
                progress.
              </p>
              <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-4 mb-6 text-left">
                <div className="mb-3">
                  <p className="text-[9px] text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                    TRACKING ID
                  </p>
                  <p className="font-mono text-sm font-bold text-gold-500 break-all font-body">
                    {orderTracking?.guestId || orderTracking?.trackingId}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-[9px] text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                    STATUS
                  </p>
                  <p className="text-sm font-bold text-blue-500 capitalize font-body">
                    {orderTracking?.status || "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                    TOTAL CHARGED
                  </p>
                  <p className="font-heading text-xl font-bold text-gold-500">
                    {fmt(orderTracking?.total || grandTotal)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold rounded-lg transition-colors font-body"
              >
                Done
              </button>
            </div>
          )}

          {view === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">🍽️</div>
                  <p className="font-body text-gray-600 dark:text-white/70 font-semibold mb-1">
                    Your cart is empty
                  </p>
                  <p className="font-body text-sm text-gray-400 dark:text-white/30">
                    Add items from the menu to get started
                  </p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-white/10"
                    >
                      <ItemImage item={item} size={44} />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-bold text-navy-900 dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-white/30 font-body">
                          {fmt(item.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          className="w-6 h-6 rounded border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs font-bold hover:bg-gold-500/20 font-body"
                          onClick={() => onUpdate(item._id, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="text-sm font-bold text-gold-500 min-w-[18px] text-center font-body">
                          {item.qty}
                        </span>
                        <button
                          className="w-6 h-6 rounded border border-gold-500/30 bg-gold-500/10 text-gold-500 text-xs font-bold hover:bg-gold-500/20 font-body"
                          onClick={() => onUpdate(item._id, item.qty + 1)}
                        >
                          +
                        </button>
                        <span className="font-heading text-sm font-bold text-gold-500 min-w-[50px] text-right">
                          {fmt(item.price * item.qty)}
                        </span>
                        <button
                          className="w-5 h-5 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs hover:bg-red-500/20 font-body"
                          onClick={() => onRemove(item._id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 p-4 bg-gold-500/5 border border-gold-500/20 rounded-lg">
                    {[
                      ["Subtotal", total],
                      ["VAT (7.5%)", tax],
                      ["Service Charge (5%)", service],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        className="flex justify-between mb-1.5 text-xs"
                      >
                        <span className="text-gray-500 dark:text-white/40 font-body">
                          {l}
                        </span>
                        <span className="text-gray-600 dark:text-white/60 font-body">
                          {fmt(v)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-gold-500/20 mt-1">
                      <span className="font-heading text-sm font-bold text-navy-900 dark:text-white">
                        Grand Total
                      </span>
                      <span className="font-heading text-lg font-bold text-gold-500">
                        {fmt(grandTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={onClear}
                      className="px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-xs font-bold rounded-lg hover:border-gold-500/30 hover:text-gold-500 transition-colors font-body"
                    >
                      CLEAR
                    </button>
                    <button
                      onClick={() => setView("form")}
                      className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold rounded-lg transition-colors font-body"
                    >
                      CHECKOUT →
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {view === "form" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                    Order Type
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                  >
                    <option value="room-service">🛎 Room Service</option>
                    <option value="dine-in">🪑 Dine In</option>
                    <option value="takeaway">🛍 Takeaway</option>
                  </select>
                </div>
                {orderType === "room-service" && (
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                      Room Number *
                    </label>
                    <input
                      placeholder="e.g., 204"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                    />
                  </div>
                )}
                {orderType === "dine-in" && (
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                      Table Number *
                    </label>
                    <input
                      placeholder="e.g., T5"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                    Your Name *
                  </label>
                  <input
                    placeholder="Full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                    Phone *
                  </label>
                  <input
                    placeholder="+234 800 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    type="tel"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                  Email (Optional)
                </label>
                <input
                  placeholder="you@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  type="email"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none font-body"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="bank-transfer">🏦 Bank Transfer</option>
                  <option value="room-charge">🏨 Room Charge</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-1 font-body">
                  Special Requests (Optional)
                </label>
                <textarea
                  placeholder="Allergies, dietary needs, preferences..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 rounded-lg text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none resize-vertical font-body"
                />
              </div>

              <div className="p-4 bg-gold-500/5 border border-gold-500/20 rounded-lg">
                <p className="text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-2 font-body">
                  ORDER SUMMARY
                </p>
                {cart.slice(0, 4).map((c) => (
                  <div
                    key={c._id}
                    className="flex justify-between text-xs mb-1"
                  >
                    <span className="text-gray-500 dark:text-white/50 truncate flex-1 font-body">
                      {c.name} ×{c.qty}
                    </span>
                    <span className="text-gray-600 dark:text-white/60 font-body">
                      {fmt(c.price * c.qty)}
                    </span>
                  </div>
                ))}
                {cart.length > 4 && (
                  <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1 font-body">
                    +{cart.length - 4} more item
                    {cart.length - 4 !== 1 ? "s" : ""}
                  </p>
                )}
                <div className="flex justify-between pt-2 border-t border-gold-500/20 mt-2">
                  <span className="font-heading text-sm font-bold text-navy-900 dark:text-white">
                    Total
                  </span>
                  <span className="font-heading text-base font-bold text-gold-500">
                    {fmt(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold rounded-lg transition-colors font-body ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>PLACING ORDER...</span>
                  </div>
                ) : (
                  `PLACE ORDER · ${fmt(grandTotal)}`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 font-body">
      {/* Hero Banner */}
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
            className="text-4xl sm:text-6xl font-bold text-white text-center font-heading"
          >
            Food & Beverage
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

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2 px-4 pt-3">
            <div className="flex-1 min-w-0 hidden md:block">
              <div className="flex items-center gap-2">
                <span className="w-6 h-px bg-gold-500" />
                <span className="text-gold-500 text-[8px] font-bold tracking-wider uppercase truncate font-body">
                  Elevated Dining & Signature Drinks
                </span>
                <span className="w-6 h-px bg-gold-500" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
                <input
                  className="pl-7 pr-6 py-1.5 text-xs bg-gray-100 dark:bg-navy-800 border border-gray-200 dark:border-white/10 rounded-full text-navy-900 dark:text-white placeholder:text-gray-400 focus:border-gold-500/50 focus:outline-none transition-all w-24 sm:w-32 mid:w-auto focus:w-36 font-body"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearch("")}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
            {isMobile && categories.length > 0 && (
              <>
                <MobileDropdown
                  categories={categories}
                  activeCategory={activeCategory}
                  activeSubCategory={activeSubCategory}
                  onCategoryChange={handleCategoryChange}
                  onSubCategoryChange={handleSubCategoryChange}
                />
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10 flex-shrink-0" />
              </>
            )}

            {!isMobile && currentCategory?.subCategories?.length > 0 && (
              <>
                <button
                  onClick={() => setActiveSubCategory(null)}
                  className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap transition-colors font-body ${
                    !activeSubCategory
                      ? "border-gold-500/50 bg-gold-500/10 text-gold-500"
                      : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gold-500"
                  }`}
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
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap transition-colors font-body ${
                      activeSubCategory === sub._id
                        ? "border-gold-500/50 bg-gold-500/10 text-gold-500"
                        : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gold-500"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
                <div className="w-px h-4 bg-gray-200 dark:bg-white/10 flex-shrink-0 ml-1" />
              </>
            )}

            <button
              onClick={() => setShowOnlyAvailable((v) => !v)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap transition-colors font-body ${
                showOnlyAvailable
                  ? "border-gold-500/50 bg-gold-500/10 text-gold-500"
                  : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gold-500"
              }`}
            >
              ✓ Available
            </button>
            <button
              onClick={() => setShowOnlyPopular((v) => !v)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-full border whitespace-nowrap transition-colors font-body ${
                showOnlyPopular
                  ? "border-gold-500/50 bg-gold-500/10 text-gold-500"
                  : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gold-500"
              }`}
            >
              ⭐ Popular
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {!isMobile && categories.length > 0 && (
          <Sidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        )}

        <main
          className={`flex-1 min-w-0 ${isMobile ? "p-4 pb-24" : "p-6 pb-24"}`}
        >
          {loading && allItems.length === 0 && (
            <div className="space-y-6">
              {[1, 2].map((g) => (
                <div key={g}>
                  <div className="h-4 w-28 bg-gray-200 dark:bg-white/10 rounded mb-3" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && grouped.length === 0 && allItems.length > 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-heading text-lg font-bold text-gray-600 dark:text-white/70 mb-1">
                Nothing found
              </p>
              <p className="font-body text-sm text-gray-400 dark:text-white/30 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setShowOnlyAvailable(false);
                  setShowOnlyPopular(false);
                  setActiveSubCategory(null);
                }}
                className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold rounded-lg transition-colors font-body"
              >
                RESET FILTERS
              </button>
            </div>
          )}

          {grouped.length > 0 && (
            <div className="space-y-6 animate-fadeIn">
              {grouped.map((group) => (
                <section key={group.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-1 h-4 bg-gold-500" />
                    <h2 className="font-heading text-base font-bold text-navy-900 dark:text-white">
                      {group.name}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gold-500/20 to-transparent" />
                    <span className="text-[9px] text-gray-400 dark:text-white/30 font-body">
                      {group.items.length} item
                      {group.items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

      {/* Floating Cart */}
      {count > 0 && !showCart && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-floatIn">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-3 px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold rounded-full shadow-lg transition-colors font-body"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>
              {count} item{count !== 1 ? "s" : ""}
            </span>
            <span className="w-px h-3 bg-white/30" />
            <span className="font-heading text-sm">{fmt(total)}</span>
          </button>
        </div>
      )}

      {/* Order Modal */}
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
  );
}
