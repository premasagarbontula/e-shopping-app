import React, { useEffect, useState } from "react";
import moment from "moment";
import toast from "react-hot-toast";

import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import API from "../../api/axios";
import { useAuth } from "../../context/authContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const { auth } = useAuth();

  // Toggle role
  const changeUserRole = async (id) => {
    if (!window.confirm("Are you sure you want to change this user's role?"))
      return;

    try {
      setLoadingId(id);

      const res = await API.patch(`/auth/users/${id}/toggle-role`);

      if (res?.data?.success) {
        toast.success(res.data.message);

        // ✅ Update locally (no refetch)
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, role: res.data.user.role } : u,
          ),
        );
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.error("Role toggle error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  // Toggle active status
  const toggleUserStatus = async (id) => {
    if (!window.confirm("Are you sure you want to change user status?")) return;

    try {
      setLoadingId(id);

      const { data } = await API.patch(`/auth/users/${id}/toggle-status`);

      if (data?.success) {
        toast.success(data.message);

        setUsers((prev) =>
          prev.map((u) =>
            u._id === id ? { ...u, isActive: data.user.isActive } : u,
          ),
        );
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    // Fetch users
    const getUsers = async () => {
      try {
        const { data } = await API.get("/auth/all-users");
        if (data?.success) {
          setUsers(data.users || []);
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    };
    getUsers();
  }, []);

  return (
    <Layout title={"Dashboard - All users"}>
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AdminMenu />
        </div>

        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold text-center mb-6 text-indigo-500">
            All Users
          </h1>

          {users.length === 0 ? (
            <div className="text-center text-gray-500">No users found</div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Member Since</th>
                    <th className="p-3">Role Change</th>
                    <th className="p-3">Activate/Deactivate</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => {
                    const isSelf = user._id === auth?.user?._id;
                    const isLoading = loadingId === user._id;

                    return (
                      <tr key={user._id} className="border-t">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>

                        <td className="p-3">
                          {user.role === "admin" ? "Admin" : "User"}
                        </td>

                        {/* Status Badge */}
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="p-3">
                          {moment(user.createdAt).fromNow()}
                        </td>

                        {/* Role Button */}
                        <td className="p-3">
                          <button
                            onClick={() => changeUserRole(user._id)}
                            disabled={isSelf || isLoading}
                            className={`text-white px-4 py-2 rounded-lg ${
                              isSelf
                                ? "bg-gray-400 cursor-not-allowed"
                                : user.role === "admin"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          >
                            {isLoading
                              ? "Updating..."
                              : user.role === "admin"
                                ? "Remove Admin"
                                : "Make Admin"}
                          </button>
                        </td>

                        {/* Status Button */}
                        <td className="p-3">
                          <button
                            onClick={() => toggleUserStatus(user._id)}
                            disabled={isSelf || isLoading}
                            className={`px-4 py-2 rounded-lg text-white ${
                              isSelf
                                ? "bg-gray-400 cursor-not-allowed"
                                : user.isActive
                                  ? "bg-red-500"
                                  : "bg-green-500"
                            }`}
                          >
                            {isLoading
                              ? "Updating..."
                              : user.isActive
                                ? "Deactivate User"
                                : "Activate User"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Users;
