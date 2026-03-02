import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAllOrders,
  fetchOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  clearMenuError,
  clearMenuSuccess,
} from "../../features/Menu/menuSlice";
import {
  Search,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Phone,
  User,
  Hash,
  Utensils,
  CreditCard,
  Banknote,
  Building2,
  BedDouble,
  TableIcon,
  Package,
  TrendingUp,
  Filter,
  Eye,
  MoreVertical,
  ChevronRight,
  Calendar,
  SortAsc,
  SortDesc,
  ListOrdered,
  DollarSign,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "served",
  "cancelled",
];

const PAYMENT_STATUSES = ["unpaid", "paid", "partially-paid"];
const PAYMENT_METHODS = ["cash", "card", "bank-transfer", "room-charge"];
const ORDER_TYPES = ["room-service", "dine-in", "takeaway"];

const STATUS_CONFIG = {
  pending: {
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: Clock,
    label: "Pending",
  },
  confirmed: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    icon: Check,
    label: "Confirmed",
  },
  preparing: {
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    icon: Loader2,
    label: "Preparing",
  },
  ready: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    icon: CheckCircle,
    label: "Ready",
  },
  served: {
    color: "text-gold-500",
    bg: "bg-gold-500/10",
    border: "border-gold-500/30",
    icon: Utensils,
    label: "Served",
  },
  cancelled: {
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: XCircle,
    label: "Cancelled",
  },
};

const PAYMENT_CONFIG = {
  unpaid: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    label: "Unpaid",
  },
  paid: {
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    label: "Paid",
  },
  "partially-paid": {
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
    label: "Partial",
  },
};

const TYPE_ICON = {
  "room-service": BedDouble,
  "dine-in": Utensils,
  takeaway: Package,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  `₦${Number(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
  });
};

const fmtDate = (date) =>
  new Date(date).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const sz =
    size === "sm" ? "text-[8px] px-2 py-0.5" : "text-[10px] px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold uppercase tracking-wider border rounded-sm ${cfg.color} ${cfg.bg} ${cfg.border} ${sz}`}
    >
      <Icon className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      {cfg.label}
    </span>
  );
}

// ── PaymentBadge ──────────────────────────────────────────────────────────────
function PaymentBadge({ status, size = "sm" }) {
  const cfg = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.unpaid;
  const sz =
    size === "sm" ? "text-[8px] px-2 py-0.5" : "text-[10px] px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider border rounded-sm ${cfg.color} ${cfg.bg} ${cfg.border} ${sz}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 border shadow-xl min-w-[260px]
        ${type === "success" ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-red-500/10 border-red-500/30 text-red-500"}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.22 }}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      <span className="text-xs font-medium flex-1">{message}</span>
      <button onClick={onClose}>
        <X className="w-4 h-4 opacity-50 hover:opacity-100" />
      </button>
    </motion.div>
  );
}

// ── SelectDropdown ────────────────────────────────────────────────────────────
function SelectDropdown({
  value,
  options,
  onChange,
  placeholder,
  disabled,
  colorFn,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs border transition-all duration-200 min-w-[130px]
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gold-500/30 hover:bg-gold-500/5"}
          bg-white dark:bg-navy-800 border-gray-200 dark:border-white/10 text-navy-900 dark:text-white`}
      >
        {selected ? (
          <span className={`font-semibold ${colorFn ? colorFn(value) : ""}`}>
            {selected.label}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-white/30">
            {placeholder}
          </span>
        )}
        <ChevronDown className="w-3 h-3 ml-auto text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 top-full mt-1 z-50 min-w-full bg-white dark:bg-navy-800 border border-gold-500/30 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                className={`w-full flex items-center px-3 py-2 text-xs transition-colors hover:bg-gold-500/10
                  ${value === opt.value ? "bg-gold-500/10 text-gold-500" : "text-gray-600 dark:text-white/70"}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {colorFn ? (
                  <span className={`font-semibold ${colorFn(opt.value)}`}>
                    {opt.label}
                  </span>
                ) : (
                  opt.label
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ orderId, onClose }) {
  const dispatch = useDispatch();
  const { currentOrder, loading } = useSelector((s) => s.menu);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [localOrder, setLocalOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrderById(orderId));
  }, [orderId, dispatch]);

  useEffect(() => {
    if (currentOrder?._id === orderId) setLocalOrder(currentOrder);
  }, [currentOrder, orderId]);

  const handleStatusChange = async (status) => {
    setStatusUpdating(true);
    const res = await dispatch(updateOrderStatus({ orderId, status }));
    if (updateOrderStatus.fulfilled.match(res)) {
      setLocalOrder(res.payload.data?.order);
    }
    setStatusUpdating(false);
  };

  const handlePaymentChange = async ({ paymentStatus, paymentMethod }) => {
    setPaymentUpdating(true);
    const res = await dispatch(
      updatePaymentStatus({ orderId, paymentStatus, paymentMethod }),
    );
    if (updatePaymentStatus.fulfilled.match(res)) {
      setLocalOrder(res.payload.data?.order);
    }
    setPaymentUpdating(false);
  };

  const order = localOrder;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-white dark:bg-navy-800 border border-gold-500/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.22 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-white/10 p-5 flex items-start justify-between z-10">
          <div>
            <div className="text-gold-500 text-[9px] font-bold tracking-[0.25em] uppercase mb-1">
              Order Details
            </div>
            <h2 className="font-heading text-xl font-bold text-navy-900 dark:text-white">
              {order?.orderNumber || "Loading..."}
            </h2>
            {order && (
              <p className="text-[10px] text-gray-400 dark:text-white/30 mt-0.5">
                {fmtDate(order.createdAt)}
              </p>
            )}
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 hover:border-red-500/30 hover:text-red-500 transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!order && loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        ) : !order ? (
          <div className="p-8 text-center text-gray-400 dark:text-white/30 text-sm">
            Order not found
          </div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Status + Payment row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Order Status */}
              <div className="bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 p-4">
                <div className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-3">
                  Order Status
                </div>
                <div className="mb-3">
                  <StatusBadge status={order.status} size="md" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ORDER_STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={order.status === s || statusUpdating}
                      onClick={() => handleStatusChange(s)}
                      className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200
                        ${
                          order.status === s
                            ? `${STATUS_CONFIG[s].color} ${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].border}`
                            : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {statusUpdating && order.status !== s ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin inline" />
                      ) : (
                        STATUS_CONFIG[s]?.label
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 p-4">
                <div className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-3">
                  Payment
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <PaymentBadge status={order.paymentStatus} size="md" />
                  {order.paymentMethod && (
                    <span className="text-[9px] font-bold uppercase tracking-wider border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 px-2 py-0.5">
                      {order.paymentMethod}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
                      Update Status
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PAYMENT_STATUSES.map((ps) => (
                        <button
                          key={ps}
                          disabled={
                            order.paymentStatus === ps || paymentUpdating
                          }
                          onClick={() =>
                            handlePaymentChange({
                              paymentStatus: ps,
                              paymentMethod: order.paymentMethod,
                            })
                          }
                          className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200
                            ${
                              order.paymentStatus === ps
                                ? `${PAYMENT_CONFIG[ps].color} ${PAYMENT_CONFIG[ps].bg} ${PAYMENT_CONFIG[ps].border}`
                                : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {PAYMENT_CONFIG[ps]?.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1.5">
                      Payment Method
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {PAYMENT_METHODS.map((pm) => (
                        <button
                          key={pm}
                          disabled={paymentUpdating}
                          onClick={() =>
                            handlePaymentChange({
                              paymentStatus: order.paymentStatus,
                              paymentMethod: pm,
                            })
                          }
                          className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200
                            ${
                              order.paymentMethod === pm
                                ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                                : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {pm}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-3">
                Customer Information
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <User className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
                      Name
                    </div>
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">
                      {order.customerName}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
                      Phone
                    </div>
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">
                      {order.customerPhone}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {order.orderType === "room-service" ? (
                    <BedDouble className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                  ) : order.orderType === "dine-in" ? (
                    <Utensils className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Package className="w-3.5 h-3.5 text-gold-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
                      {order.orderType === "room-service"
                        ? "Room"
                        : order.orderType === "dine-in"
                          ? "Table"
                          : "Type"}
                    </div>
                    <div className="text-sm font-semibold text-navy-900 dark:text-white capitalize">
                      {order.roomNumber || order.tableNumber || order.orderType}
                    </div>
                  </div>
                </div>
              </div>
              {order.specialRequests && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                  <div className="text-[8px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-1">
                    Special Requests
                  </div>
                  <p className="text-xs text-gray-600 dark:text-white/60 italic">
                    "{order.specialRequests}"
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10 p-4">
              <div className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 mb-3">
                Items ({order.items?.length || 0})
              </div>
              <div className="space-y-2">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-gray-200 dark:border-white/5 last:border-b-0"
                  >
                    <div className="w-6 h-6 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-gold-500">
                      {item.quantity}x
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-navy-900 dark:text-white">
                        {item.name}
                      </div>
                      {item.specialInstructions && (
                        <div className="text-[10px] text-gray-400 dark:text-white/30 italic mt-0.5">
                          {item.specialInstructions}
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-bold text-gold-500 whitespace-nowrap">
                      {fmt(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 space-y-1.5">
                {[
                  { label: "Subtotal", val: order.subtotal },
                  { label: "VAT (7.5%)", val: order.tax },
                  { label: "Service (5%)", val: order.serviceCharge },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-xs">
                    <span className="text-gray-400 dark:text-white/40">
                      {label}
                    </span>
                    <span className="text-gray-600 dark:text-white/60">
                      {fmt(val)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10">
                  <span className="text-sm font-bold text-navy-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gold-500">
                    {fmt(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking ID */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-white/10">
              <Hash className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
              <span className="text-[10px] text-gray-400 dark:text-white/30 font-mono">
                Tracking: {order.guestId}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Order Row ─────────────────────────────────────────────────────────────────
function OrderRow({
  order,
  onView,
  onQuickStatusChange,
  onQuickPaymentChange,
  updating,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const TypeIcon = TYPE_ICON[order.orderType] || Package;
  const statusCfg = STATUS_CONFIG[order.status];

  return (
    <motion.tr
      className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Order # + Type */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
            <TypeIcon className="w-3.5 h-3.5 text-gold-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-navy-900 dark:text-white font-mono">
              {order.orderNumber}
            </div>
            <div className="text-[9px] text-gray-400 dark:text-white/30 capitalize mt-0.5">
              {order.orderType}
              {order.tableNumber && ` · T${order.tableNumber}`}
              {order.roomNumber && ` · R${order.roomNumber}`}
            </div>
          </div>
        </div>
      </td>

      {/* Customer */}
      <td className="px-4 py-3">
        <div className="text-xs font-semibold text-navy-900 dark:text-white">
          {order.customerName}
        </div>
        <div className="text-[9px] text-gray-400 dark:text-white/30">
          {order.customerPhone}
        </div>
      </td>

      {/* Items + Total */}
      <td className="px-4 py-3">
        <div className="text-xs font-bold text-gold-500">
          {fmt(order.total)}
        </div>
        <div className="text-[9px] text-gray-400 dark:text-white/30">
          {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
        </div>
      </td>

      {/* Order Status */}
      <td className="px-4 py-3">
        <div className="relative">
          <SelectDropdown
            value={order.status}
            options={ORDER_STATUSES.map((s) => ({
              value: s,
              label: STATUS_CONFIG[s]?.label,
            }))}
            onChange={(v) => onQuickStatusChange(order._id, v)}
            disabled={updating === order._id}
            colorFn={(v) => STATUS_CONFIG[v]?.color || ""}
          />
        </div>
      </td>

      {/* Payment */}
      <td className="px-4 py-3">
        <SelectDropdown
          value={order.paymentStatus}
          options={PAYMENT_STATUSES.map((s) => ({
            value: s,
            label: PAYMENT_CONFIG[s]?.label,
          }))}
          onChange={(v) =>
            onQuickPaymentChange(order._id, v, order.paymentMethod)
          }
          disabled={updating === order._id}
          colorFn={(v) => PAYMENT_CONFIG[v]?.color || ""}
        />
      </td>

      {/* Time */}
      <td className="px-4 py-3">
        <div className="text-[10px] text-gray-400 dark:text-white/40 whitespace-nowrap">
          {timeAgo(order.createdAt)}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all"
            onClick={() => onView(order._id)}
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ── Stats Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, sub, color = "text-gold-500" }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 flex items-center gap-3 hover:border-gold-500/30 transition-colors">
      <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className={`font-heading text-xl font-bold ${color}`}>{value}</div>
        <div className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30">
          {label}
        </div>
        {sub && (
          <div className="text-[9px] text-gray-400 dark:text-white/20 mt-0.5">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Adminorderlist() {
  const dispatch = useDispatch();
  const { orders, loading, error, success, successMessage } = useSelector(
    (s) => s.menu,
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [viewOrderId, setViewOrderId] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  const LIMIT = 20;

  const load = useCallback(() => {
    dispatch(
      fetchAllOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
        orderType: typeFilter !== "all" ? typeFilter : undefined,
        date: dateFilter || undefined,
        page,
        limit: LIMIT,
      }),
    );
  }, [dispatch, statusFilter, typeFilter, dateFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (success && successMessage) {
      setToast({ type: "success", message: successMessage });
      dispatch(clearMenuSuccess());
      load();
    }
  }, [success, successMessage]);

  useEffect(() => {
    if (error) {
      setToast({ type: "error", message: error });
      dispatch(clearMenuError());
    }
  }, [error]);

  // Client-side search + payment filter on already-fetched orders
  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customerName?.toLowerCase().includes(q) ||
      o.customerPhone?.includes(q) ||
      o.tableNumber?.includes(q) ||
      o.roomNumber?.includes(q);
    const matchPayment =
      paymentFilter === "all" || o.paymentStatus === paymentFilter;
    return matchSearch && matchPayment;
  });

  const sorted = [...filtered].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortDir === "desc" ? bTime - aTime : aTime - bTime;
  });

  // Stats
  const totalRevenue = orders.reduce(
    (s, o) => s + (o.paymentStatus === "paid" ? o.total : 0),
    0,
  );
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) =>
    ["confirmed", "preparing"].includes(o.status),
  ).length;
  const paidCount = orders.filter((o) => o.paymentStatus === "paid").length;

  const handleQuickStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    await dispatch(updateOrderStatus({ orderId, status }));
    setUpdating(null);
    load();
  };

  const handleQuickPaymentChange = async (
    orderId,
    paymentStatus,
    paymentMethod,
  ) => {
    setUpdating(orderId);
    await dispatch(
      updatePaymentStatus({ orderId, paymentStatus, paymentMethod }),
    );
    setUpdating(null);
    load();
  };

  const activeFiltersCount = [
    statusFilter !== "all",
    paymentFilter !== "all",
    typeFilter !== "all",
    !!dateFilter,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter("all");
    setPaymentFilter("all");
    setTypeFilter("all");
    setDateFilter("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-gold-500 text-[10px] font-bold tracking-[0.28em] uppercase mb-1">
            Food & Beverage
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
            Order Management
          </h1>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-1">
            Track, update, and manage all food & beverage orders
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="self-start sm:self-auto w-8 h-8 flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={ListOrdered}
          value={orders.length}
          label="Total Orders"
          sub="this page"
        />
        <StatCard
          icon={Clock}
          value={pendingCount}
          label="Pending"
          color="text-yellow-500"
        />
        <StatCard
          icon={Loader2}
          value={preparingCount}
          label="In Progress"
          color="text-orange-400"
        />
        <StatCard
          icon={DollarSign}
          value={fmt(totalRevenue)}
          label="Paid Revenue"
          sub={`${paidCount} paid orders`}
          color="text-green-400"
        />
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder="Order #, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:border-gold-500/30 focus:outline-none transition-colors"
            />
            {search && (
              <button
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                onClick={() => setSearch("")}
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Status filter chips */}
          <div className="flex flex-wrap gap-1">
            {["all", ...ORDER_STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap
                  ${
                    statusFilter === s
                      ? s === "all"
                        ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                        : `${STATUS_CONFIG[s]?.color} ${STATUS_CONFIG[s]?.bg} ${STATUS_CONFIG[s]?.border}`
                      : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                  }`}
              >
                {s === "all" ? "All Status" : STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Second row filters */}
        <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
          {/* Payment filter */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 whitespace-nowrap">
              Payment:
            </span>
            {["all", ...PAYMENT_STATUSES].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPaymentFilter(p);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap
                  ${
                    paymentFilter === p
                      ? p === "all"
                        ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                        : `${PAYMENT_CONFIG[p]?.color} ${PAYMENT_CONFIG[p]?.bg} ${PAYMENT_CONFIG[p]?.border}`
                      : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                  }`}
              >
                {p === "all" ? "All" : PAYMENT_CONFIG[p]?.label}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold tracking-wider uppercase text-gray-400 dark:text-white/30 whitespace-nowrap">
              Type:
            </span>
            {["all", ...ORDER_TYPES].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTypeFilter(t);
                  setPage(1);
                }}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 whitespace-nowrap
                  ${
                    typeFilter === t
                      ? "border-gold-500/30 bg-gold-500/10 text-gold-500"
                      : "border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500"
                  }`}
              >
                {t === "all" ? "All" : t.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(1);
              }}
              className="text-xs bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-white/10 text-navy-900 dark:text-white focus:border-gold-500/30 focus:outline-none px-2 py-1 transition-colors"
            />
            {dateFilter && (
              <button onClick={() => setDateFilter("")}>
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500 transition-all duration-200"
          >
            {sortDir === "desc" ? (
              <SortDesc className="w-3 h-3" />
            ) : (
              <SortAsc className="w-3 h-3" />
            )}
            {sortDir === "desc" ? "Newest" : "Oldest"}
          </button>

          {/* Clear filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-200"
            >
              <X className="w-3 h-3" />
              Clear ({activeFiltersCount})
            </button>
          )}

          <div className="ml-auto text-[9px] text-gray-400 dark:text-white/30 font-bold uppercase tracking-wider">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading && orders.length === 0 ? (
        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 p-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white dark:bg-navy-800 border border-dashed border-gray-200 dark:border-white/10 p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-heading text-lg font-bold text-gray-400 dark:text-white/50 mb-2">
            {search || activeFiltersCount > 0
              ? "No orders match your filters"
              : "No orders yet"}
          </h3>
          <p className="text-xs text-gray-400 dark:text-white/30">
            {search || activeFiltersCount > 0
              ? "Try adjusting your search or filters"
              : "Orders will appear here once customers place them"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                  {[
                    "Order",
                    "Customer",
                    "Amount",
                    "Status",
                    "Payment",
                    "Time",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[8px] font-bold tracking-[0.18em] uppercase text-gray-400 dark:text-white/30"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    onView={setViewOrderId}
                    onQuickStatusChange={handleQuickStatusChange}
                    onQuickPaymentChange={handleQuickPaymentChange}
                    updating={updating}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {orders.length === LIMIT && (
            <div className="border-t border-gray-200 dark:border-white/10 p-3 flex items-center justify-between">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-[10px] font-bold text-gray-400 dark:text-white/30">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40 hover:border-gold-500/30 hover:text-gold-500 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {viewOrderId && (
          <OrderDetailModal
            orderId={viewOrderId}
            onClose={() => setViewOrderId(null)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
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
