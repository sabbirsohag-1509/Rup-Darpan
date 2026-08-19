import {
  CalendarDays,
  DollarSign,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import StatCard from "../../components/dashboard/StatCard";
import SectionHeader from "../../components/dashboard/SectionHeader";
import BookingStatusBadge from "../../components/dashboard/BookingStatusBadge";

const API_URL = "http://localhost:5000";

// =====================================================
// HELPERS
// =====================================================

const getBookingPrice = (booking) => {
  const price =
    booking?.price ??
    booking?.packagePrice ??
    booking?.totalPrice ??
    booking?.amount ??
    booking?.totalAmount ??
    0;

  const numericPrice = Number(price);

  return Number.isFinite(numericPrice) ? numericPrice : 0;
};

const formatCurrency = (amount) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// BAR CHART
// =====================================================

const BarPlaceholder = ({
  title,
  description,
  bars,
  valueFormatter,
}) => {
  const maxValue = Math.max(
    ...bars.map((bar) => Number(bar.value) || 0),
    1,
  );

  return (
    <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
      <SectionHeader
        title={title}
        description={description}
      />

      <div className="grid grid-cols-6 items-end gap-3 rounded-2xl border border-primary/10 bg-base-200/40 p-4 sm:p-5">
        {bars.map((bar) => {
          const numericValue = Number(bar.value) || 0;

          const height =
            numericValue === 0
              ? 3
              : Math.max((numericValue / maxValue) * 100, 3);

          return (
            <div
              key={`${bar.month}-${bar.value}`}
              className="flex min-w-0 flex-col items-center gap-2"
            >
              <div className="group relative flex h-44 w-full items-end justify-center rounded-lg bg-base-100 p-1">
                <div
                  className="w-full rounded-md bg-primary/80 transition-all duration-500 group-hover:bg-primary"
                  style={{
                    height: `${height}%`,
                  }}
                />

                <span className="absolute -top-7 hidden rounded-md bg-base-content px-2 py-1 text-[10px] text-base-100 group-hover:block">
                  {valueFormatter
                    ? valueFormatter(numericValue)
                    : numericValue}
                </span>
              </div>

              <span className="text-xs font-semibold text-base-content/70">
                {bar.month}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// =====================================================
// DASHBOARD SKELETON
// =====================================================

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="h-32 animate-pulse rounded-2xl bg-base-200" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl bg-base-200"
          />
        ))}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-base-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-base-200" />
      </div>

      {/* Recent bookings */}
      <div className="h-80 animate-pulse rounded-2xl bg-base-200" />

      {/* Users + Reviews */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-2xl bg-base-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-base-200" />
      </div>
    </div>
  );
};

// =====================================================
// ERROR
// =====================================================

const DashboardError = ({ message }) => {
  return (
    <div className="rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
      <h2 className="text-xl font-semibold text-error">
        Failed to load dashboard
      </h2>

      <p className="mt-2 text-sm text-base-content/70">
        {message ||
          "Something went wrong while loading dashboard data."}
      </p>
    </div>
  );
};

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const AdminDashboard = () => {
  // ===================================================
  // REVIEW FRONTEND PAGINATION
  // ===================================================

  const [reviewPage, setReviewPage] = useState(1);

  const REVIEWS_PER_PAGE = 4;

  // ===================================================
  // USERS
  // ===================================================

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersQueryError,
  } = useQuery({
    queryKey: ["admin-dashboard-users"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/users`, {
        withCredentials: true,
        params: {
          page: 1,
          limit: 50,
        },
      });

      return response.data;
    },
  });

  // ===================================================
  // BOOKINGS
  // ===================================================

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
    error: bookingsQueryError,
  } = useQuery({
    queryKey: ["admin-dashboard-bookings"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/admin/bookings`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    },
  });

  // ===================================================
  // REVIEWS
  // ===================================================

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    isError: reviewsError,
    error: reviewsQueryError,
  } = useQuery({
    queryKey: ["admin-dashboard-reviews"],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/admin/reviews`,
        {
          withCredentials: true,
        },
      );

      return response.data;
    },
  });

  // ===================================================
  // NORMALIZE DATA
  // ===================================================

  const users = Array.isArray(usersData?.users)
    ? usersData.users
    : Array.isArray(usersData)
      ? usersData
      : [];

  const bookings = Array.isArray(bookingsData)
    ? bookingsData
    : Array.isArray(bookingsData?.bookings)
      ? bookingsData.bookings
      : [];

  const reviews = Array.isArray(reviewsData)
    ? reviewsData
    : Array.isArray(reviewsData?.reviews)
      ? reviewsData.reviews
      : [];

  // ===================================================
  // LOADING
  // ===================================================

  if (
    usersLoading ||
    bookingsLoading ||
    reviewsLoading
  ) {
    return <DashboardSkeleton />;
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (
    usersError ||
    bookingsError ||
    reviewsError
  ) {
    const errorMessage =
      usersQueryError?.response?.data?.message ||
      bookingsQueryError?.response?.data?.message ||
      reviewsQueryError?.response?.data?.message ||
      "Please try again.";

    return <DashboardError message={errorMessage} />;
  }

  // ===================================================
  // STATS
  // ===================================================

  const totalUsers = usersData?.total ?? users.length;

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      booking.status?.toLowerCase() === "pending",
  ).length;

  // ===================================================
  // TOTAL REVENUE
  // ===================================================

  const totalRevenue = bookings
    .filter((booking) => {
      const status = booking.status?.toLowerCase();

      return (
        status === "confirmed" ||
        status === "completed" ||
        status === "paid"
      );
    })
    .reduce((total, booking) => {
      return total + getBookingPrice(booking);
    }, 0);

  // ===================================================
  // CURRENT MONTH
  // ===================================================

  const currentDate = new Date();

  const currentYear = currentDate.getFullYear();

  const currentMonth = currentDate.getMonth();

  // ===================================================
  // THIS MONTH BOOKINGS
  // ===================================================

  const thisMonthBookings = bookings.filter(
    (booking) => {
      if (!booking.createdAt) return false;

      const date = new Date(booking.createdAt);

      return (
        date.getFullYear() === currentYear &&
        date.getMonth() === currentMonth
      );
    },
  ).length;

  // ===================================================
  // BOOKING ANALYTICS
  // ===================================================

  const bookingBars = Array.from(
    { length: 6 },
    (_, index) => {
      const monthIndex =
        currentMonth - (5 - index);

      const date = new Date(
        currentYear,
        monthIndex,
        1,
      );

      const month = date.toLocaleString(
        "en-US",
        {
          month: "short",
        },
      );

      const value = bookings.filter(
        (booking) => {
          if (!booking.createdAt) return false;

          const bookingDate = new Date(
            booking.createdAt,
          );

          return (
            bookingDate.getFullYear() ===
              date.getFullYear() &&
            bookingDate.getMonth() ===
              date.getMonth()
          );
        },
      ).length;

      return {
        month,
        value,
      };
    },
  );

  // ===================================================
  // REVENUE ANALYTICS
  // ===================================================

  const revenueBars = Array.from(
    { length: 6 },
    (_, index) => {
      const monthIndex =
        currentMonth - (5 - index);

      const date = new Date(
        currentYear,
        monthIndex,
        1,
      );

      const month = date.toLocaleString(
        "en-US",
        {
          month: "short",
        },
      );

      const value = bookings
        .filter((booking) => {
          if (!booking.createdAt) return false;

          const bookingDate = new Date(
            booking.createdAt,
          );

          const status =
            booking.status?.toLowerCase();

          const isRevenueBooking =
            status === "confirmed" ||
            status === "completed" ||
            status === "paid";

          return (
            isRevenueBooking &&
            bookingDate.getFullYear() ===
              date.getFullYear() &&
            bookingDate.getMonth() ===
              date.getMonth()
          );
        })
        .reduce((total, booking) => {
          return (
            total + getBookingPrice(booking)
          );
        }, 0);

      return {
        month,
        value,
      };
    },
  );

  // ===================================================
  // RECENT BOOKINGS
  // ===================================================

  const recentBookings = [...bookings]
    .sort((a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    })
    .slice(0, 5);

  // ===================================================
  // RECENT USERS
  // ===================================================

  const recentUsers = [...users]
    .sort((a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    })
    .slice(0, 5);

  // ===================================================
  // SORT ALL REVIEWS
  // ===================================================

  const sortedReviews = [...reviews].sort(
    (a, b) => {
      return (
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
      );
    },
  );

  // ===================================================
  // REVIEW PAGINATION
  // ===================================================

  const totalReviewPages = Math.ceil(
    sortedReviews.length / REVIEWS_PER_PAGE,
  );

  // Prevent invalid page
  const safeReviewPage =
    totalReviewPages > 0
      ? Math.min(
          reviewPage,
          totalReviewPages,
        )
      : 1;

  const reviewStartIndex =
    (safeReviewPage - 1) *
    REVIEWS_PER_PAGE;

  const paginatedReviews =
    sortedReviews.slice(
      reviewStartIndex,
      reviewStartIndex + REVIEWS_PER_PAGE,
    );

  // ===================================================
  // STAT CARDS
  // ===================================================

  const stats = [
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      description:
        thisMonthBookings > 0
          ? `${thisMonthBookings} bookings added this month`
          : "No bookings added this month",
      icon: Users,
    },

    {
      label: "Total Bookings",
      value: totalBookings.toLocaleString(),
      description:
        thisMonthBookings > 0
          ? `${thisMonthBookings} bookings added this month`
          : "No bookings added this month",
      icon: CalendarDays,
    },

    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description:
        "Revenue from confirmed/completed bookings",
      icon: DollarSign,
    },

    {
      label: "Pending Bookings",
      value: pendingBookings.toLocaleString(),
      description:
        pendingBookings > 0
          ? "Requires confirmation and follow-up"
          : "No pending bookings",
      icon: TrendingUp,
    },
  ];

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-8">
      {/* =================================================
          WELCOME
      ================================================= */}

      <section className="rounded-2xl border border-primary/15 bg-base-100 p-6 shadow-sm">
        <h2 className="font-playfair text-3xl font-semibold">
          Welcome back, Admin
        </h2>

        <p className="mt-2 text-sm text-base-content/75">
          Manage your Rup Darpon platform.
        </p>
      </section>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            {...stat}
          />
        ))}
      </section>

      {/* =================================================
          ANALYTICS
      ================================================= */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <BarPlaceholder
          title="Booking Analytics"
          description="Monthly booking overview."
          bars={bookingBars}
          valueFormatter={(value) =>
            `${value} bookings`
          }
        />

        <BarPlaceholder
          title="Revenue Analytics"
          description="Monthly confirmed revenue trend."
          bars={revenueBars}
          valueFormatter={(value) =>
            formatCurrency(value)
          }
        />
      </section>

      {/* =================================================
          RECENT BOOKINGS
      ================================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
        <SectionHeader
          title="Recent Bookings"
          description="Latest customer booking activity."
          actionLabel="View All Bookings"
          actionTo="/admin/bookings"
        />

        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="py-10 text-center text-sm text-base-content/60">
              No bookings found.
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr className="text-base-content/65">
                  <th>Customer</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.map(
                  (booking) => {
                    const customerName =
                      booking.name ||
                      booking.userName ||
                      booking.customerName ||
                      booking.customer ||
                      "Unknown Customer";

                    const packageName =
                      booking.packageName ||
                      booking.package ||
                      "Unknown Package";

                    const paymentStatus =
                      booking.paymentStatus ||
                      booking.payment ||
                      (booking.status?.toLowerCase() ===
                      "paid"
                        ? "Paid"
                        : "Unpaid");

                    return (
                      <tr
                        key={
                          booking._id ||
                          `${customerName}-${booking.createdAt}`
                        }
                      >
                        <td className="font-semibold">
                          {customerName}
                        </td>

                        <td>
                          {packageName}
                        </td>

                        <td>
                          {formatDate(
                            booking.createdAt,
                          )}
                        </td>

                        <td>
                          <BookingStatusBadge
                            status={
                              booking.status
                                ? booking.status
                                    .charAt(0)
                                    .toUpperCase() +
                                  booking.status.slice(
                                    1,
                                  )
                                : "Pending"
                            }
                          />
                        </td>

                        <td>
                          <BookingStatusBadge
                            status={
                              typeof paymentStatus ===
                              "string"
                                ? paymentStatus
                                    .charAt(0)
                                    .toUpperCase() +
                                  paymentStatus.slice(
                                    1,
                                  )
                                : "Unpaid"
                            }
                          />
                        </td>

                        <td>
                          <Link
                            to="/admin/bookings"
                            className="btn btn-ghost btn-xs hover:text-primary"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* =================================================
          USERS + REVIEWS
      ================================================= */}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* =================================================
            RECENT USERS
        ================================================= */}

        <div className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
          <SectionHeader
            title="Recent Users"
            description="Newly registered users."
            actionLabel="View All Users"
            actionTo="/admin/users"
          />

          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <div className="py-8 text-center text-sm text-base-content/60">
                No users found.
              </div>
            ) : (
              recentUsers.map((item) => (
                <article
                  key={
                    item._id || item.email
                  }
                  className="flex items-center gap-3 rounded-xl border border-primary/10 p-3"
                >
                  {/* Avatar */}
                  <div className="avatar">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary">
                      {item.profilePhoto ? (
                        <img
                          src={item.profilePhoto}
                          alt={
                            item.name ||
                            "User"
                          }
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-semibold">
                          {item.name
                            ?.charAt(0)
                            .toUpperCase() ||
                            "U"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {item.name ||
                        "Unknown User"}
                    </p>

                    <p className="truncate text-xs text-base-content/70">
                      {item.email}
                    </p>
                  </div>

                  {/* Role + Date */}
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-primary">
                      {item.role || "user"}
                    </p>

                    <p className="text-xs text-base-content/65">
                      {formatDate(
                        item.createdAt,
                      )}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        {/* =================================================
            RECENT REVIEWS
        ================================================= */}

        <div className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
          <SectionHeader
            title="Recent Reviews"
            description="Latest customer feedback."
            actionLabel="View All Reviews"
            actionTo="/admin/reviews"
          />

          {/* Reviews */}
          <div className="space-y-3">
            {sortedReviews.length === 0 ? (
              <div className="py-8 text-center text-sm text-base-content/60">
                No reviews found.
              </div>
            ) : (
              paginatedReviews.map(
                (item) => {
                  const rating =
                    Math.min(
                      Math.max(
                        Number(item.rating) ||
                          0,
                        0,
                      ),
                      5,
                    );

                  const customerName =
                    item.userName ||
                    item.customerName ||
                    item.customer ||
                    "Unknown Customer";

                  return (
                    <article
                      key={
                        item._id ||
                        `${customerName}-${item.createdAt}`
                      }
                      className="rounded-xl border border-primary/10 p-4"
                    >
                      {/* Customer + Date */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          {customerName}
                        </p>

                        <p className="text-xs text-base-content/65">
                          {formatDate(
                            item.createdAt,
                          )}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={16}
                                strokeWidth={1.8}
                                className={
                                  star <= rating
                                    ? "fill-primary text-primary"
                                    : "text-base-content/20"
                                }
                              />
                            ),
                          )}
                        </div>

                        <span className="ml-1 text-xs font-medium text-base-content/65">
                          {rating}/5
                        </span>
                      </div>

                      {/* Review */}
                      <p className="mt-2 text-sm text-base-content/75">
                        {item.comment ||
                          "No review text."}
                      </p>

                      {/* Status */}
                      <div className="mt-3">
                        <BookingStatusBadge
                          status={
                            item.status
                              ? item.status
                                  .charAt(0)
                                  .toUpperCase() +
                                item.status.slice(
                                  1,
                                )
                              : "Pending"
                          }
                        />
                      </div>
                    </article>
                  );
                },
              )
            )}
          </div>

          {/* =================================================
              FRONTEND REVIEW PAGINATION
          ================================================= */}

          {totalReviewPages > 1 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {/* Previous */}
              <button
                type="button"
                className="btn btn-sm btn-outline"
                disabled={safeReviewPage === 1}
                onClick={() =>
                  setReviewPage(
                    (prev) =>
                      Math.max(
                        prev - 1,
                        1,
                      ),
                  )
                }
              >
                Previous
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: totalReviewPages,
                  },
                  (_, index) => {
                    const page =
                      index + 1;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          setReviewPage(
                            page,
                          )
                        }
                        className={`btn btn-sm ${
                          safeReviewPage ===
                          page
                            ? "btn-primary"
                            : "btn-ghost"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Next */}
              <button
                type="button"
                className="btn btn-sm btn-outline"
                disabled={
                  safeReviewPage ===
                  totalReviewPages
                }
                onClick={() =>
                  setReviewPage(
                    (prev) =>
                      Math.min(
                        prev + 1,
                        totalReviewPages,
                      ),
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;