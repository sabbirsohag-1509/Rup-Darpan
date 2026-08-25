import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import {
  useQuery,
  useQueries,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
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

const LIMIT = 9;

const VISITOR_ID_KEY = "rupdarpan_visitor_id";
const LIKED_PHOTOS_KEY = "rupdarpan_liked_photos";

// =========================================================
// GET / CREATE VISITOR ID
// =========================================================

const getVisitorId = () => {
  try {
    const existingVisitorId =
      localStorage.getItem(VISITOR_ID_KEY);

    if (existingVisitorId) {
      return existingVisitorId;
    }

    const newVisitorId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `visitor-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 12)}`;

    localStorage.setItem(
      VISITOR_ID_KEY,
      newVisitorId
    );

    return newVisitorId;
  } catch (error) {
    console.error(
      "Failed to create visitor ID:",
      error
    );

    return `visitor-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 12)}`;
  }
};

// =========================================================
// GET LOCALLY LIKED PHOTOS
// =========================================================

const getLikedPhotos = () => {
  try {
    const stored =
      localStorage.getItem(LIKED_PHOTOS_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Failed to read liked photos:",
      error
    );

    return [];
  }
};

// =========================================================
// SAVE LOCALLY LIKED PHOTOS
// =========================================================

const saveLikedPhotos = (likedPhotos) => {
  try {
    localStorage.setItem(
      LIKED_PHOTOS_KEY,
      JSON.stringify(likedPhotos)
    );
  } catch (error) {
    console.error(
      "Failed to save liked photos:",
      error
    );
  }
};

// =========================================================
// FORMAT LIKE COUNT
// =========================================================

const formatLikeCount = (count = 0) => {
  const number = Number(count) || 0;

  if (number < 1000) {
    return String(number);
  }

  if (number < 1_000_000) {
    const value = number / 1000;

    return `${value
      .toFixed(value >= 10 ? 0 : 1)
      .replace(/\.0$/, "")}K`;
  }

  if (number < 1_000_000_000) {
    const value = number / 1_000_000;

    return `${value
      .toFixed(value >= 10 ? 0 : 1)
      .replace(/\.0$/, "")}M`;
  }

  const value = number / 1_000_000_000;

  return `${value
    .toFixed(value >= 10 ? 0 : 1)
    .replace(/\.0$/, "")}B`;
};

// =========================================================
// MAIN COMPONENT
// =========================================================

const GalleryPhotos = () => {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] =
    useState(1);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedPhoto, setSelectedPhoto] =
    useState(null);

  // =======================================================
  // VISITOR ID
  // =======================================================

  const [visitorId] = useState(() =>
    getVisitorId()
  );

  // =======================================================
  // LOCAL LIKES
  // =======================================================

  const [likedPhotos, setLikedPhotos] =
    useState(() => getLikedPhotos());

  // =======================================================
  // LIKE COUNTS
  // =======================================================

  const [likeCounts, setLikeCounts] =
    useState({});

  // =======================================================
  // LIKE REQUEST LOCK
  // Prevent rapid duplicate clicks
  // =======================================================

  const likingPhotosRef = useRef(new Set());

  // =======================================================
  // SERVER LIKE STATUS SYNC TRACKER
  // Prevent stale GET responses from overwriting
  // fresh local like state
  // =======================================================

  const syncedLikeStatusRef = useRef(
    new Set()
  );

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
    queryKey: [
      "gallery-all-photos",
      currentPage,
    ],

    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/all-photos`,
        {
          params: {
            page: currentPage,
            limit: LIMIT,
          },
        }
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 5,

    placeholderData: (previousData) =>
      previousData,

    refetchOnWindowFocus: false,
  });

  // =======================================================
  // BACKEND DATA
  // =======================================================

  const photos = photoData.photos || [];

  const totalPages =
    photoData.totalPages || 1;

  // =======================================================
  // GET LIKE STATUS + COUNT
  // =======================================================

  const likeQueries = useQueries({
    queries: photos.map((photo) => ({
      queryKey: [
        "photo-like",
        photo._id,
        visitorId,
      ],

      queryFn: async () => {
        const response = await axios.get(
          `${API_URL}/photos/${photo._id}/like/${visitorId}`
        );

        return response.data;
      },

      enabled:
        Boolean(photo?._id) &&
        Boolean(visitorId),

      staleTime: 1000 * 60 * 2,

      refetchOnWindowFocus: false,

      retry: 1,
    })),
  });

  // =======================================================
  // LIKE DATA MAP
  // =======================================================

  const likeDataMap = useMemo(() => {
    const map = {};

    photos.forEach((photo, index) => {
      const data =
        likeQueries[index]?.data;

      if (data) {
        map[photo._id] = data;
      }
    });

    return map;
  }, [photos, likeQueries]);

  // =======================================================
  // INITIAL LIKE COUNTS + SERVER STATUS
  //
  // IMPORTANT:
  // We only sync a photo's server status once.
  // This prevents stale GET responses from undoing
  // a fresh POST like/unlike.
  // =======================================================

  useEffect(() => {
    if (!photos.length) {
      return;
    }

    photos.forEach((photo, index) => {
      const photoId = photo?._id;

      if (!photoId) {
        return;
      }

      const queryData =
        likeQueries[index]?.data;

      // ---------------------------------------------------
      // Initial count
      // ---------------------------------------------------

      if (queryData) {
        setLikeCounts((previous) => {
          if (
            previous[photoId] ===
            queryData.likes
          ) {
            return previous;
          }

          return {
            ...previous,
            [photoId]:
              queryData.likes ?? 0,
          };
        });
      } else {
        setLikeCounts((previous) => {
          if (
            previous[photoId] !== undefined
          ) {
            return previous;
          }

          return {
            ...previous,
            [photoId]:
              photo.likes ?? 0,
          };
        });
      }

      // ---------------------------------------------------
      // Sync liked status only once per photo
      // ---------------------------------------------------

      if (
        queryData &&
        !syncedLikeStatusRef.current.has(
          photoId
        )
      ) {
        syncedLikeStatusRef.current.add(
          photoId
        );

        setLikedPhotos((previous) => {
          let updated = previous;

          if (queryData.liked === true) {
            if (
              !previous.includes(photoId)
            ) {
              updated = [
                ...previous,
                photoId,
              ];
            }
          } else {
            if (
              previous.includes(photoId)
            ) {
              updated = previous.filter(
                (id) => id !== photoId
              );
            }
          }

          if (updated !== previous) {
            saveLikedPhotos(updated);
          }

          return updated;
        });
      }
    });
  }, [photos, likeQueries]);

  // =======================================================
  // CATEGORIES
  // =======================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        photos
          .map((photo) => photo.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [photos]);

  // =======================================================
  // SEARCH + CATEGORY
  // =======================================================

  const filteredPhotos = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return photos.filter((photo) => {
      const searchableValues = [
        photo.title,
        photo.category,
        photo.photographer,
        photo.location,
        photo.description,
        ...(Array.isArray(photo.tags)
          ? photo.tags
          : []),
      ];

      const matchesSearch =
        !query ||
        searchableValues
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          );

      const matchesCategory =
        selectedCategory === "All" ||
        photo.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    photos,
    searchQuery,
    selectedCategory,
  ]);

  // =======================================================
  // OPEN PHOTO
  // =======================================================

  const openPhoto = useCallback((photo) => {
    setSelectedPhoto(photo);

    document.body.style.overflow =
      "hidden";
  }, []);

  // =======================================================
  // CLOSE PHOTO
  // =======================================================

  const closePhoto = useCallback(() => {
    setSelectedPhoto(null);

    document.body.style.overflow = "";
  }, []);

  // =======================================================
  // LIKE PHOTO
  //
  // Optimistic update:
  // 1. UI changes immediately
  // 2. Server request happens
  // 3. Server result confirms state
  // 4. Error rolls back
  // =======================================================

  const handleLike = useCallback(
    async (photoId) => {
      if (!photoId || !visitorId) {
        return null;
      }

      // ---------------------------------------------------
      // Prevent rapid duplicate requests
      // ---------------------------------------------------

      if (
        likingPhotosRef.current.has(
          photoId
        )
      ) {
        return null;
      }

      likingPhotosRef.current.add(
        photoId
      );

      // ---------------------------------------------------
      // Get current state
      // ---------------------------------------------------

      const previousLiked =
        likedPhotos.includes(photoId);

      const previousLikes =
        likeCounts[photoId] ??
        likeDataMap[photoId]?.likes ??
        photos.find(
          (photo) => photo._id === photoId
        )?.likes ??
        0;

      // ---------------------------------------------------
      // Optimistic state
      // ---------------------------------------------------

      const optimisticLiked =
        !previousLiked;

      const optimisticLikes =
        Math.max(
          0,
          previousLikes +
            (optimisticLiked ? 1 : -1)
        );

      // ---------------------------------------------------
      // Update liked photos immediately
      // ---------------------------------------------------

      setLikedPhotos((previous) => {
        let updated;

        if (optimisticLiked) {
          updated = previous.includes(
            photoId
          )
            ? previous
            : [...previous, photoId];
        } else {
          updated = previous.filter(
            (id) => id !== photoId
          );
        }

        saveLikedPhotos(updated);

        return updated;
      });

      // ---------------------------------------------------
      // Update count immediately
      // ---------------------------------------------------

      setLikeCounts((previous) => ({
        ...previous,
        [photoId]: optimisticLikes,
      }));

      // ---------------------------------------------------
      // Update React Query immediately
      // ---------------------------------------------------

      queryClient.setQueryData(
        [
          "photo-like",
          photoId,
          visitorId,
        ],
        {
          liked: optimisticLiked,
          likes: optimisticLikes,
        }
      );

      try {
        // -------------------------------------------------
        // Cancel old GET request before POST
        // -------------------------------------------------

        await queryClient.cancelQueries({
          queryKey: [
            "photo-like",
            photoId,
            visitorId,
          ],
        });

        // -------------------------------------------------
        // POST LIKE
        // -------------------------------------------------

        const response = await axios.post(
          `${API_URL}/photos/${photoId}/like`,
          {
            visitorId,
          }
        );

        const {
          liked,
          likes,
        } = response.data;

        // -------------------------------------------------
        // Server confirmed count
        // -------------------------------------------------

        setLikeCounts((previous) => ({
          ...previous,
          [photoId]:
            Number(likes) || 0,
        }));

        // -------------------------------------------------
        // Server confirmed liked state
        // -------------------------------------------------

        setLikedPhotos((previous) => {
          let updated;

          if (liked) {
            updated = previous.includes(
              photoId
            )
              ? previous
              : [...previous, photoId];
          } else {
            updated = previous.filter(
              (id) => id !== photoId
            );
          }

          saveLikedPhotos(updated);

          return updated;
        });

        // -------------------------------------------------
        // Update React Query cache
        // -------------------------------------------------

        queryClient.setQueryData(
          [
            "photo-like",
            photoId,
            visitorId,
          ],
          {
            liked,
            likes,
          }
        );

        // -------------------------------------------------
        // Mark as freshly synced
        // -------------------------------------------------

        syncedLikeStatusRef.current.add(
          photoId
        );

        return {
          liked,
          likes,
        };
      } catch (error) {
        console.error(
          "Like photo error:",
          error
        );

        // -------------------------------------------------
        // ROLLBACK LIKED STATE
        // -------------------------------------------------

        setLikedPhotos((previous) => {
          let updated;

          if (previousLiked) {
            updated = previous.includes(
              photoId
            )
              ? previous
              : [...previous, photoId];
          } else {
            updated = previous.filter(
              (id) => id !== photoId
            );
          }

          saveLikedPhotos(updated);

          return updated;
        });

        // -------------------------------------------------
        // ROLLBACK COUNT
        // -------------------------------------------------

        setLikeCounts((previous) => ({
          ...previous,
          [photoId]: previousLikes,
        }));

        // -------------------------------------------------
        // ROLLBACK QUERY CACHE
        // -------------------------------------------------

        queryClient.setQueryData(
          [
            "photo-like",
            photoId,
            visitorId,
          ],
          {
            liked: previousLiked,
            likes: previousLikes,
          }
        );

        return null;
      } finally {
        likingPhotosRef.current.delete(
          photoId
        );
      }
    },
    [
      visitorId,
      likedPhotos,
      likeCounts,
      likeDataMap,
      photos,
      queryClient,
    ]
  );

  // =======================================================
  // HANDLE PHOTO LIKE
  // =======================================================

  const handlePhotoLike = useCallback(
    async (photoId) => {
      const result =
        await handleLike(photoId);

      if (!result) {
        return;
      }

      // ---------------------------------------------------
      // Update selected modal photo
      // ---------------------------------------------------

      setSelectedPhoto((previous) => {
        if (
          !previous ||
          previous._id !== photoId
        ) {
          return previous;
        }

        return {
          ...previous,
          likes: result.likes,
        };
      });
    },
    [handleLike]
  );

  // =======================================================
  // PAGINATION
  // =======================================================

  const goToPage = useCallback(
    (page) => {
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
    },
    [currentPage, totalPages]
  );

  // =======================================================
  // CLEAN BODY SCROLL
  // =======================================================

  useEffect(() => {
    return () => {
      document.body.style.overflow =
        "";
    };
  }, []);

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
        <title>
          Gallery Photos | Rup Darpon
        </title>

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden border-b border-base-200 bg-base-100">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              {/* LEFT */}

              <div className="max-w-3xl">
                <h1 className="font-playfair text-3xl font-semibold leading-tight text-base-content sm:text-4xl lg:text-5xl">
                  Stories captured{" "}
                  <span className="italic text-primary">
                    through our lens.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-base-content/60 sm:text-base">
                  Explore our collection
                  of photographs from
                  weddings, celebrations,
                  portraits, outdoor
                  sessions, and beautiful
                  moments.
                </p>

                <p className="mt-1 text-xs leading-6 text-base-content/50 sm:text-sm">
                  আমাদের লেন্সে ধরা পড়া
                  সুন্দর মুহূর্তগুলোর
                  সম্পূর্ণ সংগ্রহ।
                </p>
              </div>

              {/* RIGHT */}

              <div className="w-full lg:flex lg:justify-end">
                <div className="w-full rounded-2xl border border-primary/10 bg-primary/5 p-4 shadow-sm sm:p-5 lg:max-w-md">
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
                        Browse photographs or
                        watch our memorable
                        films.
                      </p>
                    </div>
                  </div>

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
            FILTER
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
                    setSearchQuery(
                      event.target.value
                    );

                    setCurrentPage(1);
                  }}
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    className="btn btn-circle btn-ghost btn-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>

              {/* CATEGORY */}

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map(
                  (category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(
                          category
                        );

                        setCurrentPage(1);
                      }}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                        selectedCategory ===
                        category
                          ? "bg-primary text-primary-content shadow-md"
                          : "border border-base-300 bg-base-100 text-base-content/60 hover:border-primary/30 hover:text-primary"
                      }`}
                    >
                      {category}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
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
              {filteredPhotos.length !==
              1
                ? "s"
                : ""}{" "}
              on this page
            </p>
          </div>

          {/* ERROR */}

          {isError ? (
            <GalleryError
              onRetry={refetch}
            />
          ) : filteredPhotos.length ===
            0 ? (
            <GalleryEmpty />
          ) : (
            <>
              {/* GALLERY */}

              <div
                className={`columns-1 gap-5 sm:columns-2 lg:columns-3 ${
                  isFetching
                    ? "opacity-60"
                    : ""
                }`}
              >
                {filteredPhotos.map(
                  (photo) => {
                    const serverLikeData =
                      likeDataMap[
                        photo._id
                      ];

                    const isLiked =
                      likedPhotos.includes(
                        photo._id
                      );

                    const likes =
                      likeCounts[
                        photo._id
                      ] ??
                      serverLikeData?.likes ??
                      photo.likes ??
                      0;

                    return (
                      <PhotoCard
                        key={photo._id}
                        photo={photo}
                        onClick={() =>
                          openPhoto(photo)
                        }
                        isLiked={isLiked}
                        likes={likes}
                      />
                    );
                  }
                )}
              </div>

              {/* PAGINATION */}

              {totalPages > 1 && (
                <Pagination
                  currentPage={
                    currentPage
                  }
                  totalPages={totalPages}
                  onPageChange={
                    goToPage
                  }
                  isFetching={isFetching}
                />
              )}
            </>
          )}
        </section>
      </main>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          photos={filteredPhotos}
          onClose={closePhoto}
          onSelectPhoto={
            setSelectedPhoto
          }
          onLike={handlePhotoLike}
          likedPhotos={likedPhotos}
          likeCounts={likeCounts}
          likeDataMap={likeDataMap}
        />
      )}
    </>
  );
};

export default GalleryPhotos;

// =========================================================
// PHOTO CARD
// =========================================================

const PhotoCard = ({
  photo,
  onClick,
  isLiked,
  likes,
}) => {
  const imageUrl =
    photo?.image ||
    photo?.imageUrl ||
    photo?.photoUrl ||
    photo?.url ||
    "";

  const title =
    photo?.title ||
    "Untitled Photograph";

  const category =
    photo?.category ||
    "Photography";

  return (
    <article
      onClick={onClick}
      className="group relative mb-5 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl bg-base-200 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:rounded-3xl"
    >
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

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {photo?.featured && (
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          <span className="text-primary">
            ★
          </span>
          Featured
        </div>
      )}

      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
        {category}
      </div>

      {/* LIKE BADGE */}

      <div
        className={`absolute bottom-4 left-4 z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold backdrop-blur-md ${
          isLiked
            ? "border-red-700/40 bg-red-950/80 text-red-400"
            : "border-white/20 bg-black/50 text-white"
        }`}
      >
        <Heart
          className={`h-3.5 w-3.5 cursor-pointer ${
            isLiked
              ? "fill-red-700 text-red-700"
              : ""
          }`}
        />

        <span>
          {formatLikeCount(likes)}
        </span>
      </div>

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
  onLike,
  likedPhotos,
  likeCounts,
  likeDataMap,
}) => {
  // =======================================================
  // ZOOM
  // =======================================================

  const [zoom, setZoom] = useState(1);

  // =======================================================
  // PAN POSITION
  // =======================================================

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  // =======================================================
  // LIKE LOADING
  // =======================================================

  const [isLiking, setIsLiking] =
    useState(false);

  // =======================================================
  // DRAG STATE
  // =======================================================

  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPositionX: 0,
    startPositionY: 0,
  });

  // =======================================================
  // PINCH STATE
  // =======================================================

  const pinchState = useRef({
    initialDistance: 0,
    initialZoom: 1,
  });

  // =======================================================
  // IMAGE URL
  // =======================================================

  const imageUrl =
    photo?.image ||
    photo?.imageUrl ||
    photo?.photoUrl ||
    photo?.url ||
    "";

  const title =
    photo?.title ||
    "Untitled Photograph";

  const category =
    photo?.category ||
    "Photography";

  const tags = Array.isArray(photo?.tags)
    ? photo.tags
    : [];

  // =======================================================
  // LIKE STATUS
  // =======================================================

  const serverLikeData =
    likeDataMap?.[photo?._id];

  const isLiked =
    likedPhotos.includes(photo?._id);

  const likes =
    likeCounts[photo?._id] ??
    serverLikeData?.likes ??
    photo?.likes ??
    0;

  // =======================================================
  // CURRENT INDEX
  // =======================================================

  const currentIndex =
    photos.findIndex(
      (item) =>
        item._id === photo?._id
    );

  const hasPrevious =
    currentIndex > 0;

  const hasNext =
    currentIndex !== -1 &&
    currentIndex < photos.length - 1;

  // =======================================================
  // LIKE HANDLER
  // =======================================================

  const handleLikeClick = async (
    event
  ) => {
    event.stopPropagation();

    if (
      isLiking ||
      !photo?._id
    ) {
      return;
    }

    setIsLiking(true);

    try {
      await onLike(photo._id);
    } finally {
      setIsLiking(false);
    }
  };

  // =======================================================
  // RESET
  // =======================================================

  const resetView = useCallback(() => {
    setZoom(1);

    setPosition({
      x: 0,
      y: 0,
    });
  }, []);

  // =======================================================
  // CHANGE ZOOM
  // =======================================================

  const changeZoom = useCallback(
    (newZoom) => {
      const nextZoom = Math.min(
        Math.max(newZoom, 0.5),
        3
      );

      setZoom(nextZoom);

      if (nextZoom <= 1) {
        setPosition({
          x: 0,
          y: 0,
        });
      }
    },
    []
  );

  // =======================================================
  // ZOOM IN
  // =======================================================

  const zoomIn = useCallback(() => {
    setZoom((previous) =>
      Math.min(
        previous + 0.25,
        10
      )
    );
  }, []);

  // =======================================================
  // ZOOM OUT
  // =======================================================

  const zoomOut = useCallback(() => {
    setZoom((previous) => {
      const next = Math.max(
        previous - 0.25,
        0.5
      );

      if (next <= 1) {
        setPosition({
          x: 0,
          y: 0,
        });
      }

      return next;
    });
  }, []);

  // =======================================================
  // PREVIOUS
  // =======================================================

  const showPrevious = useCallback(() => {
    if (!hasPrevious) {
      return;
    }

    onSelectPhoto(
      photos[currentIndex - 1]
    );
  }, [
    hasPrevious,
    currentIndex,
    photos,
    onSelectPhoto,
  ]);

  // =======================================================
  // NEXT
  // =======================================================

  const showNext = useCallback(() => {
    if (!hasNext) {
      return;
    }

    onSelectPhoto(
      photos[currentIndex + 1]
    );
  }, [
    hasNext,
    currentIndex,
    photos,
    onSelectPhoto,
  ]);

  // =======================================================
  // RESET WHEN PHOTO CHANGES
  // =======================================================

  useEffect(() => {
    resetView();
  }, [
    photo?._id,
    resetView,
  ]);

  // =======================================================
  // KEYBOARD
  // =======================================================

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

      if (
        event.key === "+" ||
        event.key === "="
      ) {
        zoomIn();
      }

      if (event.key === "-") {
        zoomOut();
      }

      if (event.key === "0") {
        resetView();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    onClose,
    showPrevious,
    showNext,
    zoomIn,
    zoomOut,
    resetView,
  ]);

  // =======================================================
  // DISTANCE BETWEEN TWO FINGERS
  // =======================================================

  const getDistance = (touches) => {
    const first = touches[0];
    const second = touches[1];

    const dx =
      second.clientX -
      first.clientX;

    const dy =
      second.clientY -
      first.clientY;

    return Math.sqrt(
      dx * dx + dy * dy
    );
  };

  // =======================================================
  // TOUCH START
  // =======================================================

  const handleTouchStart = (
    event
  ) => {
    const touches =
      event.touches;

    if (touches.length === 2) {
      const distance =
        getDistance(touches);

      pinchState.current = {
        initialDistance: distance,
        initialZoom: zoom,
      };

      return;
    }

    if (
      touches.length === 1 &&
      zoom > 1
    ) {
      const touch = touches[0];

      dragState.current = {
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        startPositionX:
          position.x,
        startPositionY:
          position.y,
      };
    }
  };

  // =======================================================
  // TOUCH MOVE
  // =======================================================

  const handleTouchMove = (
    event
  ) => {
    const touches =
      event.touches;

    if (touches.length === 2) {
      event.preventDefault();

      const currentDistance =
        getDistance(touches);

      const {
        initialDistance,
        initialZoom,
      } = pinchState.current;

      if (!initialDistance) {
        return;
      }

      const scale =
        currentDistance /
        initialDistance;

      const nextZoom = Math.min(
        Math.max(
          initialZoom * scale,
          0.5
        ),
        3
      );

      setZoom(nextZoom);

      if (nextZoom <= 1) {
        setPosition({
          x: 0,
          y: 0,
        });
      }

      return;
    }

    if (
      touches.length === 1 &&
      dragState.current
        .isDragging &&
      zoom > 1
    ) {
      event.preventDefault();

      const touch = touches[0];

      const deltaX =
        touch.clientX -
        dragState.current.startX;

      const deltaY =
        touch.clientY -
        dragState.current.startY;

      setPosition({
        x:
          dragState.current
            .startPositionX +
          deltaX,

        y:
          dragState.current
            .startPositionY +
          deltaY,
      });
    }
  };

  // =======================================================
  // TOUCH END
  // =======================================================

  const handleTouchEnd = () => {
    dragState.current.isDragging =
      false;

    pinchState.current = {
      initialDistance: 0,
      initialZoom: zoom,
    };
  };

  // =======================================================
  // MOUSE DOWN
  // =======================================================

  const handleMouseDown = (
    event
  ) => {
    if (event.button !== 0) {
      return;
    }

    if (zoom <= 1) {
      return;
    }

    event.preventDefault();

    dragState.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      startPositionX: position.x,
      startPositionY: position.y,
    };
  };

  // =======================================================
  // MOUSE MOVE
  // =======================================================

  const handleMouseMove = (
    event
  ) => {
    if (
      !dragState.current
        .isDragging ||
      zoom <= 1
    ) {
      return;
    }

    event.preventDefault();

    const deltaX =
      event.clientX -
      dragState.current.startX;

    const deltaY =
      event.clientY -
      dragState.current.startY;

    setPosition({
      x:
        dragState.current
          .startPositionX +
        deltaX,

      y:
        dragState.current
          .startPositionY +
        deltaY,
    });
  };

  // =======================================================
  // MOUSE UP
  // =======================================================

  const handleMouseUp = () => {
    dragState.current.isDragging =
      false;
  };

  // =======================================================
  // MOUSE WHEEL
  // =======================================================

  const handleWheel = (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // =======================================================
  // DOUBLE CLICK
  // =======================================================

  const handleDoubleClick = () => {
    if (zoom > 1) {
      resetView();
    } else {
      changeZoom(2);
    }
  };

  // =======================================================
  // DATE
  // =======================================================

  const formattedDate =
    photo?.createdAt
      ? new Date(
          photo.createdAt
        ).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : null;

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div
      className="fixed inset-0 z-[100] flex h-[100dvh] w-full items-center justify-center bg-black/85 p-0 backdrop-blur-md sm:p-3 lg:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex h-full max-h-[100dvh] w-full max-w-[1500px] flex-col overflow-hidden bg-base-100 shadow-2xl sm:h-[96dvh] sm:rounded-2xl lg:h-[94vh] lg:flex-row lg:rounded-3xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            CONTROL BAR
        ================================================= */}

        <div className="absolute left-1/2 top-2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/10 bg-black/65 p-1 shadow-xl backdrop-blur-xl sm:top-4 sm:gap-1 sm:p-1.5">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-30 sm:h-10 sm:w-10"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <span className="min-w-[42px] text-center text-[10px] font-semibold text-white sm:min-w-[50px] sm:text-xs">
            {Math.round(
              zoom * 100
            )}
            %
          </span>

          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 disabled:opacity-30 sm:h-10 sm:w-10"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            type="button"
            onClick={resetView}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/15 sm:h-10 sm:w-10"
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
          className="absolute right-2 top-2 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white backdrop-blur-md transition hover:bg-black/80 sm:right-4 sm:top-4 sm:h-10 sm:w-10"
          aria-label="Close photo"
        >
          <X className="h-5 w-5" />
        </button>

        {/* =================================================
            PREVIOUS
        ================================================= */}

        <button
          type="button"
          onClick={showPrevious}
          disabled={!hasPrevious}
          className="absolute left-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-black/80 disabled:pointer-events-none disabled:opacity-20 sm:left-4 sm:h-12 sm:w-12 lg:left-6"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* =================================================
            IMAGE AREA
        ================================================= */}

        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black"
          style={{
            touchAction:
              zoom > 1
                ? "none"
                : "pan-y",
          }}
          onWheel={handleWheel}
          onMouseDown={
            handleMouseDown
          }
          onMouseMove={
            handleMouseMove
          }
          onMouseUp={handleMouseUp}
          onMouseLeave={
            handleMouseUp
          }
          onDoubleClick={
            handleDoubleClick
          }
          onTouchStart={
            handleTouchStart
          }
          onTouchMove={
            handleTouchMove
          }
          onTouchEnd={
            handleTouchEnd
          }
          onTouchCancel={
            handleTouchEnd
          }
        >
          {/* IMAGE */}

          <div className="flex h-full w-full items-center justify-center overflow-hidden p-8 sm:p-12 lg:p-16">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                draggable={false}
                className={`max-h-full max-w-full select-none object-contain ${
                  zoom > 1
                    ? "cursor-grab"
                    : "cursor-zoom-in"
                }`}
                style={{
                  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
                  transformOrigin:
                    "center center",
                  transition:
                    dragState.current
                      .isDragging
                      ? "none"
                      : "transform 150ms ease-out",
                  willChange:
                    "transform",
                }}
              />
            ) : (
              <ImageIcon className="h-20 w-20 text-white/20" />
            )}
          </div>

          {/* MOBILE LIKE */}

          <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2 sm:bottom-5">
            <button
              type="button"
              onClick={
                handleLikeClick
              }
              disabled={isLiking}
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur-md transition-all duration-300 sm:hidden ${
                isLiked
                  ? "border-red-700 bg-red-900 text-white"
                  : "border-white/15 bg-black/65 text-white hover:bg-black/80"
              }`}
              aria-label={
                isLiked
                  ? "Unlike photo"
                  : "Like photo"
              }
            >
              <Heart
                className={`h-4 w-4 cursor-pointer ${
                  isLiked
                    ? "fill-red-700 text-red-700"
                    : ""
                }`}
              />

              <span>
                {formatLikeCount(
                  likes
                )}
              </span>

              <span>
                {isLiked
                  ? "Liked"
                  : "Like"}
              </span>
            </button>
          </div>

          {/* CATEGORY */}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[10px] text-white/80 backdrop-blur-md sm:bottom-5 sm:left-5 sm:text-xs">
            <Camera className="h-3.5 w-3.5" />
            {category}
          </div>

          {/* COUNTER */}

          {photos.length > 0 &&
            currentIndex !== -1 && (
              <div className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/60 px-3 py-2 text-[10px] font-medium text-white/80 backdrop-blur-md sm:bottom-5 sm:right-5 sm:text-xs">
                {currentIndex + 1} /{" "}
                {photos.length}
              </div>
            )}

          {/* DESKTOP HINT */}

          <div className="pointer-events-none absolute left-1/2 top-16 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[10px] text-white/60 backdrop-blur-md sm:block">
            Wheel to zoom • Drag to move
            • Double click to zoom
          </div>

          {/* MOBILE HINT */}

          <div className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[9px] text-white/60 backdrop-blur-md sm:hidden">
            Pinch to zoom • Drag to move
          </div>
        </div>

        {/* =================================================
            NEXT BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={showNext}
          disabled={!hasNext}
          className="absolute right-2 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-black/80 disabled:pointer-events-none disabled:opacity-20 sm:right-4 sm:h-12 sm:w-12 lg:right-[410px]"
          aria-label="Next photo"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* =================================================
            DETAILS
        ================================================= */}

        <aside className="max-h-[42dvh] w-full shrink-0 overflow-y-auto border-t border-base-200 bg-base-100 p-4 sm:max-h-[38dvh] sm:p-6 lg:max-h-none lg:w-[390px] lg:border-l lg:border-t-0 lg:p-8">
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

            <h2 className="mt-3 font-playfair text-xl font-semibold leading-tight sm:text-2xl lg:text-3xl">
              {title}
            </h2>

            {photo?.description && (
              <p className="mt-3 text-xs leading-6 text-base-content/60 sm:text-sm">
                {photo.description}
              </p>
            )}
          </div>

          {/* INFO */}

          <div className="space-y-4 py-5">
            {photo?.photographer && (
              <DetailRow
                icon={
                  <User className="h-4 w-4" />
                }
                label="Photographer"
                value={
                  photo.photographer
                }
              />
            )}

            {photo?.location && (
              <DetailRow
                icon={
                  <MapPin className="h-4 w-4" />
                }
                label="Location"
                value={photo.location}
              />
            )}

            {formattedDate && (
              <DetailRow
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
                label="Captured"
                value={formattedDate}
              />
            )}
          </div>

          {/* =================================================
              DESKTOP LIKE
          ================================================= */}

          <div className="hidden border-y border-base-200 py-4 sm:block">
            <button
              type="button"
              onClick={
                handleLikeClick
              }
              disabled={isLiking}
              className={`flex w-full items-center justify-between rounded-2xl p-4 transition-all duration-300 ${
                isLiked
                  ? "bg-red-950/10 text-red-700"
                  : "bg-base-200/60 hover:bg-red-950/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isLiked
                      ? "bg-red-700 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 cursor-pointer ${
                      isLiked
                        ? "fill-current"
                        : ""
                    }`}
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    {isLiked
                      ? "Liked"
                      : "Like this photo"}
                  </p>

                  <p className="text-xs text-base-content/50">
                    Show some love
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold">
                  {formatLikeCount(
                    likes
                  )}
                </p>

                <p className="text-xs text-base-content/50">
                  Likes
                </p>
              </div>
            </button>
          </div>

          {/* =================================================
              TAGS
          ================================================= */}

          {tags.length > 0 && (
            <div className="pt-5">
              <div className="mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />

                <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
                  Tags
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {tags.map(
                  (tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full border border-base-300 bg-base-200/50 px-3 py-1.5 text-xs text-base-content/60"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={
                showPrevious
              }
              disabled={!hasPrevious}
              className="btn btn-outline btn-sm rounded-full disabled:opacity-30 sm:btn-md"
            >
              <ArrowLeft className="h-4 w-4" />

              <span className="hidden sm:inline">
                Previous
              </span>
            </button>

            <button
              type="button"
              onClick={showNext}
              disabled={!hasNext}
              className="btn btn-primary btn-sm rounded-full disabled:opacity-30 sm:btn-md"
            >
              <span className="hidden sm:inline">
                Next
              </span>

              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm mt-2 w-full rounded-full sm:btn-md"
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

const DetailRow = ({
  icon,
  label,
  value,
}) => {
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

  const start = Math.max(
    1,
    currentPage - 2
  );

  const end = Math.min(
    totalPages,
    currentPage + 2
  );

  for (
    let page = start;
    page <= end;
    page++
  ) {
    pages.push(page);
  }

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
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

      <button
        type="button"
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
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

const GalleryPhotosSkeleton = () => {
  return (
    <main className="min-h-screen bg-base-100">
      <section className="border-b border-base-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10">
          <div className="h-4 w-28 animate-pulse rounded bg-base-200" />

          <div className="mt-5 h-12 max-w-2xl animate-pulse rounded-xl bg-base-200 sm:h-16" />

          <div className="mt-5 h-4 max-w-xl animate-pulse rounded bg-base-200" />
        </div>
      </section>

      <section className="border-b border-base-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 lg:px-10">
          <div className="h-12 max-w-md animate-pulse rounded-full bg-base-200" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:px-10">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {Array.from({
            length: 9,
          }).map((_, index) => (
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
          ))}
        </div>
      </section>
    </main>
  );
};

// =========================================================
// ERROR
// =========================================================

const GalleryError = ({
  onRetry,
}) => {
  return (
    <div className="rounded-3xl border border-error/10 bg-error/5 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
        <ImageIcon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-playfair text-2xl font-semibold">
        Unable to load photos
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        Something went wrong while
        loading the gallery. Please
        try again.
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
        No photos found / কোনো ছবি
        পাওয়া যায়নি
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">
        We couldn't find any photos
        matching your search or selected
        category. / আপনার অনুসন্ধান বা
        নির্বাচিত ক্যাটাগরির সাথে মিলে এমন
        কোনো ছবি আমরা খুঁজে পাইনি।
      </p>
    </div>
  );
};