import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  UploadCloud,
  Tag as TagIcon,
  X,
  Heart,
  Eye,
  User,
  MapPin,
  Sparkles,
  Copy,
  Check,
  Info,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router";

const CATEGORIES = [
  "Wedding",
  "Pre-Wedding",
  "Outdoor",
  "Event",
  "Lifestyle",
  "Birthday",
  "Sunset",
  "Other",
];

const AddPhoto = () => {
  const [tags, setTags] = useState(["Bride", "Outdoor", "Sunset"]);
  const [tagInput, setTagInput] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod] = useState("file");
  const [copied, setCopied] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      image: "",
      category: "Wedding",
      description: "",
      featured: false,
      // photographer: "Photographer Name",
      // location: "Dhaka",
      isPublished: true,
      uploadedBy: "admin-user-id",
    },
  });

  // Watch fields for the real-time preview card
  const watchTitle = watch("title");
  const watchCategory = watch("category");
  const watchDescription = watch("description");
  const watchFeatured = watch("featured");
  const watchPhotographer = watch("photographer");
  const watchLocation = watch("location");

  // Keep react-hook-form tags in sync
  useEffect(() => {
    register("tags", {
      validate: (value) =>
        (value && value.length > 0) || "At least one tag is required",
    });
    setValue("tags", tags, { shouldValidate: true });
  }, [tags, register, setValue]);

  // Cloudinary Upload & Handle image file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "rup_darpon");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dgshzmhyk/image/upload",
        formData,
      );

      const imageUrl = res.data.secure_url;

      // React Hook Form image URL set
      setValue("image", imageUrl, {
        shouldValidate: true,
      });

      // Preview-তেও Cloudinary URL দেখানো
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle URL change
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setValue("image", url, { shouldValidate: true });
    setPreviewImage(url);
  };

  // Handle tag input keydown (Enter or Comma)
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/,/g, "");
      if (cleanTag && !tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setTagInput("");
      }
    }
  };

  // Remove tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Copy JSON to clipboard
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(submittedData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add Photo submission handler
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const photoData = {
        title: data.title,
        image: data.image,
        category: data.category,
        tags: data.tags,
        description: data.description,
        featured: data.featured,
        photographer: data.photographer,
        location: data.location,
        likes: 0,
        views: 0,
        isPublished: data.isPublished,
        uploadedBy: "admin",
        createdAt: new Date(),
      };

      const res = await axios.post("http://localhost:5000/photos", photoData, {
        withCredentials: true,
      });

      if (res.data.insertedId) {
        toast.success("Photo added successfully!", {
          icon: "📸",
        });

        reset();
        navigate("/admin/photos");

        setPreviewImage(null);
      }
    } catch (error) {
      console.error(error);

      toast.error("Failed to add photo!");
    } finally {
      setLoading(false);
    }
  };
  //RESET FORM AND PREVIEW
  const handleReset = () => {
    reset();
    setTags(["Bride", "Outdoor", "Sunset"]);
    setPreviewImage("");
    setUploadProgress(0);
    setSubmittedData(null);
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto">
      <title>Add New Photo | Rup Darpon</title>
      <div>
        {/* back to previous btn  */}
        <button
          type="button"
          onClick={() => navigate("/admin/photos")}
          className="group inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 mb-4"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            aria-hidden="true"
          />
          Back to Previous
        </button>
      </div>
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary">
          Add New Photos
        </h1>
        <p className="mt-2 text-sm sm:text-base text-base-content/70">
          Upload and configure metadata for your gorgeous wedding shoots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-base-200/50 border border-primary/10 rounded-2xl p-5 sm:p-8 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-1.5">
                  Photo Title <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Elegant Wedding"
                className={`input input-bordered w-full focus:outline-none focus:border-primary ${
                  errors.title ? "border-error" : "border-primary/20"
                }`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Title cannot exceed 50 characters",
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
            Photo Upload
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Select Image</span>
              </label>
              <div className="flex gap-4 mb-3"></div>

              {/* Upload File Input */}
              {uploadMethod === "file" ? (
                <div className="space-y-3">
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      errors.image
                        ? "border-error bg-error/5"
                        : "border-primary/20 hover:border-primary/50 hover:bg-base-200"
                    }`}
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <UploadCloud className="mx-auto h-10 w-10 text-base-content/40 mb-2 animate-pulse" />
                    <p className="text-sm font-medium">
                      Click to select photo or drag and drop
                    </p>
                    <p className="text-xs text-base-content/50 mt-1">
                      PNG, JPG, WEBP up to 10MB
                    </p>
                  </div>

                  {/* Upload Progress Bar */}
                  {isUploading && (
                    <div className="w-full bg-base-300 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className="bg-primary h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: "easeInOut" }}
                      />
                      <div className="flex justify-between text-xs text-base-content/60 mt-1">
                        <span>Uploading to Cloudinary...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                    </div>
                  )}

                  {/* Hidden Image Input for Hook Form validation */}
                  <input
                    type="hidden"
                    {...register("image", {
                      required: "Image file or URL is required",
                    })}
                  />
                </div>
              ) : (
                /* URL Input */
                <div className="form-control w-full">
                  <input
                    type="url"
                    placeholder="https://res.cloudinary.com/..."
                    className={`input input-bordered w-full focus:outline-none focus:border-primary ${
                      errors.image ? "border-error" : "border-primary/20"
                    }`}
                    {...register("image", {
                      required: "Image URL is required",
                      pattern: {
                        value:
                          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                        message: "Please enter a valid URL",
                      },
                    })}
                    onChange={handleUrlChange}
                  />
                </div>
              )}

              {errors.image && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.image.message}
                  </span>
                </label>
              )}
            </div>
            {/* Category */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Category <span className="text-error">*</span>
                </span>
              </label>
              <select
                className="select select-bordered w-full border-primary/20 focus:outline-none focus:border-primary"
                {...register("category", { required: "Category is required" })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {/* Tags (Interactive List) */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-1.5">
                  Tags <span className="text-error">*</span>
                  <span
                    className="tooltip tooltip-right cursor-help"
                    data-tip="Press Enter or Comma to add tags"
                  >
                    <Info className="h-3.5 w-3.5 text-base-content/40" />
                  </span>
                </span>
              </label>

              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <TagIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                    <input
                      type="text"
                      placeholder="Add tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="input input-bordered w-full pl-10 border-primary/20 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanTag = tagInput.trim().replace(/,/g, "");
                      if (cleanTag && !tags.includes(cleanTag)) {
                        setTags([...tags, cleanTag]);
                        setTagInput("");
                      }
                    }}
                    className="btn btn-primary text-primary-content"
                  >
                    Add
                  </button>
                </div>

                {/* Displaying tags badges */}
                <div className="flex flex-wrap gap-1.5 py-1.5 min-h-[2.5rem] px-2 rounded-xl bg-base-300/40 border border-primary/5">
                  {tags.length === 0 ? (
                    <span className="text-xs text-base-content/40 self-center pl-1">
                      No tags added yet.
                    </span>
                  ) : (
                    tags.map((tag, idx) => (
                      <span
                        key={tag}
                        className="badge badge-primary gap-1 pl-2.5 pr-1 py-3 text-xs font-semibold shadow-sm text-primary-content hover:scale-105 transition-transform"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(idx)}
                          className="hover:bg-primary-content/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
              {errors.tags && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.tags.message}
                  </span>
                </label>
              )}
            </div>
            {/* Photographer & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-1.5">
                    Photographer
                  </span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 border-primary/20 focus:outline-none focus:border-primary"
                    {...register("photographer")}
                    placeholder="e.g. Hridoy Shill"
                  />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-1.5">
                    Location
                  </span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 border-primary/20 focus:outline-none focus:border-primary "
                    {...register("location")}
                    placeholder="e.g. Dinajpur, Bangladesh"
                  />
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">
                  Description <span className="text-error">*</span>
                </span>
              </label>
              <textarea
                placeholder="Describe this beautiful photoshoot (minimum 10 characters)..."
                className={`textarea textarea-bordered w-full h-24 border-primary/20 focus:outline-none focus:border-primary ${
                  errors.description ? "border-error" : ""
                }`}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
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
            {/* Featured & Published Toggles */}
            <div className="flex flex-wrap gap-6 bg-base-300/35 border border-primary/5 p-4 rounded-xl">
              <div className="form-control flex-1 min-w-[140px]">
                <label className="label cursor-pointer justify-between gap-4">
                  <span className="label-text font-semibold flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Featured Shoot
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    {...register("featured")}
                  />
                </label>
              </div>

              <div className="form-control flex-1 min-w-[140px]">
                <label className="label cursor-pointer justify-between gap-4">
                  <span className="label-text font-semibold">
                    Publish Immediately
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    {...register("isPublished")}
                  />
                </label>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-secondary flex-1 rounded-full font-semibold"
              >
                Reset
              </button>
              {/* <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="btn btn-primary text-primary-content flex-1 rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all"
              >
                {isSubmitting ? "Saving..." : "Add Photo"}
              </button> */}
              <button
                type="submit"
                disabled={loading || isUploading}
                className="btn btn-primary text-primary-content flex-1 rounded-full font-semibold shadow-lg hover:shadow-primary/20 transition-all"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding Photo...
                  </>
                ) : (
                  "Add Photo"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card Column */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-base-200/50 border border-primary/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-playfair text-xl font-semibold text-primary mb-4 flex items-center gap-2">
              Live Gallery Card Preview
            </h3>

            {/* Photo Card Component with realistic styling and animations */}
            <div className="group relative bg-base-100 rounded-2xl overflow-hidden border border-primary/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Featured Badge */}
              {watchFeatured && (
                <div className="absolute top-3.5 left-3.5 z-10 badge badge-primary gap-1 text-primary-content font-bold shadow-md text-xs py-2.5 px-3">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3.5 right-3.5 z-10 badge bg-black/60 backdrop-blur-md border-0 text-white font-semibold text-xs py-2.5 px-3">
                {watchCategory || "Wedding"}
              </div>

              {/* Photo Image Container */}
              <div className="h-64 sm:h-72 w-full overflow-hidden bg-base-300 relative flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-80 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-80 rounded-xl border-2 border-dashed border-base-300 bg-base-200 flex flex-col items-center justify-center text-center p-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-14 h-14 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0L15.75 15.75m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0L21.75 15.75M3.75 19.5h16.5"
                      />
                    </svg>

                    <h3 className="mt-4 text-lg font-semibold">
                      No Image Selected
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Upload a photo to see a live preview here.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5">
                <h4 className="font-playfair text-lg font-bold line-clamp-1 text-base-content group-hover:text-primary transition-colors">
                  {watchTitle || "Elegant Wedding"}
                </h4>

                <p className="text-xs text-base-content/70 line-clamp-2 h-8 font-sans">
                  {watchDescription ||
                    "Beautiful outdoor wedding photoshoot. Capturing timeless memories."}
                </p>

                {/* Photographer & Location */}
                <div className="flex justify-between items-center text-xs text-base-content/50 border-t border-primary/5 pt-3">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {watchPhotographer || "Rup Darpan"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {watchLocation || "Dhaka"}
                  </span>
                </div>

                {/* Tags List */}
                <div className="flex flex-wrap gap-1 pt-1 min-h-[1.75rem]">
                  {tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="text-[10px] bg-base-300 text-base-content/60 px-1.5 py-0.5 rounded">
                      +{tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Interaction Footer */}
                <div className="flex justify-between items-center border-t border-primary/5 pt-3 text-xs">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1 text-base-content/60">
                      <Heart className="h-3.5 w-3.5 text-error fill-error/20" />
                      0 likes
                    </span>
                    <span className="flex items-center gap-1 text-base-content/60">
                      <Eye className="h-3.5 w-3.5 text-info" />0 views
                    </span>
                  </div>
                  <span className="badge badge-success badge-sm text-[10px] py-1 text-white font-bold opacity-80">
                    Live Preview
                  </span>
                </div>
              </div>
            </div>

            {/* Helper Alert */}
            <div className="alert bg-base-300/40 border-primary/10 text-xs text-base-content/85 mt-4 p-3 gap-2 flex items-start">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                Upload a high-quality image and complete the required fields
                before adding it to the gallery.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / JSON Output */}
      <AnimatePresence>
        {submittedData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-base-200 border border-primary/20 max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setSubmittedData(null)}
                className="absolute top-4 right-4 btn btn-circle btn-sm btn-ghost"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 text-success mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-base-content">
                    Photo Added Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/60">
                    The schema object has been fully populated and saved to
                    localStorage.
                  </p>
                </div>
              </div>

              {/* JSON Inspector Code block */}
              <div className="relative mt-4">
                <div className="absolute top-2.5 right-2.5 z-10 flex gap-2">
                  <button
                    onClick={handleCopyJSON}
                    className="btn btn-sm btn-square btn-neutral bg-base-100 hover:bg-base-300 border-0"
                    title="Copy JSON"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4 text-base-content" />
                    )}
                  </button>
                </div>
                <div className="bg-base-300/80 rounded-xl p-4 overflow-x-auto max-h-72 border border-primary/5">
                  <pre className="text-xs text-success-content/90 font-mono select-all">
                    {JSON.stringify(submittedData, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={handleReset}
                  className="btn btn-outline btn-sm rounded-full"
                >
                  Add Another Photo
                </button>
                <button
                  onClick={() => setSubmittedData(null)}
                  className="btn btn-primary text-primary-content btn-sm rounded-full px-5"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddPhoto;
