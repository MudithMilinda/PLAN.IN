// components/BrandStrip.tsx

"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BrandStrip() {
  const socials = [
    {
      src: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
      alt: "Facebook",
      className: "h-8",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/733/733558.png",
      alt: "Instagram",
      className: "h-8",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
      alt: "YouTube",
      className: "h-8",
    },
    {
      src: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
      alt: "Twitter",
      className: "h-8",
    },
  ];

  const combined = [...socials, ...socials, ...socials]; // looping scroll effect

  return (
    <motion.div
      className="mt-24 max-w-full overflow-hidden py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <p className="text-center text-base text-gray-300 mb-12 tracking-wide">
        Connect with us on social media
      </p>

      {/* Auto Scrolling Strip */}
      <div className="relative w-full flex overflow-hidden">
        <motion.div
          className="flex gap-32 min-w-full px-8"
          animate={{ x: [0, -1500] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20,
          }}
        >
          {combined.map((item, index) => (
            <motion.div
              key={index}
              className="shrink-0 flex flex-col items-center justify-center gap-4"
              whileHover={{ scale: 1.15, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-5 bg-purple-500/10 rounded-full hover:bg-purple-500/20 transition-all duration-300 border border-purple-500/20">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-14 w-14 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{item.alt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
