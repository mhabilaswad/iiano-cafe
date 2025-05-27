'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Clock } from 'lucide-react';

export default function DetailPage() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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

                    {/* Garis horizontal */}
                    <hr className="border-t-2 border-[var(--color-1)] mb-4" />

                    {/* Gambar dan judul */}
                    <img
                        src="/images/table.png"
                        alt="Table Detail"
                        className="w-full h-60 object-cover rounded-lg mb-4"
                    />

                    <h2 className="text-xl font-bold text-black mb-2">Beach View</h2>

                    <hr className="border-t-2 border-[var(--color-1)] my-4" />
                    
{/* Icon info: jumlah orang */}
<div className="flex items-center gap-4 mb-4">
  <div className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center">
    <Users size={20} className="text-white" />
  </div>
  <div className="text-sm text-black flex items-center">
    4 People
  </div>
</div>

{/* Icon info: waktu */}
<div className="flex items-center gap-4 mb-6">
  <div className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center">
    <Clock size={20} className="text-white" />
  </div>
  <div className="text-sm text-black flex items-center">
    18.00 - 19.30
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
                                const onlyNums = e.target.value.replace(/\D/g, ''); // Hapus semua non-digit
                                e.target.value = onlyNums; // Update nilai input langsung
                                handleChange(e); // Tetap kirim event asli
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

                        <button
                            type="submit"
                            className="w-full bg-[var(--color-1)] text-white py-2 rounded-md font-medium hover:opacity-90"
                        >
                            Reserve
                        </button>
                    </form>
                </div>
            </div>

            {/* Pop-up Konfirmasi */}
            {showPopup && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-sm text-center">
                        <h3 className="text-lg font-semibold mb-4 text-black">
                            Are you sure all the data are correct?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-4 py-2 bg-gray-300 rounded-md text-sm hover:opacity-80 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowPopup(false);
                                    alert('Reservation Confirmed!');
                                    setTimeout(() => router.push('/'), 100); // redirect setelah 100ms
                                }}

                                className="px-4 py-2 bg-[var(--color-1)] text-white rounded-md text-sm hover:opacity-90"
                            >
                                Confirm
                            </button>

                        </div>
                    </div>
                </div>
            )}


            <Footer />
        </main>
    );
}
