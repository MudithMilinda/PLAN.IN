"use client";

import React, { useState } from "react";

export default function CTASection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-8 py-20 text-center">
      <h2 className="mb-4 text-4xl font-bold md:text-5xl">
        So, what are you waiting for?
      </h2>
      <p className="mb-8 text-gray-400">
        Stay Updated with the Latest News, Tips, and Updates
      </p>
      <div className="mx-auto flex max-w-lg gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your mail"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm transition focus:border-[#4a86b8] focus:outline-none"
        />
        <button
          onClick={handleSubscribe}
          className="rounded-full bg-gradient-to-r from-[#2f6ea8] to-[#4ba3c7] px-8 py-4 font-medium transition hover:shadow-lg hover:shadow-[#2f6ea8]/35"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}
