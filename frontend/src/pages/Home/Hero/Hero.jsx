import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

const API_URL = "http://localhost:5000/hero-images"; 

const Hero = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);

  // =========================================================
  // GET HERO IMAGES
  // =========================================================

  const {
    data: heroImages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["hero-images"],

    queryFn: async () => {
      const response = await axios.get(API_URL);

      return response.data?.data || [];
    },

    staleTime: 5 * 60 * 1000,
  });

  // =========================================================
  // ACTIVE HERO IMAGES
  // =========================================================

  const images = heroImages
    .filter((hero) => hero.isActive === true)
    .sort((a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0));

  const totalImages = images.length;

  // =========================================================
  // RESET ACTIVE INDEX
  // =========================================================

  useEffect(() => {
    if (activeIndex >= totalImages && totalImages > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalImages]);

  // =========================================================
  // AUTOPLAY
  // =========================================================

  useEffect(() => {
    if (!isAutoplay || totalImages <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalImages);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoplay, totalImages]);

  // =========================================================
  // DRAG START
  // =========================================================

  const handleDragStart = (event, info) => {
    setIsAutoplay(false);
    setDragStartX(info.point.x);
  };

  // =========================================================
  // DRAG END
  // =========================================================

  const handleDragEnd = (event, info) => {
    if (totalImages <= 1) {
      return;
    }

    const diff = info.point.x - dragStartX;
    const dragThreshold = 40;

    if (diff > dragThreshold) {
      // Swipe right → previous
      setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
    } else if (diff < -dragThreshold) {
      // Swipe left → next
      setActiveIndex((prev) => (prev + 1) % totalImages);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <section className="relative -mx-4 flex min-h-[500px] w-auto items-center justify-center rounded-3xl bg-[#faf8f4] lg:-mx-10">
        <span className="loading loading-spinner loading-lg text-[#be3d31]" />
      </section>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <section className="relative -mx-4 flex min-h-[500px] w-auto flex-col items-center justify-center rounded-3xl bg-[#faf8f4] px-6 text-center lg:-mx-10">
        <h2 className="font-playfair text-2xl font-semibold text-[#332115]">
          Failed to load hero images
        </h2>

        <p className="mt-2 max-w-md text-sm text-[#615147]">
          {error?.response?.data?.message ||
            "Something went wrong while loading hero images."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 rounded-full bg-[#c33a2e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b23328]"
        >
          Try Again
        </button>
      </section>
    );
  }

  // =========================================================
  // NO ACTIVE HERO IMAGES
  // =========================================================

  if (totalImages === 0) {
    return (
      <section className="relative -mx-4 flex min-h-[500px] w-auto flex-col items-center justify-center rounded-3xl bg-[#faf8f4] px-6 text-center lg:-mx-10">
        <h2 className="font-playfair text-2xl font-semibold text-[#332115]">
          No Hero Images Available
        </h2>

        <p className="mt-2 max-w-md text-sm text-[#615147]">
          Please activate at least one hero image from the admin panel.
        </p>
      </section>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section
      className="relative -mx-4 flex w-auto select-none flex-col items-center justify-between overflow-hidden rounded-3xl bg-[#faf8f4] px-6 py-12 text-[#332115] lg:-mx-10 lg:px-12 md:py-16"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* =====================================================
          LEFT FOLIAGE
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-8 overflow-hidden sm:w-12 md:w-16 lg:w-20">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-[0.98] brightness-[0.4] saturate-[0.75] contrast-[1.1]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=400&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* =====================================================
          RIGHT FOLIAGE
      ===================================================== */}

      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-8 scale-x-[-1] overflow-hidden sm:w-12 md:w-16 lg:w-20">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat opacity-[0.98] brightness-[0.4] saturate-[0.75] contrast-[1.1]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=400&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* =====================================================
          HEADER TEXT
      ===================================================== */}

      <div className="z-10 mx-auto mb-8 max-w-4xl px-4 text-center sm:mb-12">
        <h1 className="font-playfair text-3xl font-semibold leading-[1.2] tracking-tight text-[#332115] sm:text-4xl md:text-5xl lg:text-6xl">
          Capturing your wedding's magic,
          <br />
          <span className="relative mt-1 inline-block sm:mt-2">
            one moment at a time
            {/* Handwriting-style underline */}
            <svg
              className="absolute -bottom-3 left-0 h-4 w-full overflow-visible text-[#583923]"
              viewBox="0 0 300 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                d="M5 10C80 6 180 8 290 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.8,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                d="M15 15C100 12 190 13 275 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl px-4 font-sans text-xs leading-relaxed text-[#615147] sm:text-sm md:text-base">
          Capturing the love, joy, and magic of your wedding day, preserving
          timeless memories to cherish forever
        </p>
      </div>

      {/* =====================================================
          3D CURVED CAROUSEL
      ===================================================== */}

      <motion.div
        className="relative mx-auto flex h-[250px] w-full max-w-6xl items-center justify-center overflow-visible select-none sm:h-[310px] md:h-[350px] lg:h-[410px]"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
        drag={totalImages > 1 ? "x" : false}
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false}>
          {images.map((hero, index) => {
            // =================================================
            // CIRCULAR DISTANCE
            // =================================================

            let distance = index - activeIndex;

            const half = Math.floor(totalImages / 2);

            if (distance > half) {
              distance -= totalImages;
            } else if (distance < -half) {
              distance += totalImages;
            }

            // =================================================
            // ONLY NEARBY CARDS
            // =================================================

            const isVisible = Math.abs(distance) <= 3;

            if (!isVisible) {
              return null;
            }

            // =================================================
            // RESPONSIVE SPACING
            // =================================================

            const spacing =
              typeof window !== "undefined" && window.innerWidth < 640
                ? 95
                : typeof window !== "undefined" && window.innerWidth < 1024
                  ? 145
                  : 180;

            const xOffset = distance * spacing;

            // =================================================
            // SMILE CURVE
            // =================================================

            const yOffset = Math.pow(Math.abs(distance), 1.55) * -11;

            // =================================================
            // Z ROTATION
            // =================================================

            const rotateZ = distance * -3.5;

            // =================================================
            // Y ROTATION
            // =================================================

            const rotateY = distance * -7.5;

            // =================================================
            // SCALE
            // =================================================

            const scale = distance === 0 ? 1.2 : 1 - Math.abs(distance) * 0.08;

            // =================================================
            // Z INDEX
            // =================================================

            const zIndex = 10 - Math.abs(distance);

            // =================================================
            // OPACITY
            // =================================================

            const opacity = 1 - Math.abs(distance) * 0.12;

            return (
              <motion.div
                key={`${hero._id}-${index}`}
                style={{
                  zIndex,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: xOffset,
                  y: yOffset,
                  rotate: rotateZ,
                  rotateY,
                  scale,
                  opacity,
                }}
                exit={{
                  opacity: 0,
                  scale: scale - 0.1,
                  x: xOffset,
                }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  mass: 0.8,
                }}
                onClick={() => {
                  setIsAutoplay(false);
                  setActiveIndex(index);
                }}
                className="
                  absolute
                  origin-center
                  cursor-pointer
                  select-none
                  overflow-hidden
                  rounded-2xl
                  border-[3px]
                  border-white
                  shadow-lg
                  transition-shadow
                  hover:shadow-2xl
                  md:rounded-3xl
                  md:border-[5px]
                  md:shadow-xl

                  w-[125px]
                  h-[180px]

                  sm:w-[165px]
                  sm:h-[240px]

                  md:w-[200px]
                  md:h-[290px]

                  lg:w-[220px]
                  lg:h-[330px]
                "
              >
                {/* =================================================
                    IMAGE OVERLAY
                ================================================= */}

                <div
                  className="absolute inset-0 z-10 bg-[#332115]/10 transition-colors duration-300 hover:bg-transparent"
                  style={{
                    backgroundColor: `rgba(51, 33, 21, ${
                      Math.abs(distance) * 0.1
                    })`,
                  }}
                />

                {/* =================================================
                    HERO IMAGE
                ================================================= */}

                <img
                  src={hero.image}
                  alt={
                    hero.altText || hero.title || `Wedding moment ${index + 1}`
                  }
                  width={800}
                  height={1200}
                  className="pointer-events-none h-full w-full object-cover"
                  loading={Math.abs(distance) <= 1 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={Math.abs(distance) <= 1 ? "high" : "low"}
                  sizes="
                    (max-width: 640px) 125px,
                    (max-width: 1024px) 200px,
                    220px
                  "
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* =====================================================
          CTA
      ===================================================== */}

      <div className="z-10 mt-8 text-center sm:mt-12">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/packages"
            className="inline-block rounded-full bg-[#c33a2e] px-6 py-3.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-[#b23328] hover:shadow-xl sm:px-8 sm:py-4 sm:text-sm md:text-base"
          >
            Explore Our Packages
          </Link>
        </motion.div>
      </div>

      {/* =====================================================
          SCROLL DOWN
      ===================================================== */}

      <motion.a
        href="#featured-photos"
        initial={{
          opacity: 0,
          y: -5,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1,
          duration: 0.5,
        }}
        className="z-10 mt-7 flex flex-col items-center gap-1 text-[#583923]/70 transition-colors duration-300 hover:text-[#c33a2e]"
        aria-label="Scroll down to featured photos"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Scroll
        </span>

        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Hero;
