import React from 'react';
import { FaUsers, FaCheck } from 'react-icons/fa';

interface Table {
  _id: string;
  tableNumber: number;
  name: string;
  capacity: number;
  isAvailable: boolean;
  description: string;
  imageUrl: string;
}

interface TableGridProps {
  tables: Table[];
  selectedTable?: string;
  onSelectTable?: (tableId: string) => void;
  capacity?: number;
  isBookingMode?: boolean;
}

export default function TableGrid({ 
  tables, 
  selectedTable, 
  onSelectTable,
  capacity,
  isBookingMode = false 
}: TableGridProps) {
  const filteredTables = capacity 
    ? tables.filter(table => table.capacity >= capacity)
    : tables;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {filteredTables.map((table) => {
        const isSelected = selectedTable === table._id;
        const isAvailableForBooking = table.isAvailable && (!capacity || table.capacity >= (capacity || 0));

        return (
          <div
            key={table._id}
            className={`
              bg-white rounded-xl overflow-hidden shadow-md transition-all
              ${isBookingMode && !isAvailableForBooking ? 'opacity-50' : ''}
              ${isSelected ? 'ring-2 ring-[var(--color-1)]' : ''}
              ${isBookingMode && isAvailableForBooking ? 'cursor-pointer hover:shadow-lg' : ''}
            `}
            onClick={() => {
              if (isBookingMode && isAvailableForBooking && onSelectTable) {
                onSelectTable(table._id);
              }
            }}
          >
            <div className="relative">
              <img
                src={table.imageUrl || '/images/default-table.jpg'}
                alt={table.name}
                className="w-full h-48 object-cover"
              />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-[var(--color-1)] text-white p-2 rounded-full">
                  <FaCheck className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="p-4">
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-3)]">Table #{table.tableNumber}</span>
                <div className="flex items-center text-[var(--color-2)]">
                  <FaUsers className="w-4 h-4 mr-1" />
                  <span>{table.capacity} People</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 