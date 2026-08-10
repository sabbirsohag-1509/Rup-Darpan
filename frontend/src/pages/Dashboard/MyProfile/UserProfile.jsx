
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart3,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const UserProfile = () => {
  // =========================================
  // PROFILE
  // =========================================

  const {
    data: user,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  // =========================================
  // MY BOOKINGS
  // =========================================

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/bookings`, {
        withCredentials: true,
      });

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // =========================================
  // MY REVIEWS
  // =========================================

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/reviews/my`, {
        withCredentials: true,
      });

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // =========================================
  // QUICK STATS
  // =========================================

  const totalBookings = bookings.length;

  const totalReviews = reviews.length;

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed",
  ).length;

  // =========================================
  // MAIN LOADING
  // =========================================

  if (profileLoading) {
    return (
      <div className="space-y-5">
        {/* Profile Header Skeleton */}
        <section className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm">
          <div className="h-28 animate-pulse bg-base-300 sm:h-36" />

          <div className="-mt-12 px-5 pb-6 sm:-mt-14 sm:px-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="h-24 w-24 animate-pulse rounded-full border-4 border-base-100 bg-base-300 sm:h-28 sm:w-28" />

              <div className="w-full space-y-3">
                <div className="h-6 w-48 animate-pulse rounded bg-base-300" />
                <div className="h-4 w-64 animate-pulse rounded bg-base-300" />
                <div className="h-5 w-20 animate-pulse rounded-full bg-base-300" />
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information Skeleton */}
        <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
          <div className="mb-5 space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-base-300" />
            <div className="h-4 w-64 animate-pulse rounded bg-base-300" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-2xl bg-base-200"
              />
            ))}
          </div>

          <div className="mt-4 h-24 animate-pulse rounded-2xl bg-base-200" />
        </section>

        {/* Stats Skeleton */}
        <section className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-3xl bg-base-200"
            />
          ))}
        </section>
      </div>
    );
  }

  // =========================================
  // PROFILE ERROR
  // =========================================

  if (profileError) {
    return (
      <section className="rounded-3xl border border-error/20 bg-base-100 p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <User className="h-7 w-7 text-error" />
        </div>

        <h3 className="mt-4 font-playfair text-xl font-semibold">
          Failed to Load Profile
        </h3>

        <p className="mt-2 text-sm text-base-content/60">
          Something went wrong while loading your profile.
        </p>
      </section>
    );
  }

  // =========================================
  // PROFILE
  // =========================================

  return (
    <div className="space-y-5">
      {/* =========================================
          PROFILE HEADER
      ========================================== */}

      <section className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm">
        {/* Cover */}
        <div className="h-28 bg-primary/10 sm:h-36" />

        <div className="-mt-12 px-5 pb-6 sm:-mt-14 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            {/* Profile Info */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              {/* Profile Photo */}
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-md sm:h-28 sm:w-28">
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="text-center sm:pb-1 sm:text-left">
                <h2 className="font-playfair text-2xl font-semibold sm:text-3xl">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-base-content/55">
                  {user?.email || "No email available"}
                </p>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />

                    {user?.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              className="btn btn-primary w-full rounded-full sm:w-auto"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </section>

      {/* =========================================
          QUICK STATS
      ========================================== */}

      <section className="grid gap-4 sm:grid-cols-3">
        {/* Total Bookings */}
        <div className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-base-content/50">
                Total Bookings
              </p>

              <p className="mt-2 text-3xl font-bold">
                {bookingsLoading ? (
                  <span className="inline-block h-9 w-12 animate-pulse rounded bg-base-300" />
                ) : (
                  totalBookings
                )}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
          </div>

          <p className="mt-3 text-xs text-base-content/45">
            All your bookings
          </p>
        </div>

        {/* Total Reviews */}
        <div className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-base-content/50">
                Total Reviews
              </p>

              <p className="mt-2 text-3xl font-bold">
                {reviewsLoading ? (
                  <span className="inline-block h-9 w-12 animate-pulse rounded bg-base-300" />
                ) : (
                  totalReviews
                )}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
          </div>

          <p className="mt-3 text-xs text-base-content/45">
            Reviews you submitted
          </p>
        </div>

        {/* Completed Bookings */}
        <div className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-base-content/50">
                Completed
              </p>

              <p className="mt-2 text-3xl font-bold">
                {bookingsLoading ? (
                  <span className="inline-block h-9 w-12 animate-pulse rounded bg-base-300" />
                ) : (
                  completedBookings
                )}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <ShieldCheck className="h-6 w-6 text-success" />
            </div>
          </div>

          <p className="mt-3 text-xs text-base-content/45">
            Successfully completed
          </p>
        </div>
      </section>

      {/* =========================================
          PERSONAL INFORMATION
      ========================================== */}

      <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h3 className="font-playfair text-xl font-semibold">
            Personal Information
          </h3>

          <p className="mt-1 text-xs text-base-content/50">
            Your basic account information.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-base-content/45">Full Name</p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {user?.name || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-base-content/45">
                  Email Address
                </p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {user?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-base-content/45">Phone Number</p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {user?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-base-content/45">Address</p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {user?.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4 rounded-2xl border border-primary/10 bg-base-200 p-4">
          <p className="text-xs text-base-content/45">Bio</p>

          <p className="mt-2 text-sm leading-6 text-base-content/70">
            {user?.bio || "No bio added yet."}
          </p>
        </div>
      </section>

      {/* =========================================
          ACCOUNT INFORMATION
      ========================================== */}

      <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h3 className="font-playfair text-xl font-semibold">
            Account Information
          </h3>

          <p className="mt-1 text-xs text-base-content/50">
            Information about your account.
          </p>
        </div>

        <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs text-base-content/45">
                Account Created
              </p>

              <p className="mt-1 text-sm font-semibold">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          DATA ERROR NOTICE
      ========================================== */}

      {(bookingsError || reviewsError) && (
        <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning-content">
          Some profile statistics could not be loaded. Your main profile is
          still available.
        </div>
      )}
    </div>
  );
};

export default UserProfile;
