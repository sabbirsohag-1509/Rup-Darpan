import { Outlet } from "react-router";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const RootLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <main className="min-h-screen">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default RootLayout;