import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Vite glob import to dynamically load local images from the assets folder.
// If the user places their own 10-12 images here, they will be loaded automatically.
const localImagesGlob = import.meta.glob(
  "../../../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true },
);

const localImages = Object.values(localImagesGlob).map(
  (module) => module.default || module,
);
// Get the current month and determine the season
const currentMonth = new Date().getMonth() + 1; // 1-12

const season =
  [11, 12, 1, 2].includes(currentMonth) ? "winter" : "summer";

const Hero = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const combined = [...localImages];
    if (combined.length < 7) {
      const needed = 7 - combined.length;
      for (let i = 0; i < needed; i++) {
        combined.push(fallbackImages[i % fallbackImages.length]);
      }
    }
    setImages(combined);
  }, []);

  const totalImages = images.length;
  const [activeIndex, setActiveIndex] = useState(3);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);

  // Auto-play the carousel
  useEffect(() => {
    if (!isAutoplay || totalImages === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalImages);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoplay, totalImages]);

  if (totalImages === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#faf8f4]">
        <span className="loading loading-spinner loading-lg text-[#be3d31]"></span>
      </div>
    );
  }

  // Handle Swipe/Drag to move index
  const handleDragStart = (e, info) => {
    setIsAutoplay(false); // Stop autoplay when user drags
    setDragStartX(info.point.x);
  };

  const handleDragEnd = (e, info) => {
    const diff = info.point.x - dragStartX;
    const dragThreshold = 40; // in pixels
    if (diff > dragThreshold) {
      // Swiped right -> go to previous
      setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);
    } else if (diff < -dragThreshold) {
      // Swiped left -> go to next
      setActiveIndex((prev) => (prev + 1) % totalImages);
    }
  };

  return (
    <section
      className="relative w-auto -mx-4 lg:-mx-10 py-12 md:py-16 px-6 lg:px-12 overflow-hidden bg-[#faf8f4] text-[#332115] flex flex-col items-center justify-between select-none rounded-3xl"
      onMouseEnter={() => setIsAutoplay(false)}
      onMouseLeave={() => setIsAutoplay(true)}
    >
      {/* Dark Lush Foliage (Leaf Border) Left */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 z-20 pointer-events-none overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.98] brightness-[0.4] saturate-[0.75] contrast-[1.1]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=400&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Dark Lush Foliage (Leaf Border) Right - Horizontally Mirrored */}
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-16 lg:w-20 z-20 pointer-events-none overflow-hidden scale-x-[-1]">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.98] brightness-[0.4] saturate-[0.75] contrast-[1.1]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=400&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Header Text Section */}
      <div className="text-center max-w-4xl mx-auto px-4 z-10 mb-8 sm:mb-12">
        <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.2] text-[#332115]">
          Capturing your wedding's magic,
          <br />
          <span className="relative inline-block mt-1 sm:mt-2">
            one moment at a time
            {/* Custom handwriting-style double underline brush stroke */}
            <svg
              className="absolute -bottom-3 left-0 w-full h-4 text-[#583923] overflow-visible"
              viewBox="0 0 300 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M5 10C80 6 180 8 290 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
                d="M15 15C100 12 190 13 275 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>
        <p className="mt-8 text-xs sm:text-sm md:text-base text-[#615147] max-w-2xl mx-auto leading-relaxed font-sans px-4">
          Capturing the love, joy, and magic of your wedding day, preserving
          timeless memories to cherish forever
        </p>
      </div>

      {/* 3D Curved Carousel Container */}
      <motion.div
        className="relative h-[240px] sm:h-[300px] md:h-[340px] lg:h-[400px] w-full max-w-6xl mx-auto flex items-center justify-center overflow-visible select-none"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence initial={false}>
          {images.map((image, index) => {
            // Compute index-distance in a circular (wrapping) array structure
            let distance = index - activeIndex;
            const half = Math.floor(totalImages / 2);

            if (distance > half) {
              distance -= totalImages;
            } else if (distance < -half) {
              distance += totalImages;
            }

            // Only render cards that are close to the center for performance and layout focus
            const isVisible = Math.abs(distance) <= 3;
            if (!isVisible) return null;

            // Mathematical spacing based on screens
            const spacing =
              typeof window !== "undefined" && window.innerWidth < 640
                ? 85 // Mobile spacing
                : typeof window !== "undefined" && window.innerWidth < 1024
                  ? 130 // Tablet spacing
                  : 165; // Desktop spacing

            const xOffset = distance * spacing;

            // Curve the cards vertically in a "smile" arc (concave upwards)
            const yOffset = Math.pow(Math.abs(distance), 1.55) * -11;

            // Tilted rotation around Z-axis (pointing towards center)
            const rotateZ = distance * -3.5;

            // 3D rotation around Y-axis (cylinder effect)
            const rotateY = distance * -7.5;

            // Scale down cards as they get further from center
            const scale = distance === 0 ? 1.2 : 1 - Math.abs(distance) * 0.08;

            // Stack center card on top
            const zIndex = 10 - Math.abs(distance);

            // Fade out side cards slightly to draw focus
            const opacity = 1 - Math.abs(distance) * 0.12;

            return (
              <motion.div
                key={`${image}-${index}`}
                style={{
                  zIndex: zIndex,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: xOffset,
                  y: yOffset,
                  rotate: rotateZ,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                }}
                exit={{ opacity: 0, scale: scale - 0.1, x: xOffset }}
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
                className={`absolute origin-center rounded-2xl md:rounded-3xl overflow-hidden border-[3px] md:border-[5px] border-white shadow-lg md:shadow-xl cursor-pointer select-none transition-shadow hover:shadow-2xl
                  w-[110px] h-[160px] 
                  sm:w-[150px] sm:h-[220px] 
                  md:w-[180px] md:h-[260px] 
                  lg:w-[200px] lg:h-[300px]
                `}
              >
                {/* Image Overlay/Shading based on distance */}
                <div
                  className="absolute inset-0 bg-[#332115]/10 hover:bg-transparent transition-colors duration-300 z-10"
                  style={{
                    backgroundColor: `rgba(51, 33, 21, ${Math.abs(distance) * 0.1})`,
                  }}
                />

                {/* Card Image */}
                <img
                  src={image}
                  alt={`Wedding moment ${index + 1}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading={Math.abs(distance) <= 1 ? "eager" : "lazy"}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Red Pill Call-to-Action Button */}
      <div className="z-10 mt-8 sm:mt-12 text-center">
        <motion.button
          whileHover={{
            scale: 1.05,
            backgroundColor: "#b23328",
            boxShadow: "0 10px 25px -5px rgba(195, 58, 46, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#c33a2e] text-white text-xs sm:text-sm md:text-base font-semibold tracking-wide uppercase px-6 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get {season === "winter" ? "10%" : "15%"} off in this {season} 
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
