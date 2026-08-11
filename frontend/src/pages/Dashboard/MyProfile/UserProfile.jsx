import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  BarChart3,
  CalendarDays,
  Camera,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import ChangePassword from "./Security/ChangePassword";
import LoginActivity from "./Security/LoginActivity";

const API_URL = "http://localhost:5000";

const UserProfile = () => {
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bio: "",
    profilePhoto: "",
  });

  // =========================================
  // PROFILE
  // =========================================

  const {
    data: user,
    isLoading: profileLoading,
    isError: profileError,
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true,
      });

      return response.data;
    },
  });

  // =========================================
  // BOOKINGS
  // =========================================

  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
  } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/bookings`, {
        withCredentials: true,
      });

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // =========================================
  // REVIEWS
  // =========================================

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["my-reviews"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/reviews/my`, {
        withCredentials: true,
      });

      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // =========================================
  // STATS
  // =========================================

  const totalBookings = bookings.length;

  const totalReviews = reviews.length;

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed",
  ).length;

  // =========================================
  // OPEN EDIT MODAL
  // =========================================

  const handleOpenEdit = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone?.replace(/^\+88/, "") || "",
      address: user?.address || "",
      bio: user?.bio || "",
      profilePhoto: user?.profilePhoto || "",
    });

    setIsEditOpen(true);
  };

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // CLOUDINARY UPLOAD
  // =========================================

  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Optional size validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const cloudinaryFormData = new FormData();

      cloudinaryFormData.append("file", file);

      cloudinaryFormData.append("upload_preset", "rup_darpon");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgshzmhyk/image/upload",
        cloudinaryFormData,
      );

      const imageUrl = response.data.secure_url;

      setFormData((prev) => ({
        ...prev,
        profilePhoto: imageUrl,
      }));

      toast.success("Profile photo uploaded!");
    } catch (error) {
      console.error("Cloudinary upload failed:", error);

      toast.error("Failed to upload image.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // =========================================
  // UPDATE PROFILE
  // =========================================

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.patch(`${API_URL}/users/me`, updatedData, {
        withCredentials: true,
      });

      return response.data;
    },

    onSuccess: () => {
      toast.success("Profile updated successfully! 🎉");

      // Refresh profile
      queryClient.invalidateQueries({
        queryKey: ["my-profile"],
      });

      setIsEditOpen(false);
    },

    onError: (error) => {
      console.error("Profile update failed:", error);

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSaveProfile = (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    updateProfileMutation.mutate({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      bio: formData.bio.trim(),
      profilePhoto: formData.profilePhoto,
    });
  };

  // =========================================
  // LOADING
  // =========================================

  if (profileLoading) {
    return (
      <div className="space-y-5">
        <section className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm">
          <div className="h-32 animate-pulse bg-base-300 sm:h-40" />

          <div className="px-5 pb-7 sm:px-7">
            <div className="-mt-16 flex flex-col items-center">
              <div className="h-32 w-32 animate-pulse rounded-full border-4 border-base-100 bg-base-300" />

              <div className="mt-4 h-7 w-44 animate-pulse rounded bg-base-300" />

              <div className="mt-2 h-4 w-56 animate-pulse rounded bg-base-300" />

              <div className="mt-3 h-12 w-full max-w-xl animate-pulse rounded bg-base-300" />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-3xl bg-base-200"
            />
          ))}
        </section>

        <section className="h-40 animate-pulse rounded-3xl bg-base-200" />
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (profileError) {
    return (
      <section className="rounded-3xl border border-error/20 bg-base-100 p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <User className="h-7 w-7 text-error" />
        </div>

        <h3 className="mt-4 font-playfair text-xl font-semibold">
          Failed to Load Profile
        </h3>

        <p className="mt-2 text-sm text-base-content/60">
          Something went wrong while loading your profile.
        </p>
      </section>
    );
  }

  // =========================================
  // MAIN
  // =========================================

  return (
    <>
      <div className="space-y-5">
        {/* =========================================
            PROFILE CARD
        ========================================== */}

        <section className="overflow-hidden rounded-3xl border border-primary/10 bg-base-100 shadow-sm">
          {/* Cover */}
          <div className="h-28 bg-primary/10 sm:h-36" />

          {/* Profile Content */}
          <div className="px-5 pb-7 sm:px-7">
            <div className="-mt-16 flex flex-col items-center text-center">
              {/* Profile Photo */}

              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-base-100 bg-base-200 shadow-lg sm:h-36 sm:w-36">
                  {user?.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt={user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-5xl font-bold text-primary">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                {/* Small Camera Badge */}

                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-base-100 bg-primary text-primary-content shadow-md transition hover:scale-105"
                  title="Edit profile photo"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Name */}

              <h1 className="mt-4 font-playfair text-2xl font-semibold sm:text-3xl">
                {user?.name || "User"}
              </h1>

              {/* Email */}

              <p className="mt-1 text-sm text-base-content/55">
                {user?.email || "No email available"}
              </p>

              {/* Role */}

              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />

                  {user?.role === "admin" ? "Admin" : "User"}
                </span>
              </div>

              {/* Bio */}

              <div className="mt-5 w-full max-w-2xl">
                <p className="text-sm leading-6 text-base-content/70">
                  {user?.bio ||
                    "No bio added yet. Tell us a little about yourself."}
                </p>
              </div>

              {/* Edit Button */}

              <button
                type="button"
                onClick={handleOpenEdit}
                className="btn btn-primary mt-5 rounded-full px-7"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* =========================================
            QUICK STATS
        ========================================== */}

        <section className="grid gap-4 sm:grid-cols-3">
          {/* Total Bookings */}

          <div className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/50">
                  Total Bookings
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {bookingsLoading ? (
                    <span className="inline-block h-9 w-12 animate-pulse rounded bg-base-300" />
                  ) : (
                    totalBookings
                  )}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
            </div>

            <p className="mt-3 text-xs text-base-content/45">
              All your bookings
            </p>
          </div>

          {/* Total Reviews */}

          <div className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/50">
                  Total Reviews
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {reviewsLoading ? (
                    <span className="inline-block h-9 w-12 animate-pulse rounded bg-base-300" />
                  ) : (
                    totalReviews
                  )}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>

            <p className="mt-3 text-xs text-base-content/45">
              Reviews you submitted
            </p>
          </div>

          {/* Completed */}

          <div className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-base-content/50">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {bookingsLoading ? (
                    <span className="inline-block h-9 w-12 animate-pulse rounded bg-base-300" />
                  ) : (
                    completedBookings
                  )}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
                <ShieldCheck className="h-6 w-6 text-success" />
              </div>
            </div>

            <p className="mt-3 text-xs text-base-content/45">
              Successfully completed
            </p>
          </div>
        </section>

        {/* =========================================
            PERSONAL INFORMATION
        ========================================== */}

        <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h3 className="font-playfair text-xl font-semibold">
              Personal Information
            </h3>

            <p className="mt-1 text-xs text-base-content/50">
              Your basic account information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}

            <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-base-content/45">Full Name</p>

                  <p className="mt-1 truncate text-sm font-semibold">
                    {user?.name || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email */}

            <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-base-content/45">Email Address</p>

                  <p className="mt-1 truncate text-sm font-semibold">
                    {user?.email || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}

            <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-base-content/45">Phone Number</p>

                  <p className="mt-1 truncate text-sm font-semibold">
                    {user?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}

            <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-base-content/45">Address</p>

                  <p className="mt-1 truncate text-sm font-semibold">
                    {user?.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            ACCOUNT INFORMATION
        ========================================== */}

        <section className="rounded-3xl border border-primary/10 bg-base-100 p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h3 className="font-playfair text-xl font-semibold">
              Account Information
            </h3>

            <p className="mt-1 text-xs text-base-content/50">
              Information about your account.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-base-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-xs text-base-content/45">Account Created</p>

                <p className="mt-1 text-sm font-semibold">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            DATA ERROR NOTICE
        ========================================== */}

        {(bookingsError || reviewsError) && (
          <div className="rounded-2xl border border-warning/20 bg-warning/10 p-4 text-sm text-warning-content">
            Some profile statistics could not be loaded. Your main profile is
            still available.
          </div>
        )}
      </div>

      {/* =========================================
          EDIT PROFILE MODAL
      ========================================== */}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-primary/10 bg-base-100 shadow-2xl">
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-base-300 bg-base-100 px-5 py-4 sm:px-7">
              <div>
                <h2 className="font-playfair text-xl font-semibold sm:text-2xl">
                  Edit Profile
                </h2>

                <p className="mt-1 text-xs text-base-content/50">
                  Update your personal information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="btn btn-circle btn-ghost btn-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}

            <form onSubmit={handleSaveProfile} className="space-y-5 p-5 sm:p-7">
              {/* Profile Photo */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Profile Photo
                </label>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Preview */}

                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-primary/10 bg-base-200">
                    {formData.profilePhoto ? (
                      <img
                        src={formData.profilePhoto}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-3xl font-bold text-primary">
                        {formData.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <label
                      htmlFor="edit-profile-photo"
                      className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-primary/20 p-4 text-center transition hover:border-primary/50 hover:bg-base-200/60"
                    >
                      <input
                        id="edit-profile-photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoUpload}
                        disabled={isUploadingPhoto}
                      />

                      {isUploadingPhoto ? (
                        <span className="inline-flex items-center gap-2 text-sm font-medium">
                          <span className="loading loading-spinner loading-sm" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium">
                          <Camera className="h-4 w-4" />
                          Change profile photo
                        </span>
                      )}
                    </label>

                    <p className="mt-2 text-xs text-base-content/50">
                      JPG, PNG or WEBP. Maximum 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="input input-bordered w-full focus:border-primary"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input input-bordered w-full bg-base-200"
                />

                <p className="mt-1 text-xs text-base-content/45">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={11}
                  placeholder="017XXX-XXXXX"
                  className="input input-bordered w-full focus:border-primary"
                />
              </div>

              {/* Address */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  className="input input-bordered w-full focus:border-primary"
                />
              </div>

              {/* Bio */}

              <div>
                <label className="mb-2 block text-sm font-semibold">Bio</label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a little about yourself..."
                  rows={4}
                  maxLength={300}
                  className="textarea textarea-bordered w-full resize-none focus:border-primary"
                />

                <p className="mt-1 text-right text-xs text-base-content/45">
                  {formData.bio.length}/300
                </p>
              </div>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-base-300 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="btn btn-ghost rounded-full"
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending || isUploadingPhoto}
                  className="btn btn-primary rounded-full px-7"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div> 
        <ChangePassword></ChangePassword>
        <LoginActivity></LoginActivity>
      </div>
    </>
  );
};

export default UserProfile;
