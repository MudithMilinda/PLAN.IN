"use client";

import React from "react";

export default function StatsSection() {
  const stats = [
    { number: "10X", label: "Faster Event Promotion" },
    { number: "90%", label: "Better Audience Targeting" },
    { number: "1,000+", label: "Marketing Plans Generated" },
  ];

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-8 py-40 md:grid-cols-3">
      {stats.map((stat, i) => (
        <div key={i} className="text-center text-white">
          <div
            className="mb-2 bg-clip-text text-5xl font-bold text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ffffff, #ffffff)",
            }}
          >
            {stat.number}
          </div>
          <div className="text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
