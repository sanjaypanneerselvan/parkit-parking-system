const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const nodeCron = require('node-cron');

exports.bookSlot = async (req, res) => {
    const { slotId, vehicleID, timeSlot } = req.body;

    try {
        const slot = await Slot.findById(slotId);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        if (slot.isBooked) return res.status(400).json({ message: 'Slot already booked' });

        const booking = new Booking({
            slot: slotId,
            user: req.user,
            vehicleID: vehicleID,
            timeSlot: timeSlot,
        });
        await booking.save();

        slot.isBooked = true;
        //slot.bookedBy = req.user._id;
        await slot.save();

        
        res.json({ message: 'Slot booked successfully', booking });

        // Schedule slot to become free after 5 minutes
        // nodeCron.schedule('*/1 * * * *', async () => {
        //     console.log("nodecron",slotId);
        //     const latestBooking = await Booking.findOne({ slot: slotId }).sort({ dateBooked: -1 });
        //     if (latestBooking && latestBooking.paymentStatus !== 'Completed') {
        //         slot.isBooked = false;
        //         await slot.save();
        //     }
        // });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
