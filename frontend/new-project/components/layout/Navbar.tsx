"use client";

import React, { useState } from "react";
import { Menu, X, Rocket } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Services", link: "#services" },
    { name: "About Us", link: "#about" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full pt-6">
      <div className="mx-auto max-w-6xl rounded-full bg-[#1d14536f] shadow-2xl backdrop-blur-lg">
        <div className="relative flex h-16 items-center justify-between px-6 py-3 text-white md:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="z-20 flex items-center space-x-2 text-2xl font-extrabold tracking-wider text-white"
          >
            <Rocket className="h-6 w-6 text-[#906ae2]" />
            <span>PLAN.IN</span>
          </Link>

          {/* Desktop Links */}
          <div className="mx-auto hidden gap-10 text-sm font-semibold md:flex">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="p-2 transition hover:text-[#6A2EEF]"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="z-20 hidden items-center gap-4 md:flex">
            <SignedOut>
              <SignUpButton forceRedirectUrl="/dashboard">
                <button className="rounded-full px-5 py-2 font-semibold text-white/90 hover:bg-[#3E3466]">
                  Sign Up
                </button>
              </SignUpButton>

              <SignInButton forceRedirectUrl="/dashboard">
                <button className="rounded-full bg-[#6A2EEF] px-6 py-2 font-bold shadow-xl hover:bg-[#7D45FF]">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }}>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Dashboard"
                    labelIcon={<Rocket className="h-4 w-4" />}
                    href="/dashboard"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg bg-[#2D2350] p-2 md:hidden"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-2 w-full rounded-b-2xl bg-[#1A103B] px-6 py-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg px-4 py-3 text-lg font-medium text-white transition hover:bg-[#2D2350]"
              >
                {item.name}
              </a>
            ))}

            <SignedOut>
              <SignUpButton forceRedirectUrl="/dashboard">
                <button className="w-full rounded-lg bg-[#3E3466] py-3 font-semibold text-white">
                  Sign Up
                </button>
              </SignUpButton>

              <SignInButton forceRedirectUrl="/dashboard">
                <button className="w-full rounded-lg bg-[#6A2EEF] py-3 font-bold text-white shadow-md">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg bg-[#3E3466] py-3 text-center font-semibold text-white"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
