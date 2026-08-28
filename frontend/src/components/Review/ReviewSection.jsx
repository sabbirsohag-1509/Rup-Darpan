import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CalendarDays, MessageSquareText, Star, UserRound } from "lucide-react";
import ReviewForm from "./ReviewForm";

const ReviewSection = ({ packageId, packageName }) => {
  // =====================================================
  // FETCH PACKAGE REVIEWS
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["package-reviews", packageId],

    queryFn: async () => {
      const response = await axios.get(
        `https://rup-darpan-backend.vercel.app/reviews/package/${packageId}`,
      );

      return response.data;
    },

    enabled: !!packageId,
  });

  // =====================================================
  // REVIEW STATS
  // =====================================================

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0,
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatReviewDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // =====================================================
  // RATING STARS
  // =====================================================

  const RatingStars = ({ rating, size = "h-4 w-4" }) => {
    const numericRating = Number(rating || 0);

    return (
      <div
        className="flex items-center gap-0.5"
        aria-label={`${numericRating} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= numericRating
                ? "fill-primary text-primary"
                : "text-base-content/15"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="border-t border-primary/10 bg-base-100 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Customer Reviews{" "}
            <span className="normal-case opacity-80">(গ্রাহকদের মতামত)</span>
          </p>

          <h2 className="mt-2 font-playfair text-3xl font-semibold sm:text-4xl lg:text-5xl">
            What Our Clients Say
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
            See what our clients have to say about their photography experience
            with RupDarpon.
          </p>

          <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-base-content/50 sm:text-sm">
            রূপদর্পণ (RupDarpon)-এর সাথে চমৎকার ফটোগ্রাফি অভিজ্ঞতার গল্পগুলো
            আমাদের ক্লায়েন্টদের কাছ থেকেই জেনে নিন।
          </p>
        </div>

        {/* =================================================
            REVIEW CONTENT
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* =================================================
              LEFT — CLIENT REVIEWS
          ================================================= */}

          <div className="overflow-hidden rounded-3xl border border-primary/10 bg-base-200 shadow-sm lg:col-span-2">
            {/* Review Header */}

            <div className="border-b border-primary/10 bg-primary/5 p-6 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* Title */}

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Client Feedback{" "}
                      <span className="normal-case opacity-80">
                        (গ্রাহকদের মতামত)
                      </span>
                    </p>

                    <h3 className="mt-1 font-playfair text-2xl font-semibold">
                      Client Reviews
                    </h3>
                  </div>
                </div>

                {/* Rating Summary */}

                {totalReviews > 0 && (
                  <div className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-base-100 px-4 py-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">
                        {averageRating}
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-base-content/45">
                        Average
                      </p>
                    </div>

                    <div className="h-8 w-px bg-base-content/10" />

                    <div>
                      <RatingStars rating={Number(averageRating)} />

                      <p className="mt-1 text-xs text-base-content/50">
                        {totalReviews}{" "}
                        {totalReviews === 1 ? "Review" : "Reviews"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                REVIEW BODY
            ================================================= */}

            <div className="p-6 sm:p-7">
              {/* Loading */}

              {isLoading && (
                <div className="flex min-h-[250px] items-center justify-center">
                  <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary" />

                    <p className="mt-3 text-sm text-base-content/50">
                      Loading reviews...
                    </p>
                  </div>
                </div>
              )}

              {/* Error */}

              {isError && (
                <div className="flex min-h-[250px] items-center justify-center">
                  <div className="max-w-sm rounded-2xl border border-error/10 bg-error/5 p-6 text-center">
                    <MessageSquareText className="mx-auto h-8 w-8 text-error/60" />

                    <h4 className="mt-3 font-semibold">
                      Unable to Load Reviews
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-base-content/50">
                      We couldn't load the reviews right now. Please try again
                      later.
                    </p>
                  </div>
                </div>
              )}

              {/* Empty */}

              {!isLoading && !isError && totalReviews === 0 && (
                <div className="flex min-h-[250px] items-center justify-center">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Star className="h-7 w-7 text-primary/60" />
                    </div>

                    <h4 className="mt-4 font-playfair text-xl font-semibold">
                      No Reviews Yet
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-base-content/50">
                      Be the first person to share your experience with this
                      photography package.
                    </p>

                    <p className="mt-1 text-xs text-base-content/40">
                      এই প্যাকেজটি নিয়ে আপনার অভিজ্ঞতাই হতে পারে প্রথম মতামত।
                    </p>
                  </div>
                </div>
              )}

              {/* Reviews */}

              {!isLoading && !isError && totalReviews > 0 && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <article
                      key={review._id}
                      className="rounded-2xl border border-primary/10 bg-base-100 p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-sm sm:p-6"
                    >
                      {/* Reviewer Header */}

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {/* Profile Photo */}

                          {review.userPhoto ? (
                            <img
                              src={review.userPhoto}
                              alt={review.userName || "Client"}
                              className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-primary/10"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <UserRound className="h-5 w-5 text-primary" />
                            </div>
                          )}

                          {/* Name + Date */}

                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold">
                              {review.userName || "Anonymous Client"}
                            </h4>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <RatingStars rating={review.rating} />

                              <span className="text-xs text-base-content/35">
                                •
                              </span>

                              <span className="flex items-center gap-1 text-xs text-base-content/45">
                                <CalendarDays className="h-3.5 w-3.5" />

                                {formatReviewDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Comment */}

                      <div className="mt-5">
                        <p className="text-sm leading-7 text-base-content/70">
                          “{review.comment}”
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              RIGHT — REVIEW FORM
          ================================================= */}

          <div>
            <ReviewForm packageName={packageName} packageId={packageId} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
