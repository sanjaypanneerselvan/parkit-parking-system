const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Admin = require('../models/Admin');
const Mall = require('../models/Mall');

const mongoose = require('mongoose');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword });
        //const user = new User({ fullName, email, password, phoneNo });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    //console.log(username,password);
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: 'Admin not found.' });
        //console.log(password, admin.password);
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ admin: admin._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Admin Login Successful", token , admin});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSalesReport = async (req, res) => {
    try {
        // Step 1: Fetch mall-specific data
        const mallReport = await Booking.aggregate([
            {
                $lookup: {
                    from: 'slots', // First lookup to join Slot collection
                    localField: 'slot',
                    foreignField: '_id',
                    as: 'slotDetails',
                }
            },
            {
                $unwind: '$slotDetails' // Flatten slotDetails
            },
            {
                $group: {
                    _id: '$slotDetails.mall', // Group by mall (from Slot)
                    totalBookings: { $sum: 1 },
                    totalRevenue: { $sum: '$slotDetails.price' },
                }
            },
            {
                $lookup: {
                    from: 'slots', // Lookup all slots related to this mall
                    localField: '_id',
                    foreignField: 'mall',
                    as: 'allSlots',
                }
            },
            {
                $addFields: {
                    totalSlots: { $size: '$allSlots' },
                    slotsAvailable: {
                        $size: {
                            $filter: {
                                input: '$allSlots',
                                as: 'slot',
                                cond: { $eq: ['$$slot.isBooked', false] }
                            }
                        }
                    },
                }
            },
            {
                $addFields: {
                    availabilityPercentage: {
                        $cond: {
                            if: { $eq: ['$totalSlots', 0] },
                            then: 0,
                            else: {
                                $multiply: [
                                    { $divide: ['$slotsAvailable', '$totalSlots'] },
                                    100
                                ]
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'malls', // Lookup the Mall collection to get image URL
                    localField: '_id', // Match mall name from the group stage
                    foreignField: 'mall', // Match with the mall field in Mall schema
                    as: 'mallDetails',
                }
            },
            {
                $unwind: '$mallDetails' // Flatten mallDetails
            },
            {
                $project: {
                    _id: 0, // Hide default _id field
                    mall: '$_id',
                    totalBookings: 1,
                    totalRevenue: 1,
                    totalSlots: 1,
                    slotsAvailable: 1,
                    availabilityPercentage: { $round: ['$availabilityPercentage', 2] },
                    imageUrl: '$mallDetails.image' // Include image URL from Mall
                }
            }
        ]);
        //console.log(mallReport);
        // Step 2: Calculate overall statistics
        const overallStats = await Booking.aggregate([
            {
                $match: {
                    paymentStatus: 'Completed' // Include only completed bookings
                }
            },
            {
                $lookup: {
                    from: 'slots', // Join with Slot collection
                    localField: 'slot',
                    foreignField: '_id',
                    as: 'slotDetails'
                }
            },
            {
                $unwind: '$slotDetails' // Deconstruct slotDetails array
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$slotDetails.price' }, // Sum prices of completed bookings
                    totalBookings: { $sum: 1 } // Count total bookings
                }
            },
            {
                $lookup: {
                    from: 'slots',
                    as: 'allSlots',
                    pipeline: [
                        {
                            $group: {
                                _id: null,
                                totalSlots: { $sum: 1 },
                                slotsAvailable: {
                                    $sum: {
                                        $cond: { if: { $eq: ['$isBooked', false] }, then: 1, else: 0 }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$allSlots'
            },
            {
                $addFields: {
                    totalSlots: '$allSlots.totalSlots',
                    slotsAvailable: '$allSlots.slotsAvailable',
                    availabilityPercentage: {
                        $cond: {
                            if: { $eq: ['$allSlots.totalSlots', 0] },
                            then: 0,
                            else: {
                                $multiply: [
                                    { $divide: ['$allSlots.slotsAvailable', '$allSlots.totalSlots'] },
                                    100
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalBookings: 1,
                    totalSlots: 1,
                    slotsAvailable: 1,
                    availabilityPercentage: { $round: ['$availabilityPercentage', 2] }
                }
            }
        ]);        

        // Combine results
        res.json({
            overallStats: overallStats[0],
            mallReport
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.changeSlotPrice = async (req, res) => {
    const { slotId, newPrice } = req.body;

    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(' ')[0]; // Format: HH:MM:SS

    try {
        // Update the slot with the new price and current date/time
        const slot = await Slot.findByIdAndUpdate(
            slotId,
            { price: newPrice, date: formattedDate, time: formattedTime },
            { new: true }
        );

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        res.json({ message: 'Price updated successfully', slot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSystemStatus = async (req, res) => {
    try {
        // Fetch the latest changes in Booking and Slot collections
        const [latestBooking, latestSlot] = await Promise.all([
            Booking.findOne().sort({ dateBooked: -1 }),
            Slot.findOne().sort({ date: -1, time: -1 }) // Sorting by date and time for accurate comparison
        ]);

        let lastUpdated = null;
        let changeType = '';

        if (latestBooking && latestSlot) {
            const latestSlotDateTime = new Date(`${latestSlot.date}T${latestSlot.time}`);
            if (latestBooking.dateBooked > latestSlotDateTime) {
                lastUpdated = latestBooking.dateBooked;
                changeType = 'New Booking';
            } else {
                lastUpdated = latestSlotDateTime;
                changeType = 'Slot Update';
            }
        } else if (latestBooking) {
            lastUpdated = latestBooking.dateBooked;
            changeType = 'New Booking';
        } else if (latestSlot) {
            lastUpdated = new Date(`${latestSlot.date}T${latestSlot.time}`);
            changeType = 'Slot Update';
        } else {
            lastUpdated = 'No changes available';
            changeType = 'None';
        }

        // Fetch server status
        let serverStatus = null;
        const serverInfo = await mongoose.connection.db.admin().serverStatus();
        if (serverInfo) {
            serverStatus = "Online";
        }

        // Count active users
        const activeUsers = await Booking.distinct('user').countDocuments();

        // Send response
        res.status(200).json({
            serverStatus,
            lastUpdated,
            changeType,
            activeUsers
        });
    } catch (error) {
        console.error('Error fetching system status:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getTodaysOverview = async (req, res) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // Fetch today's bookings, revenue, and slot details
        const [todayBookings, todayRevenue, totalSlots, availableSlots] = await Promise.all([
            Booking.countDocuments({ dateBooked: { $gte: todayStart, $lt: todayEnd }, paymentStatus: 'Completed' }),
            Booking.aggregate([
                { $match: { dateBooked: { $gte: todayStart, $lt: todayEnd }, paymentStatus: 'Completed' } },
                {
                    $lookup: {
                        from: 'slots',
                        localField: 'slot',
                        foreignField: '_id',
                        as: 'slotDetails'
                    }
                },
                { $unwind: '$slotDetails' },
                { $group: { _id: null, totalRevenue: { $sum: '$slotDetails.price' } } }
            ]),
            Slot.countDocuments(),
            Slot.countDocuments({ isBooked: false })
        ]);

        res.status(200).json({
            totalBookings: todayBookings,
            revenue: todayRevenue[0]?.totalRevenue || 0,
            totalSlots,
            availableSlots
        });
    } catch (error) {
        console.error('Error fetching today\'s overview:', error.message);
        res.status(500).json({ message: error.message });
    }
};
