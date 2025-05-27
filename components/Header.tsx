'use client';

import React from 'react';

export default function Header() {
    return (
        <header className="w-full bg-white text-black shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Kiri - Logo */}
                <div className="text-xl font-normal">
                    Welcome to{' '}
                    <span className="text-[var(--color-1)]">
                        <span className="font-normal">iiano</span>
                        <span className="font-bold">Cafe</span>
                    </span>
                </div>


                {/* Kanan - Menu + Profil */}
                <div className="flex items-center space-x-12">
                    <nav className="flex space-x-6 text-base">
                        <a href="#" className="text-black hover:underline">Home</a>
                        <a href="#" className="text-black hover:underline">Contact Us</a>
                        <a href="#" className="text-[var(--color-1)] hover:underline">Sign Out</a>
                    </nav>
                    <div className="flex items-center space-x-3 text-sm text-right">
                        <div>
                            <div className="font-semibold">Habil Aswad</div>
                            <div className="text-gray-500">Mei 2025</div>
                        </div>
                                                <img
                            src="/images/profile.png"
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                    </div>

                </div>
            </div>
        </header>
    );
}
