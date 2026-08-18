import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Check, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/photos";

const MAX_FEATURED_PHOTOS = 8;

const AdminPhotosManagement = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState("");

  const [editingPhoto, setEditingPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // This count comes from BACKEND.
  // It represents ALL featured photos across ALL pages.
  const [featuredCount, setFeaturedCount] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "",
    description: "",
    photographer: "",
    location: "",
    tags: "",
    featured: false,
    isPublished: true,
  });

  // =========================================================
  // FETCH PHOTOS
  // =========================================================

  const fetchPhotos = async (page = 1) => {
    const response = await axios.get(API_URL, {
      params: {
        page,
        limit: 6,
      },
      withCredentials: true,
    });

    console.log("Photos API response:", response.data);

    // Current page photos
    setPhotos(response.data.photos || []);

    // Total pages
    setTotalPages(response.data.totalPages || 1);

    // ✅ GLOBAL featured count
    setFeaturedCount(response.data.featuredCount || 0);
  };

  // =========================================================
  // LOAD PHOTOS
  // =========================================================

  useEffect(() => {
    setLoading(true);

    fetchPhotos(currentPage)
      .catch((error) => {
        console.error("Fetch photos error:", error);

        toast.error(error.response?.data?.message || "Failed to load photos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  // =========================================================
  // DELETE PHOTO
  // =========================================================

  const handleDelete = async (photoId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this photo?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(photoId);

    try {
      await axios.delete(`${API_URL}/${photoId}`, {
        withCredentials: true,
      });

      await fetchPhotos(currentPage);

      toast.success("Photo deleted successfully.");
    } catch (error) {
      console.error("Delete photo error:", error);

      toast.error(error.response?.data?.message || "Failed to delete photo.");
    } finally {
      setDeletingId("");
    }
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (photo) => {
    setEditingPhoto(photo);

    setFormData({
      title: photo.title || "",
      image: photo.image || "",
      category: photo.category || "",
      description: photo.description || "",
      photographer: photo.photographer || "",
      location: photo.location || "",
      tags: Array.isArray(photo.tags) ? photo.tags.join(", ") : "",
      featured: Boolean(photo.featured),
      isPublished: Boolean(photo.isPublished),
    });
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditModal = () => {
    if (saving) return;

    setEditingPhoto(null);
  };

  // =========================================================
  // PARSE TAGS
  // =========================================================

  const parsedTags = useMemo(() => {
    return formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }, [formData.tags]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredPhotos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return photos;
    }

    return photos.filter((photo) => {
      const tagText = Array.isArray(photo.tags)
        ? photo.tags.join(" ")
        : photo.tags || "";

      return [
        photo.title,
        photo.category,
        photo.photographer,
        photo.location,
        photo.description,
        tagText,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery));
    });
  }, [photos, searchQuery]);

  // =========================================================
  // UPDATE PHOTO
  // =========================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingPhoto) {
      return;
    }

    const wasFeatured = Boolean(editingPhoto.featured);
    const wantsFeatured = Boolean(formData.featured);

    // -------------------------------------------------------
    // GLOBAL MAX 8 CHECK
    // -------------------------------------------------------

    const tryingToAddFeatured = wantsFeatured && !wasFeatured;

    if (tryingToAddFeatured && featuredCount >= MAX_FEATURED_PHOTOS) {
      toast.error(
        `You already have ${MAX_FEATURED_PHOTOS} featured photos. Remove one first.`,
      );

      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `${API_URL}/${editingPhoto._id}`,
        {
          title: formData.title.trim(),
          image: formData.image.trim(),
          category: formData.category.trim(),
          description: formData.description.trim(),
          photographer: formData.photographer.trim(),
          location: formData.location.trim(),
          tags: parsedTags,

          featured: wantsFeatured,

          isPublished: Boolean(formData.isPublished),
        },
        {
          withCredentials: true,
        },
      );

      // Refresh current page + GLOBAL featured count
      await fetchPhotos(currentPage);

      toast.success("Photo updated successfully.");

      closeEditModal();
    } catch (error) {
      console.error("Update photo error:", error);

      toast.error(error.response?.data?.message || "Failed to update photo.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // FEATURED TOGGLE
  // =========================================================

  const handleFeaturedToggle = async (photo) => {
    const currentlyFeatured = Boolean(photo.featured);

    // =======================================================
    // REMOVE FROM FEATURED
    // =======================================================

    if (currentlyFeatured) {
      try {
        await axios.put(
          `${API_URL}/${photo._id}`,
          {
            title: photo.title || "",
            image: photo.image || "",
            category: photo.category || "",
            description: photo.description || "",
            photographer: photo.photographer || "",
            location: photo.location || "",

            tags: Array.isArray(photo.tags) ? photo.tags : [],

            featured: false,

            isPublished: Boolean(photo.isPublished),
          },
          {
            withCredentials: true,
          },
        );

        await fetchPhotos(currentPage);

        toast.success("Removed from Featured Gallery.");
      } catch (error) {
        console.error("Remove featured error:", error);

        toast.error(
          error.response?.data?.message || "Failed to remove featured photo.",
        );
      }

      return;
    }

    // =======================================================
    // MAX 8 CHECK
    // =======================================================

    if (featuredCount >= MAX_FEATURED_PHOTOS) {
      toast.error(
        `You already have ${MAX_FEATURED_PHOTOS} featured photos. Remove one first.`,
      );

      return;
    }

    // =======================================================
    // ADD TO FEATURED
    // =======================================================

    try {
      await axios.put(
        `${API_URL}/${photo._id}`,
        {
          title: photo.title || "",
          image: photo.image || "",
          category: photo.category || "",
          description: photo.description || "",
          photographer: photo.photographer || "",
          location: photo.location || "",

          tags: Array.isArray(photo.tags) ? photo.tags : [],

          featured: true,

          isPublished: Boolean(photo.isPublished),
        },
        {
          withCredentials: true,
        },
      );

      await fetchPhotos(currentPage);

      toast.success("Added to Featured Gallery.");
    } catch (error) {
      console.error("Add featured error:", error);

      toast.error(
        error.response?.data?.message || "Failed to add featured photo.",
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
           Gallery Photos Management
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            Add, edit, delete and manage your gallery photos.
          </p>
        </div>

        <Link to="add-photos" className="btn btn-primary text-primary-content">
          <Plus className="h-4 w-4" />
          Add Photo
        </Link>
      </section>

      {/* =====================================================
          FEATURED GALLERY STATUS
      ===================================================== */}

      <section
        className={`rounded-2xl border p-5 shadow-sm ${
          featuredCount === MAX_FEATURED_PHOTOS
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
              <h3 className="font-semibold">Featured Gallery</h3>

              <p className="text-sm text-base-content/60">
                Select exactly 8 photos for your landing page.
              </p>
            </div>
          </div>

          {/* GLOBAL COUNT */}
          <div
            className={`badge badge-lg ${
              featuredCount === MAX_FEATURED_PHOTOS
                ? "badge-success"
                : "badge-primary"
            }`}
          >
            {featuredCount} / {MAX_FEATURED_PHOTOS} Selected
          </div>
        </div>

        {/* =================================================
            PROGRESS BAR
        ================================================= */}

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-300">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              featuredCount === MAX_FEATURED_PHOTOS
                ? "bg-success"
                : "bg-primary"
            }`}
            style={{
              width: `${Math.min(
                (featuredCount / MAX_FEATURED_PHOTOS) * 100,
                100,
              )}%`,
            }}
          />
        </div>

        {/* =================================================
            STATUS MESSAGE
        ================================================= */}

        {featuredCount === MAX_FEATURED_PHOTOS ? (
          <p className="mt-3 text-sm font-medium text-success">
            ✓ 8 featured photos selected. You can remove any photo and select
            another one.
          </p>
        ) : (
          <p className="mt-3 text-sm text-base-content/60">
            {MAX_FEATURED_PHOTOS - featuredCount} more photo
            {MAX_FEATURED_PHOTOS - featuredCount !== 1 ? "s" : ""} can be
            selected.
          </p>
        )}
      </section>

      {/* =====================================================
          SEARCH + PHOTOS
      ===================================================== */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="input input-bordered flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-base-content/60" />

            <input
              type="text"
              className="grow"
              placeholder="Search title, category, photographer..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <p className="text-sm text-base-content/70">
            {filteredPhotos.length} photo(s) found
          </p>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : photos.length === 0 ? (
          <p className="py-8 text-center text-sm text-base-content/70">
            No photos found. Add your first photo.
          </p>
        ) : filteredPhotos.length === 0 ? (
          <p className="py-8 text-center text-sm text-base-content/70">
            No photos matched your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Published</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPhotos.map((photo) => {
                  const isFeatured = Boolean(photo.featured);

                  // GLOBAL count ব্যবহার হচ্ছে
                  const cannotFeature =
                    !isFeatured && featuredCount >= MAX_FEATURED_PHOTOS;

                  return (
                    <tr key={photo._id}>
                      {/* PHOTO */}

                      <td>
                        <div className="avatar">
                          <div className="h-14 w-14 rounded-lg bg-base-200">
                            <img
                              src={photo.image}
                              alt={photo.title}
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </td>

                      {/* TITLE */}

                      <td>
                        <div className="max-w-[220px]">
                          <p className="truncate font-medium">{photo.title}</p>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        <span className="badge badge-outline">
                          {photo.category || "N/A"}
                        </span>
                      </td>

                      {/* FEATURED */}

                      <td>
                        <button
                          type="button"
                          onClick={() => handleFeaturedToggle(photo)}
                          disabled={cannotFeature}
                          className={`btn btn-sm gap-1 ${
                            isFeatured ? "btn-primary" : "btn-outline"
                          } ${
                            cannotFeature ? "cursor-not-allowed opacity-40" : ""
                          }`}
                          title={
                            isFeatured
                              ? "Remove from Featured Gallery"
                              : cannotFeature
                                ? "Maximum 8 featured photos already selected"
                                : "Add to Featured Gallery"
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
                            photo.isPublished
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {photo.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => openEditModal(photo)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => handleDelete(photo._id)}
                            disabled={deletingId === photo._id}
                          >
                            <Trash2 className="h-4 w-4" />

                            {deletingId === photo._id
                              ? "Deleting..."
                              : "Delete"}
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
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
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

      {editingPhoto && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-2xl font-semibold">
                  Edit Photo
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                  Update photo information and featured status.
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
                <span className="label-text mb-1 font-medium">Title</span>

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

              {/* IMAGE */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Image URL</span>

                <input
                  type="url"
                  required
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                />
              </label>

              {/* CATEGORY + TAGS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Category</span>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.category}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">
                    Tags (comma separated)
                  </span>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.tags}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        tags: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              {/* PHOTOGRAPHER + LOCATION */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">
                    Photographer
                  </span>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.photographer}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        photographer: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Location</span>

                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.location}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

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

              {/* FEATURED + PUBLISHED */}

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <div className="flex flex-wrap gap-5">
                  {/* FEATURED */}

                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={formData.featured}
                      disabled={
                        !formData.featured &&
                        featuredCount >= MAX_FEATURED_PHOTOS
                      }
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: event.target.checked,
                        }))
                      }
                    />

                    <span className="label-text font-medium">Featured</span>
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

                    <span className="label-text font-medium">Published</span>
                  </label>
                </div>

                {/* FEATURED INFO */}

                <p className="mt-3 text-xs text-base-content/55">
                  {formData.featured
                    ? "This photo will appear in the Featured Gallery."
                    : featuredCount >= MAX_FEATURED_PHOTOS
                      ? "Maximum 8 featured photos already selected. Remove one first to select this photo."
                      : "You can select this photo for the Featured Gallery."}
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
                  {saving ? "Saving..." : "Update Photo"}
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
    </div>
  );
};

export default AdminPhotosManagement;
