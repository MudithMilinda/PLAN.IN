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
    <div className="/* SOLID background only */ overflow-hidden rounded-3xl bg-[#020812] py-12">
      {/* Title */}
      <h2 className="mb-12 text-center text-xl font-semibold text-gray-200">
        Follow Us on Social Media
      </h2>

      {/* Icons */}
      <div className="flex justify-center gap-16">
        <FaFacebookF className="text-4xl text-gray-300 transition-all duration-300 hover:text-white" />
        <FaInstagram className="text-4xl text-gray-300 transition-all duration-300 hover:text-white" />
        <FaTwitter className="text-4xl text-gray-300 transition-all duration-300 hover:text-white" />
        <FaLinkedinIn className="text-4xl text-gray-300 transition-all duration-300 hover:text-white" />
        <FaYoutube className="text-4xl text-gray-300 transition-all duration-300 hover:text-white" />
      </div>
    </div>
  );
}
