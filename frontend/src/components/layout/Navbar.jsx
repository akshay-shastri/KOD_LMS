import { NavLink } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Courses", path: "/courses" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#111827] border-b border-[#1f2937] px-8">
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between">
        
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            KODLMS
          </h1>
          
          <div className="flex items-center gap-6">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-colors duration-200 ease-out ${
                    isActive
                      ? "text-blue-400 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-blue-500 after:rounded-full after:transition-all after:duration-200"
                      : "text-[#94a3b8] hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <ProfileDropdown />
      </div>
    </nav>
  );
}

export default Navbar;
