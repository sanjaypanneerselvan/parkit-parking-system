import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Booking {
  bookingId: string;
  mall: string;
  slotName: string;
  amount: number;
  vehicleID: string;
  dateBooked: Date;
  paymentStatus: string;
  slot: string; // Slot ID
  timeSlot: Date;
  visibility: Boolean;
}

export default function History() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          throw new Error('User not authenticated.');
        }

        const response = await axios.get(`${API_BASE}/api/users/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        navigate('/');
      }
    };

    fetchBookings();
  }, []);

  const handleRowClick = async (booking: Booking) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        throw new Error('User not authenticated.');
      }
      //console.log(token, booking.slot);
      const response = await axios.get(`${API_BASE}/api/users/slot/${booking.slot}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(response);
      const slot = response.data.slot; // Retrieved slot data
      const mallName = booking.mall;

      if (booking.paymentStatus === 'Pending') {
        navigate('/payment', {
          state: {
            slot,
            booking,
            mallName,
          },
        });
      } else if (booking.paymentStatus === 'Completed') {
        navigate('/payment', {
          state: {
            slot,
            booking,
            mallName,
            paymentComplete: true, // Indicating that payment is already complete
          },
        });
      }
    } catch (err) {
      console.error('Failed to retrieve slot data:', err);
      alert('Error fetching slot details. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 bg-transparent hover:underline"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Booking History</h1>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Fixed Header for Table */}
          <div className="overflow-x-auto">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-50 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mall
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Slot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.bookingId}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRowClick(booking)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.dateBooked).toLocaleDateString()} at {new Date(booking.dateBooked).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.mall} - {booking.slotName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(booking.timeSlot).toLocaleDateString()} at {new Date(booking.timeSlot).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{booking.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.vehicleID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.paymentStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
