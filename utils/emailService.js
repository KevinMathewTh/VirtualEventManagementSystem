const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send registration confirmation email
const sendRegistrationEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: 'Welcome to Virtual Event Platform',
      html: `
        <h2>Welcome ${userName}!</h2>
        <p>Your account has been successfully created on the Virtual Event Management Platform.</p>
        <p>You can now log in and start exploring events or create your own events.</p>
        <p>Best regards,<br/>Virtual Event Platform Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Failed to send registration email to ${userEmail}:`, error.message);
  }
};

// Send event registration confirmation email
const sendEventRegistrationEmail = async (userEmail, userName, eventName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Event Registration Confirmation: ${eventName}`,
      html: `
        <h2>Registration Confirmed!</h2>
        <p>Hi ${userName},</p>
        <p>You have successfully registered for the event: <strong>${eventName}</strong></p>
        <p>We look forward to seeing you there!</p>
        <p>Best regards,<br/>Virtual Event Platform Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Event registration email sent to ${userEmail}`);
  } catch (error) {
    console.error(`Failed to send event registration email to ${userEmail}:`, error.message);
  }
};

module.exports = {
  sendRegistrationEmail,
  sendEventRegistrationEmail
};
