import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MapPin,
  Package,
  Phone,
  User,
  XCircle,
  Banknote,
  RefreshCw,
  AlertCircle,
  FileText,
  X,
  Trash2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "http://localhost:5000";

const AdminBookingManagement = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteBookingId, setDeleteBookingId] = useState(null);

  const {
    data: bookings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/admin/bookings`, {
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
  // CONFIRM BOOKING
  // =========================================

  const handleConfirm = async (bookingId) => {
    try {
      await axios.patch(
        `${API_URL}/admin/bookings/${bookingId}/confirm`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Booking confirmed successfully!");

      await refetch();

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((prev) => ({
          ...prev,
          status: "confirmed",
        }));
      }
    } catch (error) {
      console.error("Failed to confirm booking:", error);

      toast.error(
        error?.response?.data?.message || "Failed to confirm booking.",
      );
    }
  };

  // =========================================
  // CANCEL BOOKING
  // =========================================

  const handleCancel = async (bookingId) => {
    try {
      await axios.patch(
        `${API_URL}/admin/bookings/${bookingId}/cancel`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Booking cancelled successfully!");

      await refetch();

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((prev) => ({
          ...prev,
          status: "cancelled",
        }));
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);

      toast.error(
        error?.response?.data?.message || "Failed to cancel booking.",
      );
    }
  };

  // =========================================
  // DELETE BOOKING
  // =========================================

  const handleDelete = async (bookingId) => {
    try {
      await axios.delete(`${API_URL}/admin/bookings/${bookingId}`, {
        withCredentials: true,
      });

      toast.success("Booking deleted permanently!");

      // Close delete confirmation modal
      setDeleteBookingId(null);

      // Close booking details modal if same booking is open
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking(null);
      }

      await refetch();
    } catch (error) {
      console.error("Failed to delete booking:", error);

      toast.error(
        error?.response?.data?.message || "Failed to delete booking.",
      );
    }
  };

  // =========================================
  // OPEN DETAILS MODAL
  // =========================================

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
  };

  // =========================================
  // CLOSE MODAL
  // =========================================

  const handleCloseModal = () => {
    setSelectedBooking(null);
  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />

        <div className="space-y-5">
          {/* Header Skeleton */}

          <section className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="h-7 w-56 animate-pulse rounded bg-base-300" />

                <div className="h-4 w-80 max-w-full animate-pulse rounded bg-base-300" />
              </div>

              <div className="h-14 w-36 animate-pulse rounded-xl bg-base-300" />
            </div>
          </section>

          {/* Table Skeleton */}

          <section className="overflow-hidden rounded-2xl border border-primary/10 bg-base-100 shadow-sm">
            <div className="h-12 animate-pulse bg-base-200" />

            <div className="space-y-3 p-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-base-200"
                />
              ))}
            </div>
          </section>
        </div>
      </>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (isError) {
    return (
      <>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
          }}
        />

        <div className="space-y-5">
          <section className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <h2 className="font-playfair text-2xl font-semibold">
              Booking Management
            </h2>

            <p className="mt-1 text-sm text-base-content/60">
              Manage customer bookings and booking status.
            </p>
          </section>

          <section className="rounded-2xl border border-error/20 bg-base-100 p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
              <AlertCircle className="h-7 w-7 text-error" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              Failed to Load Bookings
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
              Something went wrong while loading customer bookings.
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
      </>
    );
  }

  return (
    <>
      <title>Admin Booking Management | Rup Darpon</title>
      {/* =========================================
          TOASTER
      ========================================= */}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />

      <div className="space-y-5">
        {/* =========================================
            HEADER
        ========================================= */}

        <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                    Booking Management
                  </h2>

                  <p className="text-xs text-base-content/60 sm:text-sm">
                    Manage customer bookings and event schedules.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Total */}

              <div className="rounded-xl border border-primary/10 bg-base-200 px-4 py-2.5">
                <p className="text-xs text-base-content/50">Total Bookings</p>

                <p className="text-lg font-bold text-primary">
                  {bookings.length}
                </p>
              </div>

              {/* Refresh */}

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
          <section className="rounded-2xl border border-primary/10 bg-base-100 p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <CalendarDays className="h-7 w-7 text-primary" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              No Bookings Found
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              There are currently no customer bookings.
            </p>
          </section>
        ) : (
          /* =========================================
              RESPONSIVE TABLE
          ========================================= */

          <section className="overflow-hidden rounded-2xl border border-primary/10 bg-base-100 shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[1050px]">
                {/* =================================
                    TABLE HEADER
                ================================= */}

                <div className="grid grid-cols-[1.6fr_1.3fr_1.2fr_1.2fr_1fr_1.2fr] items-center gap-4 border-b border-base-content/10 bg-base-200 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Customer
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Package
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Event
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Location
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Status
                  </p>

                  <p className="text-right text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Actions
                  </p>
                </div>

                {/* =================================
                    BOOKINGS
                ================================= */}

                <div className="divide-y divide-base-content/10">
                  {bookings.map((booking) => {
                    const status = getStatusStyle(booking.status);
                    const StatusIcon = status.icon;

                    const isCancelled =
                      booking.status?.toLowerCase() === "cancelled";

                    return (
                      <div
                        key={booking._id}
                        className="group px-5 py-4 transition hover:bg-base-200/50"
                      >
                        <div className="grid grid-cols-[1.6fr_1.3fr_1.2fr_1.2fr_1fr_1.2fr] items-center gap-4">
                          {/* =================================
                              CUSTOMER
                          ================================= */}

                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-4 w-4 text-primary" />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {booking.userName || "Unknown User"}
                                </p>

                                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-base-content/50">
                                  <Mail className="h-3 w-3 shrink-0" />

                                  {booking.userEmail || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* =================================
                              PACKAGE
                          ================================= */}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 shrink-0 text-primary" />

                              <p className="truncate text-sm font-medium">
                                {booking.packageName || "Photography Package"}
                              </p>
                            </div>

                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary">
                              <Banknote className="h-3 w-3" />৳
                              {Number(
                                booking.packagePrice || 0,
                              ).toLocaleString()}
                            </p>
                          </div>

                          {/* =================================
                              EVENT
                          ================================= */}

                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-sm font-medium">
                              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />

                              {booking.eventDate || "N/A"}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-base-content/50">
                              <Clock3 className="h-3.5 w-3.5 shrink-0" />

                              {booking.eventTime || "N/A"}
                            </p>
                          </div>

                          {/* =================================
                              LOCATION
                          ================================= */}

                          <div className="min-w-0">
                            <p className="flex items-start gap-1.5 text-sm">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />

                              <span className="truncate">
                                {booking.eventLocation || "N/A"}
                              </span>
                            </p>
                          </div>

                          {/* =================================
                              STATUS
                          ================================= */}

                          <div>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />

                              {status.label}
                            </span>
                          </div>

                          {/* =================================
                              ACTIONS

                              ALWAYS:
                              Confirm + Cancel + View

                              ONLY CANCELLED:
                              + Delete
                          ================================= */}

                          <div className="flex justify-end gap-1.5">
                            {/* Confirm - ALWAYS */}

                            <button
                              type="button"
                              onClick={() => handleConfirm(booking._id)}
                              className="btn btn-square btn-ghost btn-sm text-success hover:bg-success/10"
                              title="Confirm booking"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            {/* Cancel - ALWAYS */}

                            <button
                              type="button"
                              onClick={() => handleCancel(booking._id)}
                              className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                              title="Cancel booking"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>

                            {/* View - ALWAYS */}

                            <button
                              type="button"
                              onClick={() => handleViewBooking(booking)}
                              className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                              title="View booking details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Delete - ONLY CANCELLED */}

                            {isCancelled && (
                              <button
                                type="button"
                                onClick={() => setDeleteBookingId(booking._id)}
                                className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                                title="Permanently delete booking"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile scroll hint */}

            <div className="border-t border-base-content/10 bg-base-200/50 px-4 py-2 text-center text-[11px] text-base-content/40 sm:hidden">
              ← Swipe horizontally to view all booking details →
            </div>
          </section>
        )}
      </div>

      {/* =========================================
          BOOKING DETAILS MODAL
      ========================================= */}

      {selectedBooking && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary/20 bg-base-100/95 shadow-2xl backdrop-blur-xl sm:max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* =================================
                MODAL HEADER
            ================================= */}

            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-base-content/10 bg-base-100/95 px-4 py-3 backdrop-blur-xl sm:px-5 sm:py-4">
              <div className="min-w-0">
                <h3 className="font-playfair text-lg font-semibold sm:text-xl">
                  Booking Details
                </h3>

                <p className="mt-0.5 truncate text-xs text-base-content/50">
                  Complete information about this booking
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="btn btn-circle btn-ghost btn-sm shrink-0"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* =================================
                MODAL BODY
            ================================= */}

            <div className="overflow-y-auto p-4 sm:p-5">
              <div className="space-y-5">
                {/* =================================
                    CUSTOMER
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Customer Information</h4>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Name */}

                    <div className="rounded-xl bg-base-200 p-3">
                      <p className="text-xs text-base-content/50">
                        Customer Name
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold">
                        {selectedBooking.userName || "Unknown User"}
                      </p>
                    </div>

                    {/* Email */}

                    <div className="rounded-xl bg-base-200 p-3">
                      <p className="flex items-center gap-1.5 text-xs text-base-content/50">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium">
                        {selectedBooking.userEmail || "N/A"}
                      </p>
                    </div>

                    {/* Phone */}

                    <div className="rounded-xl bg-base-200 p-3 sm:col-span-2">
                      <p className="flex items-center gap-1.5 text-xs text-base-content/50">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        Phone
                      </p>

                      <p className="mt-1 break-words text-sm font-medium">
                        {selectedBooking.phone ||
                          selectedBooking.userPhone ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================
                    PACKAGE
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Package Information</h4>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Package */}

                    <div className="rounded-xl bg-base-200 p-3">
                      <p className="text-xs text-base-content/50">Package</p>

                      <p className="mt-1 break-words text-sm font-semibold">
                        {selectedBooking.packageName || "Photography Package"}
                      </p>
                    </div>

                    {/* Price */}

                    <div className="rounded-xl bg-base-200 p-3">
                      <p className="flex items-center gap-1.5 text-xs text-base-content/50">
                        <Banknote className="h-3.5 w-3.5" />
                        Price
                      </p>

                      <p className="mt-1 text-sm font-bold text-primary">
                        ৳
                        {Number(
                          selectedBooking.packagePrice || 0,
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================
                    EVENT
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CalendarDays className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Event Information</h4>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {/* Date */}

                    <div className="rounded-xl bg-base-200 p-3">
                      <p className="text-xs text-base-content/50">Event Date</p>

                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="h-4 w-4 shrink-0 text-primary" />

                        {selectedBooking.eventDate || "N/A"}
                      </p>
                    </div>

                    {/* Time */}

                    <div className="rounded-xl bg-base-200 p-3">
                      <p className="text-xs text-base-content/50">Event Time</p>

                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <Clock3 className="h-4 w-4 shrink-0 text-primary" />

                        {selectedBooking.eventTime || "N/A"}
                      </p>
                    </div>

                    {/* Location */}

                    <div className="rounded-xl bg-base-200 p-3 sm:col-span-2">
                      <p className="text-xs text-base-content/50">Location</p>

                      <p className="mt-1 flex items-start gap-2 text-sm font-medium">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                        <span className="break-words">
                          {selectedBooking.eventLocation || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================
                    NOTES
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Notes</h4>
                  </div>

                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-base-content/70">
                      {selectedBooking.notes || "No additional notes provided."}
                    </p>
                  </div>
                </div>

                {/* =================================
                    STATUS
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Booking Status</h4>
                  </div>

                  <div className="rounded-xl bg-base-200 p-4">
                    {(() => {
                      const status = getStatusStyle(selectedBooking.status);

                      const StatusIcon = status.icon;

                      return (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${status.className}`}
                        >
                          <StatusIcon className="h-4 w-4" />

                          {status.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* =================================
                MODAL FOOTER
            ================================= */}

            <div className="sticky bottom-0 shrink-0 border-t border-base-content/10 bg-base-100/95 p-3 backdrop-blur-xl sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {/* Close - ALWAYS */}

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost order-5 sm:order-1"
                >
                  Close
                </button>

                {/* Cancel - ALWAYS */}

                <button
                  type="button"
                  onClick={() => handleCancel(selectedBooking._id)}
                  className="btn btn-error order-2 text-white sm:order-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </button>

                {/* Confirm - ALWAYS */}

                <button
                  type="button"
                  onClick={() => handleConfirm(selectedBooking._id)}
                  className="btn btn-success order-1 text-white sm:order-3"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm
                </button>

                {/* Delete - ONLY CANCELLED */}

                {selectedBooking.status?.toLowerCase() === "cancelled" && (
                  <button
                    type="button"
                    onClick={() => setDeleteBookingId(selectedBooking._id)}
                    className="btn btn-outline btn-error order-3 sm:order-4"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {/* =========================================
    DELETE CONFIRMATION MODAL
========================================= */}

        {deleteBookingId && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setDeleteBookingId(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-error/20 bg-base-100/90 p-6 shadow-2xl backdrop-blur-xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Icon */}

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
                <AlertCircle className="h-7 w-7 text-error" />
              </div>

              {/* Content */}

              <div className="mt-4 text-center">
                <h3 className="font-playfair text-xl font-semibold">
                  Delete Booking?
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  Are you sure you want to permanently delete this booking?
                </p>

                <p className="mt-1 text-xs text-error/80">
                  This action cannot be undone.
                </p>
              </div>

              {/* Actions */}

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteBookingId(null)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(deleteBookingId)}
                  className="btn btn-error text-white"
                >
                  <XCircle className="h-4 w-4" />
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminBookingManagement;
