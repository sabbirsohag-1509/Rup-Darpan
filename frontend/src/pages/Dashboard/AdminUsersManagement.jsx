import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Eye,
  Pencil,
  Search,
  Shield,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/users";
const USERS_PER_PAGE = 10;

const AdminUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [roleChangeUser, setRoleChangeUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    profilePhoto: "",
    role: "user",
  });

  const fetchUsers = async (page = 1, search = searchQuery) => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL, {
        params: {
          page,
          limit: USERS_PER_PAGE,
          search: search.trim(),
        },
        withCredentials: true,
      });

      console.log("Users API response:", response.data);

      setUsers(response.data.users || []);
      setTotalUsers(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error(
        error.response?.data?.message || "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage]);

  // Search with small debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const formattedUsers = useMemo(() => {
    return users.map((user) => ({
      ...user,
      joinedDate: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
    }));
  }, [users]);

  const openEditModal = (user) => {
    setEditingUser(user);

    setEditForm({
      name: user.name || "",
      profilePhoto: user.profilePhoto || "",
      role: user.role || "user",
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingUser(null);

    setEditForm({
      name: "",
      profilePhoto: "",
      role: "user",
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!editingUser) return;

    setSaving(true);

    try {
      await axios.patch(
        `${API_URL}/${editingUser._id}`,
        {
          name: editForm.name.trim(),
          profilePhoto: editForm.profilePhoto.trim(),
          role: editForm.role,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("User updated successfully.");

      closeEditModal();
      await fetchUsers(currentPage, searchQuery);
    } catch (error) {
      console.error("Failed to update user:", error);

      toast.error(
        error.response?.data?.message || "Failed to update user.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async () => {
    if (!roleChangeUser) return;

    try {
      await axios.patch(
        `${API_URL}/${roleChangeUser._id}/role`,
        {
          role: roleChangeUser.role === "admin" ? "user" : "admin",
        },
        {
          withCredentials: true,
        },
      );

      toast.success("User role updated successfully.");

      setRoleChangeUser(null);

      await fetchUsers(currentPage, searchQuery);
    } catch (error) {
      console.error("Failed to change user role:", error);

      toast.error(
        error.response?.data?.message || "Failed to change user role.",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;

    setDeletingId(deleteUser._id);

    try {
      await axios.delete(`${API_URL}/${deleteUser._id}`, {
        withCredentials: true,
      });

      toast.success("User deleted successfully.");

      setDeleteUser(null);

      // If the current page becomes empty,
      // move back one page when possible.
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchUsers(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete user.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">
            Users Management
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            View and manage registered users and their roles.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-4 py-2 text-sm text-primary">
          <UserRound className="h-4 w-4" />

          <span>
            {totalUsers} {totalUsers === 1 ? "User" : "Users"}
          </span>
        </div>
      </section>

      {/* Main Card */}
      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        {/* Search */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="input input-bordered flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-base-content/60" />

            <input
              type="text"
              className="grow"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <p className="text-sm text-base-content/70">
            {totalUsers} user(s) found
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : users.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-semibold">No users found</h3>

            <p className="mt-1 text-sm text-base-content/60">
              {searchQuery
                ? "No users matched your search."
                : "No registered Users are available."}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {formattedUsers.map((user) => (
                    <tr key={user._id}>
                      {/* User */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="h-11 w-11 rounded-full bg-primary/10">
                              {user.profilePhoto ? (
                                <img
                                  src={user.profilePhoto}
                                  alt={user.name || "User"}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                                  {user.name?.charAt(0).toUpperCase() || "U"}
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium">
                              {user.name || "Unnamed User"}
                            </p>

                            <p className="text-xs text-base-content/50">
                              ID: {user._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="text-sm">{user.email}</td>

                      {/* Role */}
                      <td>
                        <span
                          className={`badge gap-1 ${
                            user.role === "admin"
                              ? "badge-primary text-primary-content"
                              : "badge-ghost"
                          }`}
                        >
                          {user.role === "admin" && (
                            <Shield className="h-3 w-3" />
                          )}

                          {user.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="text-sm text-base-content/70">
                        {user.joinedDate}
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex justify-end gap-2">
                          {/* View */}
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            onClick={() => setSelectedUser(user)}
                            title="View user"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => openEditModal(user)}
                            title="Edit user"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Role */}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => setRoleChangeUser(user)}
                            title="Change role"
                          >
                            <Shield className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => setDeleteUser(user)}
                            disabled={deletingId === user._id}
                            title="Delete user"
                          >
                            {deletingId === user._id ? (
                              <span className="loading loading-spinner loading-xs" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === 1 || loading}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </button>

                <span className="px-3 text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  className="btn btn-sm btn-primary text-primary-content"
                  disabled={currentPage === totalPages || loading}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages),
                    )
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* View User Modal */}
      {selectedUser && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-md">
            <div className="flex items-center justify-between">
              <h3 className="font-playfair text-2xl font-semibold">
                User Details
              </h3>

              <button
                type="button"
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setSelectedUser(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <div className="avatar">
                <div className="h-24 w-24 rounded-full bg-primary/10 ring-2 ring-primary/20 ring-offset-2">
                  {selectedUser.profilePhoto ? (
                    <img
                      src={selectedUser.profilePhoto}
                      alt={selectedUser.name || "User"}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-primary">
                      {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>

              <h4 className="mt-4 text-xl font-semibold">
                {selectedUser.name || "Unnamed User"}
              </h4>

              <p className="text-sm text-base-content/60">
                {selectedUser.email}
              </p>
            </div>

            <div className="mt-6 space-y-3 rounded-xl bg-base-200/60 p-4">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-base-content/60">Role</span>

                <span className="font-medium capitalize">
                  {selectedUser.role}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-sm text-base-content/60">
                  Joined
                </span>

                <span className="font-medium">
                  {selectedUser.joinedDate}
                </span>
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-primary text-primary-content"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            onClick={() => setSelectedUser(null)}
          >
            Close
          </button>
        </dialog>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-playfair text-2xl font-semibold">
              Edit User
            </h3>

            <form
              onSubmit={handleEditSubmit}
              className="mt-5 space-y-4"
            >
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Name
                </span>

                <input
                  type="text"
                  required
                  className="input input-bordered w-full"
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Profile Photo URL
                </span>

                <input
                  type="url"
                  className="input input-bordered w-full"
                  value={editForm.profilePhoto}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      profilePhoto: event.target.value,
                    }))
                  }
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Role
                </span>

                <select
                  className="select select-bordered w-full"
                  value={editForm.role}
                  onChange={(event) =>
                    setEditForm((prev) => ({
                      ...prev,
                      role: event.target.value,
                    }))
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
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
                  {saving ? "Saving..." : "Save Changes"}
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

      {/* Change Role Confirmation */}
      {roleChangeUser && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Shield className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="font-playfair text-2xl font-semibold">
                Change User Role?
              </h3>

              <p className="mt-2 text-sm text-base-content/65">
                Change{" "}
                <strong>
                  {roleChangeUser.name || roleChangeUser.email}
                </strong>{" "}
                from{" "}
                <strong className="capitalize">
                  {roleChangeUser.role}
                </strong>{" "}
                to{" "}
                <strong>
                  {roleChangeUser.role === "admin" ? "User" : "Admin"}
                </strong>
                ?
              </p>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => setRoleChangeUser(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary flex-1 text-primary-content"
                onClick={handleRoleChange}
              >
                Confirm
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            onClick={() => setRoleChangeUser(null)}
          >
            Close
          </button>
        </dialog>
      )}

      {/* Delete Confirmation */}
      {deleteUser && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
              <Trash2 className="h-6 w-6" />
            </div>

            <div className="text-center">
              <h3 className="font-playfair text-2xl font-semibold">
                Delete User?
              </h3>

              <p className="mt-2 text-sm text-base-content/65">
                Are you sure you want to delete{" "}
                <strong>
                  {deleteUser.name || deleteUser.email}
                </strong>
                ?
              </p>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => setDeleteUser(null)}
                disabled={deletingId === deleteUser._id}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-error flex-1"
                onClick={handleDelete}
                disabled={deletingId === deleteUser._id}
              >
                {deletingId === deleteUser._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            onClick={() => setDeleteUser(null)}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

export default AdminUsersManagement;