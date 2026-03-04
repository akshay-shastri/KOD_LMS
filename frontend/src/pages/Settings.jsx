import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

function Settings() {
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    name: "",
    email: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/profile");
        setProfileData({
          name: response.data.name,
          email: response.data.email
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast("All password fields are required", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setIsUpdatingPassword(true);

      await api.post("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      showToast("Password updated successfully", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to update password",
        "error"
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <AppLayout title="Settings">
      <div className="max-w-[900px] mx-auto px-6">

        <div className="mb-14">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-[#e2e8f0]">
            Settings
          </h1>
          <p className="text-sm text-[#94a3b8]">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-8">

          {/* Profile Section */}
          <div className="bg-[#111827] rounded-2xl p-8 border border-[#1f2937]">
            <h2 className="text-xl font-semibold tracking-tight mb-6 text-[#e2e8f0]">
              Profile
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-2xl font-semibold">
                  {profileData.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <button className="text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-all duration-200 ease-out cursor-pointer">
                  Change Photo
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1f2937] border border-[#263043] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[#3b82f6] transition-all duration-200 ease-out"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 bg-[#0b1220] border border-[#263043] rounded-lg text-[#94a3b8] cursor-not-allowed"
                />
              </div>

              <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-[#111827] rounded-2xl p-8 border border-[#1f2937]">
            <h2 className="text-xl font-semibold tracking-tight mb-6 text-[#e2e8f0]">
              Security
            </h2>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1f2937] border border-[#263043] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[#3b82f6] transition-all duration-200 ease-out"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1f2937] border border-[#263043] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[#3b82f6] transition-all duration-200 ease-out"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e2e8f0] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1f2937] border border-[#263043] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-[#3b82f6] transition-all duration-200 ease-out"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isUpdatingPassword && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Appearance Section */}
          <div className="bg-[#111827] rounded-2xl p-8 border border-[#1f2937]">
            <h2 className="text-xl font-semibold tracking-tight mb-6 text-[#e2e8f0]">
              Appearance
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#e2e8f0] mb-1">
                  Dark Mode
                </p>
                <p className="text-xs text-[#94a3b8]">
                  Toggle between light and dark theme
                </p>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`relative w-14 h-7 rounded-full transition-all duration-200 ease-out cursor-pointer ${
                  isDarkMode ? "bg-[#3b82f6]" : "bg-[#1f2937]"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-200 ease-out ${
                    isDarkMode ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

export default Settings;
