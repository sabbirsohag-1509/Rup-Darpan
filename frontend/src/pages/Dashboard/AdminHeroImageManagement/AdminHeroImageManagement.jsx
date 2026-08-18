import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import {
  Image,
  Pencil,
  Plus,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const API_URL = "http://localhost:5000/hero-images";

const AdminHeroImageManagement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [editingHero, setEditingHero] = useState(null);
  const [deleteHero, setDeleteHero] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    publicId: "",
    altText: "",
    displayOrder: 1,
    isActive: true,
  });

  // =========================================================
  // GET HERO IMAGES
  // =========================================================

  const {
    data: heroImages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["hero-images"],

    queryFn: async () => {
      const response = await axios.get(API_URL);

      return response.data?.data || [];
    },
  });

  // =========================================================
  // DELETE MUTATION
  // =========================================================

  const deleteMutation = useMutation({
    mutationFn: async (heroId) => {
      const response = await axios.delete(`${API_URL}/${heroId}`);

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(
        data?.message || "Hero image deleted successfully.",
      );

      queryClient.invalidateQueries({
        queryKey: ["hero-images"],
      });

      setDeleteHero(null);
    },

    onError: (error) => {
      console.error("Delete hero image error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete hero image.",
      );
    },
  });

  // =========================================================
  // UPDATE MUTATION
  // =========================================================

  const updateMutation = useMutation({
    mutationFn: async ({ heroId, data }) => {
      const response = await axios.put(
        `${API_URL}/${heroId}`,
        data,
      );

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(
        data?.message || "Hero image updated successfully.",
      );

      queryClient.invalidateQueries({
        queryKey: ["hero-images"],
      });

      closeEditModal();

      // Navigate back to hero images management page
      navigate("/admin/hero-images");
    },

    onError: (error) => {
      console.error("Update hero image error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update hero image.",
      );
    },
  });

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (hero) => {
    setEditingHero(hero);

    setFormData({
      title: hero.title || "",
      image: hero.image || "",
      publicId: hero.publicId || "",
      altText: hero.altText || "",
      displayOrder: hero.displayOrder || 1,
      isActive: hero.isActive !== false,
    });
  };

  // =========================================================
  // CLOSE EDIT MODAL
  // =========================================================

  const closeEditModal = () => {
    if (updateMutation.isPending) {
      return;
    }

    setEditingHero(null);

    setFormData({
      title: "",
      image: "",
      publicId: "",
      altText: "",
      displayOrder: 1,
      isActive: true,
    });
  };

  // =========================================================
  // HANDLE UPDATE
  // =========================================================

  const handleUpdate = (event) => {
    event.preventDefault();

    if (!editingHero) {
      return;
    }

    if (!formData.image.trim()) {
      toast.error("Image URL is required.");
      return;
    }

    const updateData = {
      title: formData.title.trim(),

      image: formData.image.trim(),

      publicId: formData.publicId.trim(),

      altText:
        formData.altText.trim() ||
        formData.title.trim() ||
        "Rup Darpon Hero Image",

      displayOrder:
        Number(formData.displayOrder) || 1,

      isActive: Boolean(formData.isActive),
    };

    updateMutation.mutate({
      heroId: editingHero._id,
      data: updateData,
    });
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = (hero) => {
    setDeleteHero(hero);
  };

  const confirmDelete = () => {
    if (!deleteHero) {
      return;
    }

    deleteMutation.mutate(deleteHero._id);
  };

  const cancelDelete = () => {
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteHero(null);
  };

  // =========================================================
  // ACTIVE / INACTIVE
  // =========================================================

  const handleActiveToggle = (hero) => {
    const updateData = {
      title: hero.title || "",

      image: hero.image || "",

      publicId: hero.publicId || "",

      altText:
        hero.altText ||
        hero.title ||
        "Rup Darpon Hero Image",

      displayOrder:
        Number(hero.displayOrder) || 1,

      isActive: !Boolean(hero.isActive),
    };

    updateMutation.mutate({
      heroId: hero._id,
      data: updateData,
    });
  };

  // =========================================================
  // ACTIVE COUNT
  // =========================================================

  const activeCount = heroImages.filter(
    (hero) => hero.isActive !== false,
  ).length;

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/5 p-10 text-center">
        <Image className="mx-auto h-12 w-12 text-error/60" />

        <h3 className="mt-4 font-playfair text-xl font-semibold">
          Failed to Load Hero Images
        </h3>

        <p className="mt-2 text-sm text-base-content/60">
          {error?.response?.data?.message ||
            "Something went wrong while loading hero images."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="btn btn-primary mt-5"
        >
          Try Again
        </button>
      </div>
    );
  }

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
                Add, edit, delete and manage your homepage hero
                banner images.
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
          STATUS
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
                Manage the images displayed in the Rup Darpon
                homepage hero section.
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
          ALL HERO IMAGES
      ===================================================== */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <h3 className="font-playfair text-xl font-semibold">
            All Hero Images
          </h3>

          <p className="text-sm text-base-content/60">
            {heroImages.length} image
            {heroImages.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* ===================================================
            EMPTY
        =================================================== */}

        {heroImages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Image className="h-7 w-7 text-primary/60" />
            </div>

            <h3 className="mt-4 font-playfair text-xl font-semibold">
              No Hero Images
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              Add your first hero banner image to display it
              on the homepage.
            </p>

            <Link
              to="add-hero-photos"
              className="btn btn-primary mt-5 text-primary-content"
            >
              <Plus className="h-4 w-4" />
              Add Hero Image
            </Link>
          </div>
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
                  <th className="text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {heroImages.map((hero) => {
                  const isActive =
                    hero.isActive !== false;

                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === hero._id;

                  return (
                    <tr key={hero._id}>
                      {/* PREVIEW */}

                      <td>
                        <div className="avatar">
                          <div className="h-16 w-28 overflow-hidden rounded-lg bg-base-200">
                            <img
                              src={hero.image}
                              alt={
                                hero.altText ||
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
                        <div className="max-w-[240px]">
                          <p className="truncate font-medium">
                            {hero.title ||
                              "Untitled Hero Image"}
                          </p>

                          <p className="mt-1 max-w-[240px] truncate text-xs text-base-content/40">
                            {hero.altText ||
                              "No alt text"}
                          </p>
                        </div>
                      </td>

                      {/* ORDER */}

                      <td>
                        <span className="badge badge-outline gap-1">
                          <GripVertical className="h-3.5 w-3.5" />
                          {hero.displayOrder || 1}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleActiveToggle(hero)
                          }
                          disabled={
                            updateMutation.isPending
                          }
                          className={`btn btn-sm gap-1 ${
                            isActive
                              ? "btn-success"
                              : "btn-outline"
                          }`}
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
                            disabled={
                              updateMutation.isPending
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() =>
                              handleDelete(hero)
                            }
                            disabled={
                              deleteMutation.isPending
                            }
                          >
                            {isDeleting ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}

                            {isDeleting
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
                disabled={
                  updateMutation.isPending
                }
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

              {/* ALT TEXT */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Alt Text
                </span>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Hero image description"
                  value={formData.altText}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      altText: event.target.value,
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

              {/* PUBLIC ID */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Cloudinary Public ID
                </span>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="rup_darpon/hero/..."
                  value={formData.publicId}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      publicId: event.target.value,
                    }))
                  }
                />
              </label>

              {/* DISPLAY ORDER */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Display Order
                </span>

                <input
                  type="number"
                  min="1"
                  required
                  className="input input-bordered w-full"
                  value={formData.displayOrder}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder:
                        event.target.value,
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
                    {formData.isActive ? (
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
                    checked={formData.isActive}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive:
                          event.target.checked,
                      }))
                    }
                  />
                </label>

                <p className="mt-2 text-xs text-base-content/55">
                  {formData.isActive
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
                  disabled={
                    updateMutation.isPending
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary text-primary-content"
                  disabled={
                    updateMutation.isPending
                  }
                >
                  {updateMutation.isPending ? (
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

          {/* BACKDROP */}

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

      {deleteHero && (
        <dialog className="modal modal-open">
          {/* BACKDROP */}

          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={cancelDelete}
          />

          <div className="modal-box relative max-w-md overflow-hidden border border-error/20 bg-base-100/95 p-0 shadow-2xl backdrop-blur-xl">
            {/* TOP ACCENT */}

            <div className="h-1 w-full bg-error" />

            <div className="p-6">
              {/* ICON + HEADER */}

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-error/10">
                  <Trash2 className="h-6 w-6 text-error" />
                </div>

                <div>
                  <h3 className="font-playfair text-2xl font-semibold">
                    Delete Hero Image?
                  </h3>

                  <p className="mt-1 text-sm text-base-content/60">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* IMAGE PREVIEW */}

              <div className="mt-5 overflow-hidden rounded-xl border border-base-content/10 bg-base-200">
                <img
                  src={deleteHero.image}
                  alt={
                    deleteHero.altText ||
                    deleteHero.title ||
                    "Hero image"
                  }
                  className="h-36 w-full object-cover"
                />
              </div>

              {/* HERO INFO */}

              <div className="mt-4 rounded-xl border border-error/10 bg-error/5 p-4">
                <p className="text-sm font-semibold">
                  {deleteHero.title ||
                    "Untitled Hero Image"}
                </p>

                <p className="mt-1 line-clamp-2 text-xs text-base-content/50">
                  {deleteHero.altText ||
                    "No alt text available"}
                </p>
              </div>

              {/* WARNING */}

              <div className="mt-4 rounded-xl bg-base-200/70 p-3">
                <p className="text-xs leading-relaxed text-base-content/60">
                  Are you sure you want to permanently
                  remove this hero image from your
                  homepage hero section?
                </p>
              </div>

              {/* BUTTONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={cancelDelete}
                  disabled={
                    deleteMutation.isPending
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-error text-error-content"
                  onClick={confirmDelete}
                  disabled={
                    deleteMutation.isPending
                  }
                >
                  {deleteMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Hero
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminHeroImageManagement;