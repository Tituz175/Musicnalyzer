/**
 * RootLayout component to structure the global layout of the application.
 *
 * This component is used to define the HTML structure, meta information, and
 * global font styles for the application. It includes a navigation bar at the top,
 * a footer at the bottom, and displays the page's main content between these sections.
 *
 * Metadata:
 * - `metadata.title` (string): The title of the application, used in the HTML document's title.
 * - `metadata.description` (string): A description of the application, used in the meta tag.
 *
 * Fonts:
 * - Raleway: A sans-serif font loaded with various weights, applied globally via a CSS variable.
 * - Merriweather: A serif font loaded with various weights, applied globally via a CSS variable.
 *
 * Dependencies:
 * - `next/font/google`: Google Fonts utility for loading Raleway and Merriweather fonts.
 * - `NavBar`: Custom navigation bar component, displayed at the top of the layout.
 * - `Footer`: Custom footer component, displayed at the bottom of the layout.
 *
 * Props:
 * - `children` (React.ReactNode): The main content to display within the layout.
 *
 * Usage:
 * ```
 * <RootLayout>
 *   <Component />
 * </RootLayout>
 * ```
 *
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The main content to be rendered within the layout.
 * @returns {JSX.Element} Rendered RootLayout component.
 */

import type { Metadata } from "next";
import { Raleway, Merriweather } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-raleway",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriwether",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={`${metadata.description}`} />
        <title>{`${metadata.title}`}</title>
      </head>
      <body className={`${raleway.variable} ${merriweather.variable} font-primary`}>
        {/* Ensure the flex container takes the full height of the screen */}
        <div className="flex flex-col min-h-screen">
          <NavBar />
          
          {/* Content that will grow and push the footer down if needed */}
          <main className="flex-grow">{children}</main>

          {/* Footer stays at the bottom of the page, not the screen */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
