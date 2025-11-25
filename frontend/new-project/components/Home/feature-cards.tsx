'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Calendar, Target, TrendingUp } from 'lucide-react';

export default function FeatureCards() {
  const features = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Enter Event Details",
      desc: "Add your event information — platform creates tailored campaign instantly."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Get AI Marketing Plan",
      desc: "Get a platform creates a fully designed personalized AI guided by setting up your campaigns."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Target & Promote Smartly",
      desc: "We analyze the data and create campaigns to the potential lead to sell more tickets and maximize reach."
    }
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

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3 }}   // triggers every scroll, not only once
      transition={{ staggerChildren: 0.18 }}
      className="relative z-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-16 px-8"
    >
      {features.map((feature, i) => (
        <motion.div
          key={i}
          variants={cardVariants}
          className="bg-white/5 backdrop-blur-sm border rounded-2xl p-8 hover:bg-white/10 transition duration-300 cursor-pointer"
          style={{ borderColor: 'rgba(244, 160, 255, 0.2)' }}
          whileHover={{ scale: 1.05, boxShadow: '0 15px 25px rgba(244, 160, 255, 0.3)' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(244, 160, 255, 0.5)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(244, 160, 255, 0.2)'}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto" 
            style={{ backgroundColor: 'rgba(244, 160, 255, 0.2)' }}
          >
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
