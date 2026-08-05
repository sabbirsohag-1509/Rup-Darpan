import { useContext, useEffect, useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
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

import { AuthContext } from "../../context/AuthContext";
import Loader from "../../components/shared/Loader";

const API_URL = "http://localhost:5000/users";
const USERS_PER_PAGE = 10;

const AdminUsersManagement = () => {
  const { user: currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  // ==========================================
  // STATE
  // ==========================================

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [roleChangeUser, setRoleChangeUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    profilePhoto: "",
    role: "user",
  });

  // ==========================================
  // SEARCH DEBOUNCE
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ==========================================
  // GET USERS - TANSTACK QUERY
  // ==========================================

  const {
    data: userData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-users", currentPage, searchQuery],

    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage,
        limit: USERS_PER_PAGE,
        search: searchQuery,
      });

      const response = await fetch(`${API_URL}?${params.toString()}`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load users.");
      }

      return data;
    },

    placeholderData: keepPreviousData,
  });

  const users = userData?.users || [];
  const totalUsers = userData?.total || 0;
  const totalPages = userData?.totalPages || 1;

  // ==========================================
  // FORMATTED USERS
  // ==========================================

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

  // ==========================================
  // EDIT USER
  // ==========================================

  const editUserMutation = useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user.");
      }

      return data;
    },

    onSuccess: () => {
      toast.success("User updated successfully.");

      setEditingUser(null);

      setEditForm({
        name: "",
        profilePhoto: "",
        role: "user",
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: (error) => {
      console.error("Failed to update user:", error);

      toast.error(error.message || "Failed to update user.");
    },
  });

  // ==========================================
  // CHANGE USER ROLE
  // ==========================================

  const roleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const response = await fetch(`${API_URL}/${userId}/role`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change user role.");
      }

      return data;
    },

    onSuccess: () => {
      toast.success("User role updated successfully.");

      setRoleChangeUser(null);

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: (error) => {
      console.error("Failed to change user role:", error);

      toast.error(error.message || "Failed to change user role.");
    },
  });

  // ==========================================
  // DELETE USER
  // ==========================================

  const deleteMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user.");
      }

      return data;
    },

    onSuccess: () => {
      toast.success("User deleted successfully.");

      setDeleteUser(null);

      // Current page only had one user.
      // Move to previous page if possible.
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },

    onError: (error) => {
      console.error("Failed to delete user:", error);

      toast.error(error.message || "Failed to delete user.");
    },
  });

  // ==========================================
  // EDIT MODAL
  // ==========================================

  const openEditModal = (selectedUser) => {
    setEditingUser(selectedUser);

    setEditForm({
      name: selectedUser.name || "",
      profilePhoto: selectedUser.profilePhoto || "",
      role: selectedUser.role || "user",
    });
  };

  const closeEditModal = () => {
    if (editUserMutation.isPending) return;

    setEditingUser(null);

    setEditForm({
      name: "",
      profilePhoto: "",
      role: "user",
    });
  };

  // ==========================================
  // EDIT SUBMIT
  // ==========================================

  const handleEditSubmit = (event) => {
    event.preventDefault();

    if (!editingUser) return;

    const isEditingSelf =
      currentUser?._id &&
      String(currentUser._id) === String(editingUser._id);

    // Admin cannot change their own role
    if (isEditingSelf && editForm.role !== editingUser.role) {
      toast.error("You cannot change your own role.");

      return;
    }

    editUserMutation.mutate({
      userId: editingUser._id,

      userData: {
        name: editForm.name.trim(),
        profilePhoto: editForm.profilePhoto.trim(),

        // Keep existing role if editing own account
        role: isEditingSelf ? editingUser.role : editForm.role,
      },
    });
  };

  // ==========================================
  // ROLE CHANGE
  // ==========================================

  const handleRoleChange = () => {
    if (!roleChangeUser) return;

    const isSelf =
      currentUser?._id &&
      String(currentUser._id) === String(roleChangeUser._id);

    if (isSelf) {
      toast.error("You cannot change your own role.");
      setRoleChangeUser(null);

      return;
    }

    const newRole =
      roleChangeUser.role === "admin" ? "user" : "admin";

    roleMutation.mutate({
      userId: roleChangeUser._id,
      role: newRole,
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = () => {
    if (!deleteUser) return;

    const isSelf =
      currentUser?._id &&
      String(currentUser._id) === String(deleteUser._id);

    if (isSelf) {
      toast.error("You cannot delete your own account.");
      setDeleteUser(null);

      return;
    }

    deleteMutation.mutate(deleteUser._id);
  };

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (isError) {
    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm">
          <h2 className="font-playfair text-2xl font-semibold">
            Users Management
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            View and manage registered users and their roles.
          </p>
        </section>

        <section className="rounded-2xl border border-error/20 bg-base-100 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
            <UserRound className="h-7 w-7" />
          </div>

          <h3 className="text-lg font-semibold">
            Failed to load users
          </h3>

          <p className="mt-1 text-sm text-base-content/60">
            {error?.message || "Something went wrong."}
          </p>

          <button
            type="button"
            className="btn btn-primary mt-5 text-primary-content"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["admin-users"],
              })
            }
          >
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="flex flex-col gap-3 rounded-2xl border border-primary/10 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">
            Users Management
          </h2>

          <p className="mt-1 text-sm text-base-content/70">
            View and manage registered users and their roles.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-4 py-2 text-sm text-primary">
          <UserRound className="h-4 w-4" />

          <span>
            {totalUsers} {totalUsers === 1 ? "User" : "Users"}
          </span>
        </div>
      </section>

      {/* ==========================================
          MAIN CARD
      ========================================== */}

      <section className="rounded-2xl border border-primary/10 bg-base-100 p-4 shadow-sm sm:p-6">
        {/* Search */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="input input-bordered flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-base-content/60" />

            <input
              type="text"
              className="grow"
              placeholder="Search users by name or email..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="flex items-center gap-2">
            {isFetching && !isLoading && (
              <span className="loading loading-spinner loading-xs text-primary" />
            )}

            <p className="text-sm text-base-content/70">
              {totalUsers} user(s) found
            </p>
          </div>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : users.length === 0 ? (
          /* ==========================================
              EMPTY STATE
          ========================================== */

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-semibold">
              No users found
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              {searchQuery
                ? "No users matched your search."
                : "No registered users are available."}
            </p>
          </div>
        ) : (
          <>
            {/* ==========================================
                TABLE
            ========================================== */}

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
                  {formattedUsers.map((user) => {
                    const isSelf =
                      currentUser?._id &&
                      String(currentUser._id) === String(user._id);

                    return (
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
                                    {user.name
                                      ?.charAt(0)
                                      .toUpperCase() || "U"}
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
                        <td className="text-sm">
                          {user.email}
                        </td>

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

                            {user.role === "admin"
                              ? "Admin"
                              : "User"}
                          </span>

                          {isSelf && (
                            <span className="ml-2 text-xs text-primary">
                              You
                            </span>
                          )}
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
                              onClick={() =>
                                setSelectedUser(user)
                              }
                              title="View user"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={() =>
                                openEditModal(user)
                              }
                              title="Edit user"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            {/* Role */}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline"
                              onClick={() =>
                                setRoleChangeUser(user)
                              }
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? "You cannot change your own role"
                                  : "Change role"
                              }
                            >
                              <Shield className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              className="btn btn-sm btn-error btn-outline"
                              onClick={() =>
                                setDeleteUser(user)
                              }
                              disabled={
                                isSelf ||
                                deleteMutation.isPending
                              }
                              title={
                                isSelf
                                  ? "You cannot delete yourself"
                                  : "Delete user"
                              }
                            >
                              {deleteMutation.isPending &&
                              deleteUser?._id === user._id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ==========================================
                PAGINATION
            ========================================== */}

            {totalPages > 1 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === 1 || isFetching}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1),
                    )
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
                  disabled={
                    currentPage === totalPages || isFetching
                  }
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

      {/* ==========================================
          VIEW USER MODAL
      ========================================== */}

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
                      {selectedUser.name
                        ?.charAt(0)
                        .toUpperCase() || "U"}
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
                <span className="text-sm text-base-content/60">
                  Role
                </span>

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

      {/* ==========================================
          EDIT USER MODAL
      ========================================== */}

      {editingUser && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-playfair text-2xl font-semibold">
              Edit User
            </h3>

            <p className="mt-1 text-sm text-base-content/60">
              Update the user's basic profile information.
            </p>

            <form
              onSubmit={handleEditSubmit}
              className="mt-5 space-y-4"
            >
              {/* Name */}
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

              {/* Profile Photo */}
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

              {/* Role */}
              <label className="form-control w-full">
                <span className="label-text mb-1 font-medium">
                  Role
                </span>

                <select
                  className="select select-bordered w-full"
                  value={editForm.role}
                  disabled={
                    currentUser?._id &&
                    String(currentUser._id) ===
                      String(editingUser._id)
                  }
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

                {currentUser?._id &&
                  String(currentUser._id) ===
                    String(editingUser._id) && (
                    <span className="mt-1 text-xs text-warning">
                      You cannot change your own role.
                    </span>
                  )}
              </label>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeEditModal}
                  disabled={editUserMutation.isPending}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary text-primary-content"
                  disabled={editUserMutation.isPending}
                >
                  {editUserMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
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

      {/* ==========================================
          CHANGE ROLE CONFIRMATION
      ========================================== */}

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
                  {roleChangeUser.name ||
                    roleChangeUser.email}
                </strong>{" "}
                from{" "}
                <strong className="capitalize">
                  {roleChangeUser.role}
                </strong>{" "}
                to{" "}
                <strong>
                  {roleChangeUser.role === "admin"
                    ? "User"
                    : "Admin"}
                </strong>
                ?
              </p>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => setRoleChangeUser(null)}
                disabled={roleMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary flex-1 text-primary-content"
                onClick={handleRoleChange}
                disabled={roleMutation.isPending}
              >
                {roleMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Confirm"
                )}
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

      {/* ==========================================
          DELETE CONFIRMATION
      ========================================== */}

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

              <p className="mt-2 text-xs text-error/80">
                This action cannot be undone.
              </p>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost flex-1"
                onClick={() => setDeleteUser(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-error flex-1"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
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