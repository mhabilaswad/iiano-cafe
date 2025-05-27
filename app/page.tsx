'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';

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

  // Simpan waktu yang dipilih untuk tiap kotak
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
              <div className="text-sm text-gray-500">Indoor</div>
              <div className="text-sm text-gray-500">4 People</div>

              <div className="mt-2 text-sm text-gray-700">
                Waktu:{' '}
                <span className="font-medium">
                  {getTimeRange(selectedTime[i] || '18.00')}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                {['18.00', '20.00', '22.00'].map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(i, time)}
                    className={`px-3 py-1 rounded-full border text-sm ${
                      selectedTime[i] === time
                        ? 'bg-[var(--color-1)] text-white'
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}