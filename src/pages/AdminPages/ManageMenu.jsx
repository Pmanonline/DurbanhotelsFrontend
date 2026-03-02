import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchMenuById,
  updateMenu,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
  clearMenuError,
  clearMenuSuccess,
} from "../../features/Menu/menuSlice";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Globe,
  Lock,
  Star,
  Flame,
  Leaf,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Save,
  Upload,
  Package,
  Layers,
  UtensilsCrossed,
  TrendingUp,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Copy,
} from "lucide-react";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Halal",
  "Kosher",
  "Nut-Free",
  "Low-Calorie",
];
const SPICY_LEVELS = ["mild", "medium", "hot", "extra-hot"];

// ── ImageUpload ───────────────────────────────────────────────────────────────
function ImgUpload({ value, onChange, height = 100 }) {
  const ref = useRef();
  const [preview, setPreview] = useState(
    typeof value === "string" ? value : null,
  );

  useEffect(() => {
    if (typeof value === "string") setPreview(value);
  }, [value]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const remove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(null);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div
      className={`relative border-2 border-dashed border-gray-300 dark:border-white/20 
        bg-gray-50 dark:bg-navy-800 hover:border-gold-500/50 hover:bg-gold-500/5 
        transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2
        ${preview ? "p-0" : "p-4"}`}
      style={{ height }}
      onClick={() => ref.current?.click()}
    >
      <input
        type="file"
        ref={ref}
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {preview ? (
        <>
          <img
            src={preview}
            className="absolute inset-0 w-full h-full object-cover"
            alt=""
          />
          <button
            className="absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
            onClick={remove}
          >
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <>
          <Upload className="w-5 h-5 text-gray-400 dark:text-white/30" />
          <span className="text-xs text-gray-400 dark:text-white/30 font-semibold">
            Upload Image
          </span>
        </>
      )}
    </div>
  );
}

// ── ItemModal ─────────────────────────────────────────────────────────────────
function ItemModal({ initial, onSave, onClose, title }) {
  const blank = {
    name: "",
    description: "",
    price: "",
    currency: "NGN",
    available: true,
    spicyLevel: null,
    dietaryInfo: [],
    popular: false,
    image: null,
  };
  const [form, setForm] = useState({ ...blank, ...initial });
  const [errs, setErrs] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name required";
    if (form.price === "" || form.price === undefined)
      e.price = "Price required";
    if (isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Invalid price";
    return e;
  };

  const toggleDiet = (d) =>
    setForm((f) => ({
      ...f,
      dietaryInfo: f.dietaryInfo?.includes(d)
        ? f.dietaryInfo.filter((x) => x !== d)
        : [...(f.dietaryInfo || []), d],
    }));

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrs(e);
      return;
    }
    onSave({ ...form, price: Number(form.price) });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white dark:bg-navy-800 border border-gold-500/30 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-bold text-navy-900 dark:text-white">
            {title}
          </h3>
          <button
            className="w-7 h-7 border border-gray-200 dark:border-white/10 text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Item Photo
            </label>
            <ImgUpload
              value={form.image}
              onChange={(v) => setForm((f) => ({ ...f, image: v }))}
              height={130}
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Star Lager Beer"
            />
            {errs.name && (
              <p className="text-[10px] text-red-500 mt-1">{errs.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors resize-vertical"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: e.target.value }))
                }
              />
              {errs.price && (
                <p className="text-[10px] text-red-500 mt-1">{errs.price}</p>
              )}
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
                Currency
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors"
                value={form.currency}
                onChange={(e) =>
                  setForm((f) => ({ ...f, currency: e.target.value }))
                }
              >
                {["NGN", "USD", "EUR", "GBP", "GHS", "KES"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Spicy Level
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 text-xs font-bold border transition-all duration-200
                  ${
                    !form.spicyLevel
                      ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                      : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30"
                  }`}
                onClick={() => setForm((f) => ({ ...f, spicyLevel: null }))}
              >
                None
              </button>
              {SPICY_LEVELS.map((l) => (
                <button
                  key={l}
                  className={`px-3 py-1.5 text-xs font-bold border transition-all duration-200
                    ${
                      form.spicyLevel === l
                        ? "border-orange-500/30 bg-orange-500/10 text-orange-500"
                        : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30"
                    }`}
                  onClick={() => setForm((f) => ({ ...f, spicyLevel: l }))}
                >
                  🌶 {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Dietary Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((d) => (
                <button
                  key={d}
                  className={`px-3 py-1.5 text-xs font-bold border transition-all duration-200
                    ${
                      form.dietaryInfo?.includes(d)
                        ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                        : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30"
                    }`}
                  onClick={() => toggleDiet(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-5 flex-wrap">
            {[
              { key: "available", label: "Available" },
              { key: "popular", label: "⭐ Popular" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <button
                  type="button"
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                    form[key]
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20"
                  }`}
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-300 transition-transform duration-200 ${
                      form[key] ? "translate-x-4 bg-green-500" : ""
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-gray-600 dark:text-white/70">
                  {label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 transition-all duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              onClick={save}
            >
              <Check className="w-3.5 h-3.5" />
              Save Item
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── CategoryModal ─────────────────────────────────────────────────────────────
function CatModal({ initial, onSave, onClose, title }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    image: null,
    ...initial,
  });
  const [err, setErr] = useState("");

  const save = () => {
    if (!form.name?.trim()) {
      setErr("Name required");
      return;
    }
    onSave(form);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white dark:bg-navy-800 border border-gold-500/30 p-6 w-full max-w-md shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-bold text-navy-900 dark:text-white">
            {title}
          </h3>
          <button
            className="w-7 h-7 border border-gray-200 dark:border-white/10 text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Beers, Cocktails"
            />
            {err && <p className="text-[10px] text-red-500 mt-1">{err}</p>}
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors resize-vertical"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Display Order
            </label>
            <input
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/50 focus:outline-none transition-colors"
              type="number"
              min={0}
              value={form.displayOrder}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  displayOrder: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
              Image
            </label>
            <ImgUpload
              value={form.image}
              onChange={(v) => setForm((f) => ({ ...f, image: v }))}
              height={90}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 transition-all duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
              onClick={save}
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── DeleteConfirm ─────────────────────────────────────────────────────────────
function DeleteConfirm({ name, onConfirm, onClose, loading }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white dark:bg-navy-800 border border-red-500/30 p-6 w-full max-w-md shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-center mb-4">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        </div>
        <h3 className="font-heading text-lg font-bold text-navy-900 dark:text-white text-center mb-2">
          Delete "{name}"?
        </h3>
        <p className="text-xs text-gray-400 dark:text-white/30 text-center mb-6 leading-relaxed">
          This action is permanent and cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── ItemCard ──────────────────────────────────────────────────────────────────
function ItemCard({ item, catId, subId, menuId, onRefresh, dispatch }) {
  const [toggling, setToggling] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);
  const { loading } = useSelector((s) => s.menu);

  const handleToggle = async () => {
    setToggling(true);
    await dispatch(
      toggleItemAvailability({
        menuId,
        categoryId: catId,
        subCategoryId: subId,
        itemId: item._id,
      }),
    );
    await onRefresh();
    setToggling(false);
  };

  const handleEdit = async (form) => {
    const fd = new FormData();
    const json = {
      name: form.name,
      description: form.description,
      price: form.price,
      currency: form.currency,
      available: form.available,
      popular: form.popular,
      spicyLevel: form.spicyLevel,
      dietaryInfo: form.dietaryInfo,
    };
    fd.append("itemData", JSON.stringify(json));
    if (form.image instanceof File) fd.append("image", form.image);
    await dispatch(
      updateMenuItem({
        menuId,
        categoryId: catId,
        subCategoryId: subId,
        itemId: item._id,
        itemData: fd,
      }),
    );
    setEditModal(false);
    onRefresh();
  };

  const handleDelete = async () => {
    await dispatch(
      deleteMenuItem({
        menuId,
        categoryId: catId,
        subCategoryId: subId,
        itemId: item._id,
      }),
    );
    setDelConfirm(false);
    onRefresh();
  };

  return (
    <>
      <motion.div
        className={`bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 
          hover:border-gold-500/30 hover:translate-y-[-1px] transition-all duration-200 mb-3
          ${!item.available ? "opacity-60" : ""}`}
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="p-4 flex items-center gap-4">
          {item.image ? (
            <img
              src={item.image}
              className="w-14 h-14 object-cover flex-shrink-0"
              alt={item.name}
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 dark:bg-navy-700 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-gray-400 dark:text-white/30" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                {item.name}
              </h4>
              {item.popular && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-orange-500/30 bg-orange-500/10 text-orange-500">
                  <Star className="w-2.5 h-2.5" />
                  Popular
                </span>
              )}
              {item.spicyLevel && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-red-500/30 bg-red-500/10 text-red-500">
                  🌶 {item.spicyLevel}
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-xs text-gray-400 dark:text-white/30 truncate max-w-md mb-2">
                {item.description}
              </p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border rounded-sm
                ${
                  item.available
                    ? "border-green-500/30 bg-green-500/10 text-green-500"
                    : "border-red-500/30 bg-red-500/10 text-red-500"
                }`}
              >
                {item.available ? (
                  <Eye className="w-2.5 h-2.5" />
                ) : (
                  <EyeOff className="w-2.5 h-2.5" />
                )}
                {item.available ? "Available" : "Unavailable"}
              </span>

              {item.dietaryInfo?.slice(0, 2).map((d) => (
                <span
                  key={d}
                  className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-green-500/30 bg-green-500/10 text-green-500"
                >
                  {d}
                </span>
              ))}

              {(item.dietaryInfo?.length || 0) > 2 && (
                <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border border-gold-500/30 bg-gold-500/10 text-gold-500">
                  +{item.dietaryInfo.length - 2}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="font-heading text-lg font-bold text-gold-500">
              ₦{Number(item.price).toLocaleString()}
            </span>
            <span className="text-[9px] text-gray-400 dark:text-white/30">
              {item.currency}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Toggle availability */}
            <button
              className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                item.available
                  ? "bg-green-500/20 border border-green-500/30"
                  : "bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20"
              }`}
              onClick={handleToggle}
              disabled={toggling}
              title={item.available ? "Mark unavailable" : "Mark available"}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-300 transition-transform duration-200 ${
                  item.available ? "translate-x-4 bg-green-500" : ""
                }`}
              />
            </button>

            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
              onClick={() => setEditModal(true)}
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-red-500/30 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
              onClick={() => setDelConfirm(true)}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {editModal && (
          <ItemModal
            initial={item}
            onSave={handleEdit}
            onClose={() => setEditModal(false)}
            title="Edit Item"
          />
        )}
        {delConfirm && (
          <DeleteConfirm
            name={item.name}
            onConfirm={handleDelete}
            onClose={() => setDelConfirm(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Toast Notification ────────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border shadow-xl min-w-[240px]
        ${
          type === "success"
            ? "bg-green-500/10 border-green-500/30 text-green-500"
            : "bg-red-500/10 border-red-500/30 text-red-500"
        }`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.22 }}
    >
      {type === "success" ? (
        <Check className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      <span className="text-xs font-medium">{message}</span>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminMenuManage() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentMenu, loading, error, success, successMessage } = useSelector(
    (s) => s.menu,
  );

  const [menu, setMenu] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [openCats, setOpenCats] = useState({});
  const [search, setSearch] = useState("");
  const [filterAvail, setFilterAvail] = useState("all");
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [delConfirm, setDelConfirm] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const loadMenu = useCallback(async () => {
    const res = await dispatch(fetchMenuById(menuId));
    if (res.payload?.data?.menu) {
      const m = res.payload.data.menu;
      setMenu(m);
      if (!selectedCat && m.categories?.length) {
        setSelectedCat(m.categories[0]._id);
        if (m.categories[0].subCategories?.length)
          setSelectedSub(m.categories[0].subCategories[0]._id);
      }
    }
  }, [menuId, dispatch]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    if (success && successMessage) {
      showToast("success", successMessage);
      dispatch(clearMenuSuccess());
    }
  }, [success, successMessage]);

  useEffect(() => {
    if (error) {
      showToast("error", error);
      dispatch(clearMenuError());
    }
  }, [error]);

  const curCat = menu?.categories?.find((c) => c._id === selectedCat);
  const curSub = curCat?.subCategories?.find((s) => s._id === selectedSub);

  const items = (curSub?.items || []).filter((item) => {
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchAvail =
      filterAvail === "all" ||
      (filterAvail === "available" && item.available) ||
      (filterAvail === "unavailable" && !item.available) ||
      (filterAvail === "popular" && item.popular);
    return matchSearch && matchAvail;
  });

  const totalItems =
    menu?.categories?.reduce(
      (s, c) =>
        s +
        c.subCategories?.reduce((ss, sub) => ss + (sub.items?.length || 0), 0),
      0,
    ) || 0;

  const buildFd = (dataKey, data, image) => {
    const fd = new FormData();
    const json = { ...data };
    if (image instanceof File) {
      fd.append("image", image);
      delete json.image;
    }
    fd.append(dataKey, JSON.stringify(json));
    return fd;
  };

  const handleSaveCat = async (form) => {
    const fd = buildFd(
      "categoryData",
      {
        name: form.name,
        description: form.description,
        displayOrder: form.displayOrder,
      },
      form.image,
    );
    if (form._id) {
      await dispatch(
        updateCategory({ menuId, categoryId: form._id, categoryData: fd }),
      );
    } else {
      await dispatch(addCategory({ menuId, categoryData: fd }));
    }
    setModal(null);
    loadMenu();
  };

  const handleSaveSub = async (catId, form) => {
    const fd = buildFd(
      "subCategoryData",
      {
        name: form.name,
        description: form.description,
        displayOrder: form.displayOrder,
      },
      form.image,
    );
    if (form._id) {
      await dispatch(
        updateSubCategory({
          menuId,
          categoryId: catId,
          subCategoryId: form._id,
          subCategoryData: fd,
        }),
      );
    } else {
      await dispatch(
        addSubCategory({ menuId, categoryId: catId, subCategoryData: fd }),
      );
    }
    setModal(null);
    loadMenu();
  };

  const handleSaveItem = async (catId, subId, form) => {
    const fd = new FormData();
    const json = {
      name: form.name,
      description: form.description,
      price: form.price,
      currency: form.currency,
      available: form.available,
      popular: form.popular,
      spicyLevel: form.spicyLevel,
      dietaryInfo: form.dietaryInfo,
    };
    fd.append("itemData", JSON.stringify(json));
    if (form.image instanceof File) fd.append("image", form.image);
    if (form._id) {
      await dispatch(
        updateMenuItem({
          menuId,
          categoryId: catId,
          subCategoryId: subId,
          itemId: form._id,
          itemData: fd,
        }),
      );
    } else {
      await dispatch(
        addMenuItem({
          menuId,
          categoryId: catId,
          subCategoryId: subId,
          itemData: fd,
        }),
      );
    }
    setModal(null);
    loadMenu();
  };

  const handleDeleteConfirmed = async () => {
    if (!delConfirm) return;
    const { type, catId, subId, id } = delConfirm;
    if (type === "cat")
      await dispatch(deleteCategory({ menuId, categoryId: id }));
    if (type === "sub")
      await dispatch(
        deleteSubCategory({ menuId, categoryId: catId, subCategoryId: id }),
      );
    if (type === "item")
      await dispatch(
        deleteMenuItem({
          menuId,
          categoryId: catId,
          subCategoryId: subId,
          itemId: id,
        }),
      );
    setDelConfirm(null);
    loadMenu();
  };

  if (!menu && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 p-4 sm:p-6 lg:p-8">
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-gold-500 text-[9px] sm:text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
            Food & Beverage
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
            {menu?.title || "Menu Management"}
          </h1>
          {menu?.business_name && (
            <p className="text-xs text-gold-500 font-medium mt-1">
              {menu.business_name}
            </p>
          )}
          {menu?.description && (
            <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
              {menu.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-sm
            ${
              menu?.is_public
                ? "border-green-500/30 bg-green-500/10 text-green-500"
                : "border-red-500/30 bg-red-500/10 text-red-500"
            }`}
          >
            {menu?.is_public ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {menu?.is_public ? "Public" : "Private"}
          </span>

          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
            onClick={loadMenu}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            to={`/admin/menu/${menuId}/edit`}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Menu
          </Link>

          <button
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
            onClick={() => setModal({ type: "addCat" })}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          {
            icon: Layers,
            val: menu?.categories?.length || 0,
            lbl: "Categories",
          },
          {
            icon: UtensilsCrossed,
            val:
              menu?.categories?.reduce(
                (s, c) => s + (c.subCategories?.length || 0),
                0,
              ) || 0,
            lbl: "Subcategories",
          },
          { icon: Package, val: totalItems, lbl: "Total Items" },
          {
            icon: TrendingUp,
            val:
              menu?.categories?.reduce(
                (s, c) =>
                  s +
                  c.subCategories?.reduce(
                    (ss, sub) =>
                      ss + sub.items?.filter((i) => i.popular).length,
                    0,
                  ),
                0,
              ) || 0,
            lbl: "Popular",
          },
        ].map(({ icon: Icon, val, lbl }) => (
          <div
            key={lbl}
            className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 flex items-center gap-3 hover:border-gold-500/30 transition-colors"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                {val}
              </div>
              <div className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
                {lbl}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout - Sidebar + Main */}
      <div className="flex flex-col lg:flex-row gap-0 border border-gray-200 dark:border-white/10">
        {/* Sidebar: Category Navigation */}
        <div className="lg:w-72 flex-shrink-0 bg-white dark:bg-navy-800 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-white/10">
          <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
              Categories
            </span>
            <button
              className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
              onClick={() => setModal({ type: "addCat" })}
              title="Add Category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {!menu?.categories?.length ? (
            <div className="p-5 text-center">
              <p className="text-xs text-gray-400 dark:text-white/30">
                No categories
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-white/5">
              {menu.categories.map((cat) => (
                <div
                  key={cat._id}
                  className="border-l-2 border-transparent hover:border-gold-500/30 transition-colors"
                >
                  <div
                    className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gold-500/5 transition-colors
                      ${selectedCat === cat._id && !selectedSub ? "bg-gold-500/10 border-l-2 border-gold-500" : ""}`}
                  >
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 dark:text-white/30 transition-transform duration-200
                        ${openCats[cat._id] ? "rotate-90" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCats((p) => ({ ...p, [cat._id]: !p[cat._id] }));
                      }}
                    />

                    <span
                      className="flex-1 text-sm font-medium text-gray-700 dark:text-white/70 truncate"
                      onClick={() => {
                        setSelectedCat(cat._id);
                        setSelectedSub(null);
                      }}
                    >
                      {cat.name}
                    </span>

                    <span className="text-[9px] text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                      {cat.subCategories?.length || 0}
                    </span>

                    <button
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/10 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModal({ type: "editCat", data: cat });
                      }}
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>

                    <button
                      className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDelConfirm({
                          type: "cat",
                          id: cat._id,
                          name: cat.name,
                        });
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {openCats[cat._id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-7 pr-2 py-1 space-y-0.5 bg-gray-50/50 dark:bg-white/5">
                          {cat.subCategories?.map((sub) => (
                            <div
                              key={sub._id}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gold-500/5 transition-colors
                                ${selectedSub === sub._id ? "bg-gold-500/10 text-gold-500" : ""}`}
                              onClick={() => {
                                setSelectedCat(cat._id);
                                setSelectedSub(sub._id);
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/30 flex-shrink-0" />
                              <span className="flex-1 text-xs text-gray-600 dark:text-white/70 truncate">
                                {sub.name}
                              </span>
                              <span className="text-[8px] text-gray-400 dark:text-white/30">
                                {sub.items?.length || 0}
                              </span>
                              <button
                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/10 rounded transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModal({
                                    type: "editSub",
                                    catId: cat._id,
                                    data: sub,
                                  });
                                }}
                              >
                                <Edit3 className="w-2.5 h-2.5" />
                              </button>
                              <button
                                className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDelConfirm({
                                    type: "sub",
                                    id: sub._id,
                                    catId: cat._id,
                                    name: sub.name,
                                  });
                                }}
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}

                          <button
                            className="w-full flex items-center gap-2 p-2 text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-gold-500 hover:bg-gold-500/5 rounded transition-colors"
                            onClick={() =>
                              setModal({ type: "addSub", catId: cat._id })
                            }
                          >
                            <Plus className="w-3 h-3" />
                            Add Subcategory
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Panel */}
        <div className="flex-1 bg-white dark:bg-navy-800 min-h-[400px]">
          {!selectedSub ? (
            // Category Overview
            <div className="p-5">
              {!curCat ? (
                <div className="text-center py-16 px-4 bg-gray-50 dark:bg-navy-900 border border-dashed border-gray-200 dark:border-white/10">
                  <p className="text-xs text-gray-400 dark:text-white/30">
                    Select a category from the left to manage items
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl font-bold text-navy-900 dark:text-white">
                      {curCat.name}
                    </h2>
                    <button
                      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/70 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
                      onClick={() =>
                        setModal({ type: "addSub", catId: curCat._id })
                      }
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Subcategory
                    </button>
                  </div>

                  {!curCat.subCategories?.length ? (
                    <div className="text-center py-12 px-4 bg-gray-50 dark:bg-navy-900 border border-dashed border-gray-200 dark:border-white/10">
                      <p className="text-xs text-gray-400 dark:text-white/30">
                        No subcategories yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {curCat.subCategories.map((sub) => (
                        <div
                          key={sub._id}
                          className="p-4 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 flex items-center gap-3 cursor-pointer hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-200"
                          onClick={() => setSelectedSub(sub._id)}
                        >
                          <UtensilsCrossed className="w-4 h-4 text-gold-500" />
                          <span className="flex-1 text-sm font-semibold text-navy-900 dark:text-white">
                            {sub.name}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-white/30">
                            {sub.items?.length || 0} items
                          </span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            // Items Panel
            <div>
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-200 dark:border-white/10 flex flex-wrap items-center gap-3 bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:bg-gold-500/10 rounded transition-colors"
                    onClick={() => setSelectedSub(null)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-400 dark:text-white/30">
                    {curCat?.name}
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-bold text-navy-900 dark:text-white">
                    {curSub?.name}
                  </span>
                </div>

                <div className="flex-1" />

                <div className="relative flex-1 min-w-[200px] max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-gold-500/30 focus:outline-none transition-colors"
                  />
                </div>

                {["all", "available", "unavailable", "popular"].map((f) => (
                  <button
                    key={f}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap
                      ${
                        filterAvail === f
                          ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                          : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                      }`}
                    onClick={() => setFilterAvail(f)}
                  >
                    {f}
                  </button>
                ))}

                <button
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                  onClick={() =>
                    setModal({
                      type: "addItem",
                      catId: selectedCat,
                      subId: selectedSub,
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </button>
              </div>

              {/* Items List */}
              <div className="p-5">
                {!items.length ? (
                  <div className="text-center py-12 px-4 bg-gray-50 dark:bg-navy-900 border border-dashed border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-400 dark:text-white/30">
                      {search || filterAvail !== "all"
                        ? "No items match your filter"
                        : "No items yet — add your first item above"}
                    </p>
                  </div>
                ) : (
                  <>
                    {items.map((item) => (
                      <ItemCard
                        key={item._id}
                        item={item}
                        catId={selectedCat}
                        subId={selectedSub}
                        menuId={menuId}
                        onRefresh={loadMenu}
                        dispatch={dispatch}
                      />
                    ))}

                    <button
                      className="w-full flex items-center justify-center gap-2 p-3 mt-4 border border-dashed border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/30 text-[10px] font-bold uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/5 transition-all duration-200"
                      onClick={() =>
                        setModal({
                          type: "addItem",
                          catId: selectedCat,
                          subId: selectedSub,
                        })
                      }
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Another Item to "{curSub?.name}"
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal?.type === "addCat" && (
          <CatModal
            title="Add Category"
            initial={{}}
            onSave={handleSaveCat}
            onClose={() => setModal(null)}
          />
        )}
        {modal?.type === "editCat" && (
          <CatModal
            title="Edit Category"
            initial={modal.data}
            onSave={handleSaveCat}
            onClose={() => setModal(null)}
          />
        )}
        {modal?.type === "addSub" && (
          <CatModal
            title="Add Subcategory"
            initial={{}}
            onSave={(form) => handleSaveSub(modal.catId, form)}
            onClose={() => setModal(null)}
          />
        )}
        {modal?.type === "editSub" && (
          <CatModal
            title="Edit Subcategory"
            initial={modal.data}
            onSave={(form) => handleSaveSub(modal.catId, form)}
            onClose={() => setModal(null)}
          />
        )}
        {modal?.type === "addItem" && (
          <ItemModal
            title="Add Menu Item"
            initial={{}}
            onSave={(form) => handleSaveItem(modal.catId, modal.subId, form)}
            onClose={() => setModal(null)}
          />
        )}
        {delConfirm && (
          <DeleteConfirm
            name={delConfirm.name}
            onConfirm={handleDeleteConfirmed}
            onClose={() => setDelConfirm(null)}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.msg}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
