import { useCallback, useEffect, useMemo, useState } from "react";
import UserForm from "../components/UserForm";
import useAuth from "../context/useAuth";
import {
  createUserRequest,
  deleteUserByIdRequest,
  getMyProfileRequest,
  getUsersRequest,
  updateMyProfileRequest,
  updateUserByIdRequest,
} from "../api/usersApi";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isAdmin = useMemo(() => user?.role === "Admin", [user]);

  const loadData = useCallback(async () => {
    setError("");
    try {
      const profileResponse = await getMyProfileRequest();
      setProfile(profileResponse.data.user);

      const usersResponse = await getUsersRequest();
      setUsers(usersResponse.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    loadData();
  }, [isAuthenticated, loadData]);

  const createUser = async (payload) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await createUserRequest(payload);
      setMessage("User created");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (selected) => {
    setEditingUser(selected);
  };

  const updateUser = async (payload) => {
    if (!editingUser) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateUserByIdRequest(editingUser.id, payload);
      setMessage("User updated");
      setEditingUser(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await deleteUserByIdRequest(id);
      setMessage("User deleted");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      password: String(form.get("password") || ""),
    };

    if (!payload.password) {
      delete payload.password;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await updateMyProfileRequest(payload);
      setMessage("Profile updated");
      await loadData();
      event.currentTarget.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {profile && (
        <article className="panel">
          <h3>My Profile</h3>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          <form onSubmit={updateProfile} className="inline-form">
            <input name="name" type="text" placeholder="New name" />
            <input name="password" type="password" minLength={6} placeholder="New password" />
            <button type="submit" disabled={loading}>
              Save Profile
            </button>
          </form>
        </article>
      )}

      {isAdmin && (
        <>
          <UserForm onSubmit={createUser} loading={loading} submitText="Create User" />

          {editingUser && (
            <UserForm
              key={editingUser.id}
              onSubmit={updateUser}
              loading={loading}
              initialValues={editingUser}
              submitText="Update User"
            />
          )}
        </>
      )}

      <article className="panel">
        <h3>All Users</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  {isAdmin && (
                    <td>
                      <button type="button" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => deleteUser(item.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default DashboardPage;
