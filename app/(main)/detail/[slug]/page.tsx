'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Clock } from 'lucide-react';

interface Table {
    _id: string;
    tableNumber: number;
    name: string;
    capacity: number;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
}

export default function DetailPage({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [table, setTable] = useState<Table | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTime, setSelectedTime] = useState('18:00');
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        specialRequests: '',
    });

    useEffect(() => {
        fetchTable();
    }, [params.slug]);

    const fetchTable = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/tables/${params.slug}`);
            if (!res.ok) {
                throw new Error('Failed to fetch table');
            }
            const data = await res.json();
            setTable(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            if (!table) {
                setError('Table not found');
                return;
            }

            const today = new Date();
            today.setDate(today.getDate() + 1); // booking untuk besok
            const bookingDate = today.toISOString().split('T')[0];

            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    table: table._id,
                    date: bookingDate,
                    time: selectedTime,
                    numberOfGuests: table.capacity,
                    specialRequests: form.specialRequests,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create booking');
            }

            alert('Booking successful!');
            router.push('/bookings');
        } catch (err: any) {
            setError(err.message);
            setShowPopup(false);
        }
    };

    if (loading) {
        return (
            <main className="bg-[#F6F6F6] min-h-screen">
                <Header />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-2)]"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!table) {
        return (
            <main className="bg-[#F6F6F6] min-h-screen">
                <Header />
                <div className="max-w-3xl mx-auto px-6 py-10">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="text-red-600">Table not found</div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="bg-[#F6F6F6] min-h-screen">
            <Header />

            <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Go Back */}
                    <button
                        onClick={() => router.push('/')}
                        className="text-sm text-gray-600 hover:underline mb-2"
                    >
                        &lt; Go Back
                    </button>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    {/* Garis horizontal */}
                    <hr className="border-t-2 border-[var(--color-1)] mb-4" />

                    {/* Gambar dan judul */}
                    <img
                        src={table.imageUrl || "/images/default-table.jpg"}
                        alt={table.name}
                        className="w-full h-60 object-cover rounded-lg mb-4"
                    />

                    <h2 className="text-xl font-bold text-black mb-2">{table.name}</h2>
                    <p className="text-sm text-gray-600 mb-4">{table.description}</p>

                    <hr className="border-t-2 border-[var(--color-1)] my-4" />
                    
                    {/* Icon info: jumlah orang */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center">
                            <Users size={20} className="text-white" />
                        </div>
                        <div className="text-sm text-black flex items-center">
                            {table.capacity} People
                        </div>
                    </div>

                    {/* Icon info: waktu */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center">
                            <Clock size={20} className="text-white" />
                        </div>
                        <div className="text-sm text-black flex items-center">
                            {selectedTime} - {selectedTime.split(':')[0]}:30
                        </div>
                    </div>

                    {/* Form input */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setShowPopup(true);
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Customer Name"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black/30"
                            required
                        />
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="phone"
                            value={form.phone}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/\D/g, '');
                                e.target.value = onlyNums;
                                handleChange(e);
                            }}
                            placeholder="Phone Number"
                            maxLength={13}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black/30"
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black/30"
                            required
                        />

                        <textarea
                            name="specialRequests"
                            value={form.specialRequests}
                            onChange={handleChange}
                            placeholder="Special Requests (Optional)"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-black/30"
                            rows={3}
                        />

                        <button
                            type="submit"
                            disabled={!table.isAvailable}
                            className={`w-full py-2 rounded-md font-medium
                                ${table.isAvailable 
                                    ? 'bg-[var(--color-1)] text-white hover:opacity-90' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {table.isAvailable ? 'Reserve' : 'Not Available'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Pop-up Konfirmasi */}
            {showPopup && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center">
                        <h3 className="text-lg font-semibold mb-4 text-black">
                            Confirm Booking Details
                        </h3>
                        <div className="text-left text-sm mb-6 space-y-2">
                            <p><strong>Table:</strong> {table.name}</p>
                            <p><strong>Time:</strong> {selectedTime}</p>
                            <p><strong>Name:</strong> {form.name}</p>
                            <p><strong>Phone:</strong> {form.phone}</p>
                            <p><strong>Email:</strong> {form.email}</p>
                            {form.specialRequests && (
                                <p><strong>Special Requests:</strong> {form.specialRequests}</p>
                            )}
                        </div>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md text-sm hover:opacity-80 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-[var(--color-1)] text-white rounded-md text-sm hover:opacity-90"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
