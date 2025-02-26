import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../../components/Header';
//import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const LOCALE = import.meta.env.VITE_LOCALE || 'en-IN'; // Fallback to 'en-IN' if not defined
const TIMEZONE = import.meta.env.VITE_TIMEZONE || 'Asia/Kolkata'; // Fallback to 'Asia/Kolkata' if not defined

export default function AdminDashboard() {
  //const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [systemStatus, setSystemStatus] = useState({
    serverStatus: 'Loading...',
    lastUpdated: 'Loading...',
    changeType: 'Loading...',
    activeUsers: 'Loading...',
  });

  const [todaysOverview, setTodaysOverview] = useState({
    totalBookings: 'Loading...',
    revenue: 'Loading...',
    totalSlots: 'Loading...',
    availableSlots: 'Loading...',
  });

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(LOCALE, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: TIMEZONE,
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/admins/system-status`);
      const data = response.data;

      // Format the lastUpdated field
      data.lastUpdated = formatDateTime(data.lastUpdated);

      setSystemStatus(data);
    } catch (error) {
      console.error('Error fetching system status:', error);
      setError('Failed to fetch report data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysOverview = async () => {
    try {
      // const token = localStorage.getItem('authToken');
      // if (!token) {
      //   navigate('/');
      //   throw new Error('User not authenticated.');
      // }
      const response = await axios.get('http://localhost:5000/api/admins/todays-overview');
      setTodaysOverview(response.data);
    } catch (error) {
      console.error('Error fetching today\'s overview:', error);
      setError('Failed to fetch report data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    fetchTodaysOverview();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => (window.location.href = '/admin/report')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Report
              </button>
              <button
                onClick={() => (window.location.href = '/admin/prices')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Modify Prices
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px] min-w-[400px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Server Status</span>
                <span className="text-green-600">{systemStatus.serverStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Update</span>
                <span className="text-gray-900">{systemStatus.lastUpdated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Change Type</span>
                <span className="text-gray-900">{systemStatus.changeType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Users</span>
                <span className="text-gray-900">{systemStatus.activeUsers}</span>
              </div>
            </div>
          </div>

          {/* Today's Overview */}
          <div className="bg-white rounded-lg shadow-lg p-6 min-h-[300px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Overview</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="text-gray-900">{todaysOverview.totalBookings}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue</span>
                <span className="text-gray-900">₹{todaysOverview.revenue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Slots</span>
                <span className="text-gray-900">{todaysOverview.totalSlots}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Available Slots</span>
                <span className="text-gray-900">{todaysOverview.availableSlots}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
