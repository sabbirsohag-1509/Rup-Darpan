import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  Camera,
  Play,
  Video,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const API_URL = "http://localhost:5000/featured-videos";

const FeaturedGalleryVideos = () => {
  // =========================================================
  // FETCH FEATURED VIDEOS
  // =========================================================

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["featured-videos"],

    queryFn: async () => {
      const response = await axios.get(API_URL);

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });

  // =========================================================
  // DATA
  // =========================================================

  const videos = data?.videos || [];

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-error/20 bg-error/5 px-6 py-10 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-error" />

            <h3 className="mt-4 font-playfair text-2xl font-semibold">
              Featured Videos
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              {error?.response?.data?.message ||
                "Unable to load featured videos right now."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-primary/40" />

            <Video className="h-5 w-5 text-primary" />

            <span className="h-px w-8 bg-primary/40" />
          </div>

          <h2 className="font-playfair text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Featured Videos
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Relive the emotions, moments and stories behind
            some of our most memorable celebrations.
          </p>
        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm"
              >
                {/* Video skeleton */}
                <div className="aspect-video animate-pulse bg-base-300" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 animate-pulse rounded bg-base-300" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-base-300" />

                  <div className="h-4 w-full animate-pulse rounded bg-base-300" />

                  <div className="h-4 w-5/6 animate-pulse rounded bg-base-300" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          /* ===================================================
              EMPTY STATE
          =================================================== */

          <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 text-center sm:py-14">
            <Camera className="mx-auto h-8 w-8 text-primary" />

            <h3 className="mt-4 font-playfair text-2xl font-semibold">
              Featured Gallery
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              No featured videos available yet.
            </p>
          </div>
        ) : (
          <>
            {/* =================================================
                VIDEO GRID
            ================================================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {videos.map((video) => (
                <article
                  key={video._id}
                  className="group overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* ==========================================
                      FACEBOOK VIDEO
                  ========================================== */}

                  <div className="relative aspect-video overflow-hidden bg-base-300">
                    {video.embedUrl ? (
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        className="absolute inset-0 h-full w-full"
                        style={{
                          border: "none",
                          overflow: "hidden",
                        }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <Play className="mx-auto h-8 w-8 text-base-content/30" />

                          <p className="mt-2 text-sm text-base-content/50">
                            Video unavailable
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ==========================================
                      VIDEO INFORMATION
                  ========================================== */}

                  <div className="p-5 sm:p-6">
                    {/* Category */}

                    {video.category && (
                      <span className="badge badge-primary badge-outline text-xs font-medium">
                        {video.category}
                      </span>
                    )}

                    {/* Title */}

                    <h3 className="mt-3 font-playfair text-xl font-semibold leading-tight sm:text-2xl">
                      {video.title}
                    </h3>

                    {/* Description */}

                    {video.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-base-content/60">
                        {video.description}
                      </p>
                    )}

                    {/* Bottom */}

                    <div className="mt-5 flex items-center justify-between border-t border-base-300 pt-4">
                      <div className="flex items-center gap-2 text-xs text-base-content/50">
                        <Video className="h-4 w-4" />

                        <span>Featured Story</span>
                      </div>

                      {video.videoUrl && (
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-ghost gap-1 text-primary hover:bg-primary/10"
                        >
                          Watch
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* =================================================
                VIEW ALL CTA
            ================================================= */}

            <div className="mt-10 flex justify-center sm:mt-14">
              <Link
                to="/videos"
                className="btn btn-primary gap-2 px-6 text-primary-content"
              >
                View All Videos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedGalleryVideos;