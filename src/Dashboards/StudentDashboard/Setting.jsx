import React, { useState } from 'react';

const Settings = () => {
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: true,
    inApp: true,
  });

  const handleVisibilityChange = (event) => {
    setProfileVisibility(event.target.value);
  };

  const toggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>

      {/* Profile Management Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Profile Management</h3>
        <p className="text-gray-600 mb-2">Update your profile information or delete your account.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4">
          Update Profile
        </button>
        <div className="mt-3">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Delete Profile
          </button>
        </div>
      </div>

      {/* Privacy Settings Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Privacy Settings</h3>
        <p className="text-gray-600 mb-2">Control who can view your profile information.</p>
        <select
          value={profileVisibility}
          onChange={handleVisibilityChange}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="public">Public</option>
          <option value="companies">Visible to Companies Only</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Notification Preferences Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700">Notification Preferences</h3>
        <p className="text-gray-600 mb-2">Manage your notification settings for different channels.</p>
        <div className="flex items-center justify-between py-2 border-b">
          <span>WhatsApp Notifications</span>
          <button
            onClick={() => toggleNotification("whatsapp")}
            className={`px-3 py-1 rounded ${notifications.whatsapp ? "bg-green-500" : "bg-gray-300"} text-white`}
          >
            {notifications.whatsapp ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <span>Email Notifications</span>
          <button
            onClick={() => toggleNotification("email")}
            className={`px-3 py-1 rounded ${notifications.email ? "bg-green-500" : "bg-gray-300"} text-white`}
          >
            {notifications.email ? "Enabled" : "Disabled"}
          </button>
        </div>
        <div className="flex items-center justify-between py-2">
          <span>In-App Notifications</span>
          <button
            onClick={() => toggleNotification("inApp")}
            className={`px-3 py-1 rounded ${notifications.inApp ? "bg-green-500" : "bg-gray-300"} text-white`}
          >
            {notifications.inApp ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
