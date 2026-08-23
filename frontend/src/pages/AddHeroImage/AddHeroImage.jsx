import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Info,
  Save,
  RotateCcw,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router";

const AddHeroImage = () => {
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      image: "",
      publicId: "",
      altText: "Rup Darpon Photography",
      displayOrder: 1,
      isActive: true,
    },
  });

  const watchTitle = watch("title");
  const watchAltText = watch("altText");
  const watchDisplayOrder = watch("displayOrder");
  const watchIsActive = watch("isActive");

  // =========================================================
  // CLOUDINARY IMAGE UPLOAD
  // =========================================================

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ---------------------------------------------------------
    // File validation
    // ---------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      return;
    }

    // ---------------------------------------------------------
    // Local preview
    // ---------------------------------------------------------

    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);

    setIsUploading(true);

    try {
      // -------------------------------------------------------
      // Cloudinary FormData
      // -------------------------------------------------------

      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "rup_darpon");

      // -------------------------------------------------------
      // Upload to Cloudinary
      // -------------------------------------------------------

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dgshzmhyk/image/upload",
        formData,
      );

      const imageUrl = response.data.secure_url;
      const publicId = response.data.public_id;

      // -------------------------------------------------------
      // Save Cloudinary data to React Hook Form
      // -------------------------------------------------------

      setValue("image", imageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("publicId", publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // -------------------------------------------------------
      // Show Cloudinary image in preview
      // -------------------------------------------------------

      setPreviewImage(imageUrl);

      toast.success("Cloudinary uploaded!", {
        icon: "📸",
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);

      setPreviewImage("");

      setValue("image", "", {
        shouldValidate: true,
      });

      setValue("publicId", "", {
        shouldValidate: true,
      });

      toast.error("Failed to upload image to Cloudinary.");
    } finally {
      setIsUploading(false);
    }
  };

  // =========================================================
  // REMOVE SELECTED IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    setPreviewImage("");

    setValue("image", "", {
      shouldValidate: true,
      shouldDirty: true,
    });

    setValue("publicId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const onSubmit = async (data) => {
    if (!data.image) {
      toast.error("Please upload a hero image first.");
      return;
    }

    setLoading(true);

    try {
      // -------------------------------------------------------
      // Backend payload
      // -------------------------------------------------------

      const heroData = {
        title: data.title?.trim() || "",
        image: data.image.trim(),
        publicId: data.publicId?.trim() || "",
        altText:
          data.altText?.trim() || data.title?.trim() || "Rup Darpon Hero Image",
        displayOrder: Number(data.displayOrder) || 1,
        isActive: data.isActive !== false,
      };

      console.log("Hero Data:", heroData);

      // -------------------------------------------------------
      // POST HERO IMAGE
      const response = await axios.post(
        "http://localhost:5000/hero-images",
        heroData,
        {
          withCredentials: true,
        },
      );

      if (response.data?.success && response.data?.insertedId) {
        toast.success("Hero image added successfully!", {
          icon: "✨",
        });

        reset({
          title: "",
          image: "",
          publicId: "",
          altText: "Rup Darpon Photography",
          displayOrder: 1,
          isActive: true,
        });

        setPreviewImage("");

        navigate("/admin/hero-images");
      } else {
        toast.error(response.data?.message || "Hero image could not be added.");
      }
    } catch (error) {
      console.error("Hero image save error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to save hero image.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET
  // =========================================================

  const handleReset = () => {
    reset({
      title: "",
      image: "",
      publicId: "",
      altText: "Rup Darpon Photography",
      displayOrder: 1,
      isActive: true,
    });

    setPreviewImage("");

    toast.success("Form reset.");
  };

  return (
    <div className="mx-auto max-w-7xl py-6 sm:py-10">
      <title>Add Hero Image | Rup Darpon</title>
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mb-8 text-center sm:text-left">
        
      <div>
        {/* back to previous btn  */}
        <button
          type="button"
          onClick={() => navigate("/admin/hero-images")}
          className="group inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 mb-4"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to Previous
        </button>
      </div>
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <h1 className="font-playfair text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl">
            Add Hero Image
          </h1>
        </div>

        <p className="mt-2 text-sm text-base-content/70 sm:text-base">
          Upload and manage images for the Rup Darpon homepage hero banner.
        </p>
      </div>

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* ===================================================
            FORM
        =================================================== */}

        <div className="rounded-2xl border border-primary/10 bg-base-200/50 p-5 shadow-xl backdrop-blur-sm sm:p-8 lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* =================================================
                TITLE
            ================================================= */}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Hero Image Title
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g. Wedding Photography"
                className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                  errors.title ? "border-error" : ""
                }`}
                {...register("title", {
                  maxLength: {
                    value: 150,
                    message: "Title cannot exceed 150 characters",
                  },
                })}
              />

              {errors.title && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.title.message}
                  </span>
                </label>
              )}
            </div>

            {/* =================================================
                IMAGE UPLOAD
            ================================================= */}

            <div className="form-control w-full">
              <label className="label">
                <span className="flex items-center gap-1.5 font-semibold">
                  Hero Image
                  <span className="text-error">*</span>
                </span>
              </label>

              {!previewImage ? (
                <div
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                    errors.image
                      ? "border-error bg-error/5"
                      : "border-primary/20 hover:border-primary/50 hover:bg-base-200"
                  }`}
                  onClick={() =>
                    document.getElementById("hero-image-upload")?.click()
                  }
                >
                  <input
                    id="hero-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <UploadCloud className="mx-auto mb-3 h-12 w-12 text-base-content/40" />

                  <p className="text-sm font-semibold">
                    Click to select hero image
                  </p>

                  <p className="mt-1 text-xs text-base-content/50">
                    PNG, JPG, WEBP up to 10MB
                  </p>

                  <p className="mt-3 text-xs text-primary/70">
                    Recommended: large landscape image
                  </p>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-base-300">
                  <img
                    src={previewImage}
                    alt="Hero preview"
                    className="aspect-video w-full object-cover"
                  />

                  {/* Remove */}

                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isUploading || loading}
                    className="btn btn-circle btn-sm absolute right-3 top-3 border-0 bg-black/60 text-white hover:bg-error"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Uploading */}

                  {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white backdrop-blur-sm">
                      <span className="loading loading-spinner loading-md" />

                      <p className="mt-3 text-sm font-medium">
                        Uploading to Cloudinary...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden image field */}

              <input
                type="hidden"
                {...register("image", {
                  required: "Hero image is required",
                })}
              />

              {/* Hidden publicId field */}

              <input type="hidden" {...register("publicId")} />

              {errors.image && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.image.message}
                  </span>
                </label>
              )}
            </div>

            {/* =================================================
                ALT TEXT
            ================================================= */}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Image Alt Text</span>
              </label>

              <input
                type="text"
                placeholder="e.g. Rup Darpon Wedding Photography"
                className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                  errors.altText ? "border-error" : ""
                }`}
                {...register("altText", {
                  required: "Alt text is required",
                  minLength: {
                    value: 3,
                    message: "Alt text must be at least 3 characters",
                  },
                  maxLength: {
                    value: 150,
                    message: "Alt text cannot exceed 150 characters",
                  },
                })}
              />

              {errors.altText && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.altText.message}
                  </span>
                </label>
              )}
            </div>

            {/* =================================================
                DISPLAY ORDER
            ================================================= */}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Display Order</span>
              </label>

              <input
                type="number"
                min="1"
                placeholder="1"
                className={`input input-bordered w-full border-primary/20 focus:border-primary focus:outline-none ${
                  errors.displayOrder ? "border-error" : ""
                }`}
                {...register("displayOrder", {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Display order must be at least 1",
                  },
                })}
              />

              <label className="label">
                <span className="label-text-alt text-base-content/50">
                  Smaller numbers will appear first.
                </span>
              </label>

              {errors.displayOrder && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.displayOrder.message}
                  </span>
                </label>
              )}
            </div>

            {/* =================================================
                ACTIVE TOGGLE
            ================================================= */}

            <div className="rounded-xl border border-primary/5 bg-base-300/35 p-4">
              <label className="label cursor-pointer justify-between gap-4">
                <div>
                  <span className="flex items-center gap-2 font-semibold">
                    <Eye className="h-4 w-4 text-primary" />
                    Active Hero Image
                  </span>

                  <p className="mt-1 text-xs text-base-content/50">
                    Active images can be displayed on the homepage.
                  </p>
                </div>

                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  {...register("isActive")}
                />
              </label>
            </div>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading || isUploading}
                className="btn btn-outline btn-secondary flex-1 rounded-full font-semibold"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

              <button
                type="submit"
                disabled={loading || isUploading}
                className="btn btn-primary flex-1 rounded-full font-semibold text-primary-content shadow-lg transition-all hover:shadow-primary/20"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Saving Hero Image...
                  </>
                ) : isUploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Add Hero Image
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ===================================================
            LIVE PREVIEW
        =================================================== */}

        <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
          <div className="rounded-2xl border border-primary/10 bg-base-200/50 p-6 shadow-xl backdrop-blur-sm">
            <h3 className="mb-4 flex items-center gap-2 font-playfair text-xl font-semibold text-primary">
              <ImageIcon className="h-5 w-5" />
              Hero Image Preview
            </h3>

            {/* Preview */}

            <div className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-base-100 shadow-lg">
              <div className="relative aspect-video overflow-hidden bg-base-300">
                {previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt={watchAltText || "Hero preview"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Gradient */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Title */}

                    {watchTitle && (
                      <div className="absolute bottom-10 left-4 right-4">
                        <p className="font-playfair text-xl font-semibold text-white">
                          {watchTitle}
                        </p>
                      </div>
                    )}

                    {/* Active badge */}

                    <div className="absolute left-3 top-3">
                      <span
                        className={`badge gap-1 border-0 py-3 text-xs font-semibold text-white ${
                          watchIsActive ? "bg-success/80" : "bg-error/80"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />

                        {watchIsActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Order */}

                    <div className="absolute right-3 top-3">
                      <span className="badge border-0 bg-black/60 py-3 text-xs text-white backdrop-blur-md">
                        Order: {watchDisplayOrder || 1}
                      </span>
                    </div>

                    {/* Alt text */}

                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-xs font-medium text-white/80">
                        {watchAltText || "Rup Darpon Photography"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <ImageIcon className="h-8 w-8 text-primary/50" />
                    </div>

                    <h4 className="mt-4 font-playfair text-lg font-semibold">
                      No Hero Image Selected
                    </h4>

                    <p className="mt-2 text-sm text-base-content/50">
                      Upload an image to see the hero banner preview here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                PREVIEW INFO
            ================================================= */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-base-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-base-content/40">
                  Status
                </p>

                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      watchIsActive ? "text-success" : "text-base-content/30"
                    }`}
                  />

                  {watchIsActive ? "Active" : "Inactive"}
                </p>
              </div>

              <div className="rounded-xl bg-base-100 p-3">
                <p className="text-[10px] uppercase tracking-wider text-base-content/40">
                  Display Order
                </p>

                <p className="mt-1 text-sm font-semibold">
                  #{watchDisplayOrder || 1}
                </p>
              </div>
            </div>

            {/* =================================================
                HELPER
            ================================================= */}

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/10 bg-base-300/40 p-3 text-xs text-base-content/70">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <p>
                For the best hero section experience, use a high-quality
                landscape image.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHeroImage;
