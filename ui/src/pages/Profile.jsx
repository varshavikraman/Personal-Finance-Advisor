import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser, loading, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (user) setName(user.name);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/editProfile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Name: name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to update profile");

      toast.success("Profile updated successfully!");

      setUser(prev => ({ ...prev, name }));

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) {
    return (
      <div className="text-center text-2xl font-semibold text-gray-500 mt-10">
        <p>You need to log in</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex-1 border border-gray-300 p-4 md:p-8 rounded-lg shadow-md">
      <h3 className="text-2xl text-yellow-600 font-semibold text-center">Profile</h3>

      <div className="flex justify-center my-4">
        <svg className="w-20 h-20 text-gray-800 rounded-full bg-yellow-50 p-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block font-medium mb-1">Name:</label>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email:</label>
          <input
            type="email"
            className="border border-gray-300 p-2 rounded w-full"
            value={user.email}
            disabled
          />
        </div>

        <div className="flex justify-center space-x-10 pt-2">
          {!isEditing ? (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-blue-400 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-green-400 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Save
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
