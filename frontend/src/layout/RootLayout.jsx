import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/ScrollToTop";
import SmoothScroll from "../components/SmoothScroll";
import SocialFloating from "../components/shared/SocialFloating";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

const RootLayout = () => {
  const [showMobileNavbar, setShowMobileNavbar] = useState(true);
  const [showClickToTop, setShowClickToTop] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // =================================================
      // CLICK TO TOP VISIBILITY
      // =================================================

      setShowClickToTop(currentScrollY > 200);

      // =================================================
      // MOBILE NAVBAR SHOW / HIDE
      // =================================================

      // Top of page
      if (currentScrollY <= 20) {
        setShowMobileNavbar(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Scroll down
      if (currentScrollY > lastScrollY.current) {
        setShowMobileNavbar(false);
      }

      // Scroll up
      if (currentScrollY < lastScrollY.current) {
        setShowMobileNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ===================================================
  // CLICK TO TOP FUNCTION
  // ===================================================

  const handleClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-base-100 text-base-content">
      
      <SmoothScroll />

      <ScrollToTop />

      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className={`
          sticky
          top-0
          z-50
          bg-base-100
          border-b
          border-primary/20
          transition-transform
          duration-300
          ease-in-out
          will-change-transform

          ${showMobileNavbar ? "translate-y-0" : "-translate-y-full"}

          lg:translate-y-0
        `}
      >
        
        <Navbar />

        {/* =================================================
            CLICK TO TOP
        ================================================= */}

        <div
          className={`
            pointer-events-none
            absolute
            left-0
            right-0
            top-full
            z-40
            flex
            justify-center
            transition-all
            duration-500
            ease-out
            ${
              showClickToTop
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }
          `}
        >
          <button
            type="button"
            onClick={handleClickToTop}
            className={`
              pointer-events-auto
              group
              mt-1.5
              flex
              cursor-pointer
              items-center
              gap-1.5
              rounded-full
              bg-base-200
              px-3
              py-1
              text-xs
              font-medium
              text-base-content/60
              shadow-sm
              transition-all
              duration-200
              hover:bg-primary/10
              hover:text-primary
              hover:shadow-md
            `}
            aria-label="Scroll to top"
          >
            <ArrowUp
              className="
                h-3.5
                w-3.5
                transition-transform
                duration-200
                group-hover:-translate-y-0.5
              "
            />

            <span>Click to Top</span>
          </button>
        </div>
      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="w-full flex-1">
        <Outlet />
      </main>

      {/* =================================================
          SOCIAL FLOATING
      ================================================= */}

      <SocialFloating />

      {/* =================================================
          FOOTER
      ================================================= */}

      <Footer />
    </div>
  );
};

export default RootLayout;
