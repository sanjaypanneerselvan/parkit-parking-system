const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const slotRoutes = require('./routes/slotRoutes');
const accountRoutes = require('./routes/accountRoutes');
//const paymentRoutes = require('./routes/paymentRoutes');

const { freePendingSlots, freeCompletedSlots } = require('./controllers/accountController'); // Import the functions

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/accounts', accountRoutes);
//app.use('/api/payments', paymentRoutes);

// Schedule the cron jobs when the server starts
freePendingSlots();
freeCompletedSlots();

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found.' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

