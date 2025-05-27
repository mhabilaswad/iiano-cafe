'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Helper: hitung rentang waktu berdasarkan input (misal: "18.00" -> "18.00 - 19.30")
function getTimeRange(start: string): string {
  const [hourStr, minuteStr] = start.split('.');
  let hour = parseInt(hourStr, 10);
  let minute = parseInt(minuteStr, 10);

  // Tambah 1 jam 30 menit
  minute += 30;
  if (minute >= 60) {
    hour += 1;
    minute -= 60;
  }
  hour += 1;

  const format = (h: number, m: number) =>
    `${h.toString().padStart(2, '0')}.${m.toString().padStart(2, '0')}`;

  return `${start} - ${format(hour, minute)}`;
}

export default function Home() {
  const [selectedTime, setSelectedTime] = useState<Record<number, string>>({});

  function handleTimeSelect(index: number, time: string) {
    setSelectedTime((prev) => ({
      ...prev,
      [index]: time,
    }));
  }

  return (
    <main className="bg-[#F6F6F6] min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6 text-black">Available Table</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div key={i} className="bg-white shadow-md rounded-xl p-4">
              <img
                src="/images/table.png"
                alt="Table"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="text-lg font-bold text-black">Beach View</div>

              <div className="text-sm text-gray-500 mt-1">
                Indoor &nbsp;-&nbsp; 4 People
              </div>


              <div className="text-sm mt-1 text-green-600 font-medium">
                Status: Available
              </div>


              <div className="mt-2 text-sm text-gray-700">
                Waktu:{' '}
                <span className="font-medium">
                  {getTimeRange(selectedTime[i] || '18.00')}
                </span>
              </div>

              {/* Pilihan waktu + Tombol Reserve */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {['18.00', '20.00', '22.00'].map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(i, time)}
                      className={`px-3 py-1 rounded-full border text-sm ${selectedTime[i] === time
                        ? 'bg-[var(--color-3)] text-white'
                        : 'border-gray-300 text-gray-700'
                        }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <button
                  className="text-sm font-medium text-white bg-[var(--color-1)] px-4 py-1.5 rounded-2xl hover:opacity-90"
                  onClick={() => console.log(`Reserve table ${i}`)}
                >
                  Reserve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
