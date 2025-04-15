/**
 * NavBar component for navigating between different pages in the application.
 *
 * This component provides a responsive navigation bar with links to various pages, including
 * "Home", "About", "FAQ", and conditional links to "Upload" and "Analyze" based on the current
 * page. It also includes a mobile-friendly hamburger menu for smaller screens.
 *
 * Props: None
 *
 * Functional Components:
 * - `handleNavClick`: Navigates to the specified page and closes the mobile menu after clicking a link.
 *
 * Key Features:
 * - Dynamically highlights the active navigation link based on the current page.
 * - Includes a hamburger menu for mobile devices, toggling between open and closed states.
 * - Conditionally renders "Upload" and "Analyze" links based on the current page.
 * - Uses Next.js `useRouter` and `usePathname` for navigation and current route tracking.
 *
 * Usage:
 * ```
 * <NavBar />
 * ```
 *
 * @returns {JSX.Element} The rendered NavBar component.
 */

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
    <nav className="
    sm:px-6 
    md:px-14 
    xl:px-32
    2xl:px-60
    w-full bg-secondary font-secondary flex items-center justify-between h-20 text-2xl font-semibold sticky top-0 z-30">
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link href="/" className="text-4xl font-extrabold">
          Musicalyzer
        </Link>
      </div>

      {/* Mobile Menu Toggle Button (☰ → ✖) */}
      <button
        className="lg:hidden text-white text-3xl focus:outline-none z-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Navigation Links & Analyze Button */}
      <div
        className={`fixed inset-0 bg-secondary bg-opacity-95 flex flex-col items-center justify-center transition-all duration-300 lg:static lg:flex-row lg:items-center lg:gap-16 ${
          menuOpen ? "flex" : "hidden"
        } lg:flex`}
      >
        <ul className="flex flex-col items-center lg:flex-row gap-8 lg:gap-16 p-6 lg:p-0">
          {/* Render regular nav links (Home, About, FAQ) */}
          {navItems.map((item) => (
            <li key={item.path} className="nav-item">
              <button
                onClick={() => handleNavClick(item.path)}
                className={`nav-link text-xl md:text-2xl ${
                  pathname === item.path ? "text-black font-bold" : "text-foreground"
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
                  pathname === "/upload" ? "text-black font-bold" : "text-foreground"
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
                  pathname === "/analyze" ? "text-black font-bold" : "text-foreground"
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
