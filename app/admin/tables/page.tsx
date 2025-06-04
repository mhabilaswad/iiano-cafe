'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';

interface Table {
  _id: string;
  tableNumber: number;
  name: string;
  capacity: number;
  isAvailable: boolean;
  description: string;
  imageUrl: string;
}

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    name: '',
    capacity: '',
    description: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch('http://localhost:5000/api/tables', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

  const compressImage = (base64: string, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress as JPEG with 0.8 quality
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Convert to base64 and compress
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          // Compress the image
          const compressedImage = await compressImage(e.target.result as string);
          setFormData(prev => ({
            ...prev,
            imageUrl: compressedImage
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Form validation
      if (!formData.tableNumber || !formData.name || !formData.capacity || !formData.description) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate table number
      if (parseInt(formData.tableNumber) < 1) {
        setError('Table number must be greater than 0');
        return;
      }

      // Validate capacity
      if (parseInt(formData.capacity) < 1) {
        setError('Capacity must be greater than 0');
        return;
      }

      const tableData = {
        tableNumber: parseInt(formData.tableNumber),
        name: formData.name,
        capacity: parseInt(formData.capacity),
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
      };

      console.log('Submitting table data:', { ...tableData, imageUrl: tableData.imageUrl ? 'base64_image_data' : undefined });

      const res = await fetch('http://localhost:5000/api/tables', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tableData),
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create table');
      }

      // Refresh tables and close modal
      await fetchTables();
      setShowAddModal(false);
      setFormData({
        tableNumber: '',
        name: '',
        capacity: '',
        description: '',
        imageUrl: '',
      });
      setImageFile(null);
      setSuccess('Table created successfully!');
    } catch (err: any) {
      console.error('Error creating table:', err);
      setError(err.message || 'Failed to create table. Please try again.');
    }
  };

  const handleDelete = async (tableId: string) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/tables/${tableId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete table');
      }

      // Refresh tables
      fetchTables();
    } catch (err: any) {
      setError(err.message);
    }
  };

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
            <h1 className="text-3xl font-bold text-[var(--color-2)]">Table Management</h1>
            <p className="mt-1 text-sm text-[var(--color-3)]">
              Manage your restaurant tables
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-1)] rounded-md hover:bg-opacity-90"
          >
            Add New Table
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div key={table._id} className="bg-white shadow-md rounded-xl p-6">
              <img
                src={table.imageUrl}
                alt={table.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[var(--color-2)]">{table.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  table.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {table.isAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
              <p className="text-sm text-[var(--color-3)] mb-4">{table.description}</p>
              <div className="flex items-center justify-between text-sm text-[var(--color-3)]">
                <span>Table #{table.tableNumber}</span>
                <span>{table.capacity} People</span>
              </div>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleDelete(table._id)}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-bold text-[var(--color-2)] mb-4">Add New Table</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-2)] mb-1">
                  Table Number
                </label>
                <input
                  type="number"
                  required
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-4)] rounded-md"
                  placeholder="Enter table number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-2)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-4)] rounded-md"
                  placeholder="e.g., Beach View Table"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-2)] mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-4)] rounded-md"
                  placeholder="Enter maximum capacity"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-2)] mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--color-4)] rounded-md"
                  placeholder="Enter table description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-2)] mb-1">
                  Table Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-[var(--color-4)] rounded-md"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-2)] bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-1)] rounded-md hover:bg-opacity-90"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 