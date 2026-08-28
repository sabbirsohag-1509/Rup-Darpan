import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  Timer,
  XCircle,
  ShieldCheck,
  ReceiptText,
  LockKeyhole,
} from "lucide-react";
import PaymentBtn from "../../../pages/Payment/PaymentBtn";

const API_URL = "http://localhost:5000/bookings";

// ============================================================
// PAYMENT STATUS STYLE
// ============================================================

const getPaymentStyle = (paymentStatus, bookingStatus) => {
  const payment = paymentStatus?.toLowerCase();
  const booking = bookingStatus?.toLowerCase();

  // Advance paid
  if (payment === "paid") {
    return {
      label: "Advance Paid",
      icon: CheckCircle2,
      className: "border-success/20 bg-success/10 text-success",
    };
  }

  // Payment failed
  if (payment === "failed") {
    return {
      label: "Failed",
      icon: XCircle,
      className: "border-error/20 bg-error/10 text-error",
    };
  }

  // Confirmed but advance not paid
  if (booking === "confirmed") {
    return {
      label: "Unpaid",
      icon: Clock3,
      className: "border-warning/20 bg-warning/10 text-warning",
    };
  }

  // Pending booking
  return {
    label: "Locked",
    icon: LockKeyhole,
    className: "border-base-content/10 bg-base-100 text-base-content/50",
  };
};

// ============================================================
// BOOKING STATUS STYLE
// ============================================================

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return {
        label: "Confirmed",
        icon: CheckCircle2,
        className: "border-success/20 bg-success/10 text-success",
      };

    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "border-info/20 bg-info/10 text-info",
      };

    case "cancelled":
      return {
        label: "Cancelled",
        icon: XCircle,
        className: "border-error/20 bg-error/10 text-error",
      };

    default:
      return {
        label: "Pending",
        icon: Clock3,
        className: "border-warning/20 bg-warning/10 text-warning",
      };
  }
};

// ============================================================
// MY BOOKINGS
// ============================================================

const MyBookings = () => {
  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <div className="space-y-5">
        {/* Header Skeleton */}

        <section className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-base-300" />

            <div className="space-y-2">
              <div className="h-6 w-40 animate-pulse rounded bg-base-300" />

              <div className="h-3 w-64 animate-pulse rounded bg-base-300" />
            </div>
          </div>
        </section>

        {/* Booking Skeleton */}

        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-[700px] animate-pulse rounded-2xl bg-base-200"
            />
          ))}
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (isError) {
    return (
      <div className="space-y-5">
        {/* Header */}

        <section className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                My Bookings
              </h2>

              <p className="text-xs text-base-content/60 sm:text-sm">
                View and manage your photography bookings.
              </p>
            </div>
          </div>
        </section>

        {/* Error */}

        <section className="rounded-2xl border border-error/20 bg-base-100 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
            <AlertCircle className="h-7 w-7 text-error" />
          </div>

          <h3 className="mt-4 font-playfair text-xl font-semibold">
            Failed to Load Bookings
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
            Something went wrong while loading your bookings.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="btn btn-primary mt-5"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </section>
      </div>
    );
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <div className="space-y-5">
      <title>My Bookings | Rup Darpon</title>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                My Bookings
              </h2>

              <p className="text-xs text-base-content/60 sm:text-sm">
                View and manage your photography bookings.
              </p>
            </div>
          </div>

          {/* Total Bookings */}

          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-primary/10 bg-base-200 px-4 py-2.5">
              <p className="text-xs text-base-content/50">Total Bookings</p>

              <p className="text-lg font-bold text-primary">
                {bookings.length}
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              className="btn btn-square btn-outline border-primary/20"
              title="Refresh bookings"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {bookings.length === 0 ? (
        <section className="rounded-2xl border border-primary/10 bg-base-100 p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-8 w-8 text-primary" />
          </div>

          <h3 className="mt-4 font-playfair text-xl font-semibold">
            You Haven&apos;t Made Any Bookings
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
            Your photography bookings will appear here. Choose a package and let
            us capture your special moments.
          </p>

          <a href="/packages" className="btn btn-primary mt-5">
            <Camera className="h-4 w-4" />
            Explore Packages
          </a>
        </section>
      ) : (
        /* ======================================================
           BOOKING CARDS
        ====================================================== */

        <section className="grid gap-4 lg:grid-cols-2">
          {bookings.map((booking) => {
            const status = getStatusStyle(booking.status);
            const StatusIcon = status.icon;

            const payment = getPaymentStyle(
              booking.paymentStatus,
              booking.status,
            );

            const PaymentIcon = payment.icon;

            const bookingStatus = booking.status?.toLowerCase();

            const paymentStatus = booking.paymentStatus?.toLowerCase();

            // ==================================================
            // PACKAGE PRICE
            // ==================================================

            const packagePrice = Number(booking.packagePrice || 0);

            // ==================================================
            // 30% MINIMUM ADVANCE
            // ==================================================

            const minimumAdvance = Math.ceil(packagePrice * 0.3);

            // ==================================================
            // PAYMENT CONDITIONS
            // ==================================================

            const isConfirmed = bookingStatus === "confirmed";

            const isPaid = paymentStatus === "paid";

            const isFailed = paymentStatus === "failed";

            const canPay = isConfirmed && !isPaid;

            // ==================================================
            // PAID AMOUNT
            // ==================================================

            const paidAmount = Number(
              booking.paidAmount ?? (isPaid ? minimumAdvance : 0),
            );

            // ==================================================
            // REMAINING AMOUNT
            // ==================================================

            const remainingAmount = Math.max(packagePrice - paidAmount, 0);

            return (
              <article
                key={booking._id}
                className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md"
              >
                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div className="flex items-start justify-between gap-3">
                  {/* Package */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Camera className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] text-base-content/50">
                        Photography Package
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold">
                        {booking.packageName || "Photography Package"}
                      </p>
                    </div>
                  </div>

                  {/* Booking Status */}

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />

                    {status.label}
                  </span>
                </div>

                {/* =================================================
                    PACKAGE INFO
                ================================================= */}

                <div className="mt-5 rounded-xl bg-base-200 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] text-base-content/50">
                        Package Price
                      </p>

                      <p className="mt-0.5 text-lg font-bold text-primary">
                        ৳{packagePrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-base-content/50">Photos</p>

                      <p className="mt-0.5 text-sm font-semibold">
                        {booking.photoCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    PAYMENT INFORMATION
                ================================================= */}

                <div className="mt-4 rounded-xl border border-primary/10 bg-base-200 p-4">
                  {/* Payment Header */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isPaid
                            ? "bg-success/10 text-success"
                            : isFailed
                              ? "bg-error/10 text-error"
                              : isConfirmed
                                ? "bg-warning/10 text-warning"
                                : "bg-base-100 text-base-content/40"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-base-content/60">
                          Payment
                        </p>

                        <p className="mt-0.5 text-sm font-medium">
                          {isPaid
                            ? "Your 30% advance payment has been received"
                            : isFailed
                              ? "Your previous payment attempt was unsuccessful"
                              : isConfirmed
                                ? "30% advance payment is required"
                                : "Payment available after booking confirmation"}
                        </p>
                      </div>
                    </div>

                    {/* Payment Badge */}

                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${payment.className}`}
                    >
                      <PaymentIcon className="h-3.5 w-3.5" />

                      {payment.label}
                    </span>
                  </div>

                  {/* =================================================
                      PAYMENT AMOUNT DETAILS
                  ================================================= */}

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {/* Total */}

                    <div className="rounded-lg bg-base-100 px-3 py-2.5">
                      <p className="text-[10px] text-base-content/45">
                        Total Price
                      </p>

                      <p className="mt-0.5 text-sm font-bold">
                        ৳{packagePrice.toLocaleString()}
                      </p>
                    </div>

                    {/* Minimum Advance */}

                    <div className="rounded-lg bg-base-100 px-3 py-2.5">
                      <p className="text-[10px] text-base-content/45">
                        Minimum Advance (30%)
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-primary">
                        ৳{minimumAdvance.toLocaleString()}
                      </p>
                    </div>

                    {/* Remaining */}

                    <div className="rounded-lg bg-base-100 px-3 py-2.5">
                      <p className="text-[10px] text-base-content/45">
                        Remaining
                      </p>

                      <p className="mt-0.5 text-sm font-bold">
                        ৳{remainingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      IMPORTANT PAYMENT RULE
                  ================================================= */}

                  {!isPaid && isConfirmed && (
                    <div className="mt-3 rounded-lg border border-primary/10 bg-primary/5 px-3 py-3">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs font-semibold text-base-content/70">
                            Minimum advance payment required
                          </p>

                          <p className="mt-1 text-xs leading-5 text-base-content/55">
                            আপনার বুকিং ও নির্বাচিত তারিখটি সুনিশ্চিত করতে
                            আপনাকে অন্তত{" "}
                            <span className="font-bold text-primary">
                              ৳{minimumAdvance.toLocaleString()}
                            </span>{" "}
                            (প্যাকেজ মূল্যের ৩০%) অগ্রিম প্রদান করতে হবে।
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      PENDING BOOKING MESSAGE
                  ================================================= */}

                  {!isConfirmed && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-base-content/10 bg-base-100/70 px-3 py-3">
                      <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-base-content/40" />

                      <div>
                        <p className="text-xs font-semibold text-base-content/60">
                          Payment locked
                        </p>

                        <p className="mt-1 text-xs leading-5 text-base-content/50">
                          রূপ দর্পণ টিম আপনার বুকিংটি কনফার্ম করলেই পেমেন্ট
                          অপশনটি পেয়ে যাবেন। বুকিং কনফার্ম হলেই আপনাকে
                          নোটিফিকেশন দিয়ে জানানো হবে।
                        </p>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      PAY NOW / TRY AGAIN
                  ================================================= */}

                  {canPay && (
                    <div className="mt-3">
                      <PaymentBtn
                        bookingId={booking._id}
                        packagePrice={Number(booking.packagePrice || 0)}
                        minimumAdvance={Math.ceil(
                          Number(booking.packagePrice || 0) * 0.3,
                        )}
                        isFailed={isFailed}
                      />

                      <p className="mt-2 text-center text-[10px] text-base-content/40">
                        Secure payment via SSLCommerz
                      </p>
                    </div>
                  )}

                  {/* =================================================
                      ADVANCE PAID INFORMATION
                  ================================================= */}

                  {isPaid && (
                    <div className="mt-3 space-y-2">
                      {/* Paid Amount */}

                      <div className="flex items-center justify-between gap-3 rounded-lg bg-success/5 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />

                          <span className="text-xs text-base-content/60">
                            Advance Paid
                          </span>
                        </div>

                        <span className="text-sm font-bold text-success">
                          ৳{paidAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Remaining */}

                      {remainingAmount > 0 && (
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-base-100 px-3 py-2.5">
                          <span className="text-xs text-base-content/50">
                            Remaining Amount
                          </span>

                          <span className="text-sm font-bold">
                            ৳{remainingAmount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Transaction ID */}

                      {booking.transactionId && (
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-base-100 px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <ReceiptText className="h-4 w-4 text-base-content/40" />

                            <span className="text-xs text-base-content/50">
                              Transaction ID
                            </span>
                          </div>

                          <span className="max-w-[160px] truncate text-xs font-medium">
                            {booking.transactionId}
                          </span>
                        </div>
                      )}

                      {/* Payment Method */}

                      {booking.paymentMethod && (
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-base-100 px-3 py-2.5">
                          <span className="text-xs text-base-content/50">
                            Payment Method
                          </span>

                          <span className="text-xs font-medium">
                            {booking.paymentMethod}
                          </span>
                        </div>
                      )}

                      {/* Paid At */}

                      {booking.paidAt && (
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-base-100 px-3 py-2.5">
                          <span className="text-xs text-base-content/50">
                            Paid At
                          </span>

                          <span className="text-xs font-medium">
                            {new Date(booking.paidAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    EVENT INFORMATION
                ================================================= */}

                <div className="mt-4">
                  <p className="mb-3 text-xs font-semibold text-base-content/60">
                    Event Information
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {/* Event Date */}

                    <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
                      <CalendarDays className="h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-[11px] text-base-content/50">
                          Event Date
                        </p>

                        <p className="truncate text-sm font-medium">
                          {booking.eventDate || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Event Time */}

                    <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
                      <Clock3 className="h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-[11px] text-base-content/50">
                          Event Time
                        </p>

                        <p className="truncate text-sm font-medium">
                          {booking.eventTime || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Location */}

                    <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
                      <MapPin className="h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-[11px] text-base-content/50">
                          Event Location
                        </p>

                        <p className="truncate text-sm font-medium">
                          {booking.eventLocation || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}

                    <div className="flex items-center gap-3 rounded-xl bg-base-200 p-3">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-[11px] text-base-content/50">
                          Contact Number
                        </p>

                        <p className="truncate text-sm font-medium">
                          {booking.phone || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    NOTES
                ================================================= */}

                {booking.notes && (
                  <div className="mt-4 rounded-xl border border-primary/10 bg-base-200 p-3">
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-base-content/50">
                          Additional Requirements
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-base-content/70">
                          {booking.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-base-content/10 pt-4">
                  <div className="flex items-center gap-2 text-xs text-base-content/45">
                    <Timer className="h-3.5 w-3.5" />

                    <span>
                      {booking.packageDuration || "Duration not specified"}
                    </span>
                  </div>

                  <span className="text-xs text-base-content/40">
                    Booking #{booking._id?.slice(-6)}
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default MyBookings;
