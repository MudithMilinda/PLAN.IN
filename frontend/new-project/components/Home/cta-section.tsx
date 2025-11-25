'use client';

import React, { useState } from 'react';

export default function CTASection() {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <div className="px-8 py-20 text-center max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        So, what are you waiting for?
      </h2>
      <p className="text-gray-400 mb-8">
        Stay Updated with the Latest News, Tips, and Updates
      </p>
      <div className="flex gap-4 max-w-lg mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your mail"
          className="flex-1 px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full focus:outline-none focus:border-purple-500 transition"
        />
        <button
          onClick={handleSubscribe}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}