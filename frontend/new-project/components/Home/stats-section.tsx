'use client';

import React from 'react';

export default function StatsSection() {
  const stats = [
    { number: "10X", label: "Faster Event Promotion" },
    { number: "90%", label: "Better Audience Targeting" },
    { number: "1,000+", label: "Marketing Plans Generated" }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto px-8 py-40">
      {stats.map((stat, i) => (
        <div key={i} className="text-center text-white">
          <div
            className="text-5xl font-bold mb-2 bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(to right, #ffffff, #ffffff)' }}
          >
            {stat.number}
          </div>
          <div className="text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
