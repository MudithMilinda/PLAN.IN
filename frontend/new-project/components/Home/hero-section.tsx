"use client";

import React from "react";
import { motion } from "framer-motion";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function HeroSection() {
  return (
    <div
      id="home"
      className="relative min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0a0e27] via-[#0d1235] to-[#0a0e27] pt-64"
    >
      <BackgroundLines className="flex w-full flex-col items-center justify-center bg-transparent px-4 pb-20">
        <motion.div
          className="relative w-full max-w-7xl text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative z-20 mb-16">
            <motion.p
              className="mb-3 text-xs tracking-widest text-gray-400 uppercase"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Welcome to PLAN.IN
            </motion.p>

            <motion.h1
              className="mb-6 text-5xl leading-tight font-bold text-white md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Promote Your Events
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reach the Right Audience Instantly
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg"
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
            className="relative mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <div className="absolute inset-0 scale-110 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#2D2350] to-[#1a0f3d] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Dashboard</span>
                  <span>Analytics</span>
                  <span>Reports</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6">
                  <div className="mb-2 text-3xl font-bold text-white">
                    $7.25k
                  </div>
                  <div className="text-sm text-gray-400">Total Revenue</div>
                  <div className="mt-4 h-16 rounded-lg bg-blue-500/10" />
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 p-6">
                  <div className="mb-2 text-3xl font-bold text-white">50%</div>
                  <div className="text-sm text-gray-400">Engagement Rate</div>
                  <div className="mx-auto mt-4 h-20 w-20 rounded-full border-8 border-cyan-500 border-t-transparent" />
                </div>

                <div className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6">
                  <div className="mb-2 text-3xl font-bold text-white">
                    12.3k
                  </div>
                  <div className="text-sm text-gray-400">Total Views</div>
                  <div className="mt-4 h-16 rounded-lg bg-purple-500/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </BackgroundLines>
    </div>
  );
}
