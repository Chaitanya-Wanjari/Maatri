import { useState, useEffect } from "react";
import { navItems } from "../constants";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.replace("#", ""));
      let current = "";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop - 120; // offset for sticky navbar
          if (window.scrollY >= top) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="bg-[#F7E0B2] shadow font-sans py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 md:px-16">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <img
            src="/src/assets/logo.jpeg"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="text-2xl font-serif text-[#4B1D3F]">Maatri</span>
        </div>

        {/* Dynamic Nav Links */}
        <ul className="hidden md:flex space-x-8 text-[#4B1D3F]/80 font-medium">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className={`transition ${
                  activeSection === item.href.replace("#", "")
                    ? "text-[#4B1D3F] font-semibold"
                    : "hover:text-[#4B1D3F]"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Login & Signup Buttons */}
        <div className="hidden md:flex space-x-4">
          <a
            href="/login"
            className="bg-transparent border border-[#4B1D3F] text-[#4B1D3F] py-2 px-5 rounded-full shadow-md hover:bg-[#4B1D3F] hover:text-[#F7E0B2] transition font-serif"
          >
            Login
          </a>
          <a
            href="/signup"
            className="bg-[#4B1D3F] text-[#F7E0B2] py-2 px-5 rounded-full shadow-md hover:bg-[#6A2A5B] transition font-serif"
          >
            Signup
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

