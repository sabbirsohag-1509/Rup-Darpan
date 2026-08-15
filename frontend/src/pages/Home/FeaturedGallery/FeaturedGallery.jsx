import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowUpRight, Camera } from "lucide-react";
import { Link } from "react-router";

const API_URL = "http://localhost:5000/featured-photos";

const FeaturedGallery = () => {
  const sectionRef = useRef(null);

  // =========================================================
  // FETCH FEATURED PHOTOS
  // =========================================================

  const {
    data: photos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["featured-photos"],
    queryFn: async () => {
      const response = await axios.get(API_URL);

      return response.data?.photos || response.data || [];
    },
  });

  // =========================================================
  // SCROLL REVEAL ANIMATION
  // =========================================================

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const revealItems =
      section.querySelectorAll(".gallery-reveal");

    if (!revealItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("gallery-visible");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealItems.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, [photos]);

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="flex min-h-[300px] items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    console.error("Featured photos error:", error);

    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-error/20 bg-error/5 px-6 py-10 text-center">
            <h3 className="font-playfair text-2xl font-semibold">
              Unable to load featured gallery
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (!photos.length) {
    return (
      <section className="bg-base-100 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 px-6 py-10 text-center">
            <Camera className="mx-auto h-8 w-8 text-primary" />

            <h3 className="mt-4 font-playfair text-2xl font-semibold">
              Featured Gallery
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              No featured photos available yet.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-base-100 py-16 sm:py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">

          {/* Header Content */}

          <div
            className="gallery-reveal max-w-2xl"
            style={{ "--delay": "0ms" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
            </div>

            {/* Heading */}

            <h2 className="font-playfair text-4xl font-semibold leading-[1.05] text-base-content sm:text-5xl lg:text-6xl">
              Featured{" "}
              <span className="italic text-primary">
                Photos
              </span>
            </h2>

            {/* Description */}

            <p className="mt-5 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
              A collection of moments we loved capturing.
              Every photograph tells a story, preserves an
              emotion, and keeps a beautiful memory alive.
              <br />

              <span className="text-xs text-base-content/50 sm:text-sm">
                আমাদের ফ্রেমে বন্দি করা প্রিয় কিছু মুহূর্ত;
                যেখানে প্রতিটি ছবি বলে একটি গল্প এবং অমলিন
                রাখে সুন্দর স্মৃতিগুলোকে।
              </span>
            </p>
          </div>

          {/* View Full Gallery */}

          <div
            className="gallery-reveal"
            style={{ "--delay": "120ms" }}
          >
            <Link
              to="/gallery/photos"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-content sm:w-fit"
            >
              View All Photos

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* =====================================================
            GALLERY
        ===================================================== */}

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">

          {photos.slice(0, 8).map((photo, index) => (
            <div
              key={photo._id}
              className={`
                gallery-reveal
                group
                relative
                overflow-hidden
                rounded-2xl
                bg-base-200
                sm:rounded-3xl

                ${
                  index === 0
                    ? "sm:row-span-2 lg:col-span-2 lg:row-span-2"
                    : ""
                }

                ${index === 3 ? "lg:col-span-2" : ""}

                ${index === 4 ? "lg:col-span-2" : ""}

                ${index === 5
                  ? "sm:col-span-2 lg:col-span-2"
                  : ""}
              `}
              style={{
                "--delay": `${index * 90 + 180}ms`,
              }}
            >

              {/* Image Container */}

              <div
                className={`
                  relative overflow-hidden

                  ${
                    index === 0
                      ? "h-[400px] sm:h-[500px] lg:h-[650px]"
                      : "h-[290px] sm:h-[340px] lg:h-[360px]"
                  }
                `}
              >

                {/* Image */}

                <img
                  src={photo.image}
                  alt={photo.title}
                  loading={index > 1 ? "lazy" : "eager"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Gradient */}

                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/15
                    to-transparent
                    opacity-80
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />

                {/* CATEGORY */}

                <div className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5">
                  <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-md sm:text-xs">
                    {photo.category || "Photography"}
                  </span>
                </div>

                {/* CAMERA ICON */}

                <div
                  className="
                    absolute right-3.5 top-3.5
                    flex h-9 w-9 items-center justify-center
                    rounded-full border border-white/20
                    bg-black/20
                    text-white
                    backdrop-blur-md

                    opacity-100
                    transition-all
                    duration-500

                    sm:right-5 sm:top-5
                    sm:h-10 sm:w-10
                    sm:opacity-0
                    sm:group-hover:opacity-100
                  "
                >
                  <Camera className="h-4 w-4" />
                </div>

                {/* BOTTOM CONTENT */}

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">

                  <div
                    className="
                      transition-transform
                      duration-500

                      sm:translate-y-3
                      sm:group-hover:translate-y-0
                    "
                  >
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 sm:text-xs">
                      <span className="font-bold text-red-500">
                        Rup
                      </span>{" "}
                      Darpon
                    </p>

                    <div className="flex items-end justify-between gap-3">

                      {/* Title */}

                      <h3 className="font-playfair text-lg font-semibold leading-tight text-white sm:text-2xl">
                        {photo.title}
                      </h3>

                      {/* Arrow */}

                      <div
                        className="
                          flex h-8 w-8 shrink-0
                          items-center justify-center
                          rounded-full
                          bg-white
                          text-black
                          transition-all
                          duration-500

                          opacity-100

                          sm:h-9 sm:w-9
                          sm:opacity-0
                          sm:group-hover:opacity-100
                        "
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <div
          className="gallery-reveal mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-6 sm:mt-10 sm:rounded-3xl sm:px-8 sm:py-7 lg:flex-row"
          style={{ "--delay": "300ms" }}
        >
          <div className="text-center lg:text-left">

            <h3 className="font-playfair text-xl font-semibold sm:text-2xl">
              Want to see more?{" "}
              <span className="text-base font-normal text-base-content/80 sm:text-lg">
                (আরও দেখতে চান?)
              </span>
            </h3>

            <p className="mt-1 text-sm text-base-content/55">
              Explore our complete collection of captured
              moments.
            </p>

            <p className="mt-0.5 text-xs text-base-content/45">
              আমাদের ক্যামেরায় বন্দি করা সমস্ত সুন্দর মুহূর্তের
              গ্যালারি ঘুরে দেখুন।
            </p>
          </div>

          <Link
            to="/gallery"
            className="btn btn-primary w-full rounded-full px-6 font-semibold sm:w-auto"
          >
            Explore Gallery

            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* =====================================================
          SCROLL REVEAL CSS
      ===================================================== */}

      <style>{`
        .gallery-reveal {
          opacity: 0;
          transform: translateY(35px);

          transition:
            opacity 700ms ease-out var(--delay, 0ms),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1)
              var(--delay, 0ms);
        }

        .gallery-reveal.gallery-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 639px) {
          .gallery-reveal {
            transform: translateY(24px);

            transition:
              opacity 600ms ease-out var(--delay, 0ms),
              transform 600ms cubic-bezier(0.22, 1, 0.36, 1)
                var(--delay, 0ms);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .gallery-reveal.gallery-visible {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedGallery;