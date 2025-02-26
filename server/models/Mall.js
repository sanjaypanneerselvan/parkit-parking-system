const mongoose = require('mongoose');

const MallSchema = new mongoose.Schema({
    mall: { type: String, required: true , ref : 'Slot' },
    image: { type: String, required: true },
});

module.exports = mongoose.model('Mall', MallSchema);
