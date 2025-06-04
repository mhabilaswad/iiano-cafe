'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface User {
  username: string;
  email: string;
  role: string;
}

interface BookingForm {
  numberOfGuests: string;
  specialRequests: string;
}

// Helper: hitung rentang waktu berdasarkan input (misal: "18:00" -> "18:00 - 19:30")
function getTimeRange(start: string): string {
  const [hour, minute] = start.split(':').map(Number);
  let endHour = hour;
  let endMinute = minute + 30;

  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }
  endHour += 1;

  const format = (h: number, m: number) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

  return `${start} - ${format(endHour, endMinute)}`;
}

export default function Home() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedTime, setSelectedTime] = useState<Record<string, string>>({});
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    numberOfGuests: '1',
    specialRequests: '',
  });
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tables');
      if (!res.ok) {
        throw new Error('Failed to fetch tables');
      }
      const data = await res.json();
      setTables(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableTimes = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00'
  ];

  function handleTimeSelect(tableId: string, time: string) {
    setSelectedTime((prev) => ({
      ...prev,
      [tableId]: time,
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'numberOfGuests') {
      // Memastikan input jumlah tamu tidak melebihi kapasitas meja
      const value = parseInt(e.target.value);
      if (selectedTable && value > selectedTable.capacity) {
        setError(`Maximum capacity for this table is ${selectedTable.capacity} people`);
        return;
      }
      setError('');
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookingClick = (table: Table) => {
    setSelectedTable(table);
    setForm(prev => ({ ...prev, numberOfGuests: '1' })); // Reset form saat memilih meja baru
    setShowPopup(true);
  };

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!selectedTable) {
        setError('No table selected');
        return;
      }

      const selectedTableTime = selectedTime[selectedTable._id];
      if (!selectedTableTime) {
        setError('Please select a time first');
        return;
      }

      // Validasi jumlah tamu
      const guests = parseInt(form.numberOfGuests);
      if (guests < 1 || guests > selectedTable.capacity) {
        setError(`Number of guests must be between 1 and ${selectedTable.capacity}`);
        return;
      }

      const today = new Date();
      today.setDate(today.getDate() + 1);
      const bookingDate = today.toISOString().split('T')[0];

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: selectedTable._id,
          date: bookingDate,
          time: selectedTableTime,
          numberOfGuests: guests,
          specialRequests: form.specialRequests,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      alert('Booking successful!');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      console.error('Booking error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F6F6]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-2)]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#F6F6F6] min-h-screen pt-20">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6 text-black">Available Tables</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div key={table._id} className="bg-white shadow-md rounded-xl p-4">
              <img
                src={table.imageUrl || "/images/default-table.jpg"}
                alt={table.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="text-lg font-bold text-black">{table.name}</div>

              <div className="text-sm text-gray-500 mt-1">
                Indoor &nbsp;-&nbsp; {table.capacity} People
              </div>

              <div className="text-sm mt-1 text-green-600 font-medium">
                Status: {table.isAvailable ? 'Available' : 'Not Available'}
              </div>

              <div className="mt-2 text-sm text-gray-700">
                Waktu:{' '}
                <span className="font-medium">
                  {getTimeRange(selectedTime[table._id] || '18:00')}
                </span>
              </div>

              {/* Pilihan waktu + Tombol Reserve */}
              <div className="mt-4 space-y-4">
                <select
                  value={selectedTime[table._id] || ''}
                  onChange={(e) => handleTimeSelect(table._id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  disabled={!table.isAvailable}
                >
                  <option value="">Select time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handleBookingClick(table)}
                  disabled={!table.isAvailable}
                  className={`w-full py-2 rounded-md text-sm font-medium transition-opacity
                    ${table.isAvailable 
                      ? 'bg-[var(--color-1)] text-white hover:opacity-90'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {table.isAvailable ? 'Reserve Now' : 'Not Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pop-up Booking Form */}
      {showPopup && selectedTable && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-black">Book Table: {selectedTable.name}</h3>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center">
                  <Users size={20} className="text-white" />
                </div>
                <div className="text-sm text-black flex items-center gap-4">
                  <input
                    type="number"
                    name="numberOfGuests"
                    value={form.numberOfGuests}
                    onChange={handleChange}
                    min="1"
                    max={selectedTable.capacity}
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                    required
                  />
                  <span>/ {selectedTable.capacity} People</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-1)] flex items-center justify-center">
                  <Clock size={20} className="text-white" />
                </div>
                <div className="text-sm text-black">
                  {getTimeRange(selectedTime[selectedTable._id] || '18:00')}
                </div>
              </div>

              <div className="mt-4">
                <textarea
                  name="specialRequests"
                  value={form.specialRequests}
                  onChange={handleChange}
                  placeholder="Special Requests (Optional)"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-white rounded-md text-sm hover:opacity-80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="px-4 py-2 bg-[var(--color-1)] text-white rounded-md text-sm hover:opacity-90"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}