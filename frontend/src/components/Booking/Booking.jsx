import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  Images,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000";

const Booking = () => {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package");
  const { user } = useContext(AuthContext);
  console.log("USER:", user);
  // console.log("getIdToken:", user?.getIdToken);

  const {
    data: packageData,
    isLoading: packageLoading,
    isError: packageError,
  } = useQuery({
    queryKey: ["booking-package", packageId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/packages/${packageId}`);
      return response.data;
    },
    enabled: !!packageId,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const bookingData = {
      packageId: packageData._id,
      packageName: packageData.name,
      packagePrice: packageData.price,
      packageDuration: packageData.duration,
      photoCount: packageData.photoCount,

      userName: data.userName,
      userEmail: data.userEmail,
      phone: data.phone,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      eventLocation: data.eventLocation,
      notes: data.notes,
    };

    try {
      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        withCredentials: true,
      });
      toast.success("Booking request submitted successfully!");
      reset();
      console.log("Booking Response:", response.data);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };
  //for user name and email
  useEffect(() => {
    if (user) {
      setValue("userName", user.name || "");
      setValue("userEmail", user.email || "");
    }
  }, [user, setValue]);
  // console.log("User:", user);

  if (!packageId) {
    return (
      <main className="min-h-screen bg-base-100 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-error/20 bg-base-200 p-8 text-center">
          <Camera className="mx-auto h-10 w-10 text-error" />

          <div className="text-center">
            <h2 className="mt-4 font-playfair text-2xl font-semibold">
              No Package Selected{" "}
              <span className="text-lg font-normal text-base-content/80 sm:text-xl">
                (কোনো প্যাকেজ নির্বাচন করা হয়নি)
              </span>
            </h2>

            <p className="mt-2 text-sm text-base-content/60">
              Please select a photography package before making a booking.
            </p>
            <p className="mt-1 text-xs text-base-content/50">
              বুকিং সম্পন্ন করার আগে দয়া করে আপনার পছন্দের ফটোগ্রাফি প্যাকেজটি
              নির্বাচন করুন।
            </p>
          </div>

          <Link
            to="/packages"
            className="btn btn-primary mt-6 text-primary-content"
          >
            Browse Packages
          </Link>
        </div>
      </main>
    );
  }

  if (packageLoading) {
    return (
      <main className="min-h-screen bg-base-100 px-4 py-20">
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </main>
    );
  }

  if (packageError || !packageData) {
    return (
      <main className="min-h-screen bg-base-100 px-4 py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-error/20 bg-base-200 p-8 text-center">
          <Camera className="mx-auto h-10 w-10 text-error" />

          <div className="text-center">
            <h2 className="mt-4 font-playfair text-2xl font-semibold">
              Unable to Load Package{" "}
              <span className="text-lg font-normal text-base-content/80 sm:text-xl">
                (প্যাকেজ লোড করা সম্ভব হয়নি)
              </span>
            </h2>

            <p className="mt-2 text-sm text-base-content/60">
              We couldn't load the selected package. Please try again.
            </p>
            <p className="mt-1 text-xs text-base-content/50">
              নির্বাচিত প্যাকেজের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা
              করুন।
            </p>
          </div>

          <Link
            to="/packages"
            className="btn btn-primary mt-6 text-primary-content"
          >
            Back to Packages
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}

        <Link
          to={`/packages/${packageData._id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-base-content/60 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Package
        </Link>

        {/* Header */}

        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Booking
          </p>

          <div className="text-center">
            <h1 className="mt-2 font-playfair text-3xl font-semibold sm:text-4xl lg:text-5xl">
              Reserve Your Photography Package{" "}
              <span className="mt-1 block text-xl font-normal text-base-content/80 sm:text-2xl lg:text-3xl">
                (আপনার ফটোগ্রাফি প্যাকেজ বুক করুন)
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-base-content/60 sm:text-base">
              Tell us about your event and our team will get in touch with you
              to confirm the booking.
            </p>
            <p className="mx-auto mt-1 max-w-2xl text-xs leading-5 text-base-content/50 sm:text-sm">
              আপনার ইভেন্ট সম্পর্কে তথ্য দিন, রূপদর্পণ (RupDarpon)-এর টিম দ্রুতই
              আপনার সাথে যোগাযোগ করে বুকিং কনফার্ম করবে।
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-5">
          {/* =========================================
              PACKAGE SUMMARY
          ========================================= */}

          <aside className="lg:col-span-2">
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-primary/10 bg-base-200 shadow-sm">
              {/* Cover Image */}

              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={packageData.coverImage}
                  alt={packageData.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-5 right-5">
                  {packageData.featured && (
                    <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-content">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Featured Package
                    </span>
                  )}

                  <h2 className="font-playfair text-2xl font-semibold text-white sm:text-3xl">
                    {packageData.name}
                  </h2>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Price */}

                <div className="border-b border-base-content/10 pb-5">
                  <p className="text-xs uppercase tracking-widest text-base-content/50">
                    Package Price
                  </p>

                  <p className="mt-1 text-3xl font-bold text-primary">
                    ৳{Number(packageData.price || 0).toLocaleString()}
                  </p>
                </div>

                {/* Package Info */}

                <div className="grid grid-cols-2 gap-3 py-5">
                  <div className="rounded-xl bg-base-100 p-3">
                    <Clock3 className="h-5 w-5 text-primary" />

                    <p className="mt-2 text-xs text-base-content/50">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {packageData.duration || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-base-100 p-3">
                    <Images className="h-5 w-5 text-primary" />

                    <p className="mt-2 text-xs text-base-content/50">Photos</p>

                    <p className="mt-1 text-sm font-semibold">
                      {packageData.photoCount || 0}
                    </p>
                  </div>
                </div>

                {/* Selected Package */}

                <div className="rounded-xl border border-primary/10 bg-base-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-base-content/50">
                    Selected Package
                  </p>

                  <p className="mt-1 font-playfair text-xl font-semibold">
                    {packageData.name}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-base-content/60">Price</span>

                    <span className="font-semibold text-primary">
                      ৳{Number(packageData.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* =========================================
              BOOKING FORM
          ========================================= */}

          <section className="lg:col-span-3">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-2xl border border-primary/10 bg-base-200 p-5 shadow-sm sm:p-7"
            >
              {/* Form Header */}

              <div className="mb-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-playfair text-2xl font-semibold">
                      Booking Information
                    </h2>

                    <p className="text-sm text-base-content/50">
                      Please provide your event details.
                    </p>
                  </div>
                </div>
              </div>

              {/* =========================================
                  USER INFORMATION
              ========================================= */}

              <div className="mb-7">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  Your Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Full Name
                    </label>

                    <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
                      <User className="h-4 w-4 text-base-content/40" />

                      <input
                        type="text"
                        className="grow "
                        placeholder="Your full name"
                        {...register("userName", {
                          required: "Full name is required",
                        })}
                      />
                    </label>

                    {errors.userName && (
                      <p className="mt-1 text-xs text-error">
                        {errors.userName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Email Address
                    </label>

                    <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
                      <Mail className="h-4 w-4 text-base-content/40" />

                      <input
                        type="email"
                        className="grow"
                        placeholder="your@email.com"
                        {...register("userEmail", {
                          required: "Email is required",
                        })}
                      />
                    </label>

                    {errors.userEmail && (
                      <p className="mt-1 text-xs text-error">
                        {errors.userEmail.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* =========================================
                  EVENT INFORMATION
              ========================================= */}

              <div className="mb-7">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  Event Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Phone */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Phone Number
                    </label>

                    <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
                      <Phone className="h-4 w-4 text-base-content/40" />

                      <input
                        type="tel"
                        className="grow"
                        placeholder="01XXXXXXXXX"
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                      />
                    </label>

                    {errors.phone && (
                      <p className="mt-1 text-xs text-error">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Date */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Event Date
                    </label>

                    <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
                      <CalendarDays className="h-4 w-4 text-base-content/40" />

                      <input
                        type="date"
                        className="grow"
                        {...register("eventDate", {
                          required: "Event date is required",
                        })}
                      />
                    </label>

                    {errors.eventDate && (
                      <p className="mt-1 text-xs text-error">
                        {errors.eventDate.message}
                      </p>
                    )}
                  </div>

                  {/* Time */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Preferred Time
                    </label>

                    <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
                      <Clock3 className="h-4 w-4 text-base-content/40" />

                      <input
                        type="time"
                        className="grow"
                        {...register("eventTime", {
                          required: "Event time is required",
                        })}
                      />
                    </label>

                    {errors.eventTime && (
                      <p className="mt-1 text-xs text-error">
                        {errors.eventTime.message}
                      </p>
                    )}
                  </div>

                  {/* Location */}

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Event Location
                    </label>

                    <label className="input input-bordered flex w-full items-center gap-2 bg-base-100">
                      <MapPin className="h-4 w-4 text-base-content/40" />

                      <input
                        type="text"
                        className="grow"
                        placeholder="Event venue / location"
                        {...register("eventLocation", {
                          required: "Event location is required",
                        })}
                      />
                    </label>

                    {errors.eventLocation && (
                      <p className="mt-1 text-xs text-error">
                        {errors.eventLocation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* =========================================
                  ADDITIONAL REQUIREMENTS
              ========================================= */}

              <div className="mb-7">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  Additional Requirements
                </h3>

                <label className="textarea textarea-bordered flex w-full gap-2 bg-base-100">
                  <FileText className="mt-1 h-4 w-4 shrink-0 text-base-content/40" />

                  <textarea
                    className="grow resize-none"
                    rows="5"
                    placeholder="Tell us anything else we should know about your event..."
                    {...register("notes")}
                  />
                </label>
              </div>

              {/* =========================================
                  FINAL SUMMARY
              ========================================= */}

              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-base-content/50">
                      Booking Package
                    </p>

                    <p className="mt-1 font-playfair text-lg font-semibold">
                      {packageData.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-base-content/50">Total Price</p>

                    <p className="text-xl font-bold text-primary">
                      ৳{Number(packageData.price || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}

              <button
                type="submit"
                className="btn btn-primary w-full text-primary-content"
              >
                <Send className="h-4 w-4" />
                Confirm Booking
              </button>

              <p className="mt-3 text-center text-xs text-base-content/45">
                Your booking request will be reviewed and confirmed by our team.
                (আপনার বুকিং রিকোয়েস্টটি আমাদের টিম রিভিউ করে নিশ্চিত করবে।)
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Booking;
