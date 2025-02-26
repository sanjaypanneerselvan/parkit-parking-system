import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ResetPassword () {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMismatch(newPassword !== confirmPassword);
    if (newPassword !== confirmPassword) return;

    setIsLoading(true);
    console.log(token);
    try {
      const response = await axios.put(
        `${API_BASE}/api/accounts/reset-password/${token}`,
        { newPassword }
      );      
      if (response.status === 200) {
        setIsPasswordUpdated(true);
      } else {
        alert('Failed to update password!');
      }
    } catch (error) {
      alert('An error occurred while resetting the password!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Lock className="h-12 w-12 text-blue-600" />
          <h1 className="ml-3 text-3xl font-bold text-gray-900">PARKIT</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set a New Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isPasswordUpdated ? (
            <div className="text-center space-y-6">
              <p className="text-xl font-semibold text-gray-900">
                Your password has been updated successfully.
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to Sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                {passwordMismatch && (
                  <p className="text-red-600 text-xs mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading || passwordMismatch}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Back to Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
