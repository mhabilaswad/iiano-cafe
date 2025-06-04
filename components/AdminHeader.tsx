'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
    username: string;
    email: string;
    role: string;
}

export default function AdminHeader() {
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
                <div className="flex items-center space-x-8">
                    <div className="text-xl font-normal cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
                        <span className="text-[var(--color-1)]">
                            <span className="font-normal">iiano</span>
                            <span className="font-bold">Cafe</span>
                        </span>
                        <span className="ml-2 text-sm bg-[var(--color-1)] text-white px-2 py-1 rounded-md">
                            Admin Panel
                        </span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="hidden md:flex space-x-6 text-sm">
                        <a 
                            href="/admin/dashboard"
                            className="text-[var(--color-2)] hover:text-[var(--color-1)] transition-colors"
                        >
                            Bookings
                        </a>
                        <a 
                            href="/admin/tables"
                            className="text-[var(--color-2)] hover:text-[var(--color-1)] transition-colors"
                        >
                            Tables
                        </a>
                    </nav>
                </div>

                {/* Kanan - Profil + Logout */}
                {user && (
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <div className="font-semibold text-sm text-[var(--color-2)]">{user.username}</div>
                                <div className="text-xs text-[var(--color-3)]">Administrator</div>
                            </div>
                            <img
                                src="/images/profile.png"
                                alt="Admin Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-1)]"
                            />
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-[var(--color-1)] text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
} 