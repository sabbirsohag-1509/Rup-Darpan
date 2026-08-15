import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowUpRight,
  Camera,
  Image as ImageIcon,
  Play,
  Video,
} from "lucide-react";
import { Link } from "react-router";

const API_URL = "http://localhost:5000";

// =========================================================
// MAIN COMPONENT
// =========================================================

const Gallery = () => {
  // =======================================================
  // FETCH PHOTOS
  // =======================================================

  const {
    data: photoData = {},
    isLoading: photosLoading,
    isError: photosError,
    isFetching: photosFetching,
  } = useQuery({
    queryKey: ["gallery-photos-preview"],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all-photos`, {
        params: {
          page: 1,
          limit: 5,
        },
      });

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });

  // =======================================================
  // FETCH VIDEOS
  // =======================================================

  const {
    data: videoData = {},
    isLoading: videosLoading,
    isError: videosError,
    isFetching: videosFetching,
  } = useQuery({
    queryKey: ["gallery-videos-preview"],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all-videos`, {
        params: {
          page: 1,
          limit: 3,
        },
      });

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });

  // =======================================================
  // DATA
  // =======================================================

  const photos = photoData.photos || [];
  const videos = videoData.videos || [];

  // Only published photos should be visible publicly
  const publishedPhotos = photos.filter((photo) => photo?.isPublished === true);

  const photosLoadingState = photosLoading || photosFetching;

  const videosLoadingState = videosLoading || videosFetching;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <main className="bg-base-100">
      {/* =====================================================
          PHOTO GALLERY SECTION
      ===================================================== */}

      <section className="border-t border-base-200 bg-base-100 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          {/* Section Header */}

          <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Label */}

              <div className="mb-4 flex items-center gap-2 text-primary">
                <Camera className="h-5 w-5" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Our Gallery
                </span>
              </div>
              <h2 className="font-playfair text-4xl font-semibold leading-tight text-base-content sm:text-5xl">
                Captured <span className="italic text-primary">Moments</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                A collection of our favorite photographs from weddings,
                celebrations, portraits, and special moments.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-6 text-base-content/50 sm:text-sm">
                বিয়ে, অনুষ্ঠান, পোর্ট্রেট এবং বিশেষ মুহূর্তের কিছু প্রিয় ছবি।
              </p>
            </div>

            {/* View All */}

            <Link
              to="/gallery/photos"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content sm:w-fit"
            >
              View All Photos
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* =================================================
              PHOTO CONTENT
          ================================================= */}

          {photosLoadingState ? (
            <PhotoPreviewSkeleton />
          ) : photosError ? (
            <GalleryError
              type="photos"
              icon={<ImageIcon className="h-8 w-8" />}
            />
          ) : publishedPhotos.length === 0 ? (
            <GalleryEmpty
              type="photos"
              icon={<ImageIcon className="h-8 w-8" />}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {/* =================================================
                  MAIN PHOTO
              ================================================= */}

              {publishedPhotos[0] && (
                <PhotoPreview
                  photo={publishedPhotos[0]}
                  className="col-span-2 row-span-2 h-[360px] sm:h-[500px]"
                />
              )}

              {/* =================================================
                  REMAINING PHOTOS
              ================================================= */}

              {publishedPhotos.slice(1, 5).map((photo) => (
                <PhotoPreview
                  key={photo._id}
                  photo={photo}
                  className="h-[220px] sm:h-[250px]"
                />
              ))}
            </div>
          )}

          {/* Mobile CTA */}

          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              to="/gallery/photos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Explore All Photos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          VIDEO GALLERY SECTION
      ===================================================== */}

      <section className="border-t border-base-200 bg-base-200/30 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          {/* Section Header */}

          <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Films & Stories
                </span>
              </div>

              <h2 className="font-playfair text-4xl font-semibold leading-tight text-base-content sm:text-5xl">
                Moments in <span className="italic text-primary">Motion</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
                Watch our collection of wedding films, celebrations, stories,
                and memorable moments captured in motion.
              </p>

              <p className="mt-1 max-w-xl text-xs leading-6 text-base-content/50 sm:text-sm">
                বিয়ের গল্প, আনন্দের মুহূর্ত এবং সুন্দর স্মৃতিগুলো এবার ভিডিওতে
                দেখুন।
              </p>
            </div>

            {/* View All */}

            <Link
              to="/gallery/videos"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content sm:w-fit"
            >
              View All Videos
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* =================================================
              VIDEO CONTENT
          ================================================= */}

          {videosLoadingState ? (
            <VideoPreviewSkeleton />
          ) : videosError ? (
            <GalleryError type="videos" icon={<Video className="h-8 w-8" />} />
          ) : videos.length === 0 ? (
            <GalleryEmpty type="videos" icon={<Video className="h-8 w-8" />} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.slice(0, 3).map((video) => (
                <VideoPreview key={video._id} video={video} />
              ))}
            </div>
          )}

          {/* Mobile CTA */}

          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              to="/gallery/videos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              Explore All Videos
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="bg-base-100 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-8">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 sm:px-10 sm:py-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] border p-1 rounded">
              <span className="text-red-700 font-bold">Rup</span> Darpon
            </span>

            <h2 className="mt-3 font-playfair text-3xl font-semibold sm:text-4xl">
              Every frame tells a story.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-base-content/60">
              Discover more photographs and films from our complete collection.
            </p>

            <p className="mt-1 text-xs text-base-content/50 sm:text-sm">
              আমাদের প্রতিটি ফ্রেম একটি গল্প বলে।
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/gallery/photos"
                className="btn btn-primary rounded-full px-6"
              >
                Explore Photos
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                to="/gallery/videos"
                className="btn btn-outline rounded-full px-6"
              >
                Watch Videos
                <Play className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Gallery;

// =========================================================
// PHOTO PREVIEW
// =========================================================

const PhotoPreview = ({ photo, className = "" }) => {
  /*
   * IMPORTANT
   *
   * Your backend photo object contains:
   *
   * image: "https://res.cloudinary.com/..."
   *
   * So we use photo.image first.
   */

  const imageUrl =
    photo?.image || photo?.imageUrl || photo?.photoUrl || photo?.url || "";

  const title = photo?.title || "Photography";

  const category = photo?.category || "Photography";

  const photographer = photo?.photographer || "";

  const location = photo?.location || "";

  return (
    <Link
      to="/gallery/photos"
      className={`group relative overflow-hidden rounded-2xl bg-base-300 sm:rounded-3xl ${className}`}
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-base-300">
          <Camera className="h-10 w-10 text-base-content/20" />
        </div>
      )}

      {/* =================================================
          OVERLAY
      ================================================= */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {/* Category */}

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {category}
            </span>

            {/* Title */}

            <h3 className="mt-1 line-clamp-2 font-playfair text-lg font-semibold text-white sm:text-xl">
              {title}
            </h3>

            {/* Photographer */}

            {photographer && (
              <p className="mt-1 truncate text-xs text-white/60">
                By {photographer}
              </p>
            )}

            {/* Location */}

            {location && (
              <p className="mt-0.5 truncate text-xs text-white/50">
                {location}
              </p>
            )}
          </div>

          {/* Arrow */}

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

// =========================================================
// VIDEO PREVIEW
// =========================================================
// VIDEO PART KEPT SAME
// =========================================================

const VideoPreview = ({ video }) => {
  const thumbnailUrl = video?.thumbnailUrl || video?.thumbnail || "";

  const title = video?.title || video?.category || "Featured Video";

  const category = video?.category || "Video";

  return (
    <a
      href={video?.videoUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-video overflow-hidden rounded-2xl bg-base-300 sm:rounded-3xl"
    >
      {/* Thumbnail */}

      {thumbnailUrl ? (
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-base-300">
          <Video className="h-10 w-10 text-base-content/20" />
        </div>
      )}

      {/* Cinematic Overlay */}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      {/* Play Button */}

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/85 text-primary shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-16 sm:w-16">
          <Play
            className="ml-1 h-6 w-6 fill-current sm:h-7 sm:w-7"
            strokeWidth={1.5}
          />
        </span>
      </div>

      {/* Content */}

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {category}
            </span>

            <h3 className="mt-1 line-clamp-2 font-playfair text-lg font-semibold text-white sm:text-xl">
              {title}
            </h3>
          </div>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
};

// =========================================================
// PHOTO SKELETON
// =========================================================

const PhotoPreviewSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="col-span-2 row-span-2 h-[360px] animate-pulse rounded-2xl bg-base-200 sm:h-[500px] sm:rounded-3xl" />

      <div className="h-[220px] animate-pulse rounded-2xl bg-base-200 sm:h-[250px] sm:rounded-3xl" />

      <div className="h-[220px] animate-pulse rounded-2xl bg-base-200 sm:h-[250px] sm:rounded-3xl" />

      <div className="h-[220px] animate-pulse rounded-2xl bg-base-200 sm:h-[250px] sm:rounded-3xl" />

      <div className="h-[220px] animate-pulse rounded-2xl bg-base-200 sm:h-[250px] sm:rounded-3xl" />
    </div>
  );
};

// =========================================================
// VIDEO SKELETON
// =========================================================

const VideoPreviewSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="aspect-video animate-pulse rounded-2xl bg-base-200 sm:rounded-3xl"
        />
      ))}
    </div>
  );
};

// =========================================================
// ERROR STATE
// =========================================================

const GalleryError = ({ type, icon }) => {
  return (
    <div className="rounded-3xl border border-error/10 bg-error/5 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
        {icon}
      </div>

      <h3 className="mt-4 font-playfair text-2xl font-semibold">
        Unable to load {type}
      </h3>

      <p className="mt-2 text-sm text-base-content/60">
        Something went wrong while loading the gallery. Please try again later.
      </p>
    </div>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const GalleryEmpty = ({ type, icon }) => {
  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="mt-4 font-playfair text-2xl font-semibold">
        No {type} available
      </h3>

      <p className="mt-2 text-sm text-base-content/60">
        Our collection will be updated soon.
      </p>
    </div>
  );
};
