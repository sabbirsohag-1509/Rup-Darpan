import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clock3,
  Image as ImageIcon,
  Images,
  Info,
  Mail,
  Package,
  Sparkles,
  Tag,
} from "lucide-react";

const PackagesDetails = () => {
  const { id } = useParams();

  const {
    data: pkg,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["package", id],

    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/packages/${id}`);

      return response.data;
    },

    enabled: !!id,
  });

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (isLoading) {
    return (
      <main className="min-h-screen bg-base-100 px-4 py-16">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary" />

            <p className="mt-4 text-sm text-base-content/60">
              Loading package details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // Error
  // -----------------------------------------

  if (isError || !pkg) {
    return (
      <main className="min-h-screen bg-base-100 px-4 py-16">
        <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
          <div className="w-full rounded-3xl border border-error/20 bg-base-200 p-8 text-center shadow-xl">
            <Package className="mx-auto h-12 w-12 text-error" />

            <h1 className="mt-5 font-playfair text-3xl font-semibold">
              Package Not Found
            </h1>

            <p className="mt-3 text-sm leading-6 text-base-content/60">
              We couldn't find the photography package you're looking for.
              Please go back and choose another package.
            </p>

            <Link
              to="/packages"
              className="btn btn-primary mt-6 text-primary-content"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Packages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const features = Array.isArray(pkg.features) ? pkg.features : [];

  const isActive = pkg.active !== false;

  return (
    <main className="min-h-screen bg-base-100">
      {/* =====================================================
          HERO / COVER IMAGE
      ====================================================== */}

      <section className="px-4 pt-6 sm:pt-8">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}

          <Link
            to="/packages"
            className="group mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-base-200 px-4 py-2.5 text-sm font-medium text-base-content transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Packages
          </Link>

          {/* Cover */}

          <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-base-300 shadow-2xl">
            <div className="relative h-[320px] sm:h-[430px] lg:h-[540px]">
              {pkg.coverImage ? (
                <img
                  src={pkg.coverImage}
                  alt={pkg.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-base-content/20" />
                </div>
              )}

              {/* Dark Overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />

              {/* Featured Badge */}

              {pkg.featured && (
                <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                  <span className="badge badge-primary gap-1.5 px-4 py-3.5 text-primary-content shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    Featured Package
                  </span>
                </div>
              )}

              {/* Active Status */}

              <div className="absolute right-5 top-5 sm:right-7 sm:top-7">
                <span
                  className={`badge border-0 px-4 py-3.5 text-white ${
                    isActive ? "badge-success" : "badge-error"
                  }`}
                >
                  {isActive ? "Available" : "Unavailable"}
                </span>
              </div>

              {/* Hero Content */}

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-12">
                <div className="max-w-4xl">
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/70">
                    <Camera className="h-4 w-4" />
                    Photography Package
                  </p>

                  <h1 className="font-playfair text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
                    {pkg.name}
                  </h1>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                      {pkg.duration || "Duration not specified"}
                    </span>

                    <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                      {pkg.photoCount || 0} Photos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="px-4 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12">
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="space-y-8 lg:col-span-8">
            {/* Package Overview */}

            <div className="rounded-3xl border border-primary/10 bg-base-200 p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Info className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Package Overview
                  </p>

                  <h2 className="font-playfair text-2xl font-semibold sm:text-3xl">
                    About This Package
                  </h2>
                </div>
              </div>

              <p className="whitespace-pre-line text-sm leading-7 text-base-content/70 sm:text-base sm:leading-8">
                {pkg.description ||
                  "A carefully designed photography package for your special moments."}
              </p>
            </div>

            {/* What's Included */}

            <div className="rounded-3xl border border-primary/10 bg-base-200 p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Check className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Package Benefits
                  </p>

                  <h2 className="font-playfair text-2xl font-semibold sm:text-3xl">
                    What's Included
                  </h2>
                </div>
              </div>

              {features.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <div
                      key={`${pkg._id}-feature-${index}`}
                      className="flex items-start gap-3 rounded-2xl border border-primary/5 bg-base-100 p-4 transition-all duration-200 hover:border-primary/20 hover:bg-primary/5"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </span>

                      <span className="pt-1 text-sm font-medium leading-6 text-base-content/75">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-base-content/50">
                  No additional features have been added to this package.
                </p>
              )}
            </div>

            {/* Package Information */}

            <div className="rounded-3xl border border-primary/10 bg-base-200 p-6 shadow-sm sm:p-8">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Tag className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Details
                  </p>

                  <h2 className="font-playfair text-2xl font-semibold sm:text-3xl">
                    Package Information
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Duration */}

                <div className="rounded-2xl bg-base-100 p-5">
                  <Clock3 className="h-5 w-5 text-primary" />

                  <p className="mt-3 text-xs text-base-content/50">Duration</p>

                  <p className="mt-1 text-base font-semibold">
                    {pkg.duration || "N/A"}
                  </p>
                </div>

                {/* Photos */}

                <div className="rounded-2xl bg-base-100 p-5">
                  <Images className="h-5 w-5 text-primary" />

                  <p className="mt-3 text-xs text-base-content/50">Photos</p>

                  <p className="mt-1 text-base font-semibold">
                    {pkg.photoCount || 0} Edited Photos
                  </p>
                </div>

                {/* Status */}

                <div className="rounded-2xl bg-base-100 p-5">
                  <Sparkles className="h-5 w-5 text-primary" />

                  <p className="mt-3 text-xs text-base-content/50">Status</p>

                  <p
                    className={`mt-1 text-base font-semibold ${
                      isActive ? "text-success" : "text-error"
                    }`}
                  >
                    {isActive ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="lg:col-span-4">
            <div className="space-y-5 lg:sticky lg:top-24">
              {/* Price Card */}

              <div className="overflow-hidden rounded-3xl border border-primary/15 bg-base-200 shadow-xl">
                <div className="bg-primary p-6 text-primary-content sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-widest opacity-75">
                    Package Price
                  </p>

                  <p className="mt-2 text-4xl font-bold sm:text-5xl">
                    ৳{Number(pkg.price || 0).toLocaleString()}
                  </p>

                  <p className="mt-2 text-sm opacity-75">
                    Complete photography package
                  </p>
                </div>

                <div className="space-y-4 p-6 sm:p-7">
                  {/* Quick Info */}

                  <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
                    <span className="flex items-center gap-2 text-sm text-base-content/60">
                      <Clock3 className="h-4 w-4 text-primary" />
                      Duration
                    </span>

                    <span className="text-sm font-semibold">
                      {pkg.duration || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-base-content/10 pb-4">
                    <span className="flex items-center gap-2 text-sm text-base-content/60">
                      <Images className="h-4 w-4 text-primary" />
                      Photos
                    </span>

                    <span className="text-sm font-semibold">
                      {pkg.photoCount || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-base-content/60">
                      <Package className="h-4 w-4 text-primary" />
                      Availability
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        isActive ? "text-success" : "text-error"
                      }`}
                    >
                      {isActive ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Booking Button */}

                  <Link
                    to={`/booking?package=${pkg._id}`}
                    className={`btn mt-3 w-full rounded-full text-base font-semibold ${
                      isActive
                        ? "btn-primary text-primary-content shadow-lg"
                        : "btn-disabled"
                    }`}
                  >
                    <Camera className="h-5 w-5" />
                    Book This Package
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {/* Contact Button */}

                  <Link
                    to="/contact"
                    className="btn btn-outline w-full rounded-full border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-content"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Small Info Card */}

              <div className="rounded-3xl border border-primary/10 bg-base-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Info className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Need something different?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-base-content/55">
                      If this package doesn't perfectly match your event,
                      contact us and we'll help you create a custom package.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="border-t border-primary/10 bg-base-200 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Camera className="mx-auto h-9 w-9 text-primary" />

          <div className="text-center">
            <h2 className="mt-4 font-playfair text-3xl font-semibold sm:text-4xl">
              Ready to Capture Your Moments?{" "}
              <span className="mt-1 block text-xl font-normal text-base-content/80 sm:text-2xl">
                (আপনার বিশেষ মুহূর্তগুলো ধরে রাখতে প্রস্তুত?)
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
              Choose this package and let RupDarpon preserve your special
              moments with beautiful photography and cinematic storytelling.
            </p>
            <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-base-content/50 sm:text-sm">
              আজই বুক করুন এই প্যাকেজটি! আপনার সেরা স্মৃতিগুলোকে চমৎকার ছবি ও
              সিনেমাটিক ভিডিওতে ফ্রেমবন্দি করতে রূপদর্পণ আছে আপনার পাশে।
            </p>
          </div>

          <Link
            to={`/booking?package=${pkg._id}`}
            className={`btn btn-primary mt-6 rounded-full px-7 text-primary-content ${
              !isActive ? "btn-disabled" : ""
            }`}
          >
            Book This Package
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PackagesDetails;
