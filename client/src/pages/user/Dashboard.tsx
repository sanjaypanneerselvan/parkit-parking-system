import React from 'react';
import { Header } from '../../components/Header';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book your slot from anywhere and everywhere
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience hassle-free parking with PARKIT. Reserve your spot in advance and enjoy
            a seamless parking experience at your favorite malls.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1611845129188-d798bdfa0773?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Modern Parking"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              State-of-the-art Parking Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Our smart parking system ensures you never waste time looking for a parking spot.
              With real-time availability updates and easy booking process, parking becomes
              a breeze.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Customer Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                alt="John Smith"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Sanjay</h3>
              <p className="text-gray-600 mb-4">
                "PARKIT made my shopping experience so much better. I can now reserve my
                parking spot before leaving home!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1555652736-e92021d28a10?auto=format&fit=crop&q=80&w=200"
                  alt="Luxury Car"
                  className="w-16 h-16 rounded object-cover"
                />
                <span className="ml-2 text-sm text-gray-500">BMW 7 Series Owner</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
                alt="Sarah Johnson"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Haareez Ahamed</h3>
              <p className="text-gray-600 mb-4">
                "The convenience of booking a parking spot through PARKIT is unmatched.
                Highly recommended!"
              </p>
              <div className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Electric Car"
                  className="w-16 h-16 rounded object-cover"
                />
                <span className="ml-2 text-sm text-gray-500">Tesla Model S Owner</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}