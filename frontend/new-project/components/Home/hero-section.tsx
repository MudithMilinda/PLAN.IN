'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundLines } from "@/components/ui/background-lines";


export default function HeroSection() {
  return (
    <div
      id="home"
      className="relative min-h-[calc(100vh-80px)] pt-64 bg-gradient-to-b from-[#0a0e27] via-[#0d1235] to-[#0a0e27]"
    >
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 pb-20 bg-transparent">
        
        <motion.div
          className="relative text-center w-full max-w-7xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative z-20 mb-16">
            <motion.p
              className="mb-3 text-xs tracking-widest uppercase text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to PLAN.IN
            </motion.p>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Promote Your Events<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reach the Right Audience Instantly
              </span>
            </motion.h1>

            <motion.p
              className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              An all-in-one platform for content creators to manage, analyze,
              and optimize their digital presence across all channels.
            </motion.p>

            
          </div>

          {/* Dashboard Preview */}
          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-purple-500/20 blur-3xl scale-110 rounded-full" />

            <div className="relative bg-gradient-to-br from-[#2D2350] to-[#1a0f3d] rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Dashboard</span>
                  <span>Analytics</span>
                  <span>Reports</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
                  <div className="text-3xl font-bold text-white mb-2">$7.25k</div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                  <div className="mt-4 h-16 bg-blue-500/10 rounded-lg" />
                </div>

                <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 rounded-xl p-6 border border-cyan-500/30">
                  <div className="text-3xl font-bold text-white mb-2">50%</div>
                  <div className="text-sm text-gray-400">Engagement Rate</div>
                  <div className="mt-4 w-20 h-20 rounded-full border-8 border-cyan-500 border-t-transparent mx-auto" />
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="text-3xl font-bold text-white mb-2">12.3k</div>
                  <div className="text-sm text-gray-400">Total Views</div>
                  <div className="mt-4 h-16 bg-purple-500/10 rounded-lg" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </BackgroundLines>
    </div>
  );
}
