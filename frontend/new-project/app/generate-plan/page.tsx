"use client";
//auth + routing

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "../../components/layout/Sidebar";
import { EventForm } from "../../components/generate-plan/EventForm";
import { MarketingPlanDisplay } from "../../components/generate-plan/MarketingPlanDisplay";
import { ApiResult } from "../../types/marketing";

export default function EventFormPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [result, setResult] = useState<ApiResult | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <SidebarDemo>
      {result ? (
        <MarketingPlanDisplay
          plan={result.marketingPlan}
          event={result.event}
          onBack={() => setResult(null)}
        />
      ) : (
        <EventForm userId={user?.id} onSuccess={setResult} />
      )}
    </SidebarDemo>
  );
}
