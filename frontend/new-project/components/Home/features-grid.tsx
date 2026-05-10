"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Users,
  Target,
  Shield,
  BarChart3,
  MessageSquare,
  Award,
} from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "AI Content Generation",
      desc: "Generate high-quality event content. Instantly create compelling text and complete marketing materials.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Smart Audience Discovery",
      desc: "AI identifies your ideal audience and generates targeting strategies that maximize reach and ticket sales.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Engagement Prediction",
      desc: "Our platform predicts which post have the best engagement rate and when to post them.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Community Insights",
      desc: "Analyze social media data to understand where your audience congregates and engage them.",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Multi-Channel Strategy",
      desc: "The platform lets you simultaneous for social media, email marketing and paid ads.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Performance Tracking",
      desc: "Monitor campaign performance and get actionable insights for better ticket sale.",
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
    <div id="services" className="mx-auto max-w-6xl px-8 py-20">
      {/* Animated Heading */}
      <motion.h2
        className="mb-4 text-center text-4xl font-bold text-white md:text-5xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Everything You Need to Fill
        <br />
        Every Seat
      </motion.h2>

      {/* Animated Subheading */}
      <motion.p
        className="mx-auto mb-16 max-w-2xl text-center text-gray-400"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Powerful AI tools that transform how you promote events, find audiences,
        and drive registrations.
      </motion.p>

      {/* parent stagger container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        viewport={{ amount: 0.3 }} // animates EVERY time user scrolls
        className="grid gap-6 md:grid-cols-3"
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-[#5d98c6]/55 hover:bg-[#0f2236]/70"
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#2f6ea8]/20 text-[#8fc3e6] transition duration-300 group-hover:bg-[#3a7eb2]/30 group-hover:text-[#d3e9f8]">
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
    </div>
  );
}
