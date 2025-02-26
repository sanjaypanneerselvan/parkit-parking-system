const nodemailer = require('nodemailer');
require('dotenv').config(); // This loads the .env file

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,  // Your email
        pass: process.env.EMAIL_PASS,  // Your email password
    },
});
module.exports = transporter;
