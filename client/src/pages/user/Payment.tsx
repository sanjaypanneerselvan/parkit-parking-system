import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { CreditCard, Smartphone, QrCode } from 'lucide-react';
import axios from 'axios'; // Axios is used for API calls.
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false); // Toggle PayPal view
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { slot, booking, mallName } = location.state || {};

  const handlePayment = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage.
    if (!token) {
      alert('User not authenticated. Please log in.');
      navigate('/'); // Redirect to login if token is missing.
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API_BASE}/api/users/pay`,
        { bookingId: booking._id },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach Bearer token.
          },
        }
      );

      if (response.status === 200) {
        setPaymentComplete(true); // Set payment as complete.
        setTimeout(() => {
          navigate('/dashboard'); // Navigate to dashboard after 3 seconds.
        }, 3000);
      }
    } catch (error: any) {
      console.error('Payment failed:', error.response?.data || error.message);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const date = new Date(booking.timeSlot).toLocaleDateString();
  const timeSlot = new Date(booking.timeSlot).toLocaleTimeString();

  useEffect(() => {
    if (showPayPal) {
      // Dynamically load the PayPal script
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AQuNKs-eV-OqfmluK6jiuZwRA6paI41M5hOjWgy3zmgeD2zR3Dog2Xte6Hs_2xvtrQ69nhDUMMlbk2Nh&currency=USD';
      script.async = true;
      script.onload = () => {
        (window as any).paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: slot.price.toString(),
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log('PayPal order successful:', order);
            setPaymentComplete(true);
            setTimeout(() => {
              navigate('/dashboard'); // Navigate to dashboard after 3 seconds.
            }, 3000);
          },
          onError: (err: any) => {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
          },
        }).render('#paypal-button-container');
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup the PayPal script if the component unmounts
        const scripts = document.querySelectorAll('script[src*="paypal.com"]');
        scripts.forEach((script) => script.remove());
      };
    }
  }, [showPayPal, slot.price, navigate]);

  if (!slot || !booking || !mallName) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p className="text-lg text-red-500">Error: Missing booking details. Please try again.</p>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mall</span>
                  <span className="font-medium">{mallName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Slot Number</span>
                  <span className="font-medium">{slot.slotNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-medium">₹{slot.price}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Details</h1>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Booking Amount</p>
                  <p className="text-2xl font-bold">₹{slot.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Slot {slot.slotNumber}</p>
                  <p className="text-sm text-gray-600">{date} | {timeSlot}</p>
                </div>
              </div>
            </div>

            {!showPayPal ? (
              <button
                onClick={() => setShowPayPal(true)}
                className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Pay with PayPal
              </button>
            ) : (
              <div id="paypal-button-container" />
            )}

            {!showQR ? (
              <>
                <div className="space-y-4">
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="UPI ID"
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowQR(true)}
                  className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <QrCode className="mr-2" />
                  Show QR Code
                </button>
              </>
            ) : (
              <div className="text-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=PARKIT"
                  alt="Payment QR Code"
                  className="mx-auto mb-4"
                />
                <button
                  onClick={() => setShowQR(false)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Back to payment options
                </button>
              </div>
            )}

            <button
              onClick={handlePayment}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : `Pay ₹${slot.price}`}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Header } from '../../components/Header';
// import { CreditCard, Smartphone, QrCode } from 'lucide-react';
// import axios from 'axios'; // Axios is used for API calls.
// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// export default function PaymentPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [showQR, setShowQR] = useState(false);
//   const [paymentComplete, setPaymentComplete] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { slot, booking, mallName } = location.state || {};

//   const handlePayment = async () => {
//     const token = localStorage.getItem('token'); // Retrieve token from localStorage.
//     if (!token) {
//       alert('User not authenticated. Please log in.');
//       navigate('/'); // Redirect to login if token is missing.
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${API_BASE}/api/users/pay`,
//         { bookingId: booking._id },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Attach Bearer token.
//           },
//         }
//       );

//       if (response.status === 200) {
//         setPaymentComplete(true); // Set payment as complete.
//         setTimeout(() => {
//           navigate('/dashboard'); // Navigate to dashboard after 3 seconds.
//         }, 3000);
//       }
//     } catch (error: any) {
//       console.error('Payment failed:', error.response?.data || error.message);
//       alert('Payment failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const date = new Date(booking.timeSlot).toLocaleDateString();
//   const timeSlot = new Date(booking.timeSlot).toLocaleTimeString();

//   if (!slot || !booking || !mallName) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-center">
//         <p className="text-lg text-red-500">Error: Missing booking details. Please try again.</p>
//       </div>
//     );
//   }

//   if (paymentComplete) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//             <div className="text-center mb-8">
//               <div className="text-green-500 text-6xl mb-4">✓</div>
//               <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
//             </div>
//             <div className="border-t border-gray-200 pt-6">
//               <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Mall</span>
//                   <span className="font-medium">{mallName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Slot Number</span>
//                   <span className="font-medium">{slot.slotNumber}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Date</span>
//                   <span className="font-medium">{date}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Time</span>
//                   <span className="font-medium">{timeSlot}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Amount Paid</span>
//                   <span className="font-medium">₹{slot.price}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Details</h1>

//           <div className="space-y-6">
//             <div className="p-4 bg-gray-50 rounded-lg">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-600">Booking Amount</p>
//                   <p className="text-2xl font-bold">₹{slot.price}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-gray-600">Slot {slot.slotNumber}</p>
//                   <p className="text-sm text-gray-600">{date} | {timeSlot}</p>
//                 </div>
//               </div>
//             </div>

//             {!showQR ? (
//               <>
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Card Number"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div className="relative">
//                     <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="UPI ID"
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => setShowQR(true)}
//                   className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   <QrCode className="mr-2" />
//                   Show QR Code
//                 </button>
//               </>
//             ) : (
//               <div className="text-center">
//                 <img
//                   src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=PARKIT"
//                   alt="Payment QR Code"
//                   className="mx-auto mb-4"
//                 />
//                 <button
//                   onClick={() => setShowQR(false)}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   Back to payment options
//                 </button>
//               </div>
//             )}

//             <button
//               onClick={handlePayment}
//               className={`w-full bg-blue-600 text-white py-3 rounded-lg ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
//               disabled={loading}
//             >
//               {loading ? 'Processing Payment...' : `Pay ₹${slot.price}`}
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
