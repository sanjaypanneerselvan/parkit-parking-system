import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, User, Mail, Phone, Lock } from 'lucide-react';
import axios from 'axios';  // Import axios for API calls
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  const validateFullName = (fullName: string) => {
    if (!fullName) return 'Full name is required.';
    return '';
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required.';
    if (!emailPattern.test(email)) return 'Please enter a valid email.';
    return '';
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phonePattern = /^[0-9]{10}$/;
    if (!phoneNumber) return 'Phone number is required.';
    if (!phonePattern.test(phoneNumber)) return 'Please enter a valid 10-digit phone number.';
    return '';
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) return 'Password must be at least 6 characters long.';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    let error = '';
    if (name === 'fullName') {
      error = validateFullName(value);
    } else if (name === 'email') {
      error = validateEmail(value);
    } else if (name === 'phoneNumber') {
      error = validatePhoneNumber(value);
    } else if (name === 'password') {
      error = validatePassword(value);
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submitting
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      try {
        // Send the form data to the backend API
        const response = await axios.post(`${API_BASE}/api/users/register`, {
          fullName: formData.fullName,
          email: formData.email,
          phoneNo: formData.phoneNumber,  // Make sure the key matches the backend payload
          password: formData.password,
        });

        //console.log(response);
        // Handle successful registration
        if (response.status === 201) {
          window.alert('Registration successful!');
          navigate('/');
        }
      } catch (error) {
        // Handle errors during registration
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data.message || 'Registration failed. Please try again later.';
          window.alert(errorMessage);
        } else {
          window.alert('An error occurred. Please try again.');
        }
      }
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && (
                  <div className="text-red-500 text-sm absolute top-full left-0 mt-2 bg-white shadow-md rounded p-2">
                    {errors.fullName}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="text-red-500 text-sm absolute top-full left-0 mt-2 bg-white shadow-md rounded p-2">
                    {errors.email}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
                {errors.phoneNumber && (
                  <div className="text-red-500 text-sm absolute top-full left-0 mt-2 bg-white shadow-md rounded p-2">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="text-red-500 text-sm absolute top-full left-0 mt-2 bg-white shadow-md rounded p-2">
                    {errors.password}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
