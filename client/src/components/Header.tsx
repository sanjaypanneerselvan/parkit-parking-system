import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Car, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface HeaderProps {
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isMallsDropdownOpen, setIsMallsDropdownOpen] = useState(false);
  const [malls, setMalls] = useState<{ _id: string; mall: string }[]>([]); // State for malls
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch malls data from the API
    const fetchMalls = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/users/malls`);
        setMalls(response.data.malls || []);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
        navigate('/');
      }
    };

    fetchMalls();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMallsDropdown = () => {
    setIsMallsDropdownOpen((prev) => !prev);
  };

  const handleMallClick = (mallName: string) => {
    navigate(`/booking/${mallName}`);
  };

  const handleLogoClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <Car className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">PARKIT</h1>
          </div>

          <nav className="flex items-center space-x-6">
            {isAdmin ? (
              <>
                <button 
                  onClick={() => navigate('/admin/report')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  View Report
                </button>
                <button 
                  onClick={() => navigate('/admin/prices')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Modify Prices
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  About
                </button>
                <div className="relative">
                  <button 
                    onClick={toggleMallsDropdown} 
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Malls
                  </button>
                  {isMallsDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {malls.length > 0 ? (
                        malls.map((mall) => (
                          <button
                            key={mall._id}
                            onClick={() => handleMallClick(mall.mall)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            {mall.mall}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-2 text-sm text-gray-500">No malls available</p>
                      )}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => navigate('/history')}
                  className="text-gray-700 hover:text-blue-600"
                >
                  History
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-blue-600"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
