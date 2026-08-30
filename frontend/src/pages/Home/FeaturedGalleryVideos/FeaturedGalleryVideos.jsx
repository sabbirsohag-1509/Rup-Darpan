import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaFacebookF } from "react-icons/fa";
import { Camera, Play, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

const API_URL = "http://localhost:5000";

const FACEBOOK_PAGE_URL =
  "https://www.facebook.com/profile.php?id=61559974675020";

const DESCRIPTION_LIMIT = 120;

// =========================================================
// FACEBOOK ICON
// =========================================================

const FacebookMark = ({ className = "" }) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#0B66FB] text-white ${className}`}
    >
      <FaFacebookF />
    </span>
  );
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const FeaturedGalleryVideos = () => {
  const {
    data: videoData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-videos"],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/featured-videos`);

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });

  const videos = videoData.videos || [];

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          {/* Heading Skeleton */}

          <div className="mb-10 sm:mb-12 lg:mb-14">
            <div className="max-w-2xl">
              <div className="mb-4 h-px w-8 animate-pulse bg-base-200" />

              <div className="h-12 w-72 animate-pulse rounded-lg bg-base-200 sm:h-14 lg:h-16" />

              <div className="mt-5 h-16 w-full max-w-xl animate-pulse rounded-lg bg-base-200" />
            </div>
          </div>

          {/* Cards Skeleton */}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm"
              >
                <div className="aspect-video animate-pulse bg-base-200" />

                <div className="space-y-4 p-6">
                  <div className="h-4 w-20 animate-pulse rounded bg-base-200" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-base-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-base-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-base-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR / EMPTY
  // =========================================================

  if (isError || videos.length === 0) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 text-center">
            <Camera className="mx-auto h-8 w-8 text-primary" />

            <h3 className="mt-4 font-playfair text-2xl font-semibold">
              Featured Videos
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              No featured videos available yet.
            </p>
          </div>

          <FacebookPageCTA />
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        {/* =====================================================
            HEADING
        ===================================================== */}

        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          {/* Header Content */}

          <div className="max-w-2xl">
            {/* Decorative Line */}

            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
            </div>

            {/* Heading */}

            <h2 className="font-playfair text-4xl font-semibold leading-[1.05] text-base-content sm:text-5xl lg:text-6xl">
              Featured <span className="italic text-primary">Videos</span>
            </h2>

            {/* Description */}

            <p className="mt-5 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
              Relive some of our most memorable moments through stories,
              celebrations, and beautiful wedding films.
              <br />
              <span className="text-xs text-base-content/50 sm:text-sm">
                আমাদের ক্যামেরায় বন্দি করা প্রিয় কিছু মুহূর্ত; যেখানে প্রতিটি
                ভিডিও ধরে রাখে গল্প, আবেগ এবং সুন্দর স্মৃতির জীবন্ত প্রতিচ্ছবি।
              </span>
            </p>
          </div>

          {/* =====================================================
              VIEW FULL GALLERY
          ===================================================== */}

          <div>
            <Link
              to="/gallery/videos"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content sm:w-fit"
            >
              <span>View All Videos</span>

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* =====================================================
            VIDEOS
        ===================================================== */}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>

        {/* =====================================================
            FACEBOOK PAGE CTA
        ===================================================== */}

        <FacebookPageCTA />
      </div>
    </section>
  );
};

export default FeaturedGalleryVideos;

// =========================================================
// VIDEO CARD
// =========================================================

const VideoCard = ({ video }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const description = video.description?.trim() || "";

  const isLongDescription = description.length > DESCRIPTION_LIMIT;

  const displayedDescription =
    isExpanded || !isLongDescription
      ? description
      : `${description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`;

  return (
    <article className="group overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      {/* =====================================================
          THUMBNAIL
      ===================================================== */}

      <div className="relative aspect-video overflow-hidden bg-base-200">
        {/* Thumbnail */}

        <img
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Cinematic Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-80" />

        {/* =================================================
            PLAY BUTTON
        ================================================= */}

        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${video.title} on Facebook`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/85 text-primary shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-[72px] sm:w-[72px]">
            <Play
              className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8"
              strokeWidth={1.5}
            />
          </span>
        </a>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {video.category || "Wedding"}
          </span>
        </div>

        {/* =================================================
            FACEBOOK ICON
        ================================================= */}

        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open video on Facebook"
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110"
        >
          <FacebookMark className="h-8 w-8 text-[16px]" />
        </a>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5 sm:p-6">
        {/* Title */}

        <h3 className="font-playfair text-xl font-semibold leading-tight text-base-content sm:text-2xl">
          {video.title}
        </h3>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        {description && (
          <div className="mt-3">
            <p className="text-sm leading-6 text-base-content/60">
              {displayedDescription}
            </p>

            {/* See More / See Less */}

            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="mt-2 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary/70"
              >
                {isExpanded ? "See less" : "See more"}
              </button>
            )}
          </div>
        )}

        {/* Divider */}

        <div className="my-5 h-px bg-base-300" />

        {/* =================================================
            WATCH ON FACEBOOK
        ================================================= */}

        {video.videoUrl && (
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${video.title} on Facebook`}
            className="group/link inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary/70"
          >
            <FacebookMark className="h-7 w-7 text-[14px] transition-transform duration-300 group-hover/link:scale-110" />

            <span>Watch on Facebook</span>

            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </a>
        )}
      </div>
    </article>
  );
};

// =========================================================
// FACEBOOK PAGE CTA
// =========================================================

const FacebookPageCTA = () => {
  return (
    <div className="mt-14 overflow-hidden rounded-3xl border border-primary/10 bg-primary/5">
      <div className="relative px-6 py-8 text-center sm:px-10 sm:py-10">
        {/* Decorative Background */}

        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

        <div className="relative">
          {/* Facebook Icon */}

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0B66FB] text-white shadow-lg shadow-[#0B66FB]/20">
            <FaFacebookF className="text-2xl" />
          </div>

          {/* Heading */}

          <h3 className="mt-5 font-playfair text-2xl font-semibold sm:text-3xl">
            Follow Us on Facebook
          </h3>

          {/* English */}

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
            See our latest photography, videos, events, and behind-the-scenes
            updates on our Facebook page.
          </p>

          {/* Bangla */}

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
            আমাদের সর্বশেষ ছবি, ভিডিও, ইভেন্ট এবং নতুন আপডেট দেখতে আমাদের
            Facebook Page-এ ঘুরে আসুন।
          </p>

          {/* CTA */}

          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page"
            className="btn btn-primary mt-6 rounded-full px-6 text-primary-content shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B66FB] text-white">
              <FaFacebookF className="text-sm" />
            </span>

            <span>Visit Our Facebook Page</span>

            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
