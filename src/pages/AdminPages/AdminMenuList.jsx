import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAllMenusAdmin,
  deleteMenu,
  clearMenuError,
  clearMenuSuccess,
} from "../../features/Menu/menuSlice";
import {
  Plus,
  Search,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  Globe,
  Lock,
  UtensilsCrossed,
  ChevronRight,
  RefreshCw,
  Package,
  Layers,
  List,
  AlertTriangle,
  X,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

const TYPE_ICON = {
  restaurant: "🍛",
  bar: "🍺",
  cafe: "☕",
  bakery: "🥐",
  default: "🍽️",
};

// ── MenuCard ──────────────────────────────────────────────────────────────────
function MenuCard({ menu, onDelete }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems =
    menu.categories?.reduce(
      (s, c) =>
        s +
        c.subCategories?.reduce((ss, sub) => ss + (sub.items?.length || 0), 0),
      0,
    ) || 0;
  const totalSubs =
    menu.categories?.reduce((s, c) => s + (c.subCategories?.length || 0), 0) ||
    0;

  return (
    <motion.div
      className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 
        hover:border-gold-500/30 hover:translate-y-[-1px] transition-all duration-200 mb-3 relative"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Icon */}
          <div
            className="w-12 h-12 flex-shrink-0 bg-gold-500/10 border border-gold-500/30 
            flex items-center justify-center text-xl"
          >
            {TYPE_ICON[menu.menu_type] || TYPE_ICON.default}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base sm:text-lg font-bold text-navy-900 dark:text-white truncate">
              {menu.title}
            </h3>
            <p className="text-xs text-gold-500 font-medium mb-1">
              {menu.business_name}
            </p>
            {menu.description && (
              <p className="text-xs text-gray-400 dark:text-white/30 truncate max-w-md">
                {menu.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 sm:gap-6">
            {[
              { n: menu.categories?.length || 0, l: "Categories" },
              { n: totalSubs, l: "Subcats" },
              { n: totalItems, l: "Items" },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <div className="font-heading text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                  {n}
                </div>
                <div className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
                  {l}
                </div>
              </div>
            ))}
          </div>

          {/* Status Chips */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-[9px] font-bold 
              uppercase tracking-wider border rounded-sm
              ${
                menu.is_public
                  ? "border-green-500/30 bg-green-500/10 text-green-500"
                  : "border-red-500/30 bg-red-500/10 text-red-500"
              }`}
            >
              {menu.is_public ? (
                <Globe className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              {menu.is_public ? "Public" : "Private"}
            </span>
            <span
              className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider 
              border border-gold-500/30 bg-gold-500/10 text-gold-500 rounded-sm"
            >
              {menu.menu_type}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 relative">
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 
                dark:border-white/10 text-gray-400 dark:text-white/40 
                hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 
                transition-all duration-200"
              onClick={() => navigate(`/admin/menu/${menu._id}/edit`)}
              title="Edit Menu"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border border-gray-200 
                dark:border-white/10 text-gray-400 dark:text-white/40 
                hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 
                transition-all duration-200"
              onClick={() => window.open("/menu", "_blank")}
              title="View Public"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                className="w-8 h-8 flex items-center justify-center border border-gray-200 
                  dark:border-white/10 text-gray-400 dark:text-white/40 
                  hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 
                  transition-all duration-200"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-1 z-50 min-w-[160px]
                      bg-white dark:bg-navy-800 border border-gold-500/30 
                      shadow-xl rounded-sm overflow-hidden"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to={`/admin/menu/${menu._id}/edit`}
                      className="flex items-center gap-2 px-3 py-2 text-xs 
                        text-gray-600 dark:text-white/70 hover:text-gold-500 
                        hover:bg-gold-500/10 transition-colors w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Menu
                    </Link>
                    <Link
                      to={`/admin/menu/${menu._id}/orders`}
                      className="flex items-center gap-2 px-3 py-2 text-xs 
                        text-gray-600 dark:text-white/70 hover:text-gold-500 
                        hover:bg-gold-500/10 transition-colors w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      <List className="w-3.5 h-3.5" />
                      View Orders
                    </Link>
                    <a
                      href="/menu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-xs 
                        text-gray-600 dark:text-white/70 hover:text-gold-500 
                        hover:bg-gold-500/10 transition-colors w-full"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview Public
                    </a>
                    <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Category preview */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {menu.categories?.map((cat) => {
                const catItems =
                  cat.subCategories?.reduce(
                    (s, sub) => s + (sub.items?.length || 0),
                    0,
                  ) || 0;
                return (
                  <div
                    key={cat._id}
                    className="flex items-center gap-3 text-xs"
                  >
                    <span className="text-base">
                      {TYPE_ICON[menu.menu_type] || TYPE_ICON.default}
                    </span>
                    <span className="text-gray-700 dark:text-white/70 font-medium">
                      {cat.name}
                    </span>
                    {cat.description && (
                      <span className="text-gray-400 dark:text-white/30 truncate flex-1">
                        {cat.description}
                      </span>
                    )}
                    <span
                      className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 
                      text-gray-400 dark:text-white/30 text-[9px] font-bold rounded"
                    >
                      {cat.subCategories?.length || 0} subs
                    </span>
                    <span
                      className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 
                      text-gray-400 dark:text-white/30 text-[9px] font-bold rounded"
                    >
                      {catItems} items
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand/Collapse Button */}
        <button
          className={`w-full mt-3 pt-3 border-t border-gray-200 dark:border-white/10 
            flex items-center justify-center gap-1 text-[9px] font-bold 
            uppercase tracking-wider transition-colors
            ${
              expanded
                ? "text-gold-500"
                : "text-gray-400 dark:text-white/30 hover:text-gold-500"
            }`}
          onClick={() => setExpanded((v) => !v)}
        >
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform duration-200 
            ${expanded ? "rotate-90" : ""}`}
          />
          {expanded
            ? "Hide Categories"
            : `Show ${menu.categories?.length || 0} Categories`}
        </button>
      </div>
    </motion.div>
  );
}

// ── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-5 mb-3 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/3" />
          <div className="h-3 bg-gray-200 dark:bg-white/5 rounded w-1/4" />
        </div>
        <div className="flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-5 w-8 bg-gray-200 dark:bg-white/10 rounded mb-1" />
              <div className="h-2 w-12 bg-gray-200 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({ menu, onConfirm, onCancel, loading }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 
        bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        className="bg-white dark:bg-navy-800 border border-red-500/30 p-6 
          max-w-md w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.22 }}
      >
        <div
          className="w-12 h-12 mx-auto mb-4 bg-red-500/10 border border-red-500/30 
          flex items-center justify-center"
        >
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>

        <h3 className="font-heading text-xl font-bold text-navy-900 dark:text-white text-center mb-2">
          Delete Menu?
        </h3>

        <p className="text-xs text-gray-400 dark:text-white/30 text-center mb-6 leading-relaxed">
          You're about to permanently delete{" "}
          <span className="font-semibold text-navy-900 dark:text-white">
            "{menu?.title}"
          </span>
          . All categories, subcategories, items and images will be removed.
          This cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 border border-gray-200 dark:border-white/10 
              text-gray-600 dark:text-white/50 text-[10px] font-bold 
              uppercase tracking-wider hover:border-gold-500/30 hover:text-gold-500 
              transition-all duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2.5 bg-red-500 text-white text-[10px] font-bold 
              uppercase tracking-wider hover:bg-red-600 transition-all duration-200"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Forever"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Toast Notification ───────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, type === "success" ? 3500 : 4000);
    return () => clearTimeout(timer);
  }, [type, onClose]);

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 
        border shadow-xl min-w-[260px]
        ${
          type === "success"
            ? "bg-green-500/10 border-green-500/30 text-green-500"
            : "bg-red-500/10 border-red-500/30 text-red-500"
        }`}
      initial={{ opacity: 0, y: 16, x: 16 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <AlertTriangle className="w-5 h-5" />
      )}
      <span className="text-xs font-medium">{message}</span>
      <button onClick={onClose} className="ml-auto">
        <X className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" />
      </button>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminMenuList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { menus, loading, error, success, successMessage } = useSelector(
    (s) => s.menu,
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    dispatch(fetchAllMenusAdmin({}));
  }, [dispatch]);

  useEffect(() => {
    if (success && successMessage) {
      setToast({ type: "success", message: successMessage });
      dispatch(clearMenuSuccess());
    }
  }, [success, successMessage, dispatch]);

  useEffect(() => {
    if (error) {
      setToast({ type: "error", message: error });
      dispatch(clearMenuError());
    }
  }, [error, dispatch]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await dispatch(deleteMenu(confirmDelete._id));
    setConfirmDelete(null);
  };

  const filtered = menus.filter((m) => {
    const matchSearch =
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.business_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "public" && m.is_public) ||
      (filter === "private" && !m.is_public) ||
      filter === m.menu_type;
    return matchSearch && matchFilter;
  });

  const totalItems = menus.reduce(
    (s, m) =>
      s +
      (m.categories?.reduce(
        (cs, c) =>
          cs +
          c.subCategories?.reduce(
            (ss, sub) => ss + (sub.items?.length || 0),
            0,
          ),
        0,
      ) || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-gold-500 text-[9px] sm:text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
            Food & Beverage
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
            Menu Management
          </h1>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
            Create, edit, and manage your food & beverage menus
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { icon: UtensilsCrossed, val: menus.length, lbl: "Total Menus" },
          {
            icon: Layers,
            val: menus.reduce((s, m) => s + (m.categories?.length || 0), 0),
            lbl: "Categories",
          },
          { icon: Package, val: totalItems, lbl: "Total Items" },
          {
            icon: Globe,
            val: menus.filter((m) => m.is_public).length,
            lbl: "Public",
          },
        ].map(({ icon: Icon, val, lbl }) => (
          <div
            key={lbl}
            className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 
              p-4 flex items-center gap-3 hover:border-gold-500/30 transition-colors"
          >
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gold-500/10 border border-gold-500/30 
              flex items-center justify-center flex-shrink-0"
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-bold text-navy-900 dark:text-white">
                {val}
              </div>
              <div
                className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase 
                text-gray-400 dark:text-white/30"
              >
                {lbl}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Search menus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-navy-800 
              border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white 
              placeholder:text-gray-400 dark:placeholder:text-white/30 
              focus:border-gold-500/30 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {["all", "public", "private", "restaurant", "bar", "cafe"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap ${
                  filter === f
                    ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                    : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                }`}
              >
                {f}
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => dispatch(fetchAllMenusAdmin({}))}
          className="w-8 h-8 flex items-center justify-center border border-gray-200 
            dark:border-white/10 text-gray-400 dark:text-white/40 
            hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 
            transition-all duration-200 ml-auto"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Menu List */}
      {loading && menus.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16 px-4 bg-white dark:bg-navy-800 
          border border-dashed border-gray-200 dark:border-white/10"
        >
          <div className="text-5xl mb-4">🍽️</div>
          <h3 className="font-heading text-lg font-bold text-gray-400 dark:text-white/50 mb-2">
            {search ? "No menus match your search" : "No menus yet"}
          </h3>
          <p className="text-xs text-gray-400 dark:text-white/30 mb-6">
            {search
              ? "Try adjusting your search term"
              : "Create your first menu to get started"}
          </p>
          {!search && (
            <Link
              to="/admin/menu/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 
                bg-gold-500 hover:bg-gold-400 text-white text-[10px] font-bold 
                uppercase tracking-wider transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Create Menu
            </Link>
          )}
        </div>
      ) : (
        filtered.map((menu) => (
          <MenuCard key={menu._id} menu={menu} onDelete={setConfirmDelete} />
        ))
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <DeleteModal
            menu={confirmDelete}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(null)}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
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
