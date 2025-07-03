import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // 'smtp-relay.brevo.com'
  port: parseInt(process.env.EMAIL_PORT), // 587
  secure: false, // false for port 587 (STARTTLS), true for 465 (SSL)
  auth: {
    user: process.env.EMAIL_USER, // '8390d4001@smtp-brevo.com'
    pass: process.env.EMAIL_PASSWORD, // 'hIfVt4rO9ywSXzcW'
  },
  tls: {
    // Recommended for Brevo
    ciphers: 'SSLv3',
    rejectUnauthorized: false // Only for testing, remove in production
  }
});

export const sendVerificationEmail = async (toEmail, otp) => {
  try {
    await transporter.sendMail({
      from: `"School System" <${process.env.EMAIL_FROM}>`, // Must match verified sender
      to: toEmail,
      subject: 'Verify Your Email',
      html: `
        <p>Your OTP: <strong>${otp}</strong></p>
        <p>Expires in 10 minutes</p>
      `,
    });
  } catch (error) {
    console.error('Brevo SMTP Error:', error);
    throw new Error(`Email failed: ${error.response}`);
  }
};