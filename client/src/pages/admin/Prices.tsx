import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { ParkingSlot, Mall } from '../../types';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminPrices() {
  const navigate = useNavigate();
  const [malls, setMalls] = useState<Mall[]>([]);
  const [selectedMall, setSelectedMall] = useState<Mall | null>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/');
    throw new Error('User not authenticated.');
  }

  // Fetch malls from the backend
  useEffect(() => {
    async function fetchMalls() {
      try {
        const response = await axios.get(`${API_BASE}/api/admins/malls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMalls(response.data.malls);
        if (response.data.malls.length > 0) {
          setSelectedMall(response.data.malls[0]); // Select first mall by default
        }
      } catch (error) {
        console.error('Error fetching malls:', error);
      }
    }
    fetchMalls();
  }, []);

  // Fetch slots when selectedMall changes
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedMall) return;
      try {
        const response = await axios.get(`${API_BASE}/api/admins/slots/${selectedMall.mall}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSlots(response.data.slots);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    }
    fetchSlots();
  }, [selectedMall]);

  const handlePriceChange = (increment: boolean) => {
    if (!selectedSlot) return;

    setSlots(slots.map(slot =>
      slot._id === selectedSlot._id
        ? { ...slot, price: slot.price + (increment ? 5 : -5) }
        : slot
    ));
    setSelectedSlot(prev => prev ? { ...prev, price: prev.price + (increment ? 5 : -5) } : null);
  };

  const confirmPriceChange = async () => {
    if (!selectedSlot) return;

    try {
      await axios.put(
        `${API_BASE}/api/admins/slot-price`,
        {
          slotId: selectedSlot._id,
          newPrice: selectedSlot.price,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Price updated successfully!');
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update the price. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Modify Parking Prices</h1>

          {/* Mall Dropdown */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Mall
            </label>
            <select
              key={selectedMall?.id || ''}
              value={selectedMall?.mall || ''}
              onChange={(e) => {
                const selectedmall = e.target.value;
                const mall = malls.find((mall) => mall.mall === selectedmall);
                setSelectedMall(mall || null);
              }}
              className="w-full md:w-64 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {malls.map((mall) => (
                <option key={mall.id} value={mall.mall}>
                  {mall.mall}
                </option>
              ))}
            </select>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-5 gap-4">
            {slots.map((slot) => (
              <button
                key={slot._id}
                onClick={() => setSelectedSlot(slot)}
                className={
                  `
                  aspect-square rounded-lg p-4 flex items-center justify-center bg-white
                  ${
                    selectedSlot?._id === slot._id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }
                `
                }
              >
                <div className="text-center">
                  <div className="font-semibold mb-1">{slot.slotNumber}</div>
                  <div className="text-sm text-gray-600">₹{slot.price}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Modify Slot Price */}
          {selectedSlot && (
            <div className="fixed bottom-8 right-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Modify Price for Slot {selectedSlot.slotNumber}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">₹{selectedSlot.price}</div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handlePriceChange(true)}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <ChevronUp size={20} />
                  </button>
                  <button
                    onClick={() => handlePriceChange(false)}
                    className="p-2 bg-gray-100 rounded hover:bg-gray-200"
                    disabled={selectedSlot.price <= 5}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              </div>
              <button
                onClick={confirmPriceChange}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Confirm Price Change
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
