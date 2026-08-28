import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  MessageSquareText,
  Package,
  RefreshCw,
  Star,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const API_URL = "https://rup-darpan-backend.vercel.app";

const AdminReviewManagement = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  // =========================================
  // GET REVIEWS
  // =========================================

  const {
    data: reviews = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["adminReviews"],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/admin/reviews`, {
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
      case "approved":
        return {
          label: "Approved",
          icon: CheckCircle2,
          className: "border-success/20 bg-success/10 text-success",
        };

      case "rejected":
        return {
          label: "Rejected",
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
  // APPROVE REVIEW
  // =========================================

  const handleApprove = async (reviewId) => {
    try {
      await axios.patch(
        `${API_URL}/admin/reviews/${reviewId}/approve`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Review approved successfully!");

      await refetch();

      if (selectedReview?._id === reviewId) {
        setSelectedReview((prev) => ({
          ...prev,
          status: "approved",
        }));
      }
    } catch (error) {
      console.error("Failed to approve review:", error);

      toast.error(
        error?.response?.data?.message || "Failed to approve review.",
      );
    }
  };

  // =========================================
  // REJECT REVIEW
  // =========================================

  const handleReject = async (reviewId) => {
    try {
      await axios.patch(
        `${API_URL}/admin/reviews/${reviewId}/reject`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Review rejected successfully!");

      await refetch();

      if (selectedReview?._id === reviewId) {
        setSelectedReview((prev) => ({
          ...prev,
          status: "rejected",
        }));
      }
    } catch (error) {
      console.error("Failed to reject review:", error);

      toast.error(error?.response?.data?.message || "Failed to reject review.");
    }
  };

  // =========================================
  // DELETE REVIEW
  // =========================================

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${API_URL}/admin/reviews/${reviewId}`, {
        withCredentials: true,
      });

      toast.success("Review deleted permanently!");

      setDeleteReviewId(null);

      if (selectedReview?._id === reviewId) {
        setSelectedReview(null);
      }

      await refetch();
    } catch (error) {
      console.error("Failed to delete review:", error);

      toast.error(error?.response?.data?.message || "Failed to delete review.");
    }
  };

  // =========================================
  // VIEW REVIEW
  // =========================================

  const handleViewReview = (review) => {
    setSelectedReview(review);
  };

  // =========================================
  // CLOSE MODAL
  // =========================================

  const handleCloseModal = () => {
    setSelectedReview(null);
  };

  // =========================================
  // STATISTICS
  // =========================================

  const totalReviews = reviews.length;

  const pendingReviews = reviews.filter(
    (review) => review.status?.toLowerCase() === "pending",
  ).length;

  const approvedReviews = reviews.filter(
    (review) => review.status?.toLowerCase() === "approved",
  ).length;

  const rejectedReviews = reviews.filter(
    (review) => review.status?.toLowerCase() === "rejected",
  ).length;

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
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquareText className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-playfair text-2xl font-semibold">
                  Review Management
                </h2>

                <p className="text-sm text-base-content/60">
                  Manage customer reviews and feedback.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-error/20 bg-base-100 p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
              <AlertCircle className="h-7 w-7 text-error" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              Failed to Load Reviews
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/60">
              Something went wrong while loading customer reviews.
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
      <title>Admin Review Management | Dashboard</title>
      {/* =========================================
          TOASTER
      ========================================== */}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />

      <div className="space-y-5">
        {/* =========================================
            HEADER
        ========================================== */}

        <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquareText className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                    Review Management
                  </h2>

                  <p className="text-xs text-base-content/60 sm:text-sm">
                    Manage customer reviews and feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Total */}

              <div className="rounded-xl border border-primary/10 bg-base-200 px-4 py-2.5">
                <p className="text-xs text-base-content/50">Total Reviews</p>

                <p className="text-lg font-bold text-primary">{totalReviews}</p>
              </div>

              {/* Refresh */}

              <button
                type="button"
                onClick={() => refetch()}
                className="btn btn-square btn-outline border-primary/20"
                title="Refresh reviews"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================
            REVIEW STATISTICS
        ========================================== */}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {/* Total */}

          <div className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/50">Total</p>

                <p className="mt-1 text-2xl font-bold">{totalReviews}</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquareText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-warning/20 bg-base-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/50">Pending</p>

                <p className="mt-1 text-2xl font-bold text-warning">
                  {pendingReviews}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                <Clock3 className="h-5 w-5 text-warning" />
              </div>
            </div>
          </div>

          {/* Approved */}

          <div className="rounded-2xl border border-success/20 bg-base-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/50">Approved</p>

                <p className="mt-1 text-2xl font-bold text-success">
                  {approvedReviews}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </div>

          {/* Rejected */}

          <div className="rounded-2xl border border-error/20 bg-base-100 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/50">Rejected</p>

                <p className="mt-1 text-2xl font-bold text-error">
                  {rejectedReviews}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10">
                <XCircle className="h-5 w-5 text-error" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            EMPTY STATE
        ========================================== */}

        {reviews.length === 0 ? (
          <section className="rounded-2xl border border-primary/10 bg-base-100 p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MessageSquareText className="h-7 w-7 text-primary" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              No Reviews Found
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              There are currently no customer reviews.
            </p>
          </section>
        ) : (
          /* =========================================
              RESPONSIVE TABLE
          ========================================== */

          <section className="overflow-hidden rounded-2xl border border-primary/10 bg-base-100 shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[1100px]">
                {/* Table Header */}

                <div className="grid grid-cols-[1.5fr_1.3fr_1.4fr_1fr_1fr_1.4fr] items-center gap-4 border-b border-base-content/10 bg-base-200 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Customer
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Package
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Review
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Rating
                  </p>

                  <p className="text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Status
                  </p>

                  <p className="text-right text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Actions
                  </p>
                </div>

                {/* Reviews */}

                <div className="divide-y divide-base-content/10">
                  {reviews.map((review) => {
                    const status = getStatusStyle(review.status);
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={review._id}
                        className="group px-5 py-4 transition hover:bg-base-200/50"
                      >
                        <div className="grid grid-cols-[1.5fr_1.3fr_1.4fr_1fr_1fr_1.4fr] items-center gap-4">
                          {/* =================================
                              CUSTOMER
                          ================================= */}

                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              {review.userPhoto ? (
                                <img
                                  src={review.userPhoto}
                                  alt={review.userName || "User"}
                                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                                />
                              ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                  {review.userName || "Unknown User"}
                                </p>

                                <p className="mt-0.5 text-xs text-base-content/50">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt,
                                      ).toLocaleDateString()
                                    : "N/A"}
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
                                {review.packageName || "Photography Package"}
                              </p>
                            </div>
                          </div>

                          {/* =================================
                              REVIEW
                          ================================= */}

                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm leading-5 text-base-content/70">
                              {review.comment || "No review text."}
                            </p>
                          </div>

                          {/* =================================
                              RATING
                          ================================= */}

                          <div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />

                              <span className="text-sm font-semibold">
                                {review.rating || 0}
                              </span>

                              <span className="text-xs text-base-content/40">
                                / 5
                              </span>
                            </div>
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
                          ================================= */}

                          <div className="flex justify-end gap-1.5">
                            {/* Approve */}

                            <button
                              type="button"
                              onClick={() => handleApprove(review._id)}
                              className="btn btn-square btn-ghost btn-sm text-success hover:bg-success/10"
                              title="Approve review"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>

                            {/* Reject */}

                            <button
                              type="button"
                              onClick={() => handleReject(review._id)}
                              className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                              title="Reject review"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>

                            {/* View */}

                            <button
                              type="button"
                              onClick={() => handleViewReview(review)}
                              className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                              title="View review"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() => setDeleteReviewId(review._id)}
                              className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                              title="Delete review"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile hint */}

            <div className="border-t border-base-content/10 bg-base-200/50 px-4 py-2 text-center text-[11px] text-base-content/40 sm:hidden">
              ← Swipe horizontally to view all review details →
            </div>
          </section>
        )}
      </div>

      {/* =========================================
          REVIEW DETAILS MODAL
      ========================================== */}

      {selectedReview && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary/20 bg-base-100/95 shadow-2xl backdrop-blur-xl sm:max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-base-content/10 bg-base-100/95 px-4 py-3 backdrop-blur-xl sm:px-5 sm:py-4">
              <div className="min-w-0">
                <h3 className="font-playfair text-lg font-semibold sm:text-xl">
                  Review Details
                </h3>

                <p className="mt-0.5 truncate text-xs text-base-content/50">
                  Complete information about this customer review
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

            {/* Modal Body */}

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

                  <div className="rounded-xl bg-base-200 p-4">
                    <div className="flex items-center gap-3">
                      {selectedReview.userPhoto ? (
                        <img
                          src={selectedReview.userPhoto}
                          alt={selectedReview.userName || "User"}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold">
                          {selectedReview.userName || "Unknown User"}
                        </p>

                        <p className="text-xs text-base-content/50">
                          User ID: {selectedReview.userId || "N/A"}
                        </p>
                      </div>
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

                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-xs text-base-content/50">
                      Photography Package
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold">
                      {selectedReview.packageName || "Photography Package"}
                    </p>

                    <p className="mt-1 text-xs text-base-content/50">
                      Package ID: {selectedReview.packageId || "N/A"}
                    </p>
                  </div>
                </div>

                {/* =================================
                    RATING
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Star className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Customer Rating</h4>
                  </div>

                  <div className="rounded-xl bg-base-200 p-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            star <= selectedReview.rating
                              ? "fill-primary text-primary"
                              : "text-base-content/15"
                          }`}
                        />
                      ))}

                      <span className="ml-2 text-sm font-semibold">
                        {selectedReview.rating || 0}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* =================================
                    REVIEW
                ================================= */}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <MessageSquareText className="h-4 w-4 text-primary" />
                    </div>

                    <h4 className="font-semibold">Customer Review</h4>
                  </div>

                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-base-content/70">
                      {selectedReview.comment || "No review text provided."}
                    </p>
                  </div>
                </div>

                {/* =================================
                    DATE + STATUS
                ================================= */}

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-xs text-base-content/50">
                      Submitted Date
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {selectedReview.createdAt
                        ? new Date(selectedReview.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-base-200 p-4">
                    <p className="text-xs text-base-content/50">
                      Review Status
                    </p>

                    <div className="mt-2">
                      {(() => {
                        const status = getStatusStyle(selectedReview.status);

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
            </div>

            {/* Modal Footer */}

            <div className="sticky bottom-0 shrink-0 border-t border-base-content/10 bg-base-100/95 p-3 backdrop-blur-xl sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                {/* Close */}

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-ghost"
                >
                  Close
                </button>

                {/* Reject */}

                <button
                  type="button"
                  onClick={() => handleReject(selectedReview._id)}
                  className="btn btn-error text-white"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>

                {/* Approve */}

                <button
                  type="button"
                  onClick={() => handleApprove(selectedReview._id)}
                  className="btn btn-success text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </button>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() => setDeleteReviewId(selectedReview._id)}
                  className="btn btn-outline btn-error"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      {deleteReviewId && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setDeleteReviewId(null)}
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
                Delete Review?
              </h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Are you sure you want to permanently delete this customer
                review?
              </p>

              <p className="mt-1 text-xs text-error/80">
                This action cannot be undone.
              </p>
            </div>

            {/* Actions */}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteReviewId(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDelete(deleteReviewId)}
                className="btn btn-error text-white"
              >
                <Trash2 className="h-4 w-4" />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminReviewManagement;
