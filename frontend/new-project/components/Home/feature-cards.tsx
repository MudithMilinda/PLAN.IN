"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Calendar, Target, TrendingUp } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Enter Event Details",
      desc: "Add your event information — platform creates tailored campaign instantly.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Get AI Marketing Plan",
      desc: "Get a platform creates a fully designed personalized AI guided by setting up your campaigns.",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Target & Promote Smartly",
      desc: "We analyze the data and create campaigns to the potential lead to sell more tickets and maximize reach.",
    },
  ];

  // ultra-smooth scroll popup animation
  const cardVariants: Variants = {
    offscreen: {
      opacity: 0,
      y: 60,
      scale: 0.92,
    },
    onscreen: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.9,
        bounce: 0.22,
      },
    },
  };

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3 }} // triggers every scroll, not only once
      transition={{ staggerChildren: 0.18 }}
      className="relative z-10 mx-auto mt-16 grid max-w-6xl gap-6 px-8 md:grid-cols-3"
    >
      {features.map((feature, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="group cursor-pointer rounded-2xl border border-[#3f6d96]/35 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-[#6fa8d1]/65 hover:bg-[#0f2236]/75"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 16px 30px rgba(68, 126, 171, 0.35)",
          }}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2f6ea8]/25 text-[#a5d0ec] transition duration-300 group-hover:bg-[#3f8ab5]/35 group-hover:text-[#d4e9f8]">
            {feature.icon}
          </div>
          <h3 className="mb-3 text-xl font-semibold text-white">
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            {feature.desc}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
