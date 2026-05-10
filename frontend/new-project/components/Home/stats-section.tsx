"use client";

import React, { useEffect, useState } from "react";

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return count;
}

export default function StatsSection() {
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const animatedFaster = useCountUp(10, 1200);
  const animatedAudience = useCountUp(90, 1200);
  const animatedEvents = useCountUp(totalEvents, 1200);

  useEffect(() => {
    async function fetchEventCount() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/count`,
        );
        const data = await res.json();
        if (data.count !== undefined) {
          setTotalEvents(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch event count:", error);
        setTotalEvents(0);
      } finally {
        setLoading(false);
      }
    }
    fetchEventCount();
  }, []);

  const stats = [
    { number: `${animatedFaster}X`, label: "Faster Event Promotion" },
    { number: `${animatedAudience}%`, label: "Better Audience Targeting" },
    {
      number: loading ? "..." : animatedEvents.toLocaleString(),
      label: "Marketing Plans Generated",
    },
  ];

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-8 py-40 md:grid-cols-3">
      {stats.map((stat, i) => (
        <div key={i} className="text-center text-white">
          <div
            className="mb-2 bg-clip-text text-5xl font-bold text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ffffff, #ffffff)",
            }}
          >
            {stat.number}
          </div>
          <div className="text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
