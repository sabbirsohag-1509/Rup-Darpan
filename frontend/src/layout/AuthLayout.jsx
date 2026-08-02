import { NavLink, Outlet } from "react-router";
import { ArrowLeft } from "lucide-react";
import Logo from "../components/shared/Logo";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 md:p-8">
      <div className="mx-auto max-w-6xl min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl border border-primary/20 bg-base-200/40 shadow-2xl">
        <section className="relative flex flex-col justify-center p-6 sm:p-10 lg:p-12">
          <NavLink
            to="/"
            className="absolute left-6 top-6 md:left-10 md:top-10 inline-flex items-center gap-2 text-sm font-medium text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Home
          </NavLink>

          <div className="mb-8 mt-12 md:mt-10">
            <Logo />
          </div>

          <Outlet />
        </section>

        <aside
          className="relative hidden lg:flex items-end p-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
          <div className="relative z-10 max-w-md text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-primary/90 mb-3">
              <span className="text-[#C4121A] font-bold">RUP</span>
              <span className="text-base-content font-bold ml-2">
                DARPON
              </span>
             <span className="pl-2"> Photography</span>
            </p>
            <h2 className="font-playfair text-4xl leading-tight mb-4">
              Preserve your timeless stories with elegance
            </h2>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AuthLayout;
