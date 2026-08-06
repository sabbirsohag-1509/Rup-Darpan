import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Phone,
  RefreshCw,
  Sparkles,
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

  // -----------------------------
  // Loading State
  // -----------------------------
  if (isLoading) {
    return (
      <main className="min-h-screen bg-base-100">
        <section className="border-b border-primary/10 bg-base-200 px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <div className="h-4 w-32 animate-pulse rounded bg-base-300" />
            <div className="mt-4 h-10 w-64 animate-pulse rounded bg-base-300" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-base-300" />
          </div>
        </section>

        <section className="px-4 py-12">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-primary/10 bg-base-200"
              >
                <div className="h-32 animate-pulse bg-base-300" />

                <div className="space-y-4 p-6">
                  <div className="h-6 w-2/3 animate-pulse rounded bg-base-300" />
                  <div className="h-4 w-full animate-pulse rounded bg-base-300" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-base-300" />
                  <div className="h-10 w-full animate-pulse rounded bg-base-300" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // -----------------------------
  // Error State
  // -----------------------------
  if (isError) {
    return (
      <main className="min-h-screen bg-base-100">
        <section className="border-b border-primary/10 bg-base-200 px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              My Account
            </p>

            <h1 className="mt-2 font-playfair text-4xl font-semibold sm:text-5xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
              Keep track of your photography bookings and upcoming events.
            </p>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="mx-auto max-w-xl rounded-2xl border border-error/20 bg-base-200 p-8 text-center">
            <XCircle className="mx-auto h-12 w-12 text-error" />

            <h2 className="mt-4 font-playfair text-2xl font-semibold">
              Unable to Load Bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Something went wrong while loading your bookings. Please try
              again.
            </p>

            <button
              onClick={() => refetch()}
              className="btn btn-primary mt-6 text-primary-content"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  // -----------------------------
  // Status Helper
  // -----------------------------
  const getStatus = (status) => {
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
          icon: Timer,
          className: "border-warning/20 bg-warning/10 text-warning",
        };
    }
  };

  return (
    <main className="min-h-screen bg-base-100">
      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <section className="border-b border-primary/10 bg-base-200 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-4 w-4" />
                My Account
              </div>

              <h1 className="mt-3 font-playfair text-4xl font-semibold sm:text-5xl">
                My Bookings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
                View and manage your photography bookings, event details, and
                booking status in one place.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-base-100 px-4 py-3">
              <CalendarDays className="h-5 w-5 text-primary" />

              <div>
                <p className="text-xs text-base-content/50">Total Bookings</p>

                <p className="text-lg font-bold text-primary">
                  {bookings.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          BOOKINGS
      ========================================= */}

      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {bookings.length === 0 ? (
            <div className="rounded-2xl border border-primary/10 bg-base-200 px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Camera className="h-8 w-8 text-primary" />
              </div>

              <div className="text-center">
  <h2 className="mt-5 font-playfair text-2xl font-semibold sm:text-3xl">
    No Bookings Yet{" "}
    <span className="mt-1 block text-lg font-normal text-base-content/80 sm:text-xl">
      (এখনও কোনো বুকিং করা হয়নি)
    </span>
  </h2>

  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
    You haven't made any photography bookings yet. Choose a package and let us capture your special moments.
  </p>
  <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-base-content/50">
    আপনি এখনও কোনো বুকিং করেননি। রূপদর্পণ (RupDarpon)-এর একটি প্যাকেজ বেছে নিন এবং আপনার বিশেষ মুহূর্তগুলো ফ্রেমবন্দি করার সুযোগ দিন।
  </p>
</div>

              <a
                href="/packages"
                className="btn btn-primary mt-6 text-primary-content"
              >
                <Camera className="h-4 w-4" />
                Explore Packages
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {bookings.map((booking) => {
                const status = getStatus(booking.status);
                const StatusIcon = status.icon;

                return (
                  <article
                    key={booking._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-base-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                  >
                    {/* Card Header */}

                    <div className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-base-300 to-base-200 p-5">
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5 transition duration-500 group-hover:scale-125" />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Camera className="h-5 w-5 text-primary" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-widest text-base-content/45">
                              Photography Package
                            </p>

                            <h2 className="mt-1 truncate font-playfair text-xl font-semibold">
                              {booking.packageName || "Photography Package"}
                            </h2>
                          </div>
                        </div>

                        <span
                          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Price */}

                    <div className="flex items-center justify-between border-b border-base-content/10 px-5 py-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-base-content/45">
                          Package Price
                        </p>

                        <p className="mt-1 text-2xl font-bold text-primary">
                          ৳{Number(booking.packagePrice || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-base-content/45">Photos</p>

                        <p className="mt-1 text-sm font-semibold">
                          {booking.photoCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Event Information */}

                    <div className="flex-1 space-y-3 p-5">
                      <p className="mb-4 text-sm font-semibold">
                        Event Information
                      </p>

                      <div className="flex items-center gap-3 rounded-xl bg-base-100 p-3">
                        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs text-base-content/45">
                            Event Date
                          </p>

                          <p className="text-sm font-medium">
                            {booking.eventDate || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-base-100 p-3">
                        <Clock3 className="h-4 w-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs text-base-content/45">
                            Event Time
                          </p>

                          <p className="text-sm font-medium">
                            {booking.eventTime || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-base-100 p-3">
                        <MapPin className="h-4 w-4 shrink-0 text-primary" />

                        <div className="min-w-0">
                          <p className="text-xs text-base-content/45">
                            Event Location
                          </p>

                          <p className="truncate text-sm font-medium">
                            {booking.eventLocation || "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-base-100 p-3">
                        <Phone className="h-4 w-4 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs text-base-content/45">
                            Contact Number
                          </p>

                          <p className="text-sm font-medium">
                            {booking.phone || "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}

                    <div className="border-t border-base-content/10 p-5">
                      {booking.notes && (
                        <div className="mb-4 rounded-xl border border-primary/10 bg-base-100 p-3">
                          <div className="flex items-start gap-2">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-base-content/50">
                                Additional Requirements
                              </p>

                              <p className="mt-1 line-clamp-2 text-sm leading-5 text-base-content/70">
                                {booking.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-3">
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
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          BOTTOM CTA
      ========================================= */}

      <section className="border-t border-primary/10 bg-base-200 px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>

          <div className="text-center">
            <h2 className="mt-4 font-playfair text-3xl font-semibold sm:text-4xl">
              Looking for Another Package?{" "}
              <span className="mt-1 block text-xl font-normal text-base-content/80 sm:text-2xl">
                (অন্য কোনো প্যাকেজ খুঁজছেন?)
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60">
              Explore our photography packages and find the perfect option for
              your next special moment.
            </p>
            <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-base-content/50 sm:text-sm">
              আমাদের অন্যান্য ফটোগ্রাফি প্যাকেজগুলো ঘুরে দেখুন এবং আপনার বিশেষ
              মুহূর্তের জন্য পারফেক্ট অপশনটি বেছে নিন।
            </p>
          </div>

          <a
            href="/packages"
            className="btn btn-primary mt-6 text-primary-content"
          >
            Explore Packages
            <Camera className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
};

export default MyBookings;
