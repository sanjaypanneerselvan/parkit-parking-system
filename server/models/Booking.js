const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vehicleID: {type: String, required: true},
    dateBooked: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    visible: {type: Boolean, default: true},
    timeSlot: {type: Date, required: true},
});

module.exports = mongoose.model('Booking', BookingSchema);
