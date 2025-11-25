'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AboutSection() {
  const containerVariants: Variants = {
    offscreen: {},
    onscreen: { transition: { staggerChildren: 0.2 } }
  };

  const fadeUpVariants: Variants = {
    offscreen: { opacity: 0, y: 40 },
    onscreen: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.25, duration: 0.9 } }
  };

  // Chart data
  const data = {
    labels: ['UstaAly', 'Others'],
    datasets: [
      {
        label: 'Marketing Impact',
        data: [90, 40],
        backgroundColor: ['#9F7AEA', '#4A5568'], // purple & gray
        borderRadius: 6,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, color: '#CBD5E0' },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: { color: '#CBD5E0' },
        grid: { display: false }
      }
    }
  };

  return (
    <motion.div
      id="about"
      className="px-8 py-20 max-w-6xl mx-auto"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left side */}
        <motion.div variants={fadeUpVariants}>
          <h2 className="text-4xl font-bold mb-8">Who we are?</h2>

          {/* Chart */}
          <motion.div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8" variants={fadeUpVariants}>
            <Bar data={data} options={options} height={250} />
          </motion.div>
        </motion.div>

        {/* Right side */}
        <motion.div className="space-y-6" variants={fadeUpVariants}>
          <div className="space-y-6">
            <div>
              <div className="text-4xl font-bold">2+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold">500K+</div>
              <div className="text-gray-400">Attendees Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold">8K+</div>
              <div className="text-gray-400">Events Supported</div>
            </div>
          </div>

          <motion.p className="text-gray-400 leading-relaxed" variants={fadeUpVariants}>
            We are an AI-powered event marketing platform designed to help organizers promote their events smarter and
            faster. Our system builds personalized marketing plans, analyzes your audience, and recommends the best
            communities and channels to reach them—making event promotion simple, efficient, and data-driven.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
