const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
    mall: { type: String, required: true },
    slotNumber: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Slot', SlotSchema);
