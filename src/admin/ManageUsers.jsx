import React, { useEffect, useState } from "react";
import axios from "axios";
import { showConfirmToast } from "../common/components/Toast/ToastMessage";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaSearch,
  FaTrash,
  FaLock,
  FaUnlock,
  FaEye,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { URL } from "../service/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${URL}/users`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users. Please try again.");
        toast.error("Unable to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleBlockUnblock = async (userId, isBlocked) => {
    const newStatus = !isBlocked;
    const action = isBlocked ? "unblock" : "block";
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        setUpdatingStatusId(userId);
        await axios.patch(
          `${URL}/users/${userId}`,
          { isBlocked: newStatus },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isBlocked: newStatus } : user
          )
        );
        toast.success(`User ${action}ed successfully`);
      } catch (err) {
        toast.error(`Failed to ${action} user`);
        console.error(err);
      } finally {
        setUpdatingStatusId(null);
      }
    }
  };

  const handleDelete = async (userId) => {
    showConfirmToast("Are you sure you want to delete this user?", async () => {
      try {
        setDeletingId(userId);

        const deletePromise = axios.delete(
          `${URL}/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast.promise(deletePromise, {
          loading: "Deleting user...",
          success: "User deleted successfully",
          error: "Failed to delete user",
        });

        await deletePromise;
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      } catch (err) {
        console.error(err);
      } finally {
        setDeletingId(null);
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
      
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <motion.h2
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            User Management
          </motion.h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="peer appearance-none w-full px-3 py-2 pr-8 rounded-md bg-white border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="user">Standard User</option>
              </select>
            </div>
          </div>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUser className="mr-2" /> Name
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" /> Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUserShield className="mr-2" /> Role & Status
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                              {user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Joined{" "}
                                {new Date(
                                  user.created_at
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isBlocked
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-end gap-1">
                            {user.role === "user" && (
                              <>
                                {/* View Orders */}
                                <Link
                                  to={`/admin/user-orders/${user.id}`}
                                  className="p-2 rounded-full text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors duration-200"
                                  title="View Orders"
                                >
                                  <FaEye />
                                </Link>

                                {/* Block / Unblock */}
                                <button
                                  className={`p-2 rounded-full transition-colors duration-200 ${
                                    user.isBlocked
                                      ? "text-green-600 hover:text-green-900 hover:bg-green-50"
                                      : "text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50"
                                  } ${
                                    updatingStatusId === user.id
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleBlockUnblock(user.id, user.isBlocked)
                                  }
                                  disabled={updatingStatusId === user.id}
                                  aria-label={
                                    user.isBlocked ? "Unblock" : "Block"
                                  }
                                >
                                  {updatingStatusId === user.id ? (
                                    <span className="animate-pulse">
                                      {user.isBlocked ? (
                                        <FaUnlock />
                                      ) : (
                                        <FaLock />
                                      )}
                                    </span>
                                  ) : user.isBlocked ? (
                                    <FaUnlock />
                                  ) : (
                                    <FaLock />
                                  )}
                                </button>

                                {/* Delete */}
                                <button
                                  className={`text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors duration-200 ${
                                    deletingId === user.id
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  onClick={() => handleDelete(user.id)}
                                  disabled={deletingId === user.id}
                                  aria-label="Delete user"
                                >
                                  {deletingId === user.id ? (
                                    <span className="animate-pulse">
                                      <FaTrash />
                                    </span>
                                  ) : (
                                    <FaTrash />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr>
                      <td colSpan="4" className="text-center py-10">
                        No users found.
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ManageUsers;
