import React, { useState } from 'react';
import { Car } from 'lucide-react';

import { LoginToggle } from '../components/LoginToggle';
import { LoginForm } from '../components/LoginForm';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Car className="h-12 w-12 text-blue-600" />
          <h1 className="ml-3 text-3xl font-bold text-gray-900">PARKIT</h1>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginToggle isAdmin={isAdmin} onToggle={setIsAdmin} />
          <LoginForm isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
}