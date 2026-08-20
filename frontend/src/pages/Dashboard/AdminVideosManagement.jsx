import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router";
import {
  AlertTriangle,
  Check,
  Pencil,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/videos";

const MAX_FEATURED_VIDEOS = 8;

const AdminVideosManagement = () => {
  const queryClient = useQueryClient();

  // =========================================================
  // STATE
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteVideo, setDeleteVideo] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
    category: "",
    description: "",
    featured: false,
    isPublished: true,
  });

  // =========================================================
  // GET VIDEOS
  // =========================================================

  const {
    data: videoData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admin-videos", currentPage],

    queryFn: async () => {
      const response = await axios.get(API_URL, {
        params: {
          page: currentPage,
          limit: 6,
        },
        withCredentials: true,
      });

      return response.data;
    },

    placeholderData: (previousData) => previousData,
  });

  // =========================================================
  // BACKEND DATA
  // =========================================================

  const videos = videoData.videos || [];

  const totalPages = videoData.totalPages || 1;

  // IMPORTANT:
  // This MUST come from backend and represent
  // ALL featured videos across ALL pages.
  const featuredCount = videoData.featuredCount || 0;

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return videos;
    }

    return videos.filter((video) => {
      return [video.title, video.category, video.description, video.videoUrl]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [videos, searchQuery]);

  // =========================================================
  // DELETE MUTATION
  // =========================================================

  const deleteMutation = useMutation({
    mutationFn: async (videoId) => {
      const response = await axios.delete(`${API_URL}/${videoId}`, {
        withCredentials: true,
      });

      return response.data;
    },

    onSuccess: async () => {
      setDeleteVideo(null);

      await queryClient.invalidateQueries({
        queryKey: ["admin-videos"],
      });

      toast.success("Video deleted successfully.");
    },

    onError: (error) => {
      console.error("Delete video error:", error);

      toast.error(error.response?.data?.message || "Failed to delete video.");
    },
  });

  // =========================================================
  // DELETE HANDLER
  // =========================================================

  const handleDelete = (video) => {
    setDeleteVideo(video);
  };

  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  const confirmDelete = () => {
    if (!deleteVideo) {
      return;
    }

    deleteMutation.mutate(deleteVideo._id);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (video) => {
    setEditingVideo(video);

    setFormData({
      title: video.title || "",
      videoUrl: video.videoUrl || "",
      category: video.category || "",
      description: video.description || "",
      featured: Boolean(video.featured),
      isPublished: Boolean(video.isPublished),
    });
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditModal = () => {
    if (saving) {
      return;
    }

    setEditingVideo(null);
  };

  // =========================================================
  // UPDATE VIDEO
  // =========================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingVideo) {
      return;
    }

    const wasFeatured = Boolean(editingVideo.featured);

    const wantsFeatured = Boolean(formData.featured);

    const tryingToAddFeatured = wantsFeatured && !wasFeatured;

    // =======================================================
    // FRONTEND MAX 8 CHECK
    // =======================================================

    if (tryingToAddFeatured && featuredCount >= MAX_FEATURED_VIDEOS) {
      toast.error(
        `You already have ${MAX_FEATURED_VIDEOS} featured videos. Remove one first.`,
      );

      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `${API_URL}/${editingVideo._id}`,
        {
          title: formData.title.trim(),

          videoUrl: formData.videoUrl.trim(),

          category: formData.category.trim(),

          description: formData.description.trim(),

          featured: wantsFeatured,

          isPublished: Boolean(formData.isPublished),
        },
        {
          withCredentials: true,
        },
      );

      await queryClient.invalidateQueries({
        queryKey: ["admin-videos"],
      });

      toast.success("Video updated successfully.");

      closeEditModal();
    } catch (error) {
      console.error("Update video error:", error);

      toast.error(error.response?.data?.message || "Failed to update video.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // FEATURED TOGGLE
  // =========================================================

const handleFeaturedToggle = async (video) => {
  const currentlyFeatured = Boolean(video.featured);

  // Adding to featured
  if (!currentlyFeatured && featuredCount >= MAX_FEATURED_VIDEOS) {
    toast.error(
      `You already have ${MAX_FEATURED_VIDEOS} featured videos. Remove one first.`,
    );

    return;
  }

  try {
    await axios.patch(
      `${API_URL}/${video._id}/featured`,
      {
        featured: !currentlyFeatured,
      },
      {
        withCredentials: true,
      },
    );

    await queryClient.invalidateQueries({
      queryKey: ["admin-videos"],
    });

    toast.success(
      currentlyFeatured
        ? "Removed from Featured Videos."
        : "Added to Featured Videos.",
    );
  } catch (error) {
    console.error("Featured toggle error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to update featured status.",
    );
  }
};

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">
            Videos Management
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            Add, edit, delete and manage your Facebook videos.
          </p>
        </div>

        <Link to="add-videos" className="btn btn-primary text-primary-content">
          <Plus className="h-4 w-4" />
          Add Video
        </Link>
      </section>

      {/* =====================================================
          FEATURED STATUS
      ===================================================== */}

      <section
        className={`rounded-2xl border p-5 shadow-sm ${
          featuredCount === MAX_FEATURED_VIDEOS
            ? "border-success/30 bg-success/5"
            : "border-primary/10 bg-primary/5"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">Featured Videos</h3>

              <p className="text-sm text-base-content/60">
                Select up to {MAX_FEATURED_VIDEOS} videos for your landing page.
              </p>
            </div>
          </div>

          <div
            className={`badge badge-lg ${
              featuredCount === MAX_FEATURED_VIDEOS
                ? "badge-success"
                : "badge-primary"
            }`}
          >
            {featuredCount} / {MAX_FEATURED_VIDEOS} Selected
          </div>
        </div>

        {/* PROGRESS BAR */}

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-300">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              featuredCount === MAX_FEATURED_VIDEOS
                ? "bg-success"
                : "bg-primary"
            }`}
            style={{
              width: `${Math.min(
                (featuredCount / MAX_FEATURED_VIDEOS) * 100,
                100,
              )}%`,
            }}
          />
        </div>

        {/* STATUS MESSAGE */}

        {featuredCount === MAX_FEATURED_VIDEOS ? (
          <p className="mt-3 text-sm font-medium text-success">
            ✓ Maximum {MAX_FEATURED_VIDEOS} featured videos selected. Remove one
            before adding another.
          </p>
        ) : (
          <p className="mt-3 text-sm text-base-content/60">
            {MAX_FEATURED_VIDEOS - featuredCount} more video
            {MAX_FEATURED_VIDEOS - featuredCount !== 1 ? "s" : ""} can be
            selected.
          </p>
        )}
      </section>

      {/* =====================================================
          SEARCH + VIDEOS
      ===================================================== */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        {/* SEARCH */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="input input-bordered flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-base-content/60" />

            <input
              type="text"
              className="grow"
              placeholder="Search title, category..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
          </label>

          <p className="text-sm text-base-content/70">
            {filteredVideos.length} video(s) found
          </p>
        </div>

        {/* LOADING */}

        {isLoading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : videos.length === 0 ? (
          <div className="py-10 text-center">
            <Play className="mx-auto mb-3 h-10 w-10 text-base-content/30" />

            <p className="text-sm text-base-content/70">
              No videos found. Add your first video.
            </p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <p className="py-8 text-center text-sm text-base-content/70">
            No videos matched your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Published</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVideos.map((video) => {
                  const isFeatured = Boolean(video.featured);

                  const cannotFeature =
                    !isFeatured && featuredCount >= MAX_FEATURED_VIDEOS;

                  return (
                    <tr key={video._id}>
                      {/* VIDEO */}

                      <td>
                        <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-base-200">
                          {video.thumbnailUrl ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title || "Video thumbnail"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Play className="h-6 w-6 text-base-content/40" />
                            </div>
                          )}

                          {/* Play overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                              <Play className="ml-0.5 h-3.5 w-3.5 fill-black text-black" />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TITLE */}

                      <td>
                        <div className="max-w-[220px]">
                          <p className="truncate font-medium">{video.title}</p>

                          {video.videoUrl && (
                            <p className="mt-1 max-w-[220px] truncate text-xs text-base-content/50">
                              {video.videoUrl}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className="badge badge-outline">
                          {video.category || "N/A"}
                        </span>
                      </td>

                      {/* FEATURED */}

                      <td>
                        <button
                          type="button"
                          onClick={() => handleFeaturedToggle(video)}
                          disabled={cannotFeature}
                          className={`btn btn-sm gap-1 ${
                            isFeatured ? "btn-primary" : "btn-outline"
                          } ${
                            cannotFeature ? "cursor-not-allowed opacity-40" : ""
                          }`}
                          title={
                            isFeatured
                              ? "Remove from Featured Videos"
                              : cannotFeature
                                ? "Maximum 8 featured videos reached"
                                : "Add to Featured Videos"
                          }
                        >
                          {isFeatured ? (
                            <>
                              <Check className="h-4 w-4" />
                              Featured
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4" />
                              Set Featured
                            </>
                          )}
                        </button>
                      </td>

                      {/* PUBLISHED */}

                      <td>
                        <span
                          className={`badge ${
                            video.isPublished
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {video.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => openEditModal(video)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => handleDelete(video)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (
              <div className="mt-5 flex justify-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isFetching}
                >
                  Previous
                </button>

                <span className="btn btn-sm btn-disabled">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || isFetching}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingVideo && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-2xl font-semibold">
                  Edit Video
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                  Update video information and settings.
                </p>
              </div>

              <button
                type="button"
                className="btn btn-circle btn-ghost btn-sm"
                onClick={closeEditModal}
                disabled={saving}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              {/* TITLE */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Video Title</span>

                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </label>

              {/* FACEBOOK URL */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Facebook Video URL
                </span>

                <input
                  type="url"
                  required
                  className="input input-bordered w-full"
                  placeholder="https://www.facebook.com/.../videos/..."
                  value={formData.videoUrl}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      videoUrl: event.target.value,
                    }))
                  }
                />
              </label>

              {/* CATEGORY */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Category</span>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Wedding, Event, Outdoor..."
                  value={formData.category}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: event.target.value,
                    }))
                  }
                />
              </label>

              {/* DESCRIPTION */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Description</span>

                <textarea
                  className="textarea textarea-bordered h-24 w-full"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </label>

              {/* SETTINGS */}

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <div className="flex flex-wrap gap-6">
                  {/* FEATURED */}

                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.featured}
                      disabled={
                        !formData.featured &&
                        featuredCount >= MAX_FEATURED_VIDEOS
                      }
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: event.target.checked,
                        }))
                      }
                    />

                    <span>
                      <span className="block font-medium">Featured</span>

                      <span className="text-xs text-base-content/50">
                        Show in Featured Videos.
                      </span>
                    </span>
                  </label>

                  {/* PUBLISHED */}

                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={formData.isPublished}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          isPublished: event.target.checked,
                        }))
                      }
                    />

                    <span>
                      <span className="block font-medium">Published</span>

                      <span className="text-xs text-base-content/50">
                        Show this video publicly.
                      </span>
                    </span>
                  </label>
                </div>

                <p className="mt-3 text-xs text-base-content/55">
                  {formData.featured
                    ? "This video will appear in the Featured Videos section."
                    : featuredCount >= MAX_FEATURED_VIDEOS
                      ? "Maximum featured videos reached. Remove one first."
                      : "You can select this video as featured."}
                </p>
              </div>

              {/* ACTIONS */}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={closeEditModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary text-primary-content"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Update Video"}
                </button>
              </div>
            </form>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            onClick={closeEditModal}
          >
            Close
          </button>
        </dialog>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ===================================================== */}

      {deleteVideo && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-error/10">
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>

              <div>
                <h3 className="text-lg font-semibold">Delete Video?</h3>

                <p className="mt-1 text-sm text-base-content/60">
                  Are you sure you want to permanently delete this video?
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-base-200 p-3">
              <p className="truncate text-sm font-medium">
                {deleteVideo.title}
              </p>

              <p className="mt-1 text-xs text-base-content/50">
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setDeleteVideo(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-error text-error-content"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Video
                  </>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            onClick={() => !deleteMutation.isPending && setDeleteVideo(null)}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

export default AdminVideosManagement;
