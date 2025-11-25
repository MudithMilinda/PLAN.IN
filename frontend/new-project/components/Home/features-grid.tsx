'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Users, Target, Shield, BarChart3, MessageSquare, Award } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    { icon: <Users className="w-8 h-8" />, title: "AI Content Generation", desc: "Generate high-quality event content. Instantly create compelling text and complete marketing materials." },
    { icon: <Target className="w-8 h-8" />, title: "Smart Audience Discovery", desc: "AI identifies your ideal audience and generates targeting strategies that maximize reach and ticket sales." },
    { icon: <Shield className="w-8 h-8" />, title: "Engagement Prediction", desc: "Our platform predicts which post have the best engagement rate and when to post them." },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Community Insights", desc: "Analyze social media data to understand where your audience congregates and engage them." },
    { icon: <MessageSquare className="w-8 h-8" />, title: "Multi-Channel Strategy", desc: "The platform lets you simultaneous for social media, email marketing and paid ads." },
    { icon: <Award className="w-8 h-8" />, title: "Performance Tracking", desc: "Monitor campaign performance and get actionable insights for better ticket sale." }
  ];

  // ultra-smooth scroll popup animation
  const cardVariants: Variants = {
    offscreen: { 
      opacity: 0,
      y: 60,
      scale: 0.92
    },
    onscreen: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.9,
        bounce: 0.22
      }
    }
  };

  // heading animation variant
  const headingVariants: Variants = {
    offscreen: { opacity: 0, y: 40 },
    onscreen: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', bounce: 0.25, duration: 1 } 
    }
  };

  return (
    <div id="services" className="px-8 py-20 max-w-6xl mx-auto">
      {/* Animated Heading */}
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-4 text-white"
        initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
      >
        Everything You Need to Fill<br />Every Seat
      </motion.h2>

      {/* Animated Subheading */}
      <motion.p
        className="text-gray-400 text-center mb-16 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
      >
        Powerful AI tools that transform how you promote events, find audiences, and drive registrations.
      </motion.p>

      {/* parent stagger container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
        viewport={{ amount: 0.3 }}   // animates EVERY time user scrolls
        className="grid md:grid-cols-3 gap-6"
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition duration-300 cursor-pointer hover:bg-white/10 hover:border-purple-500/50"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-purple-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
