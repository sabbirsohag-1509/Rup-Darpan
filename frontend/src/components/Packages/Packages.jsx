import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { useContext, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  Clock3,
  Images,
  Sparkles,
  Tag,
  Lock,
  X,
  LogIn,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

// Change this path according to your project structure

const API_URL = "http://localhost:5000/packages";

// =========================================
// Utility: Short Description
// =========================================

const getShortDescription = (description, wordLimit = 50) => {
  if (!description) return "";

  const words = description.trim().split(/\s+/);

  if (words.length <= wordLimit) {
    return description;
  }

  return `${words.slice(0, wordLimit).join(" ")}...`;
};

// =========================================
// Packages Component
// =========================================

const Packages = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // =========================================
  // FETCH PACKAGES
  // =========================================

  const {
    data: packages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["packages"],

    queryFn: async () => {
      const response = await axios.get(API_URL);

      return response.data;
    },
  });

  // =========================================
  // ONLY ACTIVE PACKAGES
  // =========================================

  const activePackages = packages.filter((pkg) => pkg.active !== false);

  // =========================================
  // BOOK NOW
  // =========================================

  const handleBookNow = (packageId) => {
    // User is not logged in
    if (!user) {
      setSelectedPackageId(packageId);
      setShowLoginModal(true);
      return;
    }

    // User is logged in
    navigate(`/booking?package=${packageId}`);
  };

  // =========================================
  // LOGIN TO BOOK
  // =========================================

  const handleLoginToBook = () => {
    if (!selectedPackageId) return;

    setShowLoginModal(false);

    navigate("/login", {
      state: {
        from: `/booking?package=${selectedPackageId}`,
      },
    });
  };

  // =========================================
  // CLOSE LOGIN MODAL
  // =========================================

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setSelectedPackageId(null);
  };

  // =========================================
  // LOADING STATE
  // =========================================

  if (isLoading) {
    return (
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-primary/10 bg-base-200 shadow-sm"
              >
                {/* Image Skeleton */}

                <div className="aspect-[16/9] animate-pulse bg-base-300" />

                {/* Content Skeleton */}

                <div className="space-y-4 p-5">
                  <div className="h-8 w-32 animate-pulse rounded bg-base-300" />

                  <div className="h-4 w-full animate-pulse rounded bg-base-300" />

                  <div className="h-4 w-4/5 animate-pulse rounded bg-base-300" />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-14 animate-pulse rounded-xl bg-base-300" />

                    <div className="h-14 animate-pulse rounded-xl bg-base-300" />
                  </div>

                  <div className="h-10 w-full animate-pulse rounded bg-base-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================
  // ERROR STATE
  // =========================================

  if (isError) {
    return (
      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-error/20 bg-base-200 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
              <Camera className="h-7 w-7 text-error" />
            </div>

            <h2 className="mt-4 font-playfair text-2xl font-semibold">
              Unable to Load Packages
            </h2>

            <p className="mt-2 text-sm text-base-content/60">
              Something went wrong while loading our photography packages.
              Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* =========================================
          PACKAGES SECTION
      ========================================= */}

      <section className="px-4 pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          {/* =========================================
              NO PACKAGES
          ========================================= */}

          {activePackages.length === 0 ? (
            <div className="rounded-2xl border border-primary/10 bg-base-200 p-10 text-center">
              <Camera className="mx-auto h-12 w-12 text-base-content/30" />

              <h3 className="mt-4 font-playfair text-2xl font-semibold">
                No Packages Available
              </h3>

              <p className="mt-2 text-sm text-base-content/60">
                Our photography packages will be available soon.
              </p>
            </div>
          ) : (
            /* =========================================
                RESPONSIVE GRID

                Mobile  -> 1
                Tablet  -> 2
                Desktop -> 3
            ========================================= */

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {activePackages.map((pkg) => {
                const features = Array.isArray(pkg.features)
                  ? pkg.features
                  : [];

                return (
                  <article
                    key={pkg._id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-base-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      pkg.featured
                        ? "border-primary/50 shadow-primary/5"
                        : "border-primary/10"
                    }`}
                  >
                    {/* =====================================
                        FEATURED BADGE
                    ===================================== */}

                    {pkg.featured && (
                      <div className="absolute left-3 top-3 z-10">
                        <span className="badge badge-primary gap-1 px-3 py-3 text-xs font-semibold text-primary-content shadow-lg">
                          <Sparkles className="h-3.5 w-3.5" />
                          Featured
                        </span>
                      </div>
                    )}

                    {/* =====================================
                        COVER IMAGE
                    ===================================== */}

                    <div className="relative aspect-[16/9] overflow-hidden bg-base-300">
                      <img
                        src={pkg.coverImage}
                        alt={pkg.name || "Photography package"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      {/* Image Overlay */}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                      {/* Package Name */}

                      <div className="absolute bottom-3.5 left-4 right-4">
                        <h2 className="font-playfair text-xl font-semibold text-white sm:text-2xl">
                          {pkg.name}
                        </h2>
                      </div>
                    </div>

                    {/* =====================================
                        CARD CONTENT
                    ===================================== */}

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      {/* =====================================
                          PRICE
                      ===================================== */}

                      <div className="flex items-end justify-between gap-3 border-b border-base-content/10 pb-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-base-content/50">
                            Starting From
                          </p>

                          <p className="mt-1 text-2xl font-bold text-primary sm:text-3xl">
                            ৳{Number(pkg.price || 0).toLocaleString()}
                          </p>
                        </div>

                        <Tag className="h-5 w-5 text-primary/60" />
                      </div>

                      {/* =====================================
                          QUICK INFO
                      ===================================== */}

                      <div className="grid grid-cols-2 gap-2.5 py-4">
                        {/* Duration */}

                        <div className="flex items-center gap-2 rounded-xl bg-base-100 p-2.5">
                          <Clock3 className="h-4 w-4 shrink-0 text-primary" />

                          <div className="min-w-0">
                            <p className="text-[10px] text-base-content/50">
                              Duration
                            </p>

                            <p className="truncate text-xs font-medium sm:text-sm">
                              {pkg.duration || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Photos */}

                        <div className="flex items-center gap-2 rounded-xl bg-base-100 p-2.5">
                          <Images className="h-4 w-4 shrink-0 text-primary" />

                          <div className="min-w-0">
                            <p className="text-[10px] text-base-content/50">
                              Photos
                            </p>

                            <p className="text-xs font-medium sm:text-sm">
                              {pkg.photoCount || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* =====================================
                          DESCRIPTION
                      ===================================== */}

                      <div>
                        <p className="text-sm leading-6 text-base-content/65">
                          {getShortDescription(pkg.description)}
                        </p>
                      </div>

                      {/* =====================================
                          FEATURES
                      ===================================== */}

                      {features.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2.5 text-sm font-semibold">
                            Package Includes
                          </p>

                          <ul className="space-y-2">
                            {features.slice(0, 4).map((feature, index) => (
                              <li
                                key={`${pkg._id}-feature-${index}`}
                                className="flex items-start gap-2 text-sm text-base-content/70"
                              >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <Check className="h-3 w-3 text-primary" />
                                </span>

                                <span className="leading-5">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* More Features */}

                          {features.length > 4 && (
                            <p className="mt-2 text-xs font-medium text-primary">
                              + {features.length - 4} more benefits
                            </p>
                          )}
                        </div>
                      )}

                      {/* =====================================
                          BUTTONS
                      ===================================== */}

                      <div className="mt-auto flex gap-2.5 pt-5">
                        {/* View Details */}

                        <Link
                          to={`/packages/${pkg._id}`}
                          className="btn btn-sm btn-outline flex-1 border-primary/40 hover:border-primary hover:bg-primary hover:text-primary-content"
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        {/* Book Now */}

                        <button
                          type="button"
                          onClick={() => {
                            if (!user) {
                              setSelectedPackageId(pkg._id);
                              setShowLoginModal(true);
                              return;
                            }

                            navigate(`/booking?package=${pkg._id}`);
                          }}
                          className="btn btn-sm btn-primary flex-1 text-primary-content"
                        >
                          <Camera className="h-3.5 w-3.5" />
                          Book Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          BOTTOM CTA
      ========================================= */}

      <section className="border-t border-primary/10 bg-base-200 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-center">
            <h2 className="font-playfair text-3xl font-semibold sm:text-4xl">
              Need a Custom Package?
              <span className="mt-1 block text-xl font-normal text-base-content/80 sm:text-2xl">
                (কাস্টম প্যাকেজ প্রয়োজন?)
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
              Looking for something different? Tell us about your event and
              we'll help you create a photography package that fits your needs.
            </p>

            <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-base-content/50 sm:text-sm">
              আপনার কি অন্য কিছু প্রয়োজন? আপনার ইভেন্ট সম্পর্কে জানান, আমরা
              আপনার বাজেট ও চাহিদা অনুযায়ী প্যাকেজ বানিয়ে দেব।
            </p>
          </div>

          <Link
            to="/contact"
            className="btn btn-primary mt-6 text-primary-content"
          >
            Contact Rup Darpan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* =========================================
          LOGIN REQUIRED MODAL
      ========================================= */}

      {showLoginModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-primary/20 bg-base-100/90 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="btn btn-circle btn-ghost btn-sm absolute right-3 top-3"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Login Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-7 w-7 text-primary" />
            </div>

            {/* Content */}
            <div className="mt-4 text-center">
              <div>
                <h3 className="font-playfair text-xl font-semibold">
                  Login Required{" "}
                  <span className="text-base font-normal text-base-content/80">
                    (লগইন করা প্রয়োজন)
                  </span>
                </h3>

                <p className="mt-2 text-sm leading-6 text-base-content/60">
                  To book this photography package, you need to login to your
                  account first.
                </p>
                <p className="mt-1 text-xs text-base-content/50">
                  এই ফটোগ্রাফি প্যাকেজটি বুক করতে প্রথমে আপনার অ্যাকাউন্টে লগইন
                  করুন।
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);

                  navigate("/login", {
                    state: {
                      from: `/booking?package=${selectedPackageId}`,
                    },
                  });
                }}
                className="btn btn-primary flex-1 text-primary-content"
              >
                <LogIn className="h-4 w-4" />
                Login to Book
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Packages;
