import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Film,
  ImagePlus,
  Loader2,
  Link as LinkIcon,
  X,
  Play,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:5000/videos";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dgshzmhyk/image/upload";

const CLOUDINARY_UPLOAD_PRESET = "rup_darpon";

const MAX_FEATURED_VIDEOS = 8;

const AddVideo = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "",
    description: "",
    featured: false,
    isPublished: true,
  });

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================================================
  // FACEBOOK URL VALIDATION
  // =========================================================

  const isValidFacebookUrl = (value) => {
    try {
      const url = new URL(value.trim());

      const allowedHosts = [
        "facebook.com",
        "www.facebook.com",
        "m.facebook.com",
        "web.facebook.com",
      ];

      if (!allowedHosts.includes(url.hostname.toLowerCase())) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  // =========================================================
  // THUMBNAIL UPLOAD
  // =========================================================

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // File type validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    // 5 MB limit
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error("Thumbnail image must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setIsUploadingThumbnail(true);

    try {
      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await axios.post(CLOUDINARY_UPLOAD_URL, uploadData);

      const imageUrl = response.data?.secure_url;

      if (!imageUrl) {
        throw new Error("Cloudinary did not return an image URL.");
      }

      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: imageUrl,
      }));

      toast.success("Thumbnail uploaded successfully.");
    } catch (error) {
      console.error("Thumbnail upload error:", error);

      toast.error(
        error.response?.data?.error?.message ||
          "Failed to upload thumbnail. Please try again.",
      );
    } finally {
      setIsUploadingThumbnail(false);

      // Allows selecting the same file again
      event.target.value = "";
    }
  };

  // =========================================================
  // REMOVE THUMBNAIL
  // =========================================================

  const handleRemoveThumbnail = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: "",
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();
    const videoUrl = formData.videoUrl.trim();
    const thumbnailUrl = formData.thumbnailUrl.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();

    // =========================================================
    // BASIC VALIDATION
    // =========================================================

    if (!title) {
      toast.error("Please enter a video title.");
      return;
    }

    if (!videoUrl) {
      toast.error("Please enter a Facebook video URL.");
      return;
    }

    if (!thumbnailUrl) {
      toast.error("Please upload a video thumbnail.");
      return;
    }

    // =========================================================
    // FACEBOOK URL VALIDATION
    // =========================================================

    if (!isValidFacebookUrl(videoUrl)) {
      toast.error("Please enter a valid Facebook video or reel URL.");
      return;
    }

    // =========================================================
    // SUBMIT
    // =========================================================

    setLoading(true);

    try {
      const payload = {
        title,
        videoUrl,
        thumbnailUrl,
        category,
        description,
        featured: Boolean(formData.featured),
        isPublished: Boolean(formData.isPublished),
      };

      console.log("Sending video payload:", payload);

      const response = await axios.post(API_URL, payload, {
        withCredentials: true,
      });

      console.log("Add video response:", response.data);

      toast.success("Video added successfully!");

      navigate("/admin/videos");
    } catch (error) {
      console.error("Add video error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add video. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <title>Add Video | Rup Darpon</title>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="rounded-3xl border border-primary/10 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Film className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="font-playfair text-2xl font-semibold sm:text-3xl">
                Add Video
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-base-content/60">
                Add a Facebook video with a custom thumbnail to the Rup Darpon
                video collection.
              </p>
            </div>
          </div>

          <Link to="/admin/videos" className="btn btn-outline rounded-full">
            <ArrowLeft className="h-4 w-4" />
            Back to Videos
          </Link>
        </div>
      </section>

      {/* =====================================================
          FORM
      ===================================================== */}

      <section className="rounded-3xl border border-primary/10 bg-base-100 p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* =================================================
              VIDEO TITLE
          ================================================= */}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Video Title</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Biraj & Borsha — Wedding Highlights"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* =================================================
              FACEBOOK VIDEO URL
          ================================================= */}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Facebook Video URL
              </span>
            </label>

            <label className="input input-bordered flex w-full items-center gap-3">
              <LinkIcon className="h-4 w-4 shrink-0 text-base-content/40" />

              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="https://www.facebook.com/reel/1047215171391444"
                className="grow"
                required
              />
            </label>
          </div>

          {/* =================================================
              THUMBNAIL
          ================================================= */}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Video Thumbnail</span>
            </label>

            <div className="rounded-2xl border border-base-300 bg-base-200/20 p-4">
              {!formData.thumbnailUrl ? (
                <label
                  htmlFor="thumbnail-upload"
                  className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-base-300 bg-base-100 px-6 py-8 text-center transition duration-300 hover:border-primary/50 hover:bg-primary/5"
                >
                  {isUploadingThumbnail ? (
                    <>
                      <Loader2 className="h-10 w-10 animate-spin text-primary" />

                      <p className="mt-4 text-sm font-semibold">
                        Uploading thumbnail...
                      </p>

                      <p className="mt-1 text-xs text-base-content/50">
                        Please wait while your image is uploaded.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                        <ImagePlus className="h-7 w-7 text-primary" />
                      </div>

                      <p className="mt-4 text-sm font-semibold">
                        Upload Video Thumbnail
                      </p>

                      <p className="mt-1 max-w-sm text-xs leading-5 text-base-content/50">
                        Use a high-quality landscape image for the best result.
                        JPG, PNG or WEBP • Maximum 5 MB
                      </p>

                      <span className="btn btn-primary btn-sm mt-4 rounded-full">
                        Choose Image
                      </span>
                    </>
                  )}

                  <input
                    id="thumbnail-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleThumbnailUpload}
                    disabled={isUploadingThumbnail}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="group relative overflow-hidden rounded-xl">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Video thumbnail preview"
                    className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl backdrop-blur-sm">
                      <Play className="ml-1 h-7 w-7 fill-primary text-primary" />
                    </div>
                  </div>

                  {/* Facebook Label */}
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    Facebook Video
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="btn btn-circle btn-sm absolute right-3 top-3 border-none bg-black/60 text-white hover:bg-black/80"
                    title="Remove thumbnail"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <label className="label">
              <span className="label-text-alt leading-5 text-base-content/50">
                This thumbnail will be displayed on the website instead of
                relying on Facebook's preview image.
              </span>
            </label>
          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Category</span>
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full"
              required
            >
              <option value="" disabled>
                Select a video category
              </option>

              <option value="Wedding">Wedding</option>

              <option value="Event">Event</option>

              <option value="Outdoor">Outdoor</option>

              <option value="Lifestyle">Lifestyle</option>

              <option value="Travel">Travel</option>

              <option value="Photography">Photography</option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the story, event, or special moment featured in this video..."
              className="textarea textarea-bordered min-h-32 w-full"
            />

            <label className="label">
              <span className="label-text-alt text-base-content/50">
                Keep the description short and meaningful.
              </span>
            </label>
          </div>

          {/* =================================================
              VIDEO SETTINGS
          ================================================= */}

          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="mb-5 border-b border-base-200 pb-3">
              <h3 className="text-lg font-semibold text-base-content">
                Video Settings
              </h3>

              <p className="mt-1 text-xs text-base-content/50">
                Manage how this video appears across the website.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* FEATURED */}

              <label
                className={`relative flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all duration-200 ${
                  formData.featured
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-base-200 bg-base-50/50 hover:border-base-300"
                }`}
              >
                <div className="pr-3">
                  <span className="block font-medium text-base-content">
                    Featured Video
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-base-content/50">
                    Highlight this video on the homepage. Maximum{" "}
                    {MAX_FEATURED_VIDEOS} featured videos are allowed.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="toggle toggle-primary toggle-sm mt-0.5 sm:toggle-md"
                />
              </label>

              {/* PUBLISHED */}

              <label
                className={`relative flex cursor-pointer items-start justify-between rounded-xl border p-4 transition-all duration-200 ${
                  formData.isPublished
                    ? "border-success bg-success/5 shadow-sm"
                    : "border-base-200 bg-base-50/50 hover:border-base-300"
                }`}
              >
                <div className="pr-3">
                  <span className="block font-medium text-base-content">
                    Published
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-base-content/50">
                    Make this video visible to visitors on the public website.
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="toggle toggle-success toggle-sm mt-0.5 sm:toggle-md"
                />
              </label>
            </div>
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-base-300 pt-6 sm:flex-row sm:justify-end">
            <Link to="/admin/videos" className="btn btn-ghost rounded-full">
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                loading || isUploadingThumbnail || !formData.thumbnailUrl
              }
              className="btn btn-primary rounded-full px-7 text-primary-content"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Video...
                </>
              ) : (
                <>
                  <Film className="h-4 w-4" />
                  Add Video
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddVideo;
