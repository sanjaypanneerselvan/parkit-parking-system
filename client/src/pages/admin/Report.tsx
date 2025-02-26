import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../../components/Header';
import { useNavigate } from 'react-router-dom';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Mall {
  mall: string;
  totalRevenue: number;
  totalSlots: number;
  slotsAvailable: number;
  availabilityPercentage: number;
  imageUrl: string;
}

interface OverallStats {
  totalRevenue: number;
  totalSlots: number;
  slotsAvailable: number;
  availabilityPercentage: number;
}

export default function AdminReport() {
  const navigate = useNavigate();
  const [malls, setMalls] = useState<Mall[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token'); // Replace with your token retrieval logic
        if (!token) {
          navigate('/');
          throw new Error('User not authenticated.');
        }

        const response = await axios.get(`${API_BASE}/api/admins/sales-report`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setMalls(response.data.mallReport);
        setOverallStats(response.data.overallStats);
      } catch (err) {
        setError('Failed to fetch report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {overallStats && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Overall Statistics</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Total Revenue</h2>
                <p className="text-3xl font-bold text-blue-600">
                  ₹{overallStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 mb-2">Total Slots</h2>
                <p className="text-3xl font-bold text-green-600">{overallStats.totalSlots}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-purple-900 mb-2">Available Slots</h2>
                <p className="text-3xl font-bold text-purple-600">{overallStats.slotsAvailable}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {malls.map((mall) => (
            <div key={mall.mall} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full md:w-48 object-cover"
                    src={mall.imageUrl}
                    alt={mall.mall}
                  />
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{mall.mall}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Total Slots</p>
                      <p className="text-xl font-semibold">{mall.totalSlots}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available Slots</p>
                      <p className="text-xl font-semibold">{mall.slotsAvailable}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Revenue Generated</p>
                      <p className="text-xl font-semibold">₹{mall.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Occupancy Rate</p>
                      <p className="text-xl font-semibold">
                        {Math.round((1 - mall.slotsAvailable / mall.totalSlots) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
