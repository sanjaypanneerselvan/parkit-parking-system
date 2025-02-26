const User = require('../models/User'); // Assuming you have a User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodeCron = require('node-cron');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

exports.resetPassword = async (req, res) => {
    const { token } = req.params; // Extract token from the route parameters
    const { newPassword } = req.body; // Extract the new password from the request body
    //console.log(token, newPassword);
    try {
        // Validate input
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        // Fetch the user by ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // // Update the user's password
        user.password = hashedPassword;
        //user.password = newPassword;
        await user.save();

        // Respond with success
        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password' });
    }
};

// Function to free slots with 'Pending' payment status after 30 minutes
exports.freePendingSlots = () => {
    nodeCron.schedule('*/1 * * * *', async () => { // Change to '*/30' for every 30 minutes
        try {
            const now = new Date();
            const bookings = await Booking.find({ paymentStatus: 'Pending' });

            for (const booking of bookings) {
                const timeDifference = (now - new Date(booking.dateBooked)) / 1000 / 60; // Time difference in minutes
                if (timeDifference > 30) {
                    const slot = await Slot.findById(booking.slot);
                    if (slot) {
                        slot.isBooked = false;
                        await slot.save();
                        await Booking.findByIdAndDelete(booking._id); // Optionally remove booking
                        console.log('Pending slots cleaned up.');
                    }
                }
            }
        } catch (error) {
            console.error('Error cleaning pending slots:', error.message);
        }
    });
};

// Function to free slots with 'Completed' payment status after 4 hours
exports.freeCompletedSlots = () => {
    nodeCron.schedule('*/1 * * * *', async () => { // Change to '0 */4 * * *' for every 4 hours
        try {
            const now = new Date();
            const bookings = await Booking.find({ paymentStatus: 'Completed' });

            for (const booking of bookings) {
                const timeDifference = (now - new Date(booking.dateBooked)) / 1000 / 60 / 60; // Time difference in hours
                if (timeDifference > 4) {
                    const slot = await Slot.findById(booking.slot);
                    //const slot = await Slot.findById({id: booking.slot, isBooked: true});
                    if (slot) {
                        slot.isBooked = false;
                        await slot.save();
                        // Optionally update booking status or log details
                        console.log('Completed slots cleaned up.');
                    }
                }
            }
            
        } catch (error) {
            console.error('Error cleaning completed slots:', error.message);
        }
    });
};