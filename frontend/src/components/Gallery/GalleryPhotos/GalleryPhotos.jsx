import { useMemo, useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Image as ImageIcon,
  Images,
  MapPin,
  Play,
  Search,
  Tag,
  User,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router";

const API_URL = "http://localhost:5000";

// =========================================================
// MAIN COMPONENT
// =========================================================

const GalleryPhotos = () => {
  // =======================================================
  // STATE
  // =======================================================

  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const LIMIT = 9;

  // =======================================================
  // FETCH PHOTOS
  // =======================================================

  const {
    data: photoData = {},
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["gallery-all-photos", currentPage],

    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all-photos`, {
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

  const photos = photoData.photos || [];

  const totalPages = photoData.totalPages || 1;

  // =======================================================
  // CATEGORIES
  // =======================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(photos.map((photo) => photo.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [photos]);

  // =======================================================
  // SEARCH + CATEGORY
  // =======================================================

  const filteredPhotos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return photos.filter((photo) => {
      const matchesSearch =
        !query ||
        [
          photo.title,
          photo.category,
          photo.photographer,
          photo.location,
          photo.description,
          ...(Array.isArray(photo.tags) ? photo.tags : []),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query),
          );

      const matchesCategory =
        selectedCategory === "All" ||
        photo.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [photos, searchQuery, selectedCategory]);

  // =======================================================
  // IMAGE CLICK
  // =======================================================

  const openPhoto = (photo) => {
    setSelectedPhoto(photo);

    document.body.style.overflow = "hidden";
  };

  // =======================================================
  // CLOSE MODAL
  // =======================================================

  const closePhoto = () => {
    setSelectedPhoto(null);

    document.body.style.overflow = "";
  };

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
    return <GalleryPhotosSkeleton />;
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
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
              {/* LEFT CONTENT */}

              <div className="max-w-3xl">
                {/* Label */}

                <div className="mb-4 flex items-center gap-2 text-primary">
                  <Camera className="h-5 w-5" />

                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Our Gallery Photos
                  </span>
                </div>

                {/* Heading */}

                <h1 className="font-playfair text-3xl font-semibold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                  Stories captured{" "}
                  <span className="italic text-primary">
                    through our lens.
                  </span>
                </h1>

                {/* Description */}

                <p className="mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                  Explore our collection of photographs from
                  weddings, celebrations, portraits, outdoor
                  sessions, and beautiful moments.
                </p>

                <p className="mt-1 text-xs leading-6 text-base-content/50 sm:text-sm">
                  আমাদের লেন্সে ধরা পড়া সুন্দর মুহূর্তগুলোর
                  সম্পূর্ণ সংগ্রহ।
                </p>
              </div>

              {/* RIGHT NAVIGATION */}

              <div className="w-full lg:w-[280px]">
                <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow-sm sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Images className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                        Explore More
                      </p>

                      <h2 className="mt-1 font-playfair text-lg font-semibold">
                        Gallery Films Stories
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-base-content/55">
                        Browse photographs or watch our memorable
                        films.
                      </p>
                    </div>
                  </div>

                  {/* Navigation Buttons */}

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      to="/gallery/photos"
                      className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-content transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Camera className="h-4 w-4" />

                      Photos
                    </Link>

                    <Link
                      to="/gallery/videos"
                      className="group flex items-center justify-center gap-2 rounded-xl border border-primary/15 bg-base-100 px-3 py-2.5 text-xs font-semibold text-base-content transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
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
                  placeholder="Search photos..."
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
                Photography Collection
              </p>

              <h2 className="mt-1 font-playfair text-2xl font-semibold sm:text-3xl">
                Captured Moments
              </h2>
            </div>

            <p className="text-sm text-base-content/50">
              {filteredPhotos.length} photo
              {filteredPhotos.length !== 1 ? "s" : ""} on this
              page
            </p>
          </div>

          {/* ERROR */}

          {isError ? (
            <GalleryError onRetry={refetch} />
          ) : filteredPhotos.length === 0 ? (
            <GalleryEmpty />
          ) : (
            <>
              {/* =================================================
                  MASONRY GALLERY
              ================================================= */}

              <div
                className={`columns-1 gap-5 sm:columns-2 lg:columns-3 ${
                  isFetching ? "opacity-60" : ""
                }`}
              >
                {filteredPhotos.map((photo) => (
                  <PhotoCard
                    key={photo._id}
                    photo={photo}
                    onClick={() => openPhoto(photo)}
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

      {/* =====================================================
          PHOTO DETAIL MODAL
      ===================================================== */}

      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={closePhoto}
          onSelectPhoto={setSelectedPhoto}
        />
      )}
    </>
  );
};

export default GalleryPhotos;

// =========================================================
// PHOTO CARD
// =========================================================

const PhotoCard = ({ photo, onClick }) => {
  const imageUrl =
    photo?.image ||
    photo?.imageUrl ||
    photo?.photoUrl ||
    photo?.url ||
    "";

  const title = photo?.title || "Untitled Photograph";

  const category = photo?.category || "Photography";

  return (
    <article
      onClick={onClick}
      className="group relative mb-5 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-base-200 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:rounded-3xl"
    >
      {/* IMAGE */}

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
      ) : (
        <div className="flex min-h-[300px] items-center justify-center bg-base-200">
          <ImageIcon className="h-12 w-12 text-base-content/20" />
        </div>
      )}

      {/* GRADIENT */}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* FEATURED */}

      {photo?.featured && (
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          <span className="text-primary">★</span>
          Featured
        </div>
      )}

      {/* CATEGORY */}

      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
        {category}
      </div>

      {/* HOVER CONTENT */}

      <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-playfair text-xl font-semibold text-white sm:text-2xl">
              {title}
            </h3>

            {photo?.photographer && (
              <p className="mt-1 flex items-center gap-1.5 text-xs text-white/70">
                <User className="h-3.5 w-3.5" />

                {photo.photographer}
              </p>
            )}
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black shadow-xl">
            <ZoomIn className="h-5 w-5" />
          </div>
        </div>
      </div>
    </article>
  );
};

// =========================================================
// PHOTO DETAIL MODAL
// =========================================================

const PhotoDetailModal = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  const [zoom, setZoom] = useState(1);

  // -------------------------------------------------------
  // IMAGE URL
  // -------------------------------------------------------

  const imageUrl =
    photo?.image ||
    photo?.imageUrl ||
    photo?.photoUrl ||
    photo?.url ||
    "";

  const title = photo?.title || "Untitled Photograph";

  const category = photo?.category || "Photography";

  const tags = Array.isArray(photo?.tags) ? photo.tags : [];

  // -------------------------------------------------------
  // CURRENT PHOTO INDEX
  // -------------------------------------------------------

  const currentIndex = photos.findIndex(
    (item) => item._id === photo?._id,
  );

  const hasPrevious = currentIndex > 0;

  const hasNext =
    currentIndex !== -1 &&
    currentIndex < photos.length - 1;

  // -------------------------------------------------------
  // RESET ZOOM WHEN PHOTO CHANGES
  // -------------------------------------------------------

  useEffect(() => {
    setZoom(1);
  }, [photo?._id]);

  // -------------------------------------------------------
  // ZOOM FUNCTIONS
  // -------------------------------------------------------

  const zoomIn = useCallback(() => {
    setZoom((previous) =>
      Math.min(previous + 0.25, 3),
    );
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((previous) =>
      Math.max(previous - 0.25, 0.5),
    );
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // -------------------------------------------------------
  // PREVIOUS
  // -------------------------------------------------------

  const showPrevious = useCallback(() => {
    if (!hasPrevious) return;

    onSelectPhoto(photos[currentIndex - 1]);
  }, [
    hasPrevious,
    currentIndex,
    photos,
    onSelectPhoto,
  ]);

  // -------------------------------------------------------
  // NEXT
  // -------------------------------------------------------

  const showNext = useCallback(() => {
    if (!hasNext) return;

    onSelectPhoto(photos[currentIndex + 1]);
  }, [
    hasNext,
    currentIndex,
    photos,
    onSelectPhoto,
  ]);

  // -------------------------------------------------------
  // KEYBOARD CONTROLS
  // -------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }

      if (event.key === "+" || event.key === "=") {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetZoom();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    onClose,
    showPrevious,
    showNext,
    zoomIn,
    zoomOut,
    resetZoom,
  ]);

  // -------------------------------------------------------
  // MOUSE WHEEL ZOOM
  // -------------------------------------------------------

  const handleWheel = (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // -------------------------------------------------------
  // DATE
  // -------------------------------------------------------

  const formattedDate = photo?.createdAt
    ? new Date(photo.createdAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 backdrop-blur-md sm:p-4 lg:p-8"
      onClick={onClose}
    >
      {/* =================================================
          MODAL
      ================================================= */}

      <div
        className="relative flex h-[96vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-base-100/95 shadow-2xl backdrop-blur-2xl sm:h-[94vh] sm:rounded-3xl lg:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        {/* =================================================
            TOP CONTROL BAR
        ================================================= */}

        <div className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/55 p-1.5 shadow-xl backdrop-blur-xl sm:top-5 sm:gap-2 sm:p-2">
          {/* ZOOM OUT */}

          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* ZOOM LEVEL */}

          <span className="min-w-[48px] text-center text-xs font-semibold text-white">
            {Math.round(zoom * 100)}%
          </span>

          {/* ZOOM IN */}

          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30 sm:h-10 sm:w-10"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* RESET */}

          <button
            type="button"
            onClick={resetZoom}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-10 sm:w-10"
            title="Reset zoom"
          >
            <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white backdrop-blur-md transition hover:bg-black/75 sm:right-5 sm:top-5"
          aria-label="Close photo"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* =================================================
            PREVIOUS BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={showPrevious}
          disabled={!hasPrevious}
          className="absolute left-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-black/75 disabled:pointer-events-none disabled:opacity-20 sm:left-5 sm:h-12 sm:w-12 lg:left-7"
          title="Previous photo"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* =================================================
            NEXT BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={showNext}
          disabled={!hasNext}
          className="absolute right-3 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-black/75 disabled:pointer-events-none disabled:opacity-20 sm:right-5 sm:h-12 sm:w-12 lg:right-[430px]"
          title="Next photo"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* =================================================
            IMAGE AREA
        ================================================= */}

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black"
          onWheel={handleWheel}
        >
          {/* IMAGE */}

          <div className="flex h-full w-full items-center justify-center overflow-auto p-10 sm:p-14 lg:p-16">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              />
            ) : (
              <ImageIcon className="h-20 w-20 text-white/20" />
            )}
          </div>

          {/* CATEGORY LABEL */}

          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/80 backdrop-blur-md sm:bottom-5 sm:left-5">
            <Camera className="h-3.5 w-3.5" />

            {category}
          </div>

          {/* PHOTO COUNTER */}

          {photos.length > 0 && currentIndex !== -1 && (
            <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs font-medium text-white/80 backdrop-blur-md sm:bottom-5 sm:right-5">
              {currentIndex + 1} / {photos.length}
            </div>
          )}

          {/* ZOOM HINT */}

          <div className="pointer-events-none absolute left-1/2 top-20 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[10px] text-white/60 backdrop-blur-md sm:block">
            Scroll to zoom
          </div>
        </div>

        {/* =================================================
            DETAILS
        ================================================= */}

        <aside className="w-full shrink-0 overflow-y-auto bg-base-100 p-5 sm:p-7 lg:w-[400px] lg:p-8">
          {/* HEADER */}

          <div className="border-b border-base-200 pb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                {category}
              </span>

              {photo?.featured && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                  ★ Featured
                </span>
              )}
            </div>

            <h2 className="mt-4 font-playfair text-2xl font-semibold leading-tight sm:text-3xl">
              {title}
            </h2>

            {photo?.description && (
              <p className="mt-3 text-sm leading-7 text-base-content/60">
                {photo.description}
              </p>
            )}
          </div>

          {/* INFO */}

          <div className="space-y-4 py-6">
            {photo?.photographer && (
              <DetailRow
                icon={<User className="h-4 w-4" />}
                label="Photographer"
                value={photo.photographer}
              />
            )}

            {photo?.location && (
              <DetailRow
                icon={<MapPin className="h-4 w-4" />}
                label="Location"
                value={photo.location}
              />
            )}

            {formattedDate && (
              <DetailRow
                icon={<CalendarDays className="h-4 w-4" />}
                label="Captured"
                value={formattedDate}
              />
            )}
          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 gap-3 border-y border-base-200 py-5">
            <div className="rounded-2xl bg-base-200/60 p-4">
              <Heart className="h-4 w-4 text-primary" />

              <p className="mt-2 text-lg font-semibold">
                {photo?.likes ?? 0}
              </p>

              <p className="text-xs text-base-content/50">
                Likes
              </p>
            </div>

            <div className="rounded-2xl bg-base-200/60 p-4">
              <Eye className="h-4 w-4 text-primary" />

              <p className="mt-2 text-lg font-semibold">
                {photo?.views ?? 0}
              </p>

              <p className="text-xs text-base-content/50">
                Views
              </p>
            </div>
          </div>

          {/* TAGS */}

          {tags.length > 0 && (
            <div className="pt-6">
              <div className="mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />

                <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Tags
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full border border-base-300 bg-base-200/50 px-3 py-1.5 text-xs text-base-content/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MODAL NAVIGATION */}

          <div className="mt-7 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={showPrevious}
              disabled={!hasPrevious}
              className="btn btn-outline rounded-full disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />

              Previous
            </button>

            <button
              type="button"
              onClick={showNext}
              disabled={!hasNext}
              className="btn btn-primary rounded-full disabled:opacity-30"
            >
              Next

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* BACK */}

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost mt-2 w-full rounded-full"
          >
            <X className="h-4 w-4" />

            Close
          </button>
        </aside>
      </div>
    </div>
  );
};

// =========================================================
// DETAIL ROW
// =========================================================

const DetailRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-base-content">
          {value}
        </p>
      </div>
    </div>
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

  const start = Math.max(1, currentPage - 2);

  const end = Math.min(
    totalPages,
    currentPage + 2,
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
        disabled={currentPage === 1 || isFetching}
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
          onClick={() => onPageChange(page)}
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
          currentPage === totalPages || isFetching
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

const GalleryPhotosSkeleton = () => {
  return (
    <main className="min-h-screen bg-base-100">
      {/* HERO */}

      <section className="border-b border-base-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10">
          <div className="h-4 w-28 animate-pulse rounded bg-base-200" />

          <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-xl bg-base-200 sm:h-16" />

          <div className="mt-5 h-4 max-w-xl animate-pulse rounded bg-base-200" />
        </div>
      </section>

      {/* FILTER */}

      <section className="border-b border-base-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 lg:px-10">
          <div className="h-12 max-w-md animate-pulse rounded-full bg-base-200" />
        </div>
      </section>

      {/* GRID */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-10">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {Array.from({ length: 9 }).map(
            (_, index) => (
              <div
                key={index}
                className={`mb-5 break-inside-avoid animate-pulse rounded-3xl bg-base-200 ${
                  index % 3 === 0
                    ? "h-[480px]"
                    : index % 3 === 1
                      ? "h-[350px]"
                      : "h-[420px]"
                }`}
              />
            ),
          )}
        </div>
      </section>
    </main>
  );
};

// =========================================================
// ERROR
// =========================================================

const GalleryError = ({ onRetry }) => {
  return (
    <div className="rounded-3xl border border-error/10 bg-error/5 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
        <ImageIcon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-playfair text-2xl font-semibold">
        Unable to load photos
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        Something went wrong while loading the gallery.
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

const GalleryEmpty = () => {
  return (
    <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Camera className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-playfair text-2xl font-semibold">
        No photos found / কোনো ছবি পাওয়া যায়নি
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        We couldn't find any photos matching your
        search or selected category. / আপনার অনুসন্ধান
        বা নির্বাচিত ক্যাটাগরির সাথে মিলে এমন কোনো ছবি
        আমরা খুঁজে পাইনি।
      </p>
    </div>
  );
};