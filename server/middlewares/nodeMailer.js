const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const EmailUser = process.env.EmailUser;
const EmailPassword = process.env.EmailPassword;

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EmailUser,
        pass: EmailPassword,
    },
});

// Function to send OTP emails
async function sendOTPMail(email, otp) {
    const mailOptions = {
        from: EmailUser,
        to: email,
        subject: 'OTP',
        text: `Your Login OTP is ${otp}`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}

// Function to send general emails
async function sendGeneralMail(mailOptions) {
    // Ensure the from address is always the authenticated user
    mailOptions.from = EmailUser;

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}

module.exports = {
    sendMail: sendOTPMail,  // Keep backward compatibility for OTP
    sendGeneralMail         // New function for general emails
};
