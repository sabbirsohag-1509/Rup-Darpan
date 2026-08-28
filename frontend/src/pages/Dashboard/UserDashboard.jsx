import {
  CalendarDays,
  Camera,
  MapPin,
  MessageSquareText,
  Star,
  Clock3,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import StatCard from "../../components/dashboard/StatCard";
import SectionHeader from "../../components/dashboard/SectionHeader";
import BookingStatusBadge from "../../components/dashboard/BookingStatusBadge";
import EmptyState from "../../components/dashboard/EmptyState";
import QuickActionCard from "../../components/dashboard/QuickActionCard";

// ======================================================
// AXIOS
// ======================================================

const api = axios.create({
  baseURL: "https://rup-darpan-backend.vercel.app",
  withCredentials: true,
});

// ======================================================
// API FUNCTIONS
// ======================================================

// Current logged-in user
const fetchCurrentUser = async () => {
  const { data } = await api.get("/me");

  // Backend:
  // {
  //   user: {...}
  // }

  return data?.user ?? null;
};

// Logged-in user's bookings
const fetchMyBookings = async () => {
  const { data } = await api.get("/bookings");

  // Backend currently returns:
  // [
  //   {...},
  //   {...}
  // ]

  // Safe handling if backend later returns { bookings: [] }
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.bookings)) {
    return data.bookings;
  }

  return [];
};

// Logged-in user's reviews
const fetchMyReviews = async () => {
  const { data } = await api.get("/reviews/my");

  // Backend currently returns an array

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.reviews)) {
    return data.reviews;
  }

  return [];
};

// ======================================================
// HELPERS
// ======================================================

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";

  return String(time);
};

const getBookingDate = (booking) => {
  return (
    booking?.date ||
    booking?.bookingDate ||
    booking?.sessionDate ||
    booking?.eventDate
  );
};

const getBookingPackageName = (booking) => {
  return (
    booking?.packageName ||
    booking?.package ||
    booking?.serviceName ||
    "Photography Session"
  );
};

const getBookingPayment = (booking) => {
  return booking?.paymentStatus || booking?.payment || "Unpaid";
};

const getBookingId = (booking) => {
  if (booking?.bookingId) {
    return booking.bookingId;
  }

  if (booking?._id) {
    return `RD-${String(booking._id).slice(-6).toUpperCase()}`;
  }

  return "N/A";
};

const getStatus = (booking) => {
  return booking?.status?.toLowerCase() || "";
};

// ======================================================
// COMPONENT
// ======================================================

const UserDashboard = () => {
  // ====================================================
  // CURRENT USER
  // ====================================================

  const {
    data: user = null,
    isLoading: userLoading,
    isError: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    retry: 1,
  });

  // ====================================================
  // BOOKINGS
  // ====================================================

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
    retry: 1,
  });

  // ====================================================
  // REVIEWS
  // ====================================================

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["myReviews"],
    queryFn: fetchMyReviews,
    retry: 1,
  });

  // ====================================================
  // SAFE ARRAYS
  // ====================================================

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  // ====================================================
  // LOADING
  // ====================================================

  const isLoading = userLoading || bookingsLoading || reviewsLoading;

  // ====================================================
  // REFRESH
  // ====================================================

  const handleRefresh = () => {
    refetchUser();
    refetchBookings();
    refetchReviews();
  };

  // ====================================================
  // LOADING UI
  // ====================================================

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-2xl" />

            <div className="space-y-3">
              <div className="skeleton h-7 w-64" />
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-4 w-80" />
            </div>
          </div>
        </section>

        {/* Stats Skeleton */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-primary/10 bg-base-100 p-6"
            >
              <div className="skeleton h-10 w-10 rounded-xl" />

              <div className="mt-5 skeleton h-8 w-16" />

              <div className="mt-3 skeleton h-4 w-32" />

              <div className="mt-2 skeleton h-3 w-full" />
            </div>
          ))}
        </section>

        {/* Content Skeleton */}
        <section className="rounded-2xl border border-primary/10 bg-base-100 p-6">
          <div className="skeleton h-6 w-48" />
          <div className="mt-5 skeleton h-32 w-full rounded-2xl" />
        </section>

        <section className="rounded-2xl border border-primary/10 bg-base-100 p-6">
          <div className="skeleton h-6 w-48" />
          <div className="mt-5 skeleton h-32 w-full rounded-2xl" />
        </section>
      </div>
    );
  }

  // ====================================================
  // ERROR UI
  // ====================================================

  if (userError || bookingsError || reviewsError) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-xl font-semibold">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm leading-6 text-base-content/65">
            We couldn't load your dashboard information. Please check your
            connection and try again.
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-primary mt-5"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // DERIVED DATA
  // ====================================================

  const totalBookings = safeBookings.length;

  // Upcoming = pending/confirmed + future date
  const upcomingBookings = safeBookings
    .filter((booking) => {
      const status = getStatus(booking);

      const bookingDate = getBookingDate(booking);

      if (!bookingDate) {
        return status === "pending" || status === "confirmed";
      }

      const date = new Date(bookingDate);

      if (Number.isNaN(date.getTime())) {
        return status === "pending" || status === "confirmed";
      }

      return (
        (status === "pending" || status === "confirmed") && date >= new Date()
      );
    })
    .sort((a, b) => {
      const dateA = new Date(getBookingDate(a) || 0);
      const dateB = new Date(getBookingDate(b) || 0);

      return dateA - dateB;
    });

  const completedBookings = safeBookings.filter(
    (booking) => getStatus(booking) === "completed",
  );

  const upcomingBooking = upcomingBookings[0] || null;

  const recentBookings = [...safeBookings]
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0);
      const dateB = new Date(b?.createdAt || 0);

      return dateB - dateA;
    })
    .slice(0, 5);

  const recentReviews = [...safeReviews]
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0);
      const dateB = new Date(b?.createdAt || 0);

      return dateB - dateA;
    })
    .slice(0, 3);

  // ====================================================
  // STATS
  // ====================================================

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
      description: "Total sessions booked across all packages.",
      icon: CalendarDays,
    },
    {
      label: "Upcoming Sessions",
      value: upcomingBookings.length,
      description: "Sessions scheduled for your upcoming dates.",
      icon: Clock3,
    },
    {
      label: "Completed Sessions",
      value: completedBookings.length,
      description: "Successfully completed photography sessions.",
      icon: Camera,
    },
    {
      label: "Reviews Given",
      value: safeReviews.length,
      description: "Reviews you have submitted for your sessions.",
      icon: MessageSquareText,
    },
  ];

  // ====================================================
  // QUICK ACTIONS
  // ====================================================

  const quickActions = [
    {
      to: "/packages",
      title: "Book a Session",
      description: "Choose your next photography package.",
      icon: CalendarDays,
    },
    {
      to: "/gallery",
      title: "Browse Gallery",
      description: "Explore recent visual storytelling work.",
      icon: Camera,
    },
    {
      to: "/dashboard/bookings",
      title: "My Bookings",
      description: "Review all upcoming and past sessions.",
      icon: Clock3,
    },
    {
      to: "/dashboard/reviews",
      title: "My Reviews",
      description: "Manage your submitted feedback.",
      icon: Star,
    },
    {
      to: "/dashboard/profile",
      title: "Edit Profile",
      description: "Keep your account details up to date.",
      icon: MessageSquareText,
    },
  ];

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <div className="space-y-8">
      {/* =================================================
          PROFILE HEADER
      ================================================= */}

      <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="avatar">
              <div className="h-16 w-16 overflow-hidden rounded-2xl ring-1 ring-primary/30 ring-offset-2 ring-offset-base-100">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-semibold text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div>
              <p className="text-sm font-medium text-primary">Welcome back</p>

              <h2 className="font-playfair text-3xl font-semibold">
                {user?.name || "User"}
              </h2>

              <p className="mt-1 text-sm text-base-content/65">
                {user?.email || ""}
              </p>

              <p className="mt-2 max-w-xl text-sm text-base-content/70">
                Manage your bookings, reviews and photography experience from
                your dashboard.
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/profile"
            className="btn btn-outline btn-sm border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-content"
          >
            Edit Profile
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Overview</h2>

            <p className="text-sm text-base-content/60">
              A quick look at your photography activity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-ghost btn-sm"
            title="Refresh dashboard"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* =================================================
          UPCOMING BOOKING
      ================================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader
          title="Upcoming Booking"
          description="Your nearest scheduled photography session."
        />

        {upcomingBooking ? (
          <div className="mt-5 rounded-2xl border border-primary/15 bg-base-200/40 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-success" />

                  <span className="text-xs font-semibold uppercase tracking-wider text-success">
                    Next Session
                  </span>
                </div>

                <h3 className="mt-2 text-xl font-semibold">
                  {getBookingPackageName(upcomingBooking)}
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <p className="flex items-center gap-2 text-sm text-base-content/75">
                    <CalendarDays className="h-4 w-4 text-primary" />

                    {formatDate(getBookingDate(upcomingBooking))}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-base-content/75">
                    <Clock3 className="h-4 w-4 text-primary" />

                    {formatTime(
                      upcomingBooking?.time || upcomingBooking?.bookingTime,
                    )}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-base-content/75 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-primary" />

                    {upcomingBooking?.location || "Location not specified"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <BookingStatusBadge status={upcomingBooking?.status} />

                <BookingStatusBadge
                  status={getBookingPayment(upcomingBooking)}
                />
              </div>
            </div>

            <div className="mt-5">
              <Link
                to="/dashboard/bookings"
                className="btn btn-primary btn-sm text-primary-content"
              >
                View Booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={CalendarDays}
              title="No upcoming bookings"
              description="Explore our photography packages and book your next session."
              actionText="Explore Packages"
              actionTo="/packages"
            />
          </div>
        )}
      </section>

      {/* =================================================
          RECENT BOOKINGS
      ================================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            title="Recent Bookings"
            description="Your latest booking activity."
          />

          <Link
            to="/dashboard/bookings"
            className="group flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <>
            {/* Desktop */}
            <div className="mt-5 hidden overflow-x-auto md:block">
              <table className="table">
                <thead>
                  <tr className="text-base-content/55">
                    <th>Booking</th>
                    <th>Package</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking?._id}>
                      <td>
                        <span className="font-semibold">
                          {getBookingId(booking)}
                        </span>
                      </td>

                      <td>{getBookingPackageName(booking)}</td>

                      <td>{formatDate(getBookingDate(booking))}</td>

                      <td>
                        <BookingStatusBadge status={booking?.status} />
                      </td>

                      <td>
                        <BookingStatusBadge
                          status={getBookingPayment(booking)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="mt-5 space-y-3 md:hidden">
              {recentBookings.map((booking) => (
                <div
                  key={booking?._id}
                  className="rounded-xl border border-primary/10 bg-base-100 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {getBookingId(booking)}
                    </p>

                    <BookingStatusBadge status={booking?.status} />
                  </div>

                  <p className="mt-2 font-medium">
                    {getBookingPackageName(booking)}
                  </p>

                  <p className="mt-1 text-xs text-base-content/60">
                    {formatDate(getBookingDate(booking))}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <BookingStatusBadge status={getBookingPayment(booking)} />

                    <Link
                      to="/dashboard/bookings"
                      className="text-sm font-semibold text-primary"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={CalendarDays}
              title="No bookings yet"
              description="Your booking history will appear here once you book a session."
              actionText="Browse Packages"
              actionTo="/packages"
            />
          </div>
        )}
      </section>

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader
          title="Quick Actions"
          description="Go directly to the sections you use most."
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </section>

      {/* =================================================
          RECENT REVIEWS
      ================================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            title="Recent Reviews"
            description="Your latest submitted feedback."
          />

          <Link
            to="/dashboard/reviews"
            className="group flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {recentReviews.length > 0 ? (
          <div className="mt-5 space-y-3">
            {recentReviews.map((review) => (
              <article
                key={review?._id}
                className="rounded-xl border border-primary/10 bg-base-100 p-4 transition hover:border-primary/20 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold">
                      {review?.packageName || "Photography Session"}
                    </h3>

                    <p className="mt-1 text-xs text-base-content/55">
                      {formatDate(review?.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({
                      length: Math.min(
                        Math.max(Number(review?.rating) || 0, 0),
                        5,
                      ),
                    }).map((_, index) => (
                      <Star key={index} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-base-content/70">
                  {review?.comment || "No review comment."}
                </p>

                <div className="mt-3">
                  {review?.status === "approved" && (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />

                      <span className="text-xs font-medium text-success">
                        Approved
                      </span>
                    </div>
                  )}

                  {review?.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-warning" />

                      <span className="text-xs font-medium text-warning">
                        Pending approval
                      </span>
                    </div>
                  )}

                  {review?.status === "rejected" && (
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-error" />

                      <span className="text-xs font-medium text-error">
                        Rejected
                      </span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={MessageSquareText}
              title="No reviews yet"
              description="You have not submitted any reviews yet."
            />
          </div>
        )}
      </section>
      {/* =================================================
    SECURITY
================================================= */}

      <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h3 className="font-playfair text-xl font-semibold">Security</h3>

          <p className="mt-1 text-xs text-base-content/50">
            Manage your password and review recent account activity.
          </p>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
