import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../../components/Toast";
import {
  fetchRoomById,
  createRoom,
  updateRoom,
  clearRoomError,
  clearRoomSuccess,
} from "../../features/Room/Roomslice";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Trash2,
  Eye,
  Globe,
  Lock,
  Loader2,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

// ── Constants — MUST match Room.model.ts enums exactly ────────────────────────
const CATEGORIES = [
  "Executive",
  "Annex - Classic",
  "Imperial Suite",
  "Annex - Studio",
  "Deluxe",
  "Superior Twin",
];

const BED_TYPES = ["Single", "Double", "Queen", "King", "Twin", "Bunk"];
const STATUSES = ["available", "occupied", "maintenance", "reserved"];

const VIEWS = [
  "City View",
  "Garden View",
  "Pool View",
  "Sea View",
  "Ocean View",
  "Mountain View",
  "Courtyard View",
];

const AMENITY_SUGGESTIONS = [
  { label: "WiFi", icon: "FaWifi", category: "technology" },
  { label: "Air Conditioning", icon: "FaSnowflake", category: "comfort" },
  { label: "Flat-screen TV", icon: "FaTv", category: "technology" },
  { label: "Mini Bar", icon: "FaGlassCheers", category: "dining" },
  { label: "Free Parking", icon: "FaParking", category: "service" },
  { label: "Pool Access", icon: "FaSwimmingPool", category: "fitness" },
  { label: "Gym Access", icon: "FaDumbbell", category: "fitness" },
  { label: "Safe Box", icon: "FaShieldAlt", category: "service" },
  { label: "Room Service", icon: "FaConciergeBell", category: "service" },
  { label: "Jacuzzi", icon: "FaHotTub", category: "bathroom" },
  { label: "Living Area", icon: "FaCouch", category: "comfort" },
  { label: "Work Desk", icon: "FaDesk", category: "comfort" },
  { label: "Kitchenette", icon: "FaKitchenSet", category: "dining" },
  { label: "Sitting Area", icon: "FaCouch", category: "comfort" },
  { label: "Slippers", icon: "GiSlippers", category: "comfort" },
  { label: "Towels", icon: "MdLocalLaundryService", category: "bathroom" },
  { label: "Bathrobe", icon: "FaConciergeBell", category: "comfort" },
  { label: "Bathtub", icon: "GiBathtub", category: "bathroom" },
];

const TAGS_SUGGESTIONS = [
  "popular",
  "romantic",
  "family-friendly",
  "business",
  "budget",
  "luxury",
  "city-view",
  "ocean-view",
  "garden-view",
  "sea-view",
  "accessible",
  "pet-friendly",
  "football-theme",
  "space-theme",
  "car-theme",
  "bird-theme",
  "executive",
  "queen",
  "king",
  "twin",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Shared CSS ────────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors";
const selectCls = inputCls;

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4 pb-3 border-b border-gray-200 dark:border-white/10">
      <h2 className="font-heading text-base font-bold text-navy-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Field({ label, required, error, children, hint }) {
  return (
    <div>
      <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[9px] text-gray-400 dark:text-white/30 mt-1">
          {hint}
        </p>
      )}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Toggle({ value, onChange, label, sublabel, activeColor = "gold" }) {
  const colors = {
    gold: { track: "bg-gold-500/20 border-gold-500/30", thumb: "!bg-gold-500" },
    green: {
      track: "bg-green-500/20 border-green-500/30",
      thumb: "!bg-green-500",
    },
  };
  const c = colors[activeColor];
  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 dark:border-white/10 hover:border-gold-500/30 transition-colors">
      <div className="flex-1">
        <p className="text-sm font-bold text-navy-900 dark:text-white mb-0.5">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs text-gray-400 dark:text-white/30">{sublabel}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 border
          ${value ? c.track : "bg-gray-200 dark:bg-white/10 border-gray-300 dark:border-white/20"}`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white dark:bg-gray-300 transition-transform duration-200
          ${value ? `translate-x-6 ${c.thumb}` : ""}`}
        />
      </button>
    </div>
  );
}

// ── Multi Image Upload ────────────────────────────────────────────────────────
function MultiImageUpload({ images, onAdd, onRemove }) {
  const ref = useRef();
  const handleFiles = (e) => {
    Array.from(e.target.files || []).forEach((f) => onAdd(f));
    if (ref.current) ref.current.value = "";
  };
  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-video bg-gray-100 dark:bg-navy-700"
          >
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-gold-500 text-white px-1">
                MAIN
              </span>
            )}
            {/* Show a "NEW" badge on File objects not yet uploaded */}
            {img instanceof File && (
              <span className="absolute top-1 left-1 text-[8px] font-bold bg-blue-500 text-white px-1">
                NEW
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="aspect-video border-2 border-dashed border-gray-300 dark:border-white/20
            hover:border-gold-500/50 flex flex-col items-center justify-center gap-1
            text-gray-400 hover:text-gold-500 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[9px] font-bold">Add Photo</span>
        </button>
      </div>
      <input
        type="file"
        ref={ref}
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
      <p className="text-[9px] text-gray-400 dark:text-white/30">
        First image becomes the thumbnail. Images marked{" "}
        <span className="text-blue-400 font-bold">NEW</span> will be uploaded on
        save.
      </p>
    </div>
  );
}

// ── Amenity Manager ───────────────────────────────────────────────────────────
function AmenityManager({ value, onChange }) {
  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState("FaWifi");
  const [newCat, setNewCat] = useState("comfort");

  const add = () => {
    if (!newLabel.trim()) return;
    onChange([
      ...value,
      { label: newLabel.trim(), icon: newIcon, category: newCat },
    ]);
    setNewLabel("");
  };
  const addSuggestion = (s) => {
    if (value.find((a) => a.label === s.label)) return;
    onChange([...value, s]);
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {AMENITY_SUGGESTIONS.map((s) => {
          const added = value.find((a) => a.label === s.label);
          return (
            <button
              key={s.label}
              type="button"
              onClick={() =>
                added
                  ? remove(value.findIndex((a) => a.label === s.label))
                  : addSuggestion(s)
              }
              className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide border transition-all duration-200
                ${
                  added
                    ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                    : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                }`}
            >
              {added && "✓ "}
              {s.label}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          className={`${inputCls} flex-1`}
          placeholder="Custom amenity..."
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <select
          className={`${selectCls} w-28`}
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        >
          {[
            "comfort",
            "technology",
            "bathroom",
            "service",
            "fitness",
            "dining",
          ].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={add}
          className="px-3 bg-gold-500 hover:bg-gold-400 text-white text-xs font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((a, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold
              bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
            >
              {a.label}
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tags Manager ──────────────────────────────────────────────────────────────
function TagsManager({ value, onChange }) {
  const [input, setInput] = useState("");
  const add = (tag) => {
    const t = (tag || input).trim().toLowerCase();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setInput("");
  };
  const remove = (t) => onChange(value.filter((x) => x !== t));
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {TAGS_SUGGESTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => (value.includes(t) ? remove(t) : add(t))}
            className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide border transition-all
              ${
                value.includes(t)
                  ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                  : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-gold-500/30 hover:text-gold-500"
              }`}
          >
            {value.includes(t) && "✓ "}
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={`${inputCls} flex-1`}
          placeholder="Custom tag..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button
          type="button"
          onClick={() => add()}
          className="px-3 bg-gold-500 text-white hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold
              bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Includes Manager ──────────────────────────────────────────────────────────
function IncludesManager({ value, onChange }) {
  const SUGGESTIONS = [
    "Breakfast",
    "Breakfast for Two",
    "Welcome Drink",
    "Airport Transfer",
    "Minibar",
    "Safe",
    "Hairdryer",
    "Bathrobe",
    "Slippers",
    "Wardrobe",
    "Linen",
    "Reading Desk",
    "City View",
    "Garden View",
  ];
  const [input, setInput] = useState("");
  const add = (item) => {
    const t = (item || input).trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setInput("");
  };
  const remove = (t) => onChange(value.filter((x) => x !== t));
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => (value.includes(s) ? remove(s) : add(s))}
            className={`px-2.5 py-1 text-[9px] font-bold border transition-all
              ${
                value.includes(s)
                  ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                  : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-gold-500/30 hover:text-gold-500"
              }`}
          >
            {value.includes(s) && "✓ "}
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={`${inputCls} flex-1`}
          placeholder="Custom inclusion..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button
          type="button"
          onClick={() => add()}
          className="px-3 bg-gold-500 text-white hover:bg-gold-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {value.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold
              bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70"
            >
              {item}
              <button
                type="button"
                onClick={() => remove(item)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Extras Manager ────────────────────────────────────────────────────────────
function ExtrasManager({ value, onChange }) {
  const add = () =>
    onChange([...value, { label: "", price: 0, note: "", isFree: false }]);
  const update = (i, field, val) => {
    const next = [...value];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-2">
      {value.map((svc, i) => (
        <div
          key={i}
          className="flex gap-2 items-center p-3 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 flex-wrap sm:flex-nowrap"
        >
          <input
            className={`${inputCls} flex-1 min-w-[120px]`}
            placeholder="Service name..."
            value={svc.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <input
            className={`${inputCls} w-24`}
            type="number"
            min={0}
            placeholder="Price"
            value={svc.price}
            onChange={(e) => update(i, "price", Number(e.target.value))}
          />
          <input
            className={`${inputCls} w-28`}
            placeholder="Note..."
            value={svc.note}
            onChange={(e) => update(i, "note", e.target.value)}
          />
          <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/50 flex-shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={svc.isFree}
              onChange={(e) => update(i, "isFree", e.target.checked)}
              className="accent-gold-500"
            />
            Free
          </label>
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-gray-400 hover:text-red-500 flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full flex items-center justify-center gap-2 py-2 border border-dashed
          border-gray-200 dark:border-white/10 text-gray-400 hover:text-gold-500
          hover:border-gold-500/30 text-[10px] font-bold uppercase tracking-wider transition-all"
      >
        <Plus className="w-3.5 h-3.5" /> Add Extra Service
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Form Component
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminRoomForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRoom, loading, error, success, successMessage } = useSelector(
    (s) => s.rooms,
  );

  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // ── Form state ─────────────────────────────────────────────────────────────
  const defaultForm = {
    name: "",
    slug: "",
    category: "Executive",
    roomNumber: "",
    floor: 1,
    maxGuests: 2,
    maxAdults: 2,
    maxChildren: 0,
    minNights: 1,
    maxNights: 0,
    size: "",
    sizeValue: 0,
    view: "City View",
    bedType: "Queen",
    bedCount: 1,
    bathrooms: 1,
    smokingAllowed: false,
    petFriendly: false,
    accessible: false,
    pricePerNight: "",
    depositAmount: 0,
    depositPercent: 0,
    holdHours: 4,
    cleaningFee: 0,
    taxRate: 7.5,
    serviceChargeRate: 5,
    description: "",
    longDescription: "",
    images: [], // mixed: string URLs (existing) + File objects (new)
    thumbnailImage: "",
    amenities: [],
    fullAmenities: [],
    includes: [],
    extraServices: [],
    isAvailable: true,
    isPublished: false,
    status: "available",
    rating: 0,
    reviewCount: 0,
    tags: [],
    sortOrder: 0,
  };

  const [form, setForm] = useState(defaultForm);

  // ── Load room on edit ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isEditing) dispatch(fetchRoomById(id));
  }, [id, isEditing, dispatch]);

  useEffect(() => {
    if (isEditing && currentRoom) {
      setForm({
        ...defaultForm,
        ...currentRoom,
        taxRate: (currentRoom.taxRate ?? 0.075) * 100,
        serviceChargeRate: (currentRoom.serviceChargeRate ?? 0.05) * 100,
        // Only keep valid string URLs — no stale File objects
        images: (currentRoom.images || []).filter(
          (img) => typeof img === "string" && img.trim() !== "",
        ),
      });
    }
  }, [currentRoom, isEditing]);

  // ── Toast effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (success && successMessage) {
      setToast({ type: "success", message: successMessage });
      dispatch(clearRoomSuccess());
      if (!isEditing) setTimeout(() => navigate("/admin/rooms"), 1500);
    }
  }, [success, successMessage, dispatch, isEditing, navigate]);

  useEffect(() => {
    if (error) {
      setToast({ type: "error", message: error });
      dispatch(clearRoomError());
    }
  }, [error, dispatch]);

  // ── Field helpers ──────────────────────────────────────────────────────────
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleNameChange = (v) =>
    setForm((f) => ({
      ...f,
      name: v,
      slug: f.slug && f.slug !== slugify(f.name) ? f.slug : slugify(v),
    }));

  const handleAdultsChange = (v) => {
    const adults = Math.max(1, Number(v));
    setForm((f) => ({
      ...f,
      maxAdults: adults,
      maxGuests: adults + f.maxChildren,
    }));
  };
  const handleChildrenChange = (v) => {
    const children = Math.max(0, Number(v));
    setForm((f) => ({
      ...f,
      maxChildren: children,
      maxGuests: f.maxAdults + children,
    }));
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Room name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.pricePerNight) e.pricePerNight = "Price per night is required";
    if (Number(form.pricePerNight) < 0)
      e.pricePerNight = "Price must be positive";
    if (!form.bedType) e.bedType = "Bed type is required";
    if (!form.category) e.category = "Category is required";
    if (form.maxAdults < 1) e.maxAdults = "At least 1 adult required";
    return e;
  };

  // ── Build FormData payload ─────────────────────────────────────────────────
  // Separates File objects (sent as multipart) from string URLs (sent as JSON
  // fields). The backend controller merges them back together.
  const buildPayload = () => {
    const newImageFiles = form.images.filter((img) => img instanceof File);
    const existingImgUrls = form.images.filter(
      (img) => typeof img === "string" && img.trim() !== "",
    );

    // Core scalar/object fields — always included
    const fields = {
      name: form.name,
      slug: form.slug,
      displayName: form.name,
      category: form.category,
      roomNumber: form.roomNumber,
      floor: Number(form.floor),
      maxGuests: Number(form.maxGuests),
      maxAdults: Number(form.maxAdults),
      maxChildren: Number(form.maxChildren),
      minNights: Number(form.minNights),
      maxNights: Number(form.maxNights),
      size: form.size,
      sizeValue: form.sizeValue
        ? Number(form.sizeValue)
        : parseFloat(form.size) || 0,
      view: form.view,
      bedType: form.bedType,
      bedCount: Number(form.bedCount),
      bathrooms: Number(form.bathrooms),
      smokingAllowed: form.smokingAllowed,
      petFriendly: form.petFriendly,
      accessible: form.accessible,
      pricePerNight: Number(form.pricePerNight),
      depositAmount: Number(form.depositAmount) || 0,
      depositPercent: Number(form.depositPercent) || 0,
      holdHours: Number(form.holdHours),
      cleaningFee: Number(form.cleaningFee) || 0,
      taxRate: Number(form.taxRate) / 100, // % → decimal
      serviceChargeRate: Number(form.serviceChargeRate) / 100, // % → decimal
      description: form.description,
      longDescription: form.longDescription,
      amenities: form.amenities,
      fullAmenities: form.fullAmenities,
      includes: form.includes,
      extraServices: form.extraServices,
      isAvailable: form.isAvailable,
      isPublished: form.isPublished,
      status: form.status,
      tags: form.tags,
      sortOrder: Number(form.sortOrder),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
    };

    if (newImageFiles.length === 0) {
      // ── No new files → plain JSON ─────────────────────────────────────────
      return {
        payload: {
          ...fields,
          images: existingImgUrls,
          thumbnailImage: existingImgUrls[0] ?? "",
        },
        isFormData: false,
      };
    }

    // ── New files present → FormData ──────────────────────────────────────────
    const fd = new FormData();

    // Append every scalar field
    Object.entries(fields).forEach(([key, val]) => {
      if (Array.isArray(val) || (typeof val === "object" && val !== null)) {
        fd.append(key, JSON.stringify(val));
      } else {
        fd.append(key, String(val ?? ""));
      }
    });

    // Existing URLs as a JSON array so the controller can merge them
    fd.append("existingImages", JSON.stringify(existingImgUrls));

    // Each new file under "newImages" — matches req.files.newImages
    newImageFiles.forEach((file) => fd.append("newImages", file));

    return { payload: fd, isFormData: true };
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setActiveTab("basic");
      setToast({ type: "error", message: "Please fix the highlighted errors" });
      return;
    }

    setErrors({});
    setSaving(true);

    const { payload, isFormData } = buildPayload();

    if (isEditing) {
      await dispatch(updateRoom({ roomId: id, roomData: payload, isFormData }));
    } else {
      await dispatch(createRoom({ roomData: payload, isFormData }));
    }

    setSaving(false);
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const TABS = [
    { id: "basic", label: "Basic Info" },
    { id: "capacity", label: "Capacity" },
    { id: "pricing", label: "Pricing" },
    { id: "media", label: "Photos" },
    { id: "amenities", label: "Amenities" },
    { id: "extras", label: "Extras" },
    { id: "settings", label: "Settings" },
  ];

  if (isEditing && loading && !currentRoom) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 p-3 sm:p-5 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="text-gold-500 text-[9px] sm:text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
            Accommodation
          </div>
          <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-navy-900 dark:text-white">
            {isEditing ? `Edit: ${form.name || "Room"}` : "Add New Room"}
          </h1>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
            {isEditing
              ? "Update room details, pricing, and amenities"
              : "Fill in the details to create a new room listing"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/admin/rooms"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-white/10
              text-gray-600 dark:text-white/70 text-[10px] font-bold uppercase tracking-wider
              hover:border-gold-500/30 hover:text-gold-500 transition-all duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          {isEditing && form.slug && (
            <a
              href={`/rooms/roomdetail/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-white/10
                text-gray-600 dark:text-white/70 text-[10px] font-bold uppercase tracking-wider
                hover:border-gold-500/30 hover:text-gold-500 transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-0 mb-5 sm:mb-6 border-b border-gray-200 dark:border-white/10 -mx-3 sm:-mx-5 lg:-mx-8 px-3 sm:px-5 lg:px-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider
                border-b-2 transition-all duration-200
                ${
                  activeTab === tab.id
                    ? "border-gold-500 text-gold-500 bg-gold-500/5"
                    : "border-transparent text-gray-400 dark:text-white/40 hover:text-gold-500 hover:border-gold-500/30"
                }`}
            >
              {tab.label}
              {tab.id === "basic" && Object.keys(errors).length > 0 && (
                <span className="ml-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] inline-flex items-center justify-center">
                  !
                </span>
              )}
              {tab.id === "media" &&
                form.images.some((img) => img instanceof File) && (
                  <span className="ml-1.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[8px] inline-flex items-center justify-center">
                    ↑
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* ── TAB: BASIC INFO ───────────────────────────────────────────────── */}
        {activeTab === "basic" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Identity */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Room Identity"
                subtitle="Core details that identify this room"
              />
              <Field label="Room Name" required error={errors.name}>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. GREY - 307"
                />
              </Field>
              <Field
                label="URL Slug"
                required
                error={errors.slug}
                hint="Auto-generated from name · /rooms/roomdetail/[slug]"
              >
                <div className="flex">
                  <span className="px-3 py-2 text-xs bg-gray-100 dark:bg-navy-700 border border-r-0 border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 whitespace-nowrap">
                    /rooms/
                  </span>
                  <input
                    className={`${inputCls} flex-1`}
                    value={form.slug}
                    onChange={(e) => set("slug", slugify(e.target.value))}
                    placeholder="executive-grey-307"
                  />
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category" required error={errors.category}>
                  <select
                    className={selectCls}
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Room Number">
                  <input
                    className={inputCls}
                    value={form.roomNumber}
                    onChange={(e) => set("roomNumber", e.target.value)}
                    placeholder="307"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Floor">
                  <input
                    className={inputCls}
                    type="number"
                    min={1}
                    value={form.floor}
                    onChange={(e) => set("floor", Number(e.target.value))}
                  />
                </Field>
                <Field label="Sort Order" hint="Lower = appears first">
                  <input
                    className={inputCls}
                    type="number"
                    min={0}
                    value={form.sortOrder}
                    onChange={(e) => set("sortOrder", Number(e.target.value))}
                  />
                </Field>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Room Specs"
                subtitle="Physical attributes of the room"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bed Type" required error={errors.bedType}>
                  <select
                    className={selectCls}
                    value={form.bedType}
                    onChange={(e) => set("bedType", e.target.value)}
                  >
                    {BED_TYPES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Number of Beds">
                  <input
                    className={inputCls}
                    type="number"
                    min={1}
                    max={10}
                    value={form.bedCount}
                    onChange={(e) => set("bedCount", Number(e.target.value))}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="View">
                  <select
                    className={selectCls}
                    value={form.view}
                    onChange={(e) => set("view", e.target.value)}
                  >
                    <option value="">No view</option>
                    {VIEWS.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Bathrooms">
                  <input
                    className={inputCls}
                    type="number"
                    min={1}
                    value={form.bathrooms}
                    onChange={(e) => set("bathrooms", Number(e.target.value))}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Room Size" hint='e.g. "32 m²"'>
                  <input
                    className={inputCls}
                    value={form.size}
                    onChange={(e) => set("size", e.target.value)}
                    placeholder="32 m²"
                  />
                </Field>
                <Field label="Size (m², numeric)" hint="For filtering">
                  <input
                    className={inputCls}
                    type="number"
                    min={0}
                    value={form.sizeValue}
                    onChange={(e) => set("sizeValue", Number(e.target.value))}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { key: "smokingAllowed", label: "Smoking" },
                  { key: "petFriendly", label: "Pets OK" },
                  { key: "accessible", label: "Accessible" },
                ].map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex flex-col items-center gap-1.5 cursor-pointer p-3 border border-gray-200 dark:border-white/10 hover:border-gold-500/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => set(key, !form[key])}
                      className={`relative w-10 h-5 rounded-full transition-colors border
                        ${form[key] ? "bg-gold-500/20 border-gold-500/30" : "bg-gray-200 dark:bg-white/10 border-gray-300 dark:border-white/20"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-300 transition-transform ${form[key] ? "translate-x-5 !bg-gold-500" : ""}`}
                      />
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-wide text-gray-500 dark:text-white/40">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="lg:col-span-2 bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Content"
                subtitle="Descriptions shown to guests on the website"
              />
              <Field
                label="Short Description"
                hint="Shown on room cards (1-2 sentences)"
              >
                <textarea
                  className={`${inputCls} resize-vertical`}
                  rows={2}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Luxurious executive accommodation with modern amenities"
                />
              </Field>
              <Field
                label="Full Description"
                hint="Shown on the room detail page"
              >
                <textarea
                  className={`${inputCls} resize-vertical`}
                  rows={5}
                  value={form.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  placeholder="Full detailed description..."
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── TAB: CAPACITY ─────────────────────────────────────────────────── */}
        {activeTab === "capacity" && (
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5">
            <SectionHeader
              title="Guest Capacity"
              subtitle="Who and how many can stay in this room"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl">
              <Field label="Max Adults" required error={errors.maxAdults}>
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  max={20}
                  value={form.maxAdults}
                  onChange={(e) => handleAdultsChange(e.target.value)}
                />
              </Field>
              <Field label="Max Children">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  max={20}
                  value={form.maxChildren}
                  onChange={(e) => handleChildrenChange(e.target.value)}
                />
              </Field>
              <Field label="Total Max Guests" hint="Auto-calculated">
                <input
                  className={`${inputCls} bg-gray-100 dark:bg-navy-600 cursor-not-allowed opacity-60`}
                  value={form.maxGuests}
                  readOnly
                />
              </Field>
              <Field label="Min Nights" hint="Minimum booking duration">
                <input
                  className={inputCls}
                  type="number"
                  min={1}
                  value={form.minNights}
                  onChange={(e) => set("minNights", Number(e.target.value))}
                />
              </Field>
              <Field label="Max Nights" hint="0 = unlimited">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={form.maxNights}
                  onChange={(e) => set("maxNights", Number(e.target.value))}
                />
              </Field>
            </div>
          </div>
        )}

        {/* ── TAB: PRICING ──────────────────────────────────────────────────── */}
        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Room Rates"
                subtitle="Per-night pricing and fees"
              />
              <Field
                label="Price Per Night (₦)"
                required
                error={errors.pricePerNight}
              >
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={form.pricePerNight}
                  onChange={(e) => set("pricePerNight", e.target.value)}
                  placeholder="37450"
                />
              </Field>
              <Field label="Cleaning Fee (₦)" hint="0 = free">
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={form.cleaningFee}
                  onChange={(e) => set("cleaningFee", Number(e.target.value))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="VAT Rate (%)" hint="Default 7.5%">
                  <input
                    className={inputCls}
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={form.taxRate}
                    onChange={(e) => set("taxRate", Number(e.target.value))}
                  />
                </Field>
                <Field label="Service Charge (%)" hint="Default 5%">
                  <input
                    className={inputCls}
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={form.serviceChargeRate}
                    onChange={(e) =>
                      set("serviceChargeRate", Number(e.target.value))
                    }
                  />
                </Field>
              </div>
            </div>
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Deposit & Hold"
                subtitle="Booking deposit and reservation hold"
              />
              <Field
                label="Deposit Amount (₦)"
                hint="Fixed amount OR % below — not both"
              >
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={form.depositAmount}
                  onChange={(e) => set("depositAmount", e.target.value)}
                />
              </Field>
              <Field
                label="Deposit (%)"
                hint="% of total (used if fixed amount is 0)"
              >
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  max={100}
                  value={form.depositPercent}
                  onChange={(e) =>
                    set("depositPercent", Number(e.target.value))
                  }
                />
              </Field>
              <Field
                label="Hold Period (hours)"
                hint="How long reservation held without payment"
              >
                <input
                  className={inputCls}
                  type="number"
                  min={0}
                  value={form.holdHours}
                  onChange={(e) => set("holdHours", Number(e.target.value))}
                />
              </Field>
              {form.pricePerNight && (
                <div className="mt-3 p-4 bg-gold-500/5 border border-gold-500/20">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-gold-500 mb-3">
                    Price Preview (1 Night)
                  </p>
                  {[
                    [
                      "Base Price",
                      `₦${Number(form.pricePerNight).toLocaleString("en-NG")}`,
                    ],
                    [
                      `VAT (${form.taxRate}%)`,
                      `₦${((Number(form.pricePerNight) * Number(form.taxRate)) / 100).toLocaleString("en-NG")}`,
                    ],
                    [
                      `Service (${form.serviceChargeRate}%)`,
                      `₦${((Number(form.pricePerNight) * Number(form.serviceChargeRate)) / 100).toLocaleString("en-NG")}`,
                    ],
                    [
                      "TOTAL",
                      `₦${(Number(form.pricePerNight) * (1 + Number(form.taxRate) / 100 + Number(form.serviceChargeRate) / 100)).toLocaleString("en-NG")}`,
                    ],
                  ].map(([label, val], i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between text-xs py-1 ${i === arr.length - 1 ? "border-t border-gold-500/20 font-bold text-gold-500 mt-1 pt-2" : "text-gray-500 dark:text-white/40"}`}
                    >
                      <span>{label}</span>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: MEDIA ────────────────────────────────────────────────────── */}
        {activeTab === "media" && (
          <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-5">
            <SectionHeader
              title="Room Photos"
              subtitle="Upload high-quality photos. First image becomes the thumbnail. New files are uploaded to Cloudinary on save."
            />
            <MultiImageUpload
              images={form.images}
              onAdd={(file) => set("images", [...form.images, file])}
              onRemove={(i) =>
                set(
                  "images",
                  form.images.filter((_, idx) => idx !== i),
                )
              }
            />
            {/* Upload status summary */}
            {(() => {
              const newCount = form.images.filter(
                (img) => img instanceof File,
              ).length;
              const existingCount = form.images.filter(
                (img) => typeof img === "string",
              ).length;
              return newCount > 0 || existingCount > 0 ? (
                <div className="flex gap-4 text-[10px] text-gray-400 dark:text-white/30">
                  {existingCount > 0 && (
                    <span>
                      ✓ {existingCount} existing photo
                      {existingCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  {newCount > 0 && (
                    <span className="text-blue-400">
                      ↑ {newCount} new file{newCount !== 1 ? "s" : ""} ready to
                      upload
                    </span>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* ── TAB: AMENITIES ────────────────────────────────────────────────── */}
        {activeTab === "amenities" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Summary Amenities"
                subtitle="Shown as tags on room cards (6 max visible)"
              />
              <AmenityManager
                value={form.amenities}
                onChange={(v) => set("amenities", v)}
              />
            </div>
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Full Amenities"
                subtitle="Complete list shown on the room detail page"
              />
              <AmenityManager
                value={form.fullAmenities}
                onChange={(v) => set("fullAmenities", v)}
              />
            </div>
            <div className="lg:col-span-2 bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="What's Included"
                subtitle="Inclusions shown as bullet points (Breakfast, Welcome Drink, etc.)"
              />
              <IncludesManager
                value={form.includes}
                onChange={(v) => set("includes", v)}
              />
            </div>
          </div>
        )}

        {/* ── TAB: EXTRAS ───────────────────────────────────────────────────── */}
        {activeTab === "extras" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Extra Services"
                subtitle="Optional add-ons guests can request at booking"
              />
              <ExtrasManager
                value={form.extraServices}
                onChange={(v) => set("extraServices", v)}
              />
            </div>
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Tags"
                subtitle="Used for search and filtering on the public rooms page"
              />
              <TagsManager value={form.tags} onChange={(v) => set("tags", v)} />
              <div className="pt-4">
                <SectionHeader
                  title="Review Stats"
                  subtitle="Manually set rating display"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Rating (0–5)">
                    <input
                      className={inputCls}
                      type="number"
                      min={0}
                      max={5}
                      step={0.1}
                      value={form.rating}
                      onChange={(e) => set("rating", Number(e.target.value))}
                    />
                  </Field>
                  <Field label="Review Count">
                    <input
                      className={inputCls}
                      type="number"
                      min={0}
                      value={form.reviewCount}
                      onChange={(e) =>
                        set("reviewCount", Number(e.target.value))
                      }
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: SETTINGS ─────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5 space-y-4">
              <SectionHeader
                title="Visibility & Status"
                subtitle="Control whether guests can see and book this room"
              />
              <Toggle
                value={form.isPublished}
                onChange={(v) => set("isPublished", v)}
                activeColor="green"
                label={form.isPublished ? "Live on Website" : "Draft (Hidden)"}
                sublabel={
                  form.isPublished
                    ? "Guests can see and book this room"
                    : "Only admins can see this room"
                }
              />
              <Toggle
                value={form.isAvailable}
                onChange={(v) => set("isAvailable", v)}
                activeColor="gold"
                label={form.isAvailable ? "Bookable" : "Not Bookable"}
                sublabel={
                  form.isAvailable
                    ? "Guests can make bookings"
                    : "Temporarily blocked from new bookings"
                }
              />
              <Field label="Current Room Status">
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map((s) => {
                    const colorMap = {
                      available: "green",
                      occupied: "blue",
                      maintenance: "orange",
                      reserved: "purple",
                    };
                    const color = colorMap[s];
                    const activeColors = {
                      green:
                        "border-green-500/50 bg-green-500/15 text-green-500",
                      blue: "border-blue-500/50 bg-blue-500/15 text-blue-500",
                      orange:
                        "border-orange-500/50 bg-orange-500/15 text-orange-500",
                      purple:
                        "border-purple-500/50 bg-purple-500/15 text-purple-500",
                    };
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set("status", s)}
                        className={`py-2 px-3 text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 text-left
                          ${form.status === s ? activeColors[color] : "border-gray-200 dark:border-white/10 text-gray-400 hover:border-gold-500/30 hover:text-gold-500"}`}
                      >
                        {form.status === s && "● "}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
            {/* Summary card */}
            <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 sm:p-5">
              <SectionHeader
                title="Room Summary"
                subtitle="Quick overview before saving"
              />
              <div className="space-y-0">
                {[
                  ["Name", form.name || "—"],
                  ["Category", form.category || "—"],
                  ["Room #", form.roomNumber || "—"],
                  ["Floor", form.floor || "—"],
                  ["Bed Type", form.bedType || "—"],
                  ["Max Guests", form.maxGuests || "—"],
                  [
                    "Price",
                    form.pricePerNight
                      ? `₦${Number(form.pricePerNight).toLocaleString("en-NG")}/night`
                      : "—",
                  ],
                  ["Status", form.status || "—"],
                  ["Published", form.isPublished ? "✅ Live" : "🔒 Draft"],
                  [
                    "Amenities",
                    `${form.amenities?.length || 0} summary / ${form.fullAmenities?.length || 0} full`,
                  ],
                  [
                    "Photos",
                    (() => {
                      const newC = form.images.filter(
                        (img) => img instanceof File,
                      ).length;
                      const exC = form.images.filter(
                        (img) => typeof img === "string",
                      ).length;
                      if (newC > 0) return `${exC} saved + ${newC} pending`;
                      return `${exC} saved`;
                    })(),
                  ],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between text-xs py-1.5 border-b border-gray-100 dark:border-white/5 last:border-0"
                  >
                    <span className="text-gray-400 dark:text-white/30 font-semibold">
                      {k}
                    </span>
                    <span className="text-navy-900 dark:text-white font-medium text-right max-w-[60%] truncate">
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Sticky Save Bar ────────────────────────────────────────────────── */}
        <div
          className="sticky bottom-0 mt-5 sm:mt-6 -mx-3 sm:-mx-5 lg:-mx-8 px-3 sm:px-5 lg:px-8 py-3 sm:py-4
          bg-white/95 dark:bg-navy-900/95 backdrop-blur border-t border-gray-200 dark:border-white/10
          flex flex-wrap items-center justify-between gap-3 z-30"
        >
          <div className="text-[10px] text-gray-400 dark:text-white/30 hidden sm:block">
            {isEditing
              ? "Changes are saved immediately"
              : "Room saved as draft until published"}
            {form.images.some((img) => img instanceof File) && (
              <span className="ml-2 text-blue-400">
                · {form.images.filter((img) => img instanceof File).length} new
                photo
                {form.images.filter((img) => img instanceof File).length !== 1
                  ? "s"
                  : ""}{" "}
                will be uploaded
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <Link
              to="/admin/rooms"
              className="px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Create Room"}
            </button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
