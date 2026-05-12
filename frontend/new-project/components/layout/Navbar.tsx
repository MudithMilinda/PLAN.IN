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
      <div className="mx-auto max-w-6xl rounded-full bg-[#112842b3]/50 shadow-2xl backdrop-blur-lg">
        <div className="relative flex h-16 items-center justify-between px-6 py-3 text-white md:px-10">
          {/* Logo */}
          <Link
            href="/"
            className="z-20 flex items-center space-x-2 text-2xl font-extrabold tracking-wider text-white"
          >
            <Rocket className="h-6 w-6 text-[#7cb2db]" />
            <span>PLAN.IN</span>
          </Link>

          {/* Desktop Links */}
          <div className="mx-auto hidden gap-10 text-sm font-semibold md:flex">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="p-2 transition hover:text-[#8fc0e0]"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="z-20 hidden items-center gap-4 md:flex">
            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <button className="rounded-full border border-[#4f5f80] bg-[#112842b3]/60 px-7 py-2 text-sm font-medium text-white transition hover:border-[#687a9d] hover:bg-[#15284d]/70">
                  Sign in
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
            className="rounded-lg bg-[#152c48] p-2 md:hidden"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-2 w-full rounded-b-2xl bg-[#10243c] px-6 py-6 shadow-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg px-4 py-3 text-lg font-medium text-white transition hover:bg-[#152c48]"
              >
                {item.name}
              </a>
            ))}

            <SignedOut>
              <SignInButton forceRedirectUrl="/dashboard">
                <button className="w-full rounded-full border border-[#4f5f80] bg-[#101e3b]/55 py-2.5 text-base font-medium text-white transition hover:border-[#687a9d] hover:bg-[#15284d]/70">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton forceRedirectUrl="/dashboard">
                <button className="w-full rounded-lg bg-[#1b3555] py-3 font-semibold text-white">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-lg bg-[#1b3555] py-3 text-center font-semibold text-white"
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
