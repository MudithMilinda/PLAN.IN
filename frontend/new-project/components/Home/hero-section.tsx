"use client";

import React from "react";
import { motion } from "framer-motion";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const particles = [
    "left-[8%] top-[22%]",
    "left-[18%] top-[78%]",
    "left-[30%] top-[14%]",
    "left-[38%] top-[66%]",
    "left-[52%] top-[28%]",
    "left-[61%] top-[81%]",
    "left-[73%] top-[19%]",
    "left-[84%] top-[72%]",
    "left-[91%] top-[40%]",
    "left-[12%] top-[55%]",
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#020812] px-5 py-40 text-center md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#21486f_0%,#0a1f34_33%,#020812_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,8,18,0)_0%,#020812_72%)]" />
      <div className="pointer-events-none absolute top-[-20%] left-1/2 h-[540px] w-[760px] -translate-x-1/2 rounded-full bg-[#4d88bf]/20 blur-[130px]" />

      {particles.map((position, index) => (
        <motion.div
          key={position}
          className={`pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-slate-300/45 ${position}`}
          animate={{ opacity: [0.25, 0.7, 0.25] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.p
          className="mb-3 text-xs tracking-widest text-gray-400 uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to PLAN.IN
        </motion.p>

        <motion.p
          className="mx-auto mb-6 max-w-4xl text-3xl leading-tight font-semibold tracking-[-0.02em] text-balance text-white/85 md:text-5xl md:leading-[1.08] lg:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Promote Your Events <br />
          Reach the Right Audience Instantly
        </motion.p>

        <motion.h1
          className="mx-auto mb-10 max-w-4xl text-base leading-relaxed text-pretty text-slate-300/80 md:text-lg"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          An all-in-one platform for content creators to manage, analyze, and
          optimize their digital presence across all channels.
        </motion.h1>

        <motion.div
          className="flex flex-col items-center justify-center gap-7"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <SignedIn>
            <button
              onClick={() => router.push("/generate-plan")}
              className="rounded-full border border-[#3f5f84]/70 bg-[#040d19]/80 px-7 py-3 text-sm font-medium tracking-[0.01em] text-slate-200 shadow-[0_0_0_1px_rgba(126,170,212,0.15),0_8px_32px_rgba(8,33,57,0.55)] transition hover:border-[#79a1c7] hover:text-white"
            >
              Build Your Marketing Plan Now
            </button>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-full border border-[#3f5f84]/70 bg-[#040d19]/80 px-7 py-3 text-sm font-medium tracking-[0.01em] text-slate-200 shadow-[0_0_0_1px_rgba(126,170,212,0.15),0_8px_32px_rgba(8,33,57,0.55)] transition hover:border-[#79a1c7] hover:text-white">
                Build Your Marketing Plan Now
              </button>
            </SignInButton>
          </SignedOut>

          <motion.div
            className="text-slate-300/70"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-base">Learn more</p>
            <p className="mt-1 text-xl">↓</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
