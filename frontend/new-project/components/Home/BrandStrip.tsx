"use client";

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function SocialStrip() {
  return (
    <div
      className="
        py-12 
        rounded-3xl 
        overflow-hidden
        bg-[#050020]     /* SOLID background only */
      "
    >
      {/* Title */}
      <h2 className="text-center text-gray-200 text-xl font-semibold mb-12">
        Follow Us on Social Media
      </h2>

      {/* Icons */}
      <div className="flex justify-center gap-16">
        <FaFacebookF className="text-gray-300 text-4xl hover:text-white transition-all duration-300" />
        <FaInstagram className="text-gray-300 text-4xl hover:text-white transition-all duration-300" />
        <FaTwitter className="text-gray-300 text-4xl hover:text-white transition-all duration-300" />
        <FaLinkedinIn className="text-gray-300 text-4xl hover:text-white transition-all duration-300" />
        <FaYoutube className="text-gray-300 text-4xl hover:text-white transition-all duration-300" />
      </div>
    </div>
  );
}
