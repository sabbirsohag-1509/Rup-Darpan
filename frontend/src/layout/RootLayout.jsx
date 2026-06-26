import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-primary/15 shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-10 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
