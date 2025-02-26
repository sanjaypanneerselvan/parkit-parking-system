const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');
const Booking = require('../models/Booking');
const Slot = require('../models/Slot'); // Add this import at the top

exports.register = async (req, res) => {
    const { fullName, email, password, phoneNo} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ fullName, email, password: hashedPassword, phoneNo });
        //const user = new User({ fullName, email, password, phoneNo });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login Successful", token , user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send reset email
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
        });

        res.json({ message: 'Password reset email sent' , token: token});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.payForBooking = async (req, res) => {
  const { bookingId } = req.body;
  
  try {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      // Simulate payment processing
      booking.paymentStatus = 'Completed';
      await booking.save();

      res.json({ message: 'Payment successful', booking });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user; // Get user ID from the token
        const bookings = await Booking.find({ user: userId }).populate({
            path: 'slot',
            select: 'mall slotNumber price',
        });

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for this user.', token: req.token });
        }

        const detailedBookings = bookings.map((booking) => ({
            bookingId: booking._id,
            mall: booking.slot.mall,
            slotName: booking.slot.slotNumber,
            amount: booking.slot.price,
            vehicleID: booking.vehicleID,
            dateBooked: booking.dateBooked,
            paymentStatus: booking.paymentStatus,
            slot: booking.slot._id,
            timeSlot: booking.timeSlot,
            visibility: booking.visible,
        }));

        res.json({ bookings: detailedBookings, token: req.token });
    } catch (error) {
        res.status(500).json({ message: error.message, token: req.token });
    }
};
