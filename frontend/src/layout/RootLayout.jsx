import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import ScrollToTop from "../components/ScrollToTop";
import SmoothScroll from "../components/SmoothScroll";
import SocialFloating from "../components/shared/SocialFloating";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <SmoothScroll />

      <ScrollToTop />

      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-primary/20">
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