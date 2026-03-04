import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function AppLayout({ children, title }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1220] text-[#f1f5f9]">
      <Navbar />

      <main className={`pt-28 px-8 pb-8 transition-opacity duration-200 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;