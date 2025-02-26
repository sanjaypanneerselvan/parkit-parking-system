import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface LoginFormProps {
  isAdmin: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const validateInput = (): boolean => {
    if (isAdmin) {
      if (!formData.email.trim()) {
        setError('Username cannot be empty.');
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    setError(''); // Clear errors if validation passes
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    try {
      let response;
      if (isAdmin) {
        // Admin login
        response = await axios.post(`${API_BASE}/api/admins/login`, {
          username: formData.email, // Use username for admin login
          password: formData.password,
        });
        //console.log(response);
      } else {
        // User login
        response = await axios.post(`${API_BASE}/api/users/login`, {
          email: formData.email, // Use email for user login
          password: formData.password,
        });
        console.log(response);
      }

      if (response.status === 200) {
        const token = response.data.token;
        console.log(token);
        if (token) {
          // Save the token to localStorage
          localStorage.setItem('token', token);
          // Redirect to the appropriate dashboard
          navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
        } else {
          setError('Token not received. Please try again.');
        }
      } else {
        // Handle failed login
        setError('Invalid credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {isAdmin ? 'Username' : 'Email'}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isAdmin ? <User size={20} /> : <Mail size={20} />}
          </span>
          <input
            type={isAdmin ? 'text' : 'email'}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder={isAdmin ? 'Enter username' : 'Enter email'}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Lock size={20} />
          </span>
          <input
            type="password"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      {!isAdmin && (
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot Password?
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Register
          </button>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </form>
  );
};
