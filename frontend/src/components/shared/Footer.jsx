import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router";
import Logo from "./Logo";
import SabbirImg from "../../assets/sabbir.jpg";
import UnderFooter from "./UnderFooter";

// =========================================================
// FACEBOOK ICON
// =========================================================

const FacebookIcon = ({ className = "" }) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#0B66FB] text-white ${className}`}
    >
      <FaFacebookF />
    </span>
  );
};

// =========================================================
// FOOTER
// =========================================================

const Footer = () => {
  const FACEBOOK_PAGE_URL =
    "https://www.facebook.com/profile.php?id=61559974675020";

  // Replace with owner's actual Facebook profile URL
  const OWNER_FACEBOOK_URL = "https://www.facebook.com/hridoysharma303";

  // Replace with actual phone number
  const PHONE_NUMBER = "+8801824-269459";

  return (
    <footer className="border-t border-primary/15 bg-base-200 text-base-content">
      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          {/* =================================================
              BRAND
          ================================================= */}

          <div className="w-full lg:max-w-sm">
            {/* Logo */}

            <Link to="/" className="group inline-flex items-center gap-3">
              <div>
                <Logo></Logo>
              </div>
            </Link>

            {/* Description */}

            <p className="mt-5 max-w-sm text-sm leading-7 text-base-content/60">
              Capturing genuine emotions, beautiful moments, and timeless
              stories through photography.
            </p>

            <p className="mt-2 max-w-sm text-xs leading-6 text-base-content/45">
              আপনার সুন্দর মুহূর্তগুলোকে গল্পের মতো করে ধরে রাখাই আমাদের কাজ।
            </p>

            {/* Social */}

            <div className="mt-6 flex items-center gap-3">
              {/* Facebook Page */}

              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rup Darpon Facebook Page"
                title="Facebook Page"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <FacebookIcon className="h-7 w-7 text-sm" />
              </a>

              {/* Owner Facebook */}

              <a
                href={OWNER_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Owner Facebook Profile"
                title="Owner Facebook Profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-primary transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <nav className="flex min-w-[150px] flex-col">
            <h6 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-base-content">
              Quick Links
            </h6>

            <Link
              to="/"
              className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary"
            >
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Home
            </Link>

            <Link
              to="/gallery/photos"
              className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary"
            >
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Photos
            </Link>

            <Link
              to="/gallery/videos"
              className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary"
            >
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Videos
            </Link>

            <Link
              to="/about"
              className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary"
            >
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              About
            </Link>

            <Link
              to="/contact"
              className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary"
            >
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Contact
            </Link>
          </nav>

          {/* =================================================
              SERVICES
          ================================================= */}

          <nav className="flex min-w-[190px] flex-col">
            <h6 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-base-content">
              Services
            </h6>

            <Link className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary">
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Wedding Photography
            </Link>

            <Link className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary">
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Portrait Photography
            </Link>

            <Link className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary">
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Event Photography
            </Link>

            <Link className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary">
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Pre-Wedding
            </Link>

            <Link className="group flex items-center gap-1.5 py-1.5 text-sm text-base-content/60 transition-colors hover:text-primary">
              <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              Outdoor Session
            </Link>
          </nav>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div className="flex min-w-[220px] flex-col">
            <h6 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-base-content">
              Get in Touch
            </h6>

            {/* Location */}

            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40">
                  Location
                </p>

                <p className="mt-1 text-sm text-base-content/65">
                  Dinajpur, Bangladesh
                </p>
              </div>
            </div>

            {/* Phone */}

            <a
              href={`tel:${PHONE_NUMBER}`}
              className="group mt-5 flex items-start gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40">
                  Phone
                </p>

                <p className="mt-1 text-sm text-base-content/65 transition-colors group-hover:text-primary">
                  {PHONE_NUMBER}
                </p>
              </div>
            </a>

            {/* Facebook */}

            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 flex items-start gap-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FaFacebookF className="h-4 w-4" />
              </span>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-base-content/40">
                  Facebook
                </p>

                <Link
                  to={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm text-base-content/65 transition-colors group-hover:text-primary"
                >
                  Our Facebook Page
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-center sm:px-8 md:flex-row md:items-center md:justify-between md:text-left lg:px-10">
          <p className="text-xs text-base-content/45 font-medium">
            © {new Date().getFullYear()}{" "}
              <span> Rup Darpon </span>
            Photography. All rights reserved.
          </p>
          {/* Developed by Sabbir Hossain Sohag */}
          <div className="flex items-center gap-4">
            <span className="h-3 w-px bg-base-300" />

            <a
              href="https://portfolio-sabbir-sohag-f956ef.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Sabbir Hossain Sohag portfolio"
              title="Visit Sabbir Hossain Sohag portfolio"
              className="group flex flex-col items-center"
            >
              {/* ===================================================== 
        DESIGNED & DEVELOPED BY 
    ===================================================== */}

              <span className="flex items-center gap-1 text-[9px] font-medium tracking-[0.12em] text-base-content/40 transition-colors duration-300 group-hover:text-primary">
                DESIGNED & DEVELOPED BY
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:translate-y-0.5" />
              </span>

              {/* ===================================================== 
        PROFILE / CLICK HERE 
    ===================================================== */}

              <div className="mt-2 flex items-center gap-2.5">
                {/* Image Container with Rotating Text around Image Only */}
                <div className="relative flex h-11 w-11 items-center justify-center">
                  {/* Rotating CLICK HERE Text */}
                  <div className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.65] animate-[spin_10s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <defs>
                        <path
                          id="developerCirclePath"
                          d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                        />
                      </defs>

                      <text className="fill-primary/60 text-[9px] font-semibold uppercase tracking-[2px]">
                        <textPath href="#developerCirclePath">
                          CLICK HERE • CLICK HERE •
                        </textPath>
                      </text>
                    </svg>
                  </div>

                  {/* Image */}
                  <img
                    src={SabbirImg}
                    alt="Sabbir Hossain Sohag"
                    className="relative z-10 h-10 w-10 rounded-full object-cover border-2 border-base-200 ring-1 ring-primary/30 shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:ring-primary/70 group-hover:shadow-lg"
                  />
                </div>

                {/* Name */}
                <span className="relative z-10 cursor-pointer text-xs font-semibold text-base-content/60 underline-offset-4 transition-all duration-300 group-hover:text-primary group-hover:underline">
                  Sabbir Hossain Sohag
                </span>
              </div>

              {/* ===================================================== 
        PHONE 
    ===================================================== */}

              <span className="mt-1 text-center text-[11px] text-base-content/50 transition-colors duration-300 group-hover:text-base-content/70">
                +8801723-473804
              </span>
            </a>
          </div>
        </div>
      </div>
      <UnderFooter></UnderFooter>
    </footer>
  );
};

export default Footer;
