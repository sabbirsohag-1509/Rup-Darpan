import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/ScrollToTop";
import SmoothScroll from "../components/SmoothScroll";
import SocialFloating from "../components/shared/SocialFloating";
import { useEffect, useRef, useState } from "react";

const RootLayout = () => {
  const [showMobileNavbar, setShowMobileNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <SmoothScroll />

      <ScrollToTop />

      {/* HEADER */}

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

    ${
      showMobileNavbar
        ? "translate-y-0"
        : "-translate-y-full"
    }

    lg:translate-y-0
  `}
>
  <Navbar />
</header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <SocialFloating />

      <Footer />
    </div>
  );
};

export default RootLayout;