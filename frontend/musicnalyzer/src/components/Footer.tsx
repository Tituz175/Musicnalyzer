import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-tertiary font-secondary text-gray-500 py-4 text-center h-20">
      <div className="container mx-auto px-6">
        <p>
          &copy; {new Date().getFullYear()} Musicalyzer. All rights reserved.
        </p>
        <div className="flex justify-center mt-2">
          <a href="#" className="mr-2">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="mr-2">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="mr-2">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="mr-2">
            <i className="fab fa-youtube"></i>
          </a>
          <a href="#" className="mr-2">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}