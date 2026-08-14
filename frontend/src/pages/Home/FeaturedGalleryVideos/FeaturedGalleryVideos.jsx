import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Camera, Play, ExternalLink } from "lucide-react";

const API_URL = "http://localhost:5000";

const FeaturedGalleryVideos = () => {
  const {
    data: videoData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-videos"],

    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/featured-videos`
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });

  const videos = videoData.videos || [];

  // Loading
  if (isLoading) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl bg-base-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error / Empty
  if (isError || videos.length === 0) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 text-center">
            <Camera className="mx-auto h-8 w-8 text-primary" />

            <h3 className="mt-4 font-playfair text-2xl font-semibold">
              Featured Gallery
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              No featured videos available yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Camera className="mx-auto h-8 w-8 text-primary" />

          <h2 className="mt-4 font-playfair text-3xl font-semibold sm:text-4xl">
            Featured Gallery
          </h2>

          <p className="mt-3 text-sm leading-6 text-base-content/60 sm:text-base">
            Relive some of our most memorable moments through
            stories, celebrations, and beautiful wedding films.
          </p>
        </div>

        {/* Videos */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video._id}
              className="group overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Facebook Video */}
              <div className="relative aspect-video overflow-hidden bg-base-200">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="absolute inset-0 h-full w-full"
                  style={{ border: "none" }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="badge badge-primary badge-outline">
                    {video.category || "Wedding"}
                  </span>

                  <Play className="h-4 w-4 text-primary" />
                </div>

                <h3 className="font-playfair text-xl font-semibold">
                  {video.title}
                </h3>

                {video.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-base-content/60">
                    {video.description}
                  </p>
                )}

                {video.videoUrl && (
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/70"
                  >
                    Watch on Facebook
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGalleryVideos;