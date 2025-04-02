"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "FAQ", path: "/faq" },
];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (path: string) => {
    router.push(path);
    setMenuOpen(false); // Close menu after clicking a link
  };

  // Check if the current page is either Upload or Analyze
  const isAnalyzePage = pathname === "/analyze";
  const isUploadPage = pathname === "/upload";

  return (
    <nav className="bg-secondary font-secondary flex items-center justify-between h-20 px-6 sm:px-6 w-full md:px-20 lg:px-64 text-2xl font-semibold sticky top-0 z-30">
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-4xl font-extrabold">
          Musicalyzer
        </Link>
      </div>

      {/* Mobile Menu Toggle Button (☰ → ✖) */}
      <button
        className="md:hidden text-white text-3xl focus:outline-none z-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Navigation Links & Analyze Button */}
      <div
        className={`fixed inset-0 bg-secondary bg-opacity-95 flex flex-col items-center justify-center transition-all duration-300 md:static md:flex-row md:items-center md:gap-16 ${
          menuOpen ? "flex" : "hidden"
        } md:flex`}
      >
        <ul className="flex flex-col items-center md:flex-row gap-8 md:gap-16 p-6 md:p-0">
          {/* Render regular nav links (Home, About, FAQ) */}
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <button
                onClick={() => handleNavClick(item.path)}
                className={`nav-link text-xl md:text-2xl ${
                  pathname === item.path ? "text-accent font-bold" : "text-white"
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}

          {/* Conditionally render Upload link */}
          {isUploadPage && (
            <li className="nav-item">
              <button
                onClick={() => handleNavClick("/upload")}
                className={`nav-link text-xl md:text-2xl ${
                  pathname === "/upload" ? "text-accent font-bold" : "text-white"
                }`}
              >
                Upload
              </button>
            </li>
          )}

          {/* Conditionally render Analyze link */}
          {isAnalyzePage && (
            <li className="nav-item">
              <button
                onClick={() => handleNavClick("/analyze")}
                className={`nav-link text-xl md:text-2xl ${
                  pathname === "/analyze" ? "text-accent font-bold" : "text-white"
                }`}
              >
                Analyze
              </button>
            </li>
          )}
        </ul>

        {/* Conditionally Render Analyze Button */}
        {!isAnalyzePage && !isUploadPage && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => handleNavClick("/upload")}
              className="bg-foreground text-white px-10 py-3 rounded-lg font-bold hover:bg-accent transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
            >
              Analyze
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
