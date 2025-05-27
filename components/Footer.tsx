'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-2)] text-center py-8">
      {/* Logo iianoCafe */}
      <div className="mb-4 text-xl">
        <span className="text-[var(--color-1)]">
          <span className="font-normal">iiano</span>
          <span className="font-bold">Cafe</span>
        </span>
      </div>

      {/* Menu link */}
      <nav className="mb-6 text-white space-x-6 text-sm">
        {['Service', 'About Us', 'Contact Us', 'FAQs', 'Sign in'].map((item) => (
          <a
            key={item}
            href="#"
            className="hover:underline cursor-pointer"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Social icons */}
      <div className="flex justify-center gap-6 mb-6">
        {/* Facebook */}
        <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center text-white hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 12a10 10 0 10-11.5 9.87v-6.98h-3v-2.9h3v-2.2c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.24 2.7.24v3h-1.5c-1.5 0-2 1-2 2v2.4h3.4l-.54 2.9h-2.86v6.98A10 10 0 0022 12z" />
          </svg>
        </a>

        {/* X (Twitter) */}
        <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center text-white hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.724 9.868 9.868 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482A13.978 13.978 0 011.671 3.149a4.917 4.917 0 001.523 6.574 4.9 4.9 0 01-2.228-.616c-.054 2.28 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.085 4.928 4.928 0 004.6 3.417 9.867 9.867 0 01-6.102 2.104c-.395 0-.779-.023-1.158-.067a13.945 13.945 0 007.557 2.213c9.054 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
          </svg>
        </a>

        {/* Instagram */}
        <a href="#" className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center text-white hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37a4 4 0 11-4.73-4.73 4 4 0 014.73 4.73z" />
            <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
          </svg>
        </a>
      </div>

      {/* Footer text */}
      <div className="text-xs text-white opacity-70">
        iianocafe.com | All rights reserved
      </div>
    </footer>
  );
}