const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const { sendGeneralMail } = require('../middlewares/nodeMailer');

const sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!email || !name || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const mailOptions = {
            to: 'parianshm@gmail.com', // The recipient's email address
            replyTo: email, // The user's email for replies
            subject: `Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                        <div style="margin-top: 20px;">
                            <p><strong>Message:</strong></p>
                            <p style="white-space: pre-wrap;">${message}</p>
                        </div>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                        This email was sent from the contact form on Tapowan Website.
                    </p>
                </div>
            `
        };

        await sendGeneralMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully' 
        });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email. Please try again later.' 
        });
    }
};

module.exports = {
    sendContactEmail
};
