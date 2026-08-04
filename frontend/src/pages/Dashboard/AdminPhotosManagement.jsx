import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/photos";

const AdminPhotosManagement = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
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

  const fetchPhotos = async () => {
    const response = await axios.get(API_URL, { withCredentials: true });
    setPhotos(response.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchPhotos()
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load photos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (photoId) => {
    const confirmed = window.confirm("Are you sure you want to delete this photo?");
    if (!confirmed) {
      return;
    }

    setDeletingId(photoId);
    try {
      await axios.delete(`${API_URL}/${photoId}`, { withCredentials: true });
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== photoId));
      toast.success("Photo deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete photo.");
    } finally {
      setDeletingId("");
    }
  };

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

  const closeEditModal = () => {
    setEditingPhoto(null);
  };

  const parsedTags = useMemo(
    () =>
      formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [formData.tags],
  );

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingPhoto) {
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
          featured: formData.featured,
          isPublished: formData.isPublished,
        },
        { withCredentials: true },
      );

      await fetchPhotos();
      toast.success("Photo updated successfully.");
      closeEditModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update photo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">Photos Management</h2>
          <p className="mt-1 text-sm text-base-content/70">
            Add, edit, and delete gallery photos from your dashboard.
          </p>
        </div>
        <Link to="/add-photo" className="btn btn-primary text-primary-content">
          <Plus className="h-4 w-4" />
          Add Photo
        </Link>
      </section>

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : photos.length === 0 ? (
          <p className="py-6 text-center text-sm text-base-content/70">
            No photos found. Add your first photo.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Published</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => (
                  <tr key={photo._id}>
                    <td>
                      <div className="avatar">
                        <div className="h-14 w-14 rounded-lg bg-base-200">
                          <img src={photo.image} alt={photo.title} />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{photo.title}</td>
                    <td>{photo.category || "N/A"}</td>
                    <td>
                      <span className={`badge ${photo.isPublished ? "badge-success" : "badge-warning"}`}>
                        {photo.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
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
                          {deletingId === photo._id ? "Deleting..." : "Delete"}
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

      {editingPhoto && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-playfair text-2xl font-semibold">Edit Photo</h3>
            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Title</span>
                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  value={formData.title}
                  onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Image URL</span>
                <input
                  type="url"
                  required
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(event) => setFormData((prev) => ({ ...prev, image: event.target.value }))}
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Category</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.category}
                    onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Tags (comma separated)</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.tags}
                    onChange={(event) => setFormData((prev) => ({ ...prev, tags: event.target.value }))}
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Photographer</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.photographer}
                    onChange={(event) => setFormData((prev) => ({ ...prev, photographer: event.target.value }))}
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text mb-1 font-medium">Location</span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.location}
                    onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                  />
                </label>
              </div>

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">Description</span>
                <textarea
                  className="textarea textarea-bordered h-24 w-full"
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                />
              </label>

              <div className="flex flex-wrap gap-4">
                <label className="label cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={formData.featured}
                    onChange={(event) => setFormData((prev) => ({ ...prev, featured: event.target.checked }))}
                  />
                  <span className="label-text">Featured</span>
                </label>
                <label className="label cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={formData.isPublished}
                    onChange={(event) => setFormData((prev) => ({ ...prev, isPublished: event.target.checked }))}
                  />
                  <span className="label-text">Published</span>
                </label>
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-primary-content" disabled={saving}>
                  {saving ? "Saving..." : "Update Photo"}
                </button>
              </div>
            </form>
          </div>
          <button type="button" className="modal-backdrop" onClick={closeEditModal}>
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

export default AdminPhotosManagement;
