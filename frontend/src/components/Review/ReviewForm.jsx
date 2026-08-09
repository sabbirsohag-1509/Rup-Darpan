import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { MessageSquareText, Send, Star } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "./../../context/AuthContext";

const ReviewForm = ({ packageName, packageId }) => {
  const { user } = useContext(AuthContext);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // =========================================
  // SUBMIT REVIEW
  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    const reviewData = {
      packageId,
      packageName,
      rating,
      comment: data.comment,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/reviews",
        reviewData,
        {
          withCredentials: true,
        },
      );

      console.log("Review Response:", response.data);

      toast.success("Review submitted successfully!");

      // Reset form
      reset();
      setRating(0);
      setHoverRating(0);
    } catch (error) {
      console.error("Review submission failed:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to submit review. Please try again.",
      );
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-primary/10 bg-base-200 shadow-sm">
      {/* =========================================
          FORM HEADER
      ========================================== */}

      <div className="border-b border-primary/10 bg-primary/5 p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquareText className="h-5 w-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Share Your Experience
            </p>

            <h3 className="mt-1 font-playfair text-2xl font-semibold">
              Leave a Review
            </h3>

            <p className="mt-1 text-xs text-base-content/50">
              আপনার অভিজ্ঞতা শেয়ার করুন
            </p>
          </div>
        </div>
      </div>

      {/* =========================================
          FORM
      ========================================== */}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 sm:p-7">
        {/* =========================================
            PACKAGE
        ========================================== */}
        {/* =========================================
    REVIEWER PROFILE
========================================== */}

        <div className="rounded-2xl border border-primary/10 bg-base-100 p-4">
          {/* Login as user info  */}
          <div className="flex items-center gap-3">
            {/* Profile Image */}

            <div className="avatar">
              <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/10 ring-offset-2 ring-offset-base-100">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user?.name || "User"} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-base-content/50">
                {user?.email || "No email available"}
              </p>
            </div>

            {/* Logged In Status */}

            <div
              className={`hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium sm:flex ${
                user ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  user ? "bg-success" : "bg-error"
                }`}
              />

              {user ? "Logged in" : "Not logged in"}
            </div>
          </div>
          
        </div>

        <div className="rounded-2xl border border-primary/10 bg-base-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-base-content/45">
            Reviewing Package
          </p>

          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-primary text-primary" />

            <p className="font-playfair text-lg font-semibold">{packageName}</p>
          </div>
        </div>

        {/* =========================================
            RATING
        ========================================== */}

        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Your Rating</label>

            {rating > 0 && (
              <span className="text-xs font-medium text-primary">
                {rating}/5
              </span>
            )}
          </div>

          <div className="mt-3 rounded-2xl border border-primary/10 bg-base-100 p-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((star) => {
                const activeRating = hoverRating || rating;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="rounded-full p-1 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors duration-200 sm:h-8 sm:w-8 ${
                        star <= activeRating
                          ? "fill-primary text-primary"
                          : "text-base-content/20"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-center text-xs text-base-content/45">
              {rating === 0
                ? "Select a rating from 1 to 5 stars"
                : rating === 5
                  ? "Excellent experience!"
                  : rating === 4
                    ? "Great experience!"
                    : rating === 3
                      ? "Good experience"
                      : rating === 2
                        ? "Could be better"
                        : "Needs improvement"}
            </p>
          </div>

          {rating === 0 && (
            <p className="mt-2 text-xs text-error">Please select a rating.</p>
          )}
        </div>

        {/* =========================================
            COMMENT
        ========================================== */}

        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-semibold"
          >
            Your Review
          </label>

          <div
            className={`rounded-2xl border bg-base-100 transition focus-within:ring-2 ${
              errors.comment
                ? "border-error/40 focus-within:ring-error/10"
                : "border-primary/10 focus-within:border-primary/40 focus-within:ring-primary/10"
            }`}
          >
            <textarea
              id="review-comment"
              rows="5"
              placeholder="Tell us about your photography experience..."
              className="w-full resize-none border-0 bg-transparent p-4 text-sm leading-6 outline-none placeholder:text-base-content/35"
              {...register("comment", {
                required: "Please write your review.",
                minLength: {
                  value: 10,
                  message: "Review must be at least 10 characters.",
                },
                maxLength: {
                  value: 1500,
                  message: "Review cannot exceed 1500 characters.",
                },
              })}
            />
          </div>

          {errors.comment && (
            <p className="mt-2 text-xs text-error">{errors.comment.message}</p>
          )}

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-base-content/40">
              আপনার অভিজ্ঞতা সম্পর্কে আমাদের জানান।
            </p>

            <span className="text-xs text-base-content/35">
              10–1500 characters
            </span>
          </div>
        </div>

        {/* =========================================
            SUBMIT
        ========================================== */}

        <button
          type="submit"
          disabled={rating === 0}
          className="btn btn-primary w-full rounded-full text-primary-content shadow-md transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Submit Review
        </button>

        {/* =========================================
            NOTE
        ========================================== */}

        <div className="flex items-start gap-2 rounded-xl bg-base-100 p-3">
          <Star className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <p className="text-xs leading-5 text-base-content/45">
            Your review will be submitted for approval before appearing publicly
            on this package. (আমাদের টিম যাচাই করার পর আপনার রিভিউটি প্রকাশ করা
            হবে।)
          </p>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
