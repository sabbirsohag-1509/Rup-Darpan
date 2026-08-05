import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  Clock3,
  Images,
  Pencil,
  Plus,
  Search,
  Trash2,
  Sparkles,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/packages";

const AdminPackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState("");
  const [editingPackage, setEditingPackage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingPackage, setDeletingPackage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    photoCount: "",
    description: "",
    coverImage: "",
    features: "",
    featured: false,
    active: true,
  });

  // =====================================================
  // FETCH PACKAGES
  // =====================================================

  const fetchPackages = async () => {
    try {
      const response = await axios.get(API_URL, {
        withCredentials: true,
      });

      console.log("Packages API response:", response.data);

      setPackages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch packages:", error);

      toast.error("Failed to load packages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPackages = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return packages;
    }

    return packages.filter((pkg) => {
      const featureText = Array.isArray(pkg.features)
        ? pkg.features.join(" ")
        : pkg.features || "";

      return [pkg.name, pkg.description, pkg.duration, featureText]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [packages, searchQuery]);

  // =====================================================
  // DELETE PACKAGE
  // =====================================================

  const handleDelete = async (packageId) => {
    setDeletingId(packageId);

    try {
      await axios.delete(`${API_URL}/${packageId}`, {
        withCredentials: true,
      });

      setPackages((prevPackages) =>
        prevPackages.filter((pkg) => pkg._id !== packageId),
      );

      toast.success("Package deleted successfully.");
    } catch (error) {
      console.error("Failed to delete package:", error);

      toast.error("Failed to delete package.");
    } finally {
        setDeletingId("");
        setDeletingPackage(null);
    }
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (pkg) => {
    setEditingPackage(pkg);

    setFormData({
      name: pkg.name || "",
      price: pkg.price || "",
      duration: pkg.duration || "",
      photoCount: pkg.photoCount || "",
      description: pkg.description || "",
      coverImage: pkg.coverImage || "",
      features: Array.isArray(pkg.features) ? pkg.features.join(", ") : "",
      featured: Boolean(pkg.featured),
      active: Boolean(pkg.active),
    });
  };

  // =====================================================
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {
    setEditingPackage(null);
  };

  // =====================================================
  // UPDATE PACKAGE
  // =====================================================

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingPackage) {
      return;
    }

    setSaving(true);

    try {
      const parsedFeatures = formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const updatedPackage = {
        name: formData.name.trim(),
        price: Number(formData.price),
        duration: formData.duration.trim(),
        photoCount: Number(formData.photoCount),
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim(),
        features: parsedFeatures,
        featured: formData.featured,
        active: formData.active,
        updatedAt: new Date(),
      };

      await axios.put(`${API_URL}/${editingPackage._id}`, updatedPackage, {
        withCredentials: true,
      });

      await fetchPackages();

      toast.success("Package updated successfully.");

      closeEditModal();
    } catch (error) {
      console.error("Failed to update package:", error);

      toast.error("Failed to update package.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">
            Package Management
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            Add, Edit, and Delete packages from your dashboard.
          </p>
        </div>

        <Link to="add-package" className="btn btn-primary text-primary-content">
          <Plus className="h-4 w-4" />
          Add Package
        </Link>
      </section>

      {/* =================================================
          PACKAGE LIST
      ================================================= */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        {/* Search */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="input input-bordered flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-base-content/60" />

            <input
              type="text"
              className="grow"
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <p className="text-sm text-base-content/70">
            {filteredPackages.length} package(s) found
          </p>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : packages.length === 0 ? (
          /* Empty */

          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-base-content/30" />

            <p className="mt-3 text-sm text-base-content/70">
              No packages found.
            </p>

            <Link to="add-package" className="btn btn-primary btn-sm mt-4">
              <Plus className="h-4 w-4" />
              Add Your First Package
            </Link>
          </div>
        ) : filteredPackages.length === 0 ? (
          /* Search empty */

          <p className="py-8 text-center text-sm text-base-content/70">
            No packages matched your search.
          </p>
        ) : (
          /* =================================================
             TABLE
          ================================================= */

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Photos</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id}>
                    {/* Package */}

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="h-14 w-16 rounded-lg bg-base-200">
                            <img
                              src={pkg.coverImage}
                              alt={pkg.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{pkg.name}</p>

                            {pkg.featured && (
                              <span className="badge badge-primary badge-sm gap-1">
                                <Sparkles className="h-3 w-3" />
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="max-w-xs truncate text-xs text-base-content/60">
                            {pkg.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}

                    <td>
                      <span className="font-semibold text-primary">
                        ৳{Number(pkg.price || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Duration */}

                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock3 className="h-4 w-4 text-primary" />

                        {pkg.duration || "N/A"}
                      </div>
                    </td>

                    {/* Photos */}

                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Images className="h-4 w-4 text-primary" />

                        {pkg.photoCount || 0}
                      </div>
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={`badge ${
                          pkg.active ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {pkg.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => openEditModal(pkg)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-error btn-outline"
                          onClick={() => setDeletingPackage(pkg)}
                          disabled={deletingId === pkg._id}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingPackage && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-playfair text-2xl font-semibold">
              Edit Package
            </h3>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              {/* Name */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Package Name
                </span>

                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </label>

              {/* Price / Duration */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Price (৳)</span>

                  <input
                    type="number"
                    min="1"
                    required
                    className="input input-bordered w-full"
                    value={formData.price}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Duration</span>

                  <input
                    type="text"
                    required
                    className="input input-bordered w-full"
                    value={formData.duration}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              {/* Photo Count */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Photo Count</span>

                <input
                  type="number"
                  min="1"
                  required
                  className="input input-bordered w-full"
                  value={formData.photoCount}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      photoCount: event.target.value,
                    }))
                  }
                />
              </label>

              {/* Cover Image */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Cover Image URL
                </span>

                <input
                  type="url"
                  required
                  className="input input-bordered w-full"
                  value={formData.coverImage}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: event.target.value,
                    }))
                  }
                />
              </label>

              {/* Image Preview */}

              {formData.coverImage && (
                <div className="overflow-hidden rounded-xl border border-primary/10">
                  <img
                    src={formData.coverImage}
                    alt="Package preview"
                    className="h-48 w-full object-cover"
                  />
                </div>
              )}

              {/* Features */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Features</span>

                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="300 Edited Photos, 2 Photographers, Premium Album"
                  value={formData.features}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      features: event.target.value,
                    }))
                  }
                />

                <span className="mt-1 text-xs text-base-content/50">
                  Separate features with commas.
                </span>
              </label>

              {/* Description */}

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Description</span>

                <textarea
                  className="textarea textarea-bordered h-28 w-full"
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </label>

              {/* Toggles */}

              <div className="flex flex-wrap gap-6">
                <label className="label cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.featured}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: event.target.checked,
                      }))
                    }
                  />

                  <span className="label-text">Featured</span>
                </label>

                <label className="label cursor-pointer gap-3">
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

                  <span className="label-text">Active</span>
                </label>
              </div>

              {/* Buttons */}

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
                      <Pencil className="h-4 w-4" />
                      Update Package
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Modal backdrop */}

          <button
            type="button"
            className="modal-backdrop"
            onClick={closeEditModal}
          >
            Close
          </button>
        </dialog>
      )}
      <div>
        {/* =================================================
    DELETE CONFIRMATION MODAL
================================================= */}

        {deletingPackage && (
          <dialog className="modal modal-open">
            {/* Transparent / Glass Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                if (!deletingId) {
                  setDeletingPackage(null);
                }
              }}
            />

            {/* Modal Box */}
            <div className="modal-box relative max-w-md border border-error/20 bg-base-100/90 shadow-2xl backdrop-blur-xl">
              {/* Icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                <Trash2 className="h-8 w-8 text-error" />
              </div>

              {/* Title */}
              <h3 className="mt-5 text-center font-playfair text-2xl font-semibold">
                Delete Package?
              </h3>

              {/* Description */}
              <p className="mt-2 text-center text-sm leading-6 text-base-content/70">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-base-content">
                  "{deletingPackage.name}"
                </span>
                ?
                <br />
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setDeletingPackage(null)}
                  disabled={Boolean(deletingId)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => handleDelete(deletingPackage._id)}
                  disabled={Boolean(deletingId)}
                >
                  {deletingId === deletingPackage._id ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default AdminPackageManagement;
