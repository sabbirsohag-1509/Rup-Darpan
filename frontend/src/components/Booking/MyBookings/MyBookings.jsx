import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  Timer,
  XCircle,
} from "lucide-react";

const API_URL = "http://localhost:5000/bookings";

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

  // =========================================
  // STATUS STYLE
  // =========================================

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

  // =========================================
  // LOADING
  // =========================================

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
              className="h-80 animate-pulse rounded-2xl bg-base-200"
            />
          ))}
        </div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

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

  return (
    <div className="space-y-5">
      <title>My Bookings | Rup Darpon</title>
      {/* =========================================
          HEADER
      ========================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left Content */}

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
              <p className="text-xs text-base-content/50">
                Total Bookings
              </p>

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

      {/* =========================================
          EMPTY STATE
      ========================================= */}

      {bookings.length === 0 ? (
        <section className="rounded-2xl border border-primary/10 bg-base-100 p-10 text-center shadow-sm sm:p-14">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-8 w-8 text-primary" />
          </div>

          <h3 className="mt-4 font-playfair text-xl font-semibold">
            You Haven&apos;t Made Any Bookings
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
            Your photography bookings will appear here. Choose a package
            and let us capture your special moments.
          </p>

          <a
            href="/packages"
            className="btn btn-primary mt-5"
          >
            <Camera className="h-4 w-4" />
            Explore Packages
          </a>
        </section>
      ) : (
        /* =========================================
            BOOKING CARDS
        ========================================= */

        <section className="grid gap-4 lg:grid-cols-2">
          {bookings.map((booking) => {
            const status = getStatusStyle(booking.status);
            const StatusIcon = status.icon;

            return (
              <article
                key={booking._id}
                className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md"
              >
                {/* =========================================
                    CARD HEADER
                ========================================= */}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Package Icon */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Camera className="h-5 w-5" />
                    </div>

                    {/* Package Name */}

                    <div className="min-w-0">
                      <p className="text-[11px] text-base-content/50">
                        Photography Package
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold">
                        {booking.packageName || "Photography Package"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />

                    {status.label}
                  </span>
                </div>

                {/* =========================================
                    PACKAGE INFO
                ========================================= */}

                <div className="mt-5 rounded-xl bg-base-200 p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] text-base-content/50">
                        Package Price
                      </p>

                      <p className="mt-0.5 text-lg font-bold text-primary">
                        ৳
                        {Number(
                          booking.packagePrice || 0,
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] text-base-content/50">
                        Photos
                      </p>

                      <p className="mt-0.5 text-sm font-semibold">
                        {booking.photoCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =========================================
                    EVENT INFORMATION
                ========================================= */}

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

                {/* =========================================
                    NOTES
                ========================================= */}

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

                {/* =========================================
                    FOOTER
                ========================================= */}

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-base-content/10 pt-4">
                  <div className="flex items-center gap-2 text-xs text-base-content/45">
                    <Timer className="h-3.5 w-3.5" />

                    <span>
                      {booking.packageDuration ||
                        "Duration not specified"}
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