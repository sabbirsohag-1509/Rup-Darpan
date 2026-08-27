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

      if (currentScrollY > 200) {
        setShowClickToTop(true);
      } else {
        setShowClickToTop(false);
      }

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
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
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

        {showClickToTop && (
          <div
            className="
              flex
              justify-center
              border-t
              border-primary/10
              px-4
              py-1.5
            "
          >
            <button
              type="button"
              onClick={handleClickToTop}
              className="
                group
                flex
                items-center
                bg-base-200
                gap-1.5
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                text-base-content/60
                transition-all
                duration-200
                hover:bg-primary/10
                hover:text-primary
                cursor-pointer
              "
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
        )}
      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="flex-1 w-full">
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