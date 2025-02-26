import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../../components/Header';
import { Calendar, Clock } from 'lucide-react';
import { ParkingSlot } from '../../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const TIME_SLOT_MAP: { [key: string]: string } = {
  '09:00 AM': '09:00',
  '10:00 AM': '10:00',
  '11:00 AM': '11:00',
  '12:00 PM': '12:00',
  '01:00 PM': '13:00',
  '02:00 PM': '14:00',
  '03:00 PM': '15:00',
  '04:00 PM': '16:00',
  '05:00 PM': '17:00',
  '06:00 PM': '18:00',
  '07:00 PM': '19:00',
  '08:00 PM': '20:00',
};

export default function BookingPage() {
  const { mallName } = useParams<{ mallName: string }>();
  const navigate = useNavigate();
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [date, setDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/api/users/slots/${mallName}`);
        setSlots(response.data.slots);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch slots');
        setLoading(false);
      }
    };

    fetchSlots();
  }, [mallName]);

  const handleConfirmBooking = async () => {
    if (selectedSlot && date && timeSlot && vehicleId) {
      const formattedTime = TIME_SLOT_MAP[timeSlot];
      if (!formattedTime) {
        setError('Invalid time slot selected');
        return;
      }

      const formattedTimeSlot = new Date(`${date}T${formattedTime}`);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized: Token not found');
        }

        const response = await axios.post(
          `${API_BASE}/api/slots/book`,
          {
            slotId: selectedSlot._id,
            vehicleID: vehicleId,
            timeSlot: formattedTimeSlot,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //console.log(response.data.booking);
        navigate('/payment', {
          state: {
            slot: selectedSlot,
            booking: response.data.booking,
            mallName,
          },
        });
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to book the slot. Please try again.';
        setError(message);
        console.error(message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Book Parking Slot - {mallName} Mall
          </h1>

          <div className="grid grid-cols-5 gap-2 mb-4 overflow-y-auto max-h-[calc(100vh-400px)]">
            {slots.map((slot) => (
              <button
                key={slot._id}
                onClick={() => setSelectedSlot(slot)}
                className={`
                  w-30 h-30 rounded-md p-2 flex items-center justify-center text-xs
                  ${slot.isBooked
                    ? 'bg-gray-200 cursor-not-allowed opacity-50'
                    : selectedSlot?._id === slot._id
                      ? 'bg-blue-100 border border-blue-500'
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  }
                `}
                disabled={slot.isBooked}
              >
                <div className="text-center">
                  <div className="font-medium mb-1">{slot.slotNumber}</div>
                  <div className="text-sm text-gray-600">₹{slot.price}</div>
                </div>
              </button>
            ))}
          </div>

          {selectedSlot && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Vehicle ID
                </label>
                <input
                  type="text"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  placeholder="Enter Vehicle ID"
                  className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a time slot</option>
                    {Object.keys(TIME_SLOT_MAP).map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={!vehicleId || !date || !timeSlot}
                className={`
                  w-full py-3 rounded-lg text-white font-semibold
                  ${vehicleId && date && timeSlot
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Confirm Slot
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
