'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Table {
  _id: string;
  tableNumber: number;
  name: string;
  capacity: number;
  imageUrl: string;
}

interface Booking {
  _id: string;
  user: User;
  table: Table;
  date: string;
  time: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to cancel booking');
      }

      // Refresh bookings
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F6F6F6] min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-2)]"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen flex flex-col pt-20">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-black">My Reservations</h1>
            <button
              onClick={() => router.push('/')}
              className="text-sm font-medium text-white bg-[var(--color-1)] px-4 py-1.5 rounded-2xl hover:opacity-90"
            >
              New Reservation
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.length === 0 ? (
              <div className="col-span-2 bg-white shadow-md rounded-xl p-8 text-center text-gray-500">
                No reservations found. Make your first reservation now!
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="bg-white shadow-md rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-black">
                        Table {booking.table?.tableNumber || 'N/A'} - {booking.table?.name || 'Unknown'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.numberOfGuests} / {booking.table?.capacity || 0} People
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {booking.table?.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={booking.table.imageUrl}
                        alt={booking.table.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {booking.time}
                    </p>
                    {booking.specialRequests && (
                      <p>
                        <span className="font-medium">Special Requests:</span>{' '}
                        {booking.specialRequests}
                      </p>
                    )}
                  </div>

                  {booking.status === 'pending' && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
