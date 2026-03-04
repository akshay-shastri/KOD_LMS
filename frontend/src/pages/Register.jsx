import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#020617] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Soft ambient glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full -top-40 -right-40"></div>

      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 shadow-2xl">

        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            Create Account
          </h1>
          <p className="text-sm text-gray-400">
            Start your learning journey today.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your full name"
              className="
                w-full rounded-lg px-4 py-3 text-white placeholder-gray-500
                bg-white/5 border border-white/10
                transition-all duration-200
                hover:bg-white/10 hover:border-white/20 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="
                w-full rounded-lg px-4 py-3 text-white placeholder-gray-500
                bg-white/5 border border-white/10
                transition-all duration-200
                hover:bg-white/10 hover:border-white/20 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="
                  w-full rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500
                  bg-white/5 border border-white/10
                  transition-all duration-200
                  hover:bg-white/10 hover:border-white/20 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  // Eye Off
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 1l22 22M17.94 17.94A10.9 10.9 0 0112 20c-5 0-9-8-9-8a18.6 18.6 0 014.21-5.94" />
                  </svg>
                ) : (
                  // Eye
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="
                w-full rounded-lg px-4 py-3 text-white
                bg-white/5 border border-white/10
                transition-all duration-200
                hover:bg-white/10 hover:border-white/20 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40
              "
            >
              <option value="student" className="bg-[#0f172a]">Student</option>
              <option value="admin" className="bg-[#0f172a]">Admin</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg
              transition-all duration-200
              shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5
              disabled:opacity-60 cursor-pointer
            "
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <div className="mt-8 text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;