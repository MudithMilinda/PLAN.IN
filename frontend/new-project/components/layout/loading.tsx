"use client";

import React, { useState, useEffect } from "react";
import { Rocket } from "lucide-react";

export default function LoadingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0520]">
      <div className="flex flex-col items-center">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2 mb-4">
          <Rocket className="text-[#906ae2] w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-white text-2xl md:text-3xl font-extrabold tracking-wider">
            PLAN.IN
          </h1>
        </div>

        {/* Dots Animation */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#906ae2] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2.5 h-2.5 bg-[#6A2EEF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2.5 h-2.5 bg-[#906ae2] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          <div className="w-2.5 h-2.5 bg-[#6A2EEF] rounded-full animate-bounce" style={{ animationDelay: "450ms" }}></div>
        </div>
      </div>
    </div>
  );
}
