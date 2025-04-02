/**
 * Footer component for displaying a website's footer section.
 *
 * This component displays a copyright notice along with social media icons linked to various platforms. It is designed
 * to be visually distinct, centered, and responsive to different screen sizes. The footer includes icons for Facebook,
 * Twitter, Instagram, YouTube, and LinkedIn, each linked to placeholder URLs.
 *
 * Key Features:
 * - Displays the current year dynamically in the copyright notice.
 * - Includes social media icons with links to platforms like Facebook, Twitter, Instagram, YouTube, and LinkedIn.
 * - Responsive design with centered content for the footer.
 *
 * Usage:
 * ```
 * <Footer />
 * ```
 *
 * @returns {JSX.Element} The rendered Footer component.
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-tertiary font-secondary text-gray-500 py-4 text-center">
      <div className="container mx-auto px-6">
        <p>&copy; {new Date().getFullYear()} Musicalyzer. All rights reserved.</p>
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
