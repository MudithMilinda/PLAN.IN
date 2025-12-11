"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "I've used other kits, but this one is the best. The attention to detail and usability are truly amazing for all designers. I highly recommend it for any type of project.",
    name: "Dazzle Healer",
    title: "Front End Developer",
    avatar: "👩🏽",
    color: "bg-gradient-to-br from-orange-500 to-pink-500",
  },
  {
    quote:
      "This UI Kit is incredibly helpful for my designs. The components and illustrations are clean, modern, and versatile. It's perfect for beginners and professionals alike.",
    name: "Crystal Maiden",
    title: "UI/UX Designer",
    avatar: "👩🏻",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    quote:
      "This UI Kit saved me hours of work. It's intuitive, high-quality, and totally worth the price for all design needs. My projects look more professional and appealing now.",
    name: "Mirana Marci",
    title: "3D Designer",
    avatar: "👩🏻",
    color: "bg-gradient-to-br from-green-500 to-emerald-500",
  },
  {
    quote:
      "Amazing work! The color schemes are vibrant, and the icons fit perfectly with all my projects, especially modern UI designs. It makes everything look polished and user-friendly instantly.",
    name: "Bimosaurus",
    title: "Graphic Designer",
    avatar: "👨🏻",
    color: "bg-gradient-to-br from-purple-500 to-indigo-500",
  },
];

export default function ClientFeedback() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: "#050020" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-blue-400 font-semibold text-lg mb-2">
            Client Feedback
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            What They Say After Using Our Product
          </h1>
        </div>

        {/* Testimonials */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition duration-300 cursor-pointer"
              style={{
                borderColor: "rgba(244, 160, 255, 0.2)",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 25px rgba(244, 160, 255, 0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(244, 160, 255, 0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "rgba(244, 160, 255, 0.2)")
              }
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-orange-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 ${testimonial.color} rounded-full flex items-center justify-center text-2xl`}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-300 text-sm">{testimonial.title}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-200 leading-relaxed">
                {testimonial.quote}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
