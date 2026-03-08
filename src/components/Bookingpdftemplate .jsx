/**
 * BookingPDF.jsx
 * ─────────────────────────────────────────────────────────────
 * Drop this component into both ReserveSuccess and DepositSuccess.
 * It renders a hidden, print-optimised receipt div that gets
 * captured by html2canvas → jsPDF.
 *
 * Usage:
 *   <BookingPDFTemplate id="pdf-receipt" {...props} />
 *   await downloadBookingPDF("pdf-receipt", `Duban-Booking-${ref_}.pdf`);
 * ─────────────────────────────────────────────────────────────
 */

export const downloadBookingPDF = async (elementId, filename) => {
  const loadScript = (src, check) =>
    new Promise((resolve) => {
      if (check()) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      document.body.appendChild(s);
    });

  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    () => !!window.html2canvas,
  );

  await loadScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    () => !!window.jspdf,
  );

  const element = document.getElementById(elementId);
  if (!element) return;

  // Proper temporary render style (NO visibility:hidden)
  const prevStyle = element.style.cssText;

  element.style.position = "fixed";
  element.style.left = "0";
  element.style.top = "0";
  element.style.zIndex = "-1";
  element.style.opacity = "1";
  element.style.display = "block";

  await new Promise((r) => setTimeout(r, 100));

  const canvas = await window.html2canvas(element, {
    scale: 1.5, // ↓ lower scale (was 2.5)
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
  });

  element.style.cssText = prevStyle;

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgData = canvas.toDataURL("image/jpeg", 0.85); // JPEG + compression
  const imgProps = pdf.getImageProperties(imgData);

  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
};

// ── Helper ────────────────────────────────────────────────────────────────────
const fmtNG = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const nights = (a, b) =>
  Math.max(1, Math.round((new Date(b) - new Date(a)) / 86400000));

// ── Row ───────────────────────────────────────────────────────────────────────
const Row = ({ label, value, bold, gold, borderTop }) => (
  <tr
    style={{
      borderTop: borderTop ? "2px solid #e5e7eb" : "1px solid #f3f4f6",
    }}
  >
    <td
      style={{
        padding: "7px 0",
        fontSize: 11,
        color: "#9ca3af",
        fontFamily: "sans-serif",
        width: "45%",
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: "7px 0",
        fontSize: bold ? 15 : 12,
        fontWeight: bold ? 700 : 600,
        color: gold ? "#d97706" : bold ? "#111827" : "#374151",
        textAlign: "right",
        fontFamily: "sans-serif",
      }}
    >
      {value}
    </td>
  </tr>
);

// ── Section header ────────────────────────────────────────────────────────────
const Section = ({ title, children, mt = 20 }) => (
  <div style={{ marginTop: mt }}>
    <div
      style={{
        background: "#f9fafb",
        borderLeft: "3px solid #d97706",
        padding: "6px 12px",
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#6b7280",
          fontFamily: "sans-serif",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </div>
    {children}
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// BookingPDFTemplate — the hidden element that gets captured
// ──────────────────────────────────────────────────────────────────────────────
const BookingPDFTemplate = ({
  id,
  type, // "reservation" | "deposit"
  room,
  form,
  ref_,
  depositPaid,
  priceBreakdown,
  expiresAt,
}) => {
  const n = nights(form.checkIn, form.checkOut);
  const images = room?.images?.length
    ? room.images
    : room?.thumbnailImage
      ? [room.thumbnailImage]
      : [];
  const displayName = room?.displayName || room?.name || "Room";
  const grandTotal = priceBreakdown?.grandTotal ?? 0;
  const vatAmount = priceBreakdown?.vatAmount ?? 0;
  const svcAmount = priceBreakdown?.serviceChargeAmount ?? 0;
  const baseTotal = priceBreakdown?.totalBase ?? (room?.pricePerNight ?? 0) * n;
  const balance = Math.max(0, grandTotal - (depositPaid ?? 0));

  const isDeposit = type === "deposit";
  const statusColor = isDeposit ? "#16a34a" : "#d97706";
  const statusLabel = isDeposit ? "BOOKING CONFIRMED" : "RESERVATION PENDING";
  const statusBg = isDeposit ? "#f0fdf4" : "#fffbeb";
  const statusBorder = isDeposit ? "#86efac" : "#fcd34d";

  return (
    <div
      id={id}
      style={{
        width: 794,
        background: "#ffffff",
        fontFamily: "sans-serif",
        padding: "40px 48px 48px",
        boxSizing: "border-box",
        position: "absolute",
        left: -9999,
        top: 0,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: "2px solid #f3f4f6",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
              fontFamily: "Georgia, serif",
            }}
          >
            DubanInternational
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#9ca3af",
              marginTop: 2,
              letterSpacing: "0.1em",
            }}
          >
            Ogba, Lagos State, Nigeria
          </div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>
            +234 810 378 5017 · reservations@dubanhotel.com
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              background: statusBg,
              border: `1px solid ${statusBorder}`,
              padding: "5px 14px",
              display: "inline-block",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: statusColor,
              }}
            >
              {statusLabel}
            </span>
          </div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>Booking Ref</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "#d97706",
              letterSpacing: "0.08em",
            }}
          >
            {ref_}
          </div>
          <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>
            Issued:{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* ── Two-column body ── */}
      <div style={{ display: "flex", gap: 32 }}>
        {/* ── LEFT ── */}
        <div style={{ flex: 1 }}>
          {/* Room card */}
          <Section title="Room Details" mt={0}>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              {images[0] && (
                <img
                  src={images[0]}
                  alt=""
                  crossOrigin="anonymous"
                  style={{
                    width: 90,
                    height: 60,
                    objectFit: "cover",
                    flexShrink: 0,
                    border: "1px solid #e5e7eb",
                  }}
                />
              )}
              <div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#d97706",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: 3,
                  }}
                >
                  {room?.category}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    fontFamily: "Georgia, serif",
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </div>
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                  {[
                    room?.view,
                    room?.size,
                    room?.bedType ? `${room.bedType} Bed` : null,
                    room?.bathrooms ? `${room.bathrooms} Bath` : null,
                  ]
                    .filter(Boolean)
                    .join("  ·  ")}
                </div>
              </div>
            </div>
          </Section>

          {/* Stay dates */}
          <Section title="Stay Details">
            <div style={{ display: "flex", gap: 0, marginBottom: 8 }}>
              {[
                { label: "CHECK-IN", date: form.checkIn, note: "from 14:00" },
                {
                  label: "CHECK-OUT",
                  date: form.checkOut,
                  note: "until 11:00",
                },
              ].map(({ label, date, note }, i) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    paddingRight: i === 0 ? 16 : 0,
                    borderRight: i === 0 ? "1px solid #f3f4f6" : "none",
                    paddingLeft: i === 1 ? 16 : 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      fontWeight: 700,
                      color: "#9ca3af",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
                  >
                    {fmtDate(date)}
                  </div>
                  <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>
                    {note}
                  </div>
                </div>
              ))}
              <div
                style={{
                  flex: 1,
                  paddingLeft: 16,
                  borderLeft: "1px solid #f3f4f6",
                }}
              >
                <div
                  style={{
                    fontSize: 8,
                    fontWeight: 700,
                    color: "#9ca3af",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  DURATION
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
                >
                  {n} Night{n !== 1 ? "s" : ""}
                </div>
                <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>
                  {form.rooms > 1 ? `${form.rooms} rooms` : "1 room"}
                </div>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <Row label="Guest Name" value={form.name} />
              <Row label="Phone" value={form.phone} />
              <Row label="Email" value={form.email} />
              <Row
                label="Guests"
                value={`${form.adults} Adult${+form.adults > 1 ? "s" : ""}${+form.children > 0 ? `, ${form.children} Child${+form.children > 1 ? "ren" : ""}` : ""}`}
              />
            </table>
          </Section>

          {/* Hold notice (reservation only) */}
          {!isDeposit && expiresAt && (
            <div
              style={{
                marginTop: 20,
                padding: "10px 14px",
                background: "#fffbeb",
                border: "1px solid #fcd34d",
                borderLeft: "3px solid #f59e0b",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#92400e",
                  letterSpacing: "0.12em",
                  marginBottom: 3,
                }}
              >
                ⏱ HOLD NOTICE
              </div>
              <div style={{ fontSize: 10, color: "#78350f", lineHeight: 1.5 }}>
                This room is held until{" "}
                <strong>{new Date(expiresAt).toLocaleString("en-GB")}</strong>.
                Payment must be confirmed to secure your booking.
              </div>
            </div>
          )}

          {/* Bank transfer (reservation only) */}
          {!isDeposit && (
            <Section title="Bank Transfer Details">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <Row label="Bank" value="First Bank of Nigeria" />
                <Row
                  label="Account Name"
                  value="DubanInternational Hotels & Resorts"
                />
                <Row label="Account Number" value="2012345678" />
                <Row label="Sort Code" value="011" />
                <Row label="SWIFT" value="FBNINGLA" />
              </table>
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 12px",
                  background: "#fef9c3",
                  fontSize: 9,
                  color: "#713f12",
                  lineHeight: 1.6,
                  border: "1px solid #fde68a",
                }}
              >
                <strong>Important:</strong> Include booking reference{" "}
                <strong>{ref_}</strong> in your transfer description. Send proof
                to <strong>reservations@dubanhotel.com</strong>
              </div>
            </Section>
          )}
        </div>

        {/* ── RIGHT ── */}
        <div style={{ width: 230, flexShrink: 0 }}>
          {/* Price summary */}
          <Section title="Price Summary" mt={0}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <Row
                label={`${fmtNG(room?.pricePerNight)} × ${n} night${n > 1 ? "s" : ""}${+form.rooms > 1 ? ` × ${form.rooms} rooms` : ""}`}
                value={fmtNG(baseTotal)}
              />
              {vatAmount > 0 && (
                <Row
                  label={`VAT (${((room?.taxRate ?? 0.075) * 100).toFixed(0)}%)`}
                  value={fmtNG(vatAmount)}
                />
              )}
              {svcAmount > 0 && (
                <Row label="Service Charge" value={fmtNG(svcAmount)} />
              )}
              <Row
                label="Total Stay"
                value={fmtNG(grandTotal)}
                bold
                borderTop
              />
            </table>

            {isDeposit && (
              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    padding: "10px 12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: "#15803d",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      marginBottom: 4,
                    }}
                  >
                    ✓ PAYMENT RECEIVED
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#4b5563" }}>
                      Deposit paid
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#16a34a",
                      }}
                    >
                      {fmtNG(depositPaid)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 6,
                      borderTop: "1px solid #bbf7d0",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#4b5563" }}>
                      Balance on arrival
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {fmtNG(balance)}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#9ca3af",
                    textAlign: "center",
                    marginTop: 5,
                  }}
                >
                  Via Paystack · Ref: {ref_}
                </div>
              </div>
            )}

            {!isDeposit && (
              <div
                style={{
                  marginTop: 12,
                  background: "#fffbeb",
                  border: "1px solid #fcd34d",
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "#92400e",
                    fontWeight: 700,
                    marginBottom: 3,
                  }}
                >
                  PAYMENT PENDING
                </div>
                <div
                  style={{ fontSize: 10, color: "#78350f", lineHeight: 1.5 }}
                >
                  Full amount of <strong>{fmtNG(grandTotal)}</strong> is due
                  before/on arrival.
                </div>
              </div>
            )}
          </Section>

          {/* Policies */}
          <Section title="Policies">
            {[
              { label: "Check-in", value: "From 14:00" },
              { label: "Check-out", value: "Until 11:00" },
              { label: "Cancellation", value: "Free — 24hrs before" },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px 0",
                  borderBottom: "1px solid #f3f4f6",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 10, color: "#9ca3af" }}>{label}</span>
                <span
                  style={{ fontSize: 10, fontWeight: 600, color: "#374151" }}
                >
                  {value}
                </span>
              </div>
            ))}
          </Section>

          {/* Contact */}
          <Section title="Need Help?">
            <div style={{ fontSize: 10, color: "#4b5563", lineHeight: 1.8 }}>
              <div>📞 +234 810 378 5017</div>
              <div>✉️ reservations@dubanhotel.com</div>
              <div>💬 WhatsApp us anytime</div>
            </div>
          </Section>

          {/* QR placeholder / decorative block */}
          <div
            style={{
              marginTop: 20,
              padding: "12px",
              background: "#111827",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.18em",
                marginBottom: 4,
              }}
            >
              BOOKING REFERENCE
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#d97706",
                letterSpacing: "0.08em",
              }}
            >
              {ref_}
            </div>
            <div
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.25)",
                marginTop: 4,
              }}
            >
              Present at reception on arrival
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          marginTop: 32,
          paddingTop: 16,
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 8, color: "#d1d5db", letterSpacing: "0.1em" }}>
          DUBAN INTERNATIONAL HOTEL · LAGOS, NIGERIA
        </div>
        <div style={{ fontSize: 8, color: "#d1d5db" }}>
          {isDeposit
            ? `Confirmation sent to ${form.email}`
            : `A copy sent to ${form.email}`}
        </div>
        <div style={{ fontSize: 8, color: "#d1d5db" }}>Ref: {ref_}</div>
      </div>
    </div>
  );
};

export default BookingPDFTemplate;
