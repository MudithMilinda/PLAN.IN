'use client';

import React, { useState } from 'react';
import { Menu, X, Rocket } from 'lucide-react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "#home" },
    { name: "Services", link: "#services" },
    { name: "About Us", link: "#about" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 pt-6">
      <div className="max-w-6xl mx-auto rounded-full bg-[#1d14536f] backdrop-blur-lg shadow-2xl">
        <div className="relative flex items-center justify-between px-6 md:px-10 py-3 h-16 text-white">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-white text-2xl font-extrabold tracking-wider z-20">
            <Rocket className="text-[#906ae2] w-6 h-6" />
            <span>PLAN.IN</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-10 text-sm font-semibold mx-auto">
            {navItems.map((item, idx) => (
              <a key={idx} href={item.link} className="hover:text-[#6A2EEF] transition p-2">
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4 z-20 items-center">
            <SignedOut>
              <SignUpButton forceRedirectUrl="/dashboard">
                <button className="px-5 py-2 font-semibold text-white/90 hover:bg-[#3E3466] rounded-full">
                  Sign Up
                </button>
              </SignUpButton>

              <SignInButton forceRedirectUrl="/dashboard">
                <button className="px-6 py-2 bg-[#6A2EEF] hover:bg-[#7D45FF] rounded-full font-bold shadow-xl">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>

              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }}>
                <UserButton.MenuItems>

                  <UserButton.Link
                    label="Dashboard"
                    labelIcon={<Rocket className="w-4 h-4" />}
                    href="/dashboard"
                  />

                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-[#2D2350] rounded-lg"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1A103B] w-full px-6 py-6 mt-2 rounded-b-2xl shadow-xl">
          <div className="flex flex-col gap-4">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-white text-lg font-medium py-3 px-4 rounded-lg hover:bg-[#2D2350] transition"
              >
                {item.name}
              </a>
            ))}

            <SignedOut>
              <SignUpButton forceRedirectUrl="/dashboard">
                <button className="w-full py-3 rounded-lg bg-[#3E3466] font-semibold text-white">
                  Sign Up
                </button>
              </SignUpButton>

              <SignInButton forceRedirectUrl="/dashboard">
                <button className="w-full py-3 rounded-lg bg-[#6A2EEF] font-bold text-white shadow-md">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-[#3E3466] font-semibold text-white"
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
