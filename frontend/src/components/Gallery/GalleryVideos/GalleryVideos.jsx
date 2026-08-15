import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowUpRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Images,
  Play,
  Search,
  X,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router";

const API_URL = "http://localhost:5000";

const LIMIT = 6;

// =========================================================
// MAIN COMPONENT
// =========================================================

const GalleryVideos = () => {
  // =======================================================
  // STATE
  // =======================================================

  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  // =======================================================
  // FETCH VIDEOS
  // =======================================================

  const {
    data: videoData = {},
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["gallery-all-videos", currentPage],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all-videos`, {
        params: {
          page: currentPage,
          limit: LIMIT,
        },
      });

      return response.data;
    },

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) => previousData,
  });

  // =======================================================
  // BACKEND DATA
  // =======================================================

  const videos = videoData.videos || [];

  const totalPages = videoData.totalPages || 1;

  // =======================================================
  // CATEGORIES
  // =======================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(videos.map((video) => video.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [videos]);

  // =======================================================
  // SEARCH + CATEGORY
  // =======================================================

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return videos.filter((video) => {
      const matchesSearch =
        !query ||
        [
          video.title,
          video.category,
          video.description,
          video.location,
          video.photographer,
          ...(Array.isArray(video.tags) ? video.tags : []),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesCategory =
        selectedCategory === "All" ||
        video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [videos, searchQuery, selectedCategory]);

  // =======================================================
  // PAGINATION
  // =======================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (isLoading) {
    return <GalleryVideosSkeleton />;
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <>
      <main className="min-h-screen bg-base-100">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden border-b border-base-200 bg-base-100">

          {/* Decorative Background */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

            {/* 50 / 50 */}

            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

              {/* =================================================
                  LEFT SIDE
              ================================================= */}

              <div className="max-w-3xl">

                <h1 className="font-playfair text-3xl font-semibold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                  Stories that{" "}
                  <span className="italic text-primary">
                    come alive.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                  Watch our collection of wedding films,
                  celebrations, cinematic stories, and beautiful
                  moments captured through our lens.
                </p>

                <p className="mt-1 text-xs leading-6 text-base-content/50 sm:text-sm">
                  আমাদের লেন্সে ধারণ করা গল্প, আবেগ এবং সুন্দর
                  মুহূর্তগুলোর ভিডিও সংগ্রহ দেখুন।
                </p>

              </div>

              {/* =================================================
                  RIGHT SIDE
              ================================================= */}

              <div className="w-full lg:flex lg:justify-end">

                <div className="w-full rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow-sm sm:p-5 lg:max-w-md">

                  {/* Header */}

                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Images className="h-5 w-5" />
                    </div>

                    <div>

                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                        Explore More
                      </p>

                      <h2 className="mt-1 font-playfair text-lg font-semibold">
                        Gallery Photos Videos
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-base-content/55">
                        Browse photographs or watch our memorable
                        films.
                      </p>

                    </div>

                  </div>

                  {/* Navigation */}

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    {/* Photos */}

                    <Link
                      to="/gallery/photos"
                      className="group flex items-center justify-center gap-2 rounded-xl border border-primary/15 bg-base-100 px-3 py-2.5 text-xs font-semibold text-base-content transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                    >
                      <Camera className="h-4 w-4" />

                      Photos
                    </Link>

                    {/* Videos */}

                    <Link
                      to="/gallery/videos"
                      className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-content transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Play className="h-4 w-4" />

                      Videos
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <section className="sticky top-0 z-30 border-b border-base-200 bg-base-100/90 backdrop-blur-xl">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 lg:px-10">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              {/* SEARCH */}

              <label className="input input-bordered flex w-full items-center gap-3 bg-base-100 lg:max-w-md">

                <Search className="h-4 w-4 text-base-content/50" />

                <input
                  type="text"
                  className="grow"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="btn btn-circle btn-ghost btn-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

              </label>

              {/* CATEGORY */}

              <div className="flex gap-2 overflow-x-auto pb-1">

                {categories.map((category) => (

                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-primary text-primary-content shadow-md"
                        : "border border-base-300 bg-base-100 text-base-content/60 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {category}
                  </button>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">

          {/* TOP INFO */}

          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Video Collection
              </p>

              <h2 className="mt-1 font-playfair text-2xl font-semibold sm:text-3xl">
                Memorable Stories
              </h2>

            </div>

            <p className="text-sm text-base-content/50">
              {filteredVideos.length} video
              {filteredVideos.length !== 1 ? "s" : ""} on this page
            </p>

          </div>

          {/* ERROR */}

          {isError ? (

            <GalleryVideosError onRetry={refetch} />

          ) : filteredVideos.length === 0 ? (

            <GalleryVideosEmpty />

          ) : (

            <>

              {/* =================================================
                  VIDEO GRID
              ================================================= */}

              <div
                className={`grid gap-6 sm:gap-7 md:grid-cols-2 ${
                  isFetching ? "opacity-60" : ""
                }`}
              >

                {filteredVideos.map((video) => (

                  <VideoCard
                    key={video._id}
                    video={video}
                  />

                ))}

              </div>

              {/* =================================================
                  PAGINATION
              ================================================= */}

              {totalPages > 1 && (

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  isFetching={isFetching}
                />

              )}

            </>

          )}

        </section>

      </main>
    </>
  );
};

export default GalleryVideos;

// =========================================================
// VIDEO CARD
// =========================================================

const VideoCard = ({ video }) => {

  const thumbnail =
    video?.thumbnailUrl ||
    video?.thumbnail ||
    video?.image ||
    "";

  const title =
    video?.title ||
    "Untitled Video";

  const category =
    video?.category ||
    "Video";

  const videoUrl =
    video?.videoUrl ||
    video?.url ||
    "";

  const description =
    video?.description ||
    "";

  return (
    <article className="group overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">

      {/* =================================================
          THUMBNAIL
      ================================================= */}

      <div className="relative aspect-video overflow-hidden bg-base-200 sm:aspect-[16/9] lg:aspect-[16/9]">

        {thumbnail ? (

          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

        ) : (

          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-16 w-16 text-base-content/20" />
          </div>

        )}

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* PLAY */}

        {videoUrl && (

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${title} on Facebook`}
            className="absolute inset-0 flex items-center justify-center"
          >

            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/50 bg-white/90 text-primary shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white sm:h-24 sm:w-24">

              <Play
                className="ml-1 h-9 w-9 fill-current sm:h-10 sm:w-10"
                strokeWidth={1.5}
              />

            </span>

          </a>

        )}

        {/* CATEGORY */}

        <div className="absolute bottom-5 left-5">

          <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {category}
          </span>

        </div>

        {/* FACEBOOK */}

        {videoUrl && (

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open video on Facebook"
            className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110"
          >

            <FaFacebookF className="text-lg" />

          </a>

        )}

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-6 sm:p-7">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <h3 className="font-playfair text-xl font-semibold leading-tight text-base-content sm:text-2xl">
              {title}
            </h3>

            {description && (

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-base-content/60">
                {description}
              </p>

            )}

          </div>

          {videoUrl && (

            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/5 p-3 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-content sm:flex"
              aria-label={`Open ${title}`}
            >
              <ArrowUpRight className="h-4 w-4" />
            </a>

          )}

        </div>

        {/* Divider */}

        <div className="my-5 h-px bg-base-300" />

        {/* WATCH */}

        {videoUrl ? (

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors duration-300 hover:text-primary/70"
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B66FB] text-white">
              <FaFacebookF className="text-sm" />
            </span>

            <span>
              Watch on Facebook
            </span>

            <ArrowUpRight className="h-4 w-4" />

          </a>

        ) : (

          <span className="text-sm text-base-content/40">
            Video link unavailable
          </span>

        )}

      </div>

    </article>
  );
};

// =========================================================
// PAGINATION
// =========================================================

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isFetching,
}) => {

  const pages = [];

  const start = Math.max(
    1,
    currentPage - 2
  );

  const end = Math.min(
    totalPages,
    currentPage + 2
  );

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">

      {/* PREVIOUS */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage - 1)
        }
        disabled={
          currentPage === 1 ||
          isFetching
        }
        className="btn btn-outline btn-sm rounded-full"
      >

        <ChevronLeft className="h-4 w-4" />

        <span className="hidden sm:inline">
          Previous
        </span>

      </button>

      {/* PAGE NUMBERS */}

      {pages.map((page) => (

        <button
          key={page}
          type="button"
          onClick={() =>
            onPageChange(page)
          }
          disabled={isFetching}
          className={`h-9 min-w-9 rounded-full px-3 text-sm font-semibold transition-all ${
            currentPage === page
              ? "bg-primary text-primary-content shadow-md"
              : "border border-base-300 bg-base-100 hover:border-primary/40 hover:text-primary"
          }`}
        >
          {page}
        </button>

      ))}

      {/* NEXT */}

      <button
        type="button"
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        disabled={
          currentPage === totalPages ||
          isFetching
        }
        className="btn btn-outline btn-sm rounded-full"
      >

        <span className="hidden sm:inline">
          Next
        </span>

        <ChevronRight className="h-4 w-4" />

      </button>

    </div>
  );
};

// =========================================================
// LOADING SKELETON
// =========================================================

const GalleryVideosSkeleton = () => {

  return (
    <main className="min-h-screen bg-base-100">

      {/* HERO */}

      <section className="border-b border-base-200">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10">

          <div className="grid items-center gap-8 lg:grid-cols-2">

            <div>

              <div className="h-4 w-28 animate-pulse rounded bg-base-200" />

              <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-xl bg-base-200 sm:h-16" />

              <div className="mt-5 h-16 max-w-xl animate-pulse rounded bg-base-200" />

            </div>

            <div className="h-44 w-full animate-pulse rounded-2xl bg-base-200 lg:ml-auto lg:max-w-md" />

          </div>

        </div>

      </section>

      {/* FILTER */}

      <section className="border-b border-base-200">

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 lg:px-10">

          <div className="h-12 max-w-md animate-pulse rounded-full bg-base-200" />

        </div>

      </section>

      {/* VIDEOS */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-10">

        <div className="grid gap-6 md:grid-cols-2">

          {Array.from({ length: 6 }).map((_, index) => (

            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm"
            >

              <div className="aspect-video animate-pulse bg-base-200" />

              <div className="space-y-4 p-6">

                <div className="h-6 w-3/4 animate-pulse rounded bg-base-200" />

                <div className="h-4 w-full animate-pulse rounded bg-base-200" />

                <div className="h-4 w-2/3 animate-pulse rounded bg-base-200" />

              </div>

            </div>

          ))}

        </div>

      </section>

    </main>
  );
};

// =========================================================
// ERROR
// =========================================================

const GalleryVideosError = ({ onRetry }) => {

  return (
    <div className="rounded-3xl border border-error/10 bg-error/5 px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">

        <Play className="h-7 w-7" />

      </div>

      <h3 className="mt-5 font-playfair text-2xl font-semibold">
        Unable to load videos
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        Something went wrong while loading the video gallery.
        Please try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="btn btn-primary mt-6 rounded-full"
      >
        Try Again
      </button>

    </div>
  );
};

// =========================================================
// EMPTY
// =========================================================

const GalleryVideosEmpty = () => {

  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-16 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">

        <Play className="h-7 w-7" />

      </div>

      <h3 className="mt-5 font-playfair text-2xl font-semibold">
        No videos found / কোনো ভিডিও পাওয়া যায়নি
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        We couldn't find any videos matching your search
        or selected category.
      </p>

    </div>
  );
};