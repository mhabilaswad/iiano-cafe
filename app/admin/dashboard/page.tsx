'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

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

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
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

      const res = await fetch('http://localhost:5000/api/bookings/all', {
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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update booking status');
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

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F6F6]">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-2)]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6] pt-20">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-2)]">Booking Management</h1>
            <p className="mt-1 text-sm text-[var(--color-3)]">
              Manage and monitor all reservations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-[var(--color-4)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-1)]"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-1)] rounded-md hover:bg-opacity-90"
            >
              View Website
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-[var(--color-4)]">
            {filteredBookings.length === 0 ? (
              <div className="px-4 py-12 text-center text-[var(--color-3)]">
                <svg
                  className="mx-auto h-12 w-12 text-[var(--color-4)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-[var(--color-2)]">No bookings found</h3>
                <p className="mt-1 text-sm text-[var(--color-3)]">
                  {filter === 'all' 
                    ? 'There are no bookings in the system yet.'
                    : `No ${filter} bookings found.`}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-4)]">
                {filteredBookings.map((booking) => (
                  <li key={booking._id} className="px-4 py-5 hover:bg-[#F6F6F6]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-[var(--color-2)]">
                            {booking.table?.name || `Table ${booking.table?.tableNumber || 'N/A'}`}
                          </div>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-[var(--color-3)]">
                          <span className="font-medium">Customer:</span> {booking.user?.username} ({booking.user?.email})
                        </div>
                        <div className="mt-1 text-sm text-[var(--color-3)]">
                          <span className="font-medium">Date & Time:</span> {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </div>
                        <div className="mt-1 text-sm text-[var(--color-3)]">
                          <span className="font-medium">Guests:</span> {booking.numberOfGuests} / {booking.table?.capacity || 0} (Capacity)
                        </div>
                        {booking.specialRequests && (
                          <div className="mt-1 text-sm text-[var(--color-3)]">
                            <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                          </div>
                        )}
                      </div>

                      {booking.status === 'pending' && (
                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="px-3 py-1 text-sm font-medium text-white bg-[var(--color-1)] rounded hover:opacity-90"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="px-3 py-1 text-sm font-medium text-white bg-[var(--color-2)] rounded hover:opacity-90"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {booking.status === 'confirmed' && (
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'completed')}
                            className="px-3 py-1 text-sm font-medium text-white bg-[var(--color-1)] rounded hover:opacity-90"
                          >
                            Mark as Completed
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 