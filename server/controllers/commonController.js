const Slot = require('../models/Slot');
const Mall = require('../models/Mall');

exports.getMalls = async (req, res) => {
    try {
        const malls = await Mall.find({}, { _id: 1, mall: 1 }); // Fetch mall ID and name
        res.status(200).json({ malls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSlotsByMall = async (req, res) => {
    //console.log(req);
    const { mall } = req.params;
    try {
        const slots = await Slot.find({ mall: mall });
        if (!slots.length) {
            return res.status(404).json({ message: 'No slots found for this mall' });
        }
        res.status(200).json({ slots });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSlotById = async (req,res) => {
    console.log(req.params);
    const { slotId } = req.params;
    console.log(slotId);
    try {
        const slot = await Slot.findById(slotId);
        console.log(slot);
        if (!slot.length) {
            return res.status(404).json({ message: 'No slots found' });
        }
        res.status(200).json({ slot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}