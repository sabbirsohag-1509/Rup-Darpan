import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import {
  ArrowLeft,
  Check,
  Clock3,
  Image as ImageIcon,
  Images,
  Info,
  Package,
  Plus,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Loader from "../../components/shared/Loader";


const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dgshzmhyk/image/upload";

const CLOUDINARY_UPLOAD_PRESET = "rup_darpon";

const createPackage = async (packageData) => {
  const response = await fetch("http://localhost:5000/packages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(packageData),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create package.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const AddPackage = () => {
  const navigate = useNavigate();

  const [features, setFeatures] = useState([
    "300 Edited Photos",
    "2 Photographers",
    "Premium Album",
  ]);

  const [featureInput, setFeatureInput] = useState("");

  const [previewImage, setPreviewImage] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      duration: "",
      photoCount: "",
      description: "",
      coverImage: "",
      featured: false,
      active: true,
    },
  });

  // --------------------------------------------------
  // Live Preview Values
  // --------------------------------------------------

  const watchName = watch("name");
  const watchPrice = watch("price");
  const watchDuration = watch("duration");
  const watchPhotoCount = watch("photoCount");
  const watchDescription = watch("description");
  const watchFeatured = watch("featured");
  const watchActive = watch("active");

  // --------------------------------------------------
  // TanStack Query Mutation
  // --------------------------------------------------

  const {
    mutate: submitPackage,
    isPending,
  } = useMutation({
    mutationFn: createPackage,

    onSuccess: () => {
      toast.success("Package added successfully!", {
        icon: "📦",
      });

      reset();

      setFeatures([]);

      setFeatureInput("");

      setPreviewImage("");

      navigate("/admin/packages");
    },

    onError: (error) => {
      console.error("Failed to create package:", error);

      toast.error(
        error.message || "Failed to add package.",
      );
    },
  });

  // --------------------------------------------------
  // Cloudinary Upload
  // --------------------------------------------------

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Basic file validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      return;
    }

    // Local preview
    const localUrl = URL.createObjectURL(file);

    setPreviewImage(localUrl);

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET,
      );

      const response = await fetch(
        CLOUDINARY_UPLOAD_URL,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed.");
      }

      const data = await response.json();

      const imageUrl = data.secure_url;

      setValue("coverImage", imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setPreviewImage(imageUrl);

      toast.success("Cover image uploaded successfully!", {
        icon: "☁️",
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      setPreviewImage("");

      setValue("coverImage", "", {
        shouldValidate: true,
      });

      toast.error(
        "Failed to upload cover image. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // --------------------------------------------------
  // Features
  // --------------------------------------------------

  const addFeature = () => {
    const cleanFeature = featureInput.trim();

    if (!cleanFeature) return;

    if (features.includes(cleanFeature)) {
      toast.error("This feature is already added.");
      return;
    }

    setFeatures((prev) => [...prev, cleanFeature]);

    setFeatureInput("");
  };

  const handleFeatureKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addFeature();
    }
  };

  const removeFeature = (indexToRemove) => {
    setFeatures((prev) =>
      prev.filter(
        (_, index) => index !== indexToRemove,
      ),
    );
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const onSubmit = (data) => {
    if (isUploading) {
      toast.error("Please wait until the image upload is complete.");
      return;
    }

    if (features.length === 0) {
      toast.error("Please add at least one package feature.");
      return;
    }

    if (!data.coverImage) {
      toast.error("Please upload a cover image.");
      return;
    }

    const packageData = {
      name: data.name.trim(),

      price: Number(data.price),

      duration: data.duration.trim(),

      photoCount: Number(data.photoCount),

      description: data.description.trim(),

      features,

      coverImage: data.coverImage,

      featured: Boolean(data.featured),

      active: Boolean(data.active),

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    submitPackage(packageData);
  };

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------

  const handleReset = () => {
    if (isPending || isUploading) return;

    reset();

    setFeatures([
      "300 Edited Photos",
      "2 Photographers",
      "Premium Album",
    ]);

    setFeatureInput("");

    setPreviewImage("");
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-10">
      {/* Back Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/admin/packages")}
          className="group inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />

          Back to Packages
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="font-playfair text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl">
          Add New Package
        </h1>

        <p className="mt-2 text-sm text-base-content/70 sm:text-base">
          Create and configure a premium photography package
          for your clients.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* =====================================================
            FORM
        ====================================================== */}
        <div className="rounded-2xl border border-primary/10 bg-base-200/50 p-5 shadow-xl backdrop-blur-sm sm:p-8 lg:col-span-7">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Package Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-1.5 font-semibold">
                  <Package className="h-4 w-4 text-primary" />

                  Package Name

                  <span className="text-error">*</span>
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. Wedding Gold"
                className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                  errors.name ? "border-error" : ""
                }`}
                {...register("name", {
                  required: "Package name is required",

                  minLength: {
                    value: 3,
                    message:
                      "Package name must be at least 3 characters",
                  },

                  maxLength: {
                    value: 50,
                    message:
                      "Package name cannot exceed 50 characters",
                  },
                })}
              />

              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.name.message}
                  </span>
                </label>
              )}
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Price */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold">
                    Price (৳)

                    <span className="ml-1 text-error">*</span>
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 25000"
                  className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                    errors.price ? "border-error" : ""
                  }`}
                  {...register("price", {
                    required: "Price is required",

                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },

                    valueAsNumber: true,
                  })}
                />

                {errors.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.price.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Duration */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text flex items-center gap-1.5 font-semibold">
                    <Clock3 className="h-4 w-4 text-primary" />

                    Duration

                    <span className="text-error">*</span>
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. 8 Hours"
                  className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                    errors.duration ? "border-error" : ""
                  }`}
                  {...register("duration", {
                    required: "Duration is required",

                    minLength: {
                      value: 2,
                      message:
                        "Please enter a valid duration",
                    },
                  })}
                />

                {errors.duration && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.duration.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Photo Count */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-1.5 font-semibold">
                  <Images className="h-4 w-4 text-primary" />

                  Photo Count

                  <span className="text-error">*</span>
                </span>
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 300"
                className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                  errors.photoCount ? "border-error" : ""
                }`}
                {...register("photoCount", {
                  required: "Photo count is required",

                  min: {
                    value: 1,
                    message:
                      "Photo count must be greater than 0",
                  },

                  valueAsNumber: true,
                })}
              />

              {errors.photoCount && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.photoCount.message}
                  </span>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Description

                  <span className="ml-1 text-error">*</span>
                </span>
              </label>

              <textarea
                placeholder="Describe this photography package..."
                className={`textarea textarea-bordered h-28 w-full border-primary/20 focus:border-primary focus:outline-none ${
                  errors.description ? "border-error" : ""
                }`}
                {...register("description", {
                  required: "Description is required",

                  minLength: {
                    value: 10,
                    message:
                      "Description must be at least 10 characters",
                  },

                  maxLength: {
                    value: 2000,
                    message:
                      "Description cannot exceed 2000 characters",
                  },
                })}
              />

              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description.message}
                  </span>
                </label>
              )}
            </div>

            {/* Features */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-1.5 font-semibold">
                  Package Features

                  <span className="text-error">*</span>

                  <span
                    className="tooltip tooltip-right cursor-help"
                    data-tip="Press Enter or click Add"
                  >
                    <Info className="h-3.5 w-3.5 text-base-content/40" />
                  </span>
                </span>
              </label>

              {/* Feature Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 2 Photographers"
                  value={featureInput}
                  onChange={(event) =>
                    setFeatureInput(event.target.value)
                  }
                  onKeyDown={handleFeatureKeyDown}
                  className="input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none"
                />

                <button
                  type="button"
                  onClick={addFeature}
                  disabled={!featureInput.trim()}
                  className="btn btn-primary text-primary-content"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Add
                  </span>
                </button>
              </div>

              {/* Feature List */}
              <div className="mt-3 min-h-[3rem] rounded-xl border border-primary/5 bg-base-300/40 p-3">
                {features.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-base-content/40">
                    <Info className="h-4 w-4" />

                    No features added yet.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span
                        key={`${feature}-${index}`}
                        className="badge badge-primary gap-1 py-3 pl-3 pr-1 text-xs font-semibold text-primary-content shadow-sm transition-transform hover:scale-105"
                      >
                        <Check className="h-3 w-3" />

                        {feature}

                        <button
                          type="button"
                          onClick={() =>
                            removeFeature(index)
                          }
                          className="rounded-full p-0.5 transition-colors hover:bg-primary-content/20"
                          aria-label={`Remove ${feature}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {features.length === 0 && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    At least one feature is required
                  </span>
                </label>
              )}
            </div>

            {/* Cover Image */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text flex items-center gap-1.5 font-semibold">
                  <ImageIcon className="h-4 w-4 text-primary" />

                  Cover Image

                  <span className="text-error">*</span>
                </span>
              </label>

              <div
                className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                  errors.coverImage
                    ? "border-error bg-error/5"
                    : "border-primary/20 hover:border-primary/50 hover:bg-base-200"
                }`}
                onClick={() => {
                  if (!isUploading) {
                    document
                      .getElementById("package-cover-upload")
                      ?.click();
                  }
                }}
              >
                <input
                  id="package-cover-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  disabled={isUploading}
                  onChange={handleFileChange}
                />

                {isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-md text-primary" />

                    <p className="mt-3 text-sm font-medium">
                      Uploading to Cloudinary...
                    </p>

                    <p className="mt-1 text-xs text-base-content/50">
                      Please wait
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mx-auto mb-2 h-10 w-10 text-base-content/40" />

                    <p className="text-sm font-medium">
                      Click to select cover image
                    </p>

                    <p className="mt-1 text-xs text-base-content/50">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </>
                )}
              </div>

              {/* Hidden RHF Field */}
              <input
                type="hidden"
                {...register("coverImage", {
                  required: "Cover image is required",
                })}
              />

              {errors.coverImage && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.coverImage.message}
                  </span>
                </label>
              )}
            </div>

            {/* Cover Image Preview */}
            {previewImage && (
              <div className="relative overflow-hidden rounded-xl border border-primary/10 bg-base-300">
                <img
                  src={previewImage}
                  alt="Package cover preview"
                  className="h-48 w-full object-cover"
                />

                <button
                  type="button"
                  disabled={isUploading || isPending}
                  onClick={() => {
                    setPreviewImage("");

                    setValue("coverImage", "", {
                      shouldValidate: true,
                    });
                  }}
                  className="btn btn-circle btn-sm btn-error absolute right-3 top-3 text-white"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Featured & Active */}
            <div className="flex flex-wrap gap-6 rounded-xl border border-primary/5 bg-base-300/35 p-4">
              {/* Featured */}
              <div className="form-control min-w-[140px] flex-1">
                <label className="label cursor-pointer justify-between gap-4">
                  <span className="label-text flex items-center gap-1.5 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />

                    Featured Package
                  </span>

                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register("featured")}
                  />
                </label>
              </div>

              {/* Active */}
              <div className="form-control min-w-[140px] flex-1">
                <label className="label cursor-pointer justify-between gap-4">
                  <span className="label-text font-semibold">
                    Active Package
                  </span>

                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    {...register("active")}
                  />
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending || isUploading}
                className="btn btn-outline btn-secondary flex-1 rounded-full font-semibold"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isPending || isUploading}
                className="btn btn-primary flex-1 rounded-full font-semibold text-primary-content shadow-lg transition-all hover:shadow-primary/20"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />

                    Adding Package...
                  </>
                ) : isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />

                    Uploading...
                  </>
                ) : (
                  "Add Package"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* =====================================================
            LIVE PREVIEW
        ====================================================== */}
        <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
          <div className="rounded-2xl border border-primary/10 bg-base-200/50 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 font-playfair text-xl font-semibold text-primary">
              <Sparkles className="h-5 w-5" />

              Live Package Preview
            </h3>

            {/* Package Card */}
            <motion.div
              layout
              className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-base-100 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Featured Badge */}
              {watchFeatured && (
                <div className="absolute left-3.5 top-3.5 z-10 badge badge-primary gap-1 px-3 py-2.5 text-xs font-bold text-primary-content shadow-md">
                  <Sparkles className="h-3 w-3" />

                  Featured
                </div>
              )}

              {/* Active Status */}
              <div
                className={`absolute right-3.5 top-3.5 z-10 badge border-0 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur-md ${
                  watchActive
                    ? "bg-success/80"
                    : "bg-error/80"
                }`}
              >
                {watchActive ? "Active" : "Inactive"}
              </div>

              {/* Cover */}
              <div className="relative h-64 w-full overflow-hidden bg-base-300 sm:h-72">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Package preview"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center border-b border-dashed border-base-300 bg-base-200 p-6 text-center">
                    <ImageIcon className="h-14 w-14 text-base-content/25" />

                    <h3 className="mt-4 text-lg font-semibold">
                      No Cover Image
                    </h3>

                    <p className="mt-2 text-sm text-base-content/50">
                      Upload a cover image to see the
                      package preview.
                    </p>
                  </div>
                )}

                {/* Bottom Gradient */}
                {previewImage && (
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                )}
              </div>

              {/* Card Body */}
              <div className="space-y-4 p-5">
                {/* Name & Price */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="line-clamp-1 font-playfair text-xl font-bold text-base-content transition-colors group-hover:text-primary">
                      {watchName || "Wedding Gold"}
                    </h4>

                    <p className="mt-1 text-xs text-base-content/55">
                      Premium Photography Package
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold text-primary">
                      ৳
                      {watchPrice
                        ? Number(watchPrice).toLocaleString()
                        : "25,000"}
                    </p>
                  </div>
                </div>

                {/* Package Stats */}
                <div className="grid grid-cols-2 gap-3 border-y border-primary/5 py-4">
                  <div className="rounded-xl bg-primary/5 p-3 text-center">
                    <Clock3 className="mx-auto mb-1 h-4 w-4 text-primary" />

                    <p className="text-xs text-base-content/50">
                      Duration
                    </p>

                    <p className="mt-0.5 text-sm font-semibold">
                      {watchDuration || "8 Hours"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-primary/5 p-3 text-center">
                    <Images className="mx-auto mb-1 h-4 w-4 text-primary" />

                    <p className="text-xs text-base-content/50">
                      Photos
                    </p>

                    <p className="mt-0.5 text-sm font-semibold">
                      {watchPhotoCount || "300"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="line-clamp-3 text-sm leading-relaxed text-base-content/70">
                    {watchDescription ||
                      "Complete wedding photography coverage with beautiful edited photos and premium service."}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <p className="mb-2 text-sm font-semibold">
                    Package Includes
                  </p>

                  <div className="space-y-2">
                    {features.length > 0 ? (
                      features.slice(0, 5).map((feature, index) => (
                        <div
                          key={`${feature}-preview-${index}`}
                          className="flex items-start gap-2 text-sm text-base-content/70"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3 w-3" />
                          </span>

                          <span className="line-clamp-1">
                            {feature}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-base-content/40">
                        Add features to see them here.
                      </p>
                    )}

                    {features.length > 5 && (
                      <p className="pl-7 text-xs font-semibold text-primary">
                        +{features.length - 5} more features
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-primary/5 pt-4">
                  <span
                    className={`badge ${
                      watchActive
                        ? "badge-success"
                        : "badge-error"
                    } badge-sm text-white`}
                  >
                    {watchActive ? "Available" : "Unavailable"}
                  </span>

                  <span className="badge badge-outline badge-sm gap-1 border-primary/20 text-primary">
                    <Package className="h-3 w-3" />

                    Live Preview
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Helper Alert */}
            <div className="alert mt-4 flex items-start gap-2 border-primary/10 bg-base-300/40 p-3 text-xs text-base-content/85">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                Add a high-quality cover image and complete
                all package details before publishing your
                package.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl border border-primary/10 bg-base-100 p-8 shadow-2xl">
            <Loader />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPackage;