'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
    username: string;
    email: string;
    role: string;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
    }, []);

    const handleSignOut = () => {
        // Remove from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Remove from cookies
        Cookies.remove('token');
        Cookies.remove('user');
        
        router.push('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Kiri - Logo */}
                <div className="text-xl font-normal cursor-pointer" onClick={() => router.push('/')}>
                    Welcome to{' '}
                    <span className="text-[var(--color-1)]">
                        <span className="font-normal">iiano</span>
                        <span className="font-bold">Cafe</span>
                    </span>
                </div>

                {/* Kanan - Menu + Profil */}
                <div className="flex items-center space-x-12">
                    <nav className="flex space-x-6 text-base">
                        <a href="/dashboard" className="text-black hover:underline">My Reservation</a>
                        <a href="/about" className="text-black hover:underline">About Us</a>
                        <button onClick={handleSignOut} className="text-[var(--color-1)] hover:underline">Sign Out</button>
                    </nav>
                    {user && (
                        <div className="flex items-center space-x-3 text-sm text-right">
                            <div>
                                <div className="font-semibold">{user.username}</div>
                                <div className="text-gray-500">{user.email}</div>
                            </div>
                            <img
                                src="/images/profile.png"
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
