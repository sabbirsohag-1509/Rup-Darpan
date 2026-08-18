import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  Image,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/hero-images";

const AdminHeroImageManagement = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [heroImages, setHeroImages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState("");

  const [editingHero, setEditingHero] = useState(null);

  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    order: 1,
    active: true,
  });

  // =========================================================
  // FETCH HERO IMAGES
  // =========================================================

  const fetchHeroImages = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      console.log("Hero Images API response:", response.data);

      /*
        Backend যদি সরাসরি array দেয়:
        response.data = [...]

        অথবা যদি object দেয়:
        { heroImages: [...] }
      */

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.heroImages || [];

      setHeroImages(data);
    } catch (error) {
      console.error("Fetch hero images error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load hero images.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchHeroImages();
  }, []);

  // =========================================================
  // DELETE HERO IMAGE
  // =========================================================

  const handleDelete = async (heroId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hero image?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(heroId);

    try {
      await axios.delete(`${API_URL}/${heroId}`, {
        withCredentials: true,
      });

      await fetchHeroImages();

      toast.success("Hero image deleted successfully.");
    } catch (error) {
      console.error("Delete hero image error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete hero image.",
      );
    } finally {
      setDeletingId("");
    }
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (hero) => {
    setEditingHero(hero);

    setFormData({
      title: hero.title || "",
      image: hero.image || "",
      order: hero.order || 1,
      active: Boolean(hero.active),
    });
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditModal = () => {
    if (saving) return;

    setEditingHero(null);

    setFormData({
      title: "",
      image: "",
      order: 1,
      active: true,
    });
  };

  // =========================================================
  // UPDATE HERO IMAGE
  // =========================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingHero) {
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Image URL is required.");
      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `${API_URL}/${editingHero._id}`,
        {
          title: formData.title.trim(),
          image: formData.image.trim(),
          order: Number(formData.order),
          active: Boolean(formData.active),
        },
        {
          withCredentials: true,
        },
      );

      await fetchHeroImages();

      toast.success("Hero image updated successfully.");

      closeEditModal();
    } catch (error) {
      console.error("Update hero image error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update hero image.",
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ACTIVE / INACTIVE TOGGLE
  // =========================================================

  const handleActiveToggle = async (hero) => {
    try {
      await axios.put(
        `${API_URL}/${hero._id}`,
        {
          title: hero.title || "",
          image: hero.image || "",
          order: Number(hero.order || 1),
          active: !Boolean(hero.active),
        },
        {
          withCredentials: true,
        },
      );

      await fetchHeroImages();

      toast.success(
        hero.active
          ? "Hero image disabled."
          : "Hero image activated.",
      );
    } catch (error) {
      console.error("Toggle hero image error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update hero image status.",
      );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredHeroImages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return heroImages;
    }

    return heroImages.filter((hero) => {
      return [
        hero.title,
        hero.image,
        hero.order,
        hero.active ? "active" : "inactive",
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query),
        );
    });
  }, [heroImages, searchQuery]);

  // =========================================================
  // SORT BY ORDER
  // =========================================================

  const sortedHeroImages = useMemo(() => {
    return [...filteredHeroImages].sort(
      (a, b) => Number(a.order || 0) - Number(b.order || 0),
    );
  }, [filteredHeroImages]);

  // =========================================================
  // ACTIVE COUNT
  // =========================================================

  const activeCount = heroImages.filter(
    (hero) => hero.active !== false,
  ).length;

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
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Image className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-playfair text-2xl font-semibold">
                Hero Images Management
              </h2>

              <p className="mt-1 text-sm text-base-content/70">
                Add, edit, delete and manage your homepage hero banner
                images.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="add-hero-photos"
          className="btn btn-primary text-primary-content"
        >
          <Plus className="h-4 w-4" />
          Add Hero Image
        </Link>
      </section>

      {/* =====================================================
          HERO STATUS
      ===================================================== */}

      <section className="rounded-2xl border border-primary/10 bg-primary/5 p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Image className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">
                Hero Banner Images
              </h3>

              <p className="text-sm text-base-content/60">
                Manage the images displayed in the Rup Darpon homepage
                hero section.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="badge badge-primary badge-lg">
              {heroImages.length} Total
            </span>

            <span className="badge badge-success badge-lg">
              {activeCount} Active
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEARCH + TABLE
      ===================================================== */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        {/* Search */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="input input-bordered flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-base-content/60" />

            <input
              type="text"
              className="grow"
              placeholder="Search hero image..."
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
            />
          </label>

          <p className="text-sm text-base-content/70">
            {sortedHeroImages.length} image(s) found
          </p>
        </div>

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (
          <div className="flex justify-center py-14">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : heroImages.length === 0 ? (
          /* =================================================
              EMPTY
          ================================================= */

          <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Image className="h-7 w-7 text-primary/60" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              No Hero Images
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              Add your first hero banner image to display it on
              the homepage.
            </p>

            <Link
              to="add-hero-photos"
              className="btn btn-primary mt-5 text-primary-content"
            >
              <Plus className="h-4 w-4" />
              Add Hero Image
            </Link>
          </div>
        ) : sortedHeroImages.length === 0 ? (
          /* =================================================
              NO SEARCH RESULT
          ================================================= */

          <p className="py-10 text-center text-sm text-base-content/70">
            No hero images matched your search.
          </p>
        ) : (
          /* =================================================
              TABLE
          ================================================= */

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Title</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sortedHeroImages.map((hero) => {
                  const isActive = hero.active !== false;

                  return (
                    <tr key={hero._id}>
                      {/* PREVIEW */}

                      <td>
                        <div className="avatar">
                          <div className="h-16 w-28 overflow-hidden rounded-lg bg-base-200">
                            <img
                              src={hero.image}
                              alt={
                                hero.title ||
                                "Hero banner"
                              }
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </td>

                      {/* TITLE */}

                      <td>
                        <div className="max-w-[220px]">
                          <p className="truncate font-medium">
                            {hero.title ||
                              "Untitled Hero Image"}
                          </p>

                          <p className="mt-1 max-w-[220px] truncate text-xs text-base-content/40">
                            {hero.image}
                          </p>
                        </div>
                      </td>

                      {/* ORDER */}

                      <td>
                        <span className="badge badge-outline gap-1">
                          <GripVertical className="h-3.5 w-3.5" />
                          {hero.order || 1}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleActiveToggle(hero)
                          }
                          className={`btn btn-sm gap-1 ${
                            isActive
                              ? "btn-success"
                              : "btn-outline"
                          }`}
                          title={
                            isActive
                              ? "Click to disable"
                              : "Click to activate"
                          }
                        >
                          {isActive ? (
                            <>
                              <Eye className="h-4 w-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() =>
                              openEditModal(hero)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() =>
                              handleDelete(hero._id)
                            }
                            disabled={
                              deletingId === hero._id
                            }
                          >
                            <Trash2 className="h-4 w-4" />

                            {deletingId === hero._id
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
          </div>
        )}
      </section>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {editingHero && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-2xl font-semibold">
                  Edit Hero Image
                </h3>

                <p className="mt-1 text-sm text-base-content/60">
                  Update hero banner information.
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

            {/* FORM */}

            <form
              onSubmit={handleUpdate}
              className="mt-5 space-y-5"
            >
              {/* IMAGE PREVIEW */}

              <div className="overflow-hidden rounded-2xl border border-primary/10 bg-base-200">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Hero preview"
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center">
                    <Image className="h-10 w-10 text-base-content/30" />
                  </div>
                )}
              </div>

              {/* TITLE */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Hero Title
                </span>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g. Wedding Memories"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </label>

              {/* IMAGE URL */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Image URL
                </span>

                <input
                  type="url"
                  required
                  className="input input-bordered w-full"
                  placeholder="https://res.cloudinary.com/..."
                  value={formData.image}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: event.target.value,
                    }))
                  }
                />
              </label>

              {/* ORDER */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Display Order
                </span>

                <input
                  type="number"
                  min="1"
                  required
                  className="input input-bordered w-full"
                  value={formData.order}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: event.target.value,
                    }))
                  }
                />

                <span className="mt-1 text-xs text-base-content/50">
                  Smaller numbers will appear first.
                </span>
              </label>

              {/* ACTIVE */}

              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <label className="label cursor-pointer justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {formData.active ? (
                      <Eye className="h-4 w-4 text-success" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-base-content/50" />
                    )}

                    <span className="label-text font-medium">
                      Active Hero Image
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={formData.active}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        active: event.target.checked,
                      }))
                    }
                  />
                </label>

                <p className="mt-2 text-xs text-base-content/55">
                  {formData.active
                    ? "This image can be displayed in the homepage hero section."
                    : "This image will not be displayed in the homepage hero section."}
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
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Update Hero
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* MODAL BACKDROP */}

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

export default AdminHeroImageManagement;