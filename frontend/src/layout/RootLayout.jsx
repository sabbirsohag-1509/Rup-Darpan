import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-primary/20">
        <Navbar />
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-10 pb-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
