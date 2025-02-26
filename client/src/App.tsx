
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserDashboard from './pages/user/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReport from './pages/admin/Report';
import AdminPrices from './pages/admin/Prices';
import BookingPage from './pages/user/Booking';
import PaymentPage from './pages/user/Payment';
import History from './pages/user/History'; //modified history

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword/>}/>
        <Route path="/dashboard" element={<UserDashboard />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/report" element={<AdminReport />} />
        <Route path="/admin/prices" element={<AdminPrices />} />
        <Route path="/history" element={<History />} />
        <Route path="/booking/:mallName" element={<BookingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;