import {
  AlertCircle,
  CalendarDays,
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
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

const API_URL = "http://localhost:5000";

const MyReview = () => {
  const [selectedReview, setSelectedReview] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    data: reviews = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["myReviews"],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/reviews/my`, {
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
  // VIEW
  // =========================================

  const handleView = (review) => {
    setSelectedReview(review);
    setIsViewModalOpen(true);
  };

  // =========================================
  // EDIT
  // =========================================

  const handleEdit = (review) => {
    setSelectedReview(review);
    setEditRating(Number(review.rating) || 5);
    setEditComment(review.comment || "");
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editComment.trim()) {
      toast.error("Please write your review.");
      return;
    }

    if (editRating < 1 || editRating > 5) {
      toast.error("Rating must be between 1 and 5.");
      return;
    }

    try {
      setIsUpdating(true);

      await axios.patch(
        `${API_URL}/reviews/${selectedReview._id}`,
        {
          rating: editRating,
          comment: editComment.trim(),
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Review Updated successfully!");
      setShowSuccessModal(true);

      setIsEditModalOpen(false);
      setSelectedReview(null);

      await refetch();
    } catch (error) {
      console.error("Failed to update review:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update review. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReview?._id) return;

    try {
      setIsDeleting(true);

      await axios.delete(`${API_URL}/reviews/${selectedReview._id}`, {
        withCredentials: true,
      });

      toast.success("Review deleted successfully!");

      setIsDeleteModalOpen(false);
      setSelectedReview(null);

      await refetch();
    } catch (error) {
      console.error("Failed to delete review:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete review. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {
    return (
      <>
        <Toaster position="top-center" />

        <div className="space-y-5">
          <section className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl bg-base-300" />

              <div className="space-y-2">
                <div className="h-6 w-40 animate-pulse rounded bg-base-300" />

                <div className="h-3 w-64 animate-pulse rounded bg-base-300" />
              </div>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl bg-base-200"
              />
            ))}
          </div>
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
        <Toaster position="top-center" />

        <div className="space-y-5">
          <section className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquareText className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                  My Reviews
                </h2>

                <p className="text-xs text-base-content/60 sm:text-sm">
                  View and manage your reviews.
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
              Something went wrong while loading your reviews.
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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />

      <div className="space-y-5">
        <title>My Reviews | Rup Darpon</title>
        {/* =========================================
            HEADER
        ========================================= */}

        <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquareText className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                  My Reviews
                </h2>

                <p className="text-xs text-base-content/60 sm:text-sm">
                  View and manage your submitted reviews.
                </p>
              </div>
            </div>

            {/* Total Reviews */}

            <div className="flex items-center gap-2">
              <div className="rounded-xl border border-primary/10 bg-base-200 px-4 py-2.5">
                <p className="text-xs text-base-content/50">Total Reviews</p>

                <p className="text-lg font-bold text-primary">
                  {reviews.length}
                </p>
              </div>

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
            EMPTY STATE
        ========================================= */}

        {reviews.length === 0 ? (
          <section className="rounded-2xl border border-primary/10 bg-base-100 p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageSquareText className="h-8 w-8 text-primary" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              You Haven&apos;t Written Any Reviews
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
              Your submitted reviews will appear here. Share your experience
              after using our photography services.
            </p>
          </section>
        ) : (
          /* =========================================
              REVIEW CARDS
          ========================================= */

          <section className="grid gap-4 lg:grid-cols-2">
            {reviews.map((review) => {
              const status = getStatusStyle(review.status);
              const StatusIcon = status.icon;

              return (
                <article
                  key={review._id}
                  className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm transition hover:border-primary/20 hover:shadow-md"
                >
                  {/* Card Header */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {review.userPhoto ? (
                        <img
                          src={review.userPhoto}
                          alt={review.userName || "User"}
                          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {review.userName || "User"}
                        </p>

                        <p className="mt-0.5 flex items-center gap-1 text-xs text-base-content/50">
                          <CalendarDays className="h-3 w-3" />

                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "N/A"}
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

                  {/* Package */}

                  <div className="mt-5 rounded-xl bg-base-200 p-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 shrink-0 text-primary" />

                      <div className="min-w-0">
                        <p className="text-[11px] text-base-content/50">
                          Photography Package
                        </p>

                        <p className="truncate text-sm font-semibold">
                          {review.packageName || "Photography Package"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}

                  <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Number(review.rating)
                            ? "fill-primary text-primary"
                            : "text-base-content/15"
                        }`}
                      />
                    ))}

                    <span className="ml-1 text-xs font-semibold">
                      {review.rating || 0}/5
                    </span>
                  </div>

                  {/* Comment */}

                  <div className="mt-3">
                    <p className="line-clamp-3 text-sm leading-6 text-base-content/70">
                      {review.comment || "No review text provided."}
                    </p>
                  </div>

                  {/* Actions */}

                  <div className="mt-5 flex justify-end gap-2 border-t border-base-content/10 pt-4">
                    {/* VIEW */}

                    <button
                      type="button"
                      onClick={() => handleView(review)}
                      className="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() => handleEdit(review)}
                      className="btn btn-ghost btn-sm text-warning hover:bg-warning/10"
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(review)}
                      className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {isViewModalOpen && selectedReview && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-lg border border-primary/10 bg-base-100 p-0">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-base-content/10 p-5">
              <div>
                <h3 className="font-playfair text-xl font-semibold">
                  Review Details
                </h3>

                <p className="mt-1 text-xs text-base-content/50">
                  Your submitted review
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedReview(null);
                }}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* User */}

              <div className="flex items-center gap-3">
                {selectedReview.userPhoto ? (
                  <img
                    src={selectedReview.userPhoto}
                    alt={selectedReview.userName || "User"}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/10"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold">
                    {selectedReview.userName || "User"}
                  </p>

                  <p className="text-xs text-base-content/50">
                    {selectedReview.createdAt
                      ? new Date(selectedReview.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Package */}

              <div className="rounded-xl bg-base-200 p-4">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />

                  <div>
                    <p className="text-xs text-base-content/50">
                      Photography Package
                    </p>

                    <p className="font-semibold">
                      {selectedReview.packageName || "Photography Package"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Status</span>

                {(() => {
                  const status = getStatusStyle(selectedReview.status);
                  const StatusIcon = status.icon;

                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />

                      {status.label}
                    </span>
                  );
                })()}
              </div>

              {/* Rating */}

              <div>
                <p className="mb-2 text-sm font-semibold">Rating</p>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Number(selectedReview.rating)
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

              {/* Comment */}

              <div>
                <p className="mb-2 text-sm font-semibold">Your Review</p>

                <div className="rounded-xl border border-primary/10 bg-base-200 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-base-content/70">
                    {selectedReview.comment || "No review text provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-base-content/10 p-5">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedReview(null);
                }}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => {
              setIsViewModalOpen(false);
              setSelectedReview(null);
            }}
          />
        </dialog>
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {isEditModalOpen && selectedReview && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-lg border border-primary/10 bg-base-100 p-0">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-base-content/10 p-5">
              <div>
                <h3 className="font-playfair text-xl font-semibold">
                  Edit Review
                </h3>

                <p className="mt-1 text-xs text-base-content/50">
                  Update your rating and review.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!isUpdating) {
                    setIsEditModalOpen(false);
                    setSelectedReview(null);
                  }
                }}
                className="btn btn-circle btn-ghost btn-sm"
                disabled={isUpdating}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="space-y-5 p-5">
                {/* Package */}

                <div className="rounded-xl bg-base-200 p-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />

                    <div>
                      <p className="text-xs text-base-content/50">
                        Photography Package
                      </p>

                      <p className="font-semibold">
                        {selectedReview.packageName || "Photography Package"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Your Rating
                  </label>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditRating(star)}
                        className="rounded-md p-1 transition hover:bg-primary/10"
                      >
                        <Star
                          className={`h-7 w-7 transition ${
                            star <= editRating
                              ? "fill-primary text-primary"
                              : "text-base-content/20"
                          }`}
                        />
                      </button>
                    ))}

                    <span className="ml-2 text-sm font-semibold">
                      {editRating}/5
                    </span>
                  </div>
                </div>

                {/* Comment */}

                <div>
                  <label
                    htmlFor="edit-review-comment"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Your Review
                  </label>

                  <textarea
                    id="edit-review-comment"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="Write your review..."
                    className="textarea textarea-bordered w-full border-primary/20 bg-base-200 focus:border-primary focus:outline-none"
                  />

                  <div className="mt-1 text-right text-xs text-base-content/40">
                    {editComment.length}/1000
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="flex justify-end gap-2 border-t border-base-content/10 p-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedReview(null);
                  }}
                  className="btn btn-ghost"
                  disabled={isUpdating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => {
              if (!isUpdating) {
                setIsEditModalOpen(false);
                setSelectedReview(null);
              }
            }}
          />
        </dialog>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {isDeleteModalOpen && selectedReview && (
        <dialog open className="modal modal-bottom sm:modal-middle">
          <div className="modal-box max-w-md border border-error/20 bg-base-100">
            {/* Icon */}

            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
                <Trash2 className="h-7 w-7 text-error" />
              </div>
            </div>

            {/* Content */}

            <div className="text-center">
              <h3 className="mt-4 font-playfair text-2xl font-semibold">
                Delete Review?
              </h3>

              <p className="mt-2 text-sm leading-6 text-base-content/60">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>
            </div>

            {/* Review Preview */}

            <div className="mt-5 rounded-xl border border-error/10 bg-base-200 p-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Number(selectedReview.rating)
                        ? "fill-primary text-primary"
                        : "text-base-content/15"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-2 line-clamp-2 text-sm leading-5 text-base-content/70">
                {selectedReview.comment || "No review text provided."}
              </p>
            </div>

            {/* Buttons */}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!isDeleting) {
                    setIsDeleteModalOpen(false);
                    setSelectedReview(null);
                  }
                }}
                className="btn btn-ghost"
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-error text-error-content"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => {
              if (!isDeleting) {
                setIsDeleteModalOpen(false);
                setSelectedReview(null);
              }
            }}
          />
        </dialog>
      )}
      <div>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl border border-primary/20 bg-base-100/95 p-7 text-center shadow-2xl backdrop-blur-md sm:p-8">
              {/* Icon */}

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>

              {/* Message */}

              <h3 className="mt-5 font-playfair text-2xl font-semibold">
                Review Submitted Successfully
              </h3>

              <p className="mt-3 text-sm leading-6 text-base-content/65">
                Thank you for taking the time to share your experience with us!
              </p>

              <p className="mt-2 text-sm leading-6 text-base-content/65">
                Your review has been submitted successfully. It will be
                published shortly after being reviewed by the RupDarpon team.
                <span className="mt-1 block text-xs opacity-80 sm:text-sm">
                  (আপনার রিভিউটি সফলভাবে জমা হয়েছে। রূপদর্পণ টিম যাচাই করার পর
                  খুব শীঘ্রই এটি প্রকাশ করা হবে।)
                </span>
              </p>

              {/* OK */}

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="btn btn-primary mt-6 w-full rounded-full text-primary-content"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyReview;
