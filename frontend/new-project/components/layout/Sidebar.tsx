// components/layout/Sidebar.tsx
"use client";

import React, { useState, ReactNode } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/aceternity-sidebar";
import {
  IconDashboard,       
  IconFilePlus,        
  IconCalendarEvent,   
  IconCalendar,        
  IconLogout
} from "@tabler/icons-react";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";

const LOGO_TEXT = "PLAN.IN";

interface SidebarDemoProps {
  children: ReactNode;
}

export function SidebarDemo({ children }: SidebarDemoProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(true);

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="h-5 w-5 text-white" /> },
    { label: "Generate Plan", href: "/generate-plan", icon: <IconFilePlus className="h-5 w-5 text-white" /> },
    { label: "My Events", href: "/my-events", icon: <IconCalendarEvent className="h-5 w-5 text-white" /> },
    { label: "Calendar", href: "/calendar", icon: <IconCalendar className="h-5 w-5 text-white" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#050020] text-white">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} className="shrink-0 transition-all duration-300">
        <div className="flex flex-col h-full bg-[#0c0536ba]">
          <SidebarBody className="flex flex-col justify-between gap-4 h-full">
            {/* Top section */}
            <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
              {/* Logo */}
              <div
                className={cn(
                  "flex items-center p-3",
                  open ? "justify-start" : "justify-center"
                )}
              >
                <button
                  className="focus:outline-none"
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle Sidebar"
                >
                  {open ? <Logo /> : <LogoIcon />}
                </button>
              </div>

              {/* Navigation links */}
              <div className="mt-6 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className="text-white hover:bg-[#3d3360] rounded-md transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* User Section */}
            <SignedIn>
              <div className="flex flex-col gap-2 p-3">
                <div
                  className={cn(
                    "py-2 rounded-md flex items-center transition-colors hover:bg-[#3d3360]",
                    open ? "px-3 justify-start" : "justify-center"
                  )}
                >
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8",
                        userButtonTrigger: "focus:shadow-none",
                      },
                    }}
                  />
                  {open && user && (
                    <p className="ml-2 text-sm font-medium truncate">
                      {user.fullName || user.primaryEmailAddress?.emailAddress || "User"}
                    </p>
                  )}
                </div>

                <SignOutButton>
                  <button
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors text-red-300 hover:bg-red-700/50",
                      open ? "w-full justify-start" : "justify-center w-full"
                    )}
                  >
                    <IconLogout className="h-5 w-5" />
                    {open && <span>Sign Out</span>}
                  </button>
                </SignOutButton>
              </div>
            </SignedIn>
          </SidebarBody>
        </div>
      </Sidebar>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

/* Logo when sidebar is open */
export const Logo = () => (
  <a className="flex items-center space-x-2 text-2xl font-extrabold tracking-wider">
    <Rocket className="text-[#906ae2] w-6 h-6" />
    <span>{LOGO_TEXT}</span>
  </a>
);

/* Logo icon when sidebar is collapsed */
export const LogoIcon = () => (
  <a className="flex items-center justify-center">
    <Rocket className="text-[#906ae2] w-6 h-6" />
  </a>
);
