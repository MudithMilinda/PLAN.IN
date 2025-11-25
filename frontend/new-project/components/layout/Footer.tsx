'use client';

import React from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold mb-4">PLAN.IN</div>
            <p className="text-gray-400 text-sm">
              An AI-powered event marketing that drives results.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Pages</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <Link href="#" className="hover:text-purple-300 transition">
                  Home
                </Link>
              </div>
              <div>
                <Link href="#services" className="hover:text-purple-300 transition">
                  Services
                </Link>
              </div>
              <div>
                <Link href="#" className="hover:text-purple-300 transition">
                  Achievement
                </Link>
              </div>
              <div>
                <Link href="#about" className="hover:text-purple-300 transition">
                  About Us
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <Link href="#" className="hover:text-purple-300 transition">
                  Customer
                </Link>
              </div>
              <div>
                <Link href="#" className="hover:text-purple-300 transition">
                  Enterprise
                </Link>
              </div>
              <div>
                <Link href="#" className="hover:text-purple-300 transition">
                  Partners
                </Link>
              </div>
              <div>
                <Link href="#" className="hover:text-purple-300 transition">
                  Jobs
                </Link>
              </div>
            </div>
          </div>
          <div>
            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
              <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition w-full">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
              <button className="mt-4 px-8 py-3 border border-white/20 rounded-full font-medium hover:bg-white/5 transition w-full">
                Log In
              </button>
            </SignInButton>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 pt-8 border-t border-white/10">
          © 2025. All rights reserved
        </div>
      </div>
    </footer>
  );
}