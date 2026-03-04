import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ProfileDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/profile");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUser();
  }, []);

  const getInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-bold hover:bg-[#2563eb] transition-all duration-200 ease-out overflow-hidden"
      >
        {getInitial()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-[#111827] border border-[#1f2937] rounded-xl shadow-xl overflow-hidden transition-all duration-200 ease-out">
          <div className="px-4 py-3 border-b border-[#1f2937]">
            <p className="text-sm font-semibold text-[#e2e8f0]">{user?.name || "User"}</p>
            <p className="text-xs text-[#94a3b8]">{user?.email || "user@example.com"}</p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/settings");
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-[#e2e8f0] hover:bg-[#1f2937] transition-all duration-200 ease-out"
            >
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-[#ef4444] hover:bg-[#1f2937] transition-all duration-200 ease-out"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
