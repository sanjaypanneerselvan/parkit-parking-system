import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail } from 'lucide-react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // API Call for Password Reset using axios
    try {
      const response = await axios.post(`${API_BASE}/api/users/reset-password`, {
        email,
      });

      if (response.status === 200) {
        setIsEmailSent(true);
      } else {
        window.alert('Password reset failed!');
      }
    } catch (error) {
      window.alert('An error occurred while resetting the password!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Car className="h-12 w-12 text-blue-600" />
          <h1 className="ml-3 text-3xl font-bold text-gray-900">PARKIT</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isEmailSent ? (
            <div className="text-center space-y-6">
              <p className="text-xl font-semibold text-gray-900">
                Look for the reset password link at your email
              </p>
              <p className="text-blue-600 hover:text-blue-800 cursor-pointer"
                 onClick={() => navigate('/')}>
                CLICK THIS after the password is reset
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Reset Link
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
}
