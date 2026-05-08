"use client";

import React from "react";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-8 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold">PLAN.IN</div>
            <p className="text-sm text-gray-400">
              An AI-powered event marketing that drives results.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Pages</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <Link href="#" className="transition hover:text-purple-300">
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="#services"
                  className="transition hover:text-purple-300"
                >
                  Services
                </Link>
              </div>
              <div>
                <Link href="#" className="transition hover:text-purple-300">
                  Achievement
                </Link>
              </div>
              <div>
                <Link
                  href="#about"
                  className="transition hover:text-purple-300"
                >
                  About Us
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <Link href="#" className="transition hover:text-purple-300">
                  Customer
                </Link>
              </div>
              <div>
                <Link href="#" className="transition hover:text-purple-300">
                  Enterprise
                </Link>
              </div>
              <div>
                <Link href="#" className="transition hover:text-purple-300">
                  Partners
                </Link>
              </div>
              <div>
                <Link href="#" className="transition hover:text-purple-300">
                  Jobs
                </Link>
              </div>
            </div>
          </div>
          <div>
            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
              <button className="w-full rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-8 py-3 font-medium transition hover:shadow-lg hover:shadow-purple-500/50">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
              <button className="mt-4 w-full rounded-full border border-white/20 px-8 py-3 font-medium transition hover:bg-white/5">
                Log In
              </button>
            </SignInButton>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          © 2025. All rights reserved
        </div>
      </div>
    </footer>
  );
}
