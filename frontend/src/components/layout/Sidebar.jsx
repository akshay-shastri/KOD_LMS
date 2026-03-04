import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItem = (label, path) => {
    const isActive = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full text-left px-4 py-2 rounded-md transition ${
          isActive
            ? "bg-white/10 text-white"
            : "text-[#94a3b8] hover:bg-white/5 hover:text-white"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 backdrop-blur-md bg-white/5 border-r border-white/10 p-6 flex flex-col justify-between">

      <div>
        <h2 className="text-lg font-semibold tracking-tight mb-10">
          LMS
        </h2>

        <nav className="space-y-2 text-sm">
          {navItem("Dashboard", "/")}
        </nav>
      </div>

      <div className="text-sm text-[#94a3b8]">
        Professional LMS
      </div>

    </aside>
  );
}

export default Sidebar;