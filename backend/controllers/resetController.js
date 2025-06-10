// Send verification code
import nodemailer from "nodemailer";
import db from "../db.js";
import bcrypt from "bcryptjs"; // Make sure this is at the top of the file

const verificationCodes = {}

export const sendcode=(req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000); // 6-digit code

  // Check if user exists
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(404).json({ message: "Email not registered." });
    }

    // Store code
    verificationCodes[email] = code;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdullahmug2332@gmail.com", // your email
        pass: "qoyo ujbx sdng gqpk", // use App Password for Gmail
      },
    });

    const mailOptions = {
      from: "abdullahmug2332@gmail.com",
      to: email,
      subject: "Password Reset Code",
      text: `Your verification code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: "Email failed to send" });
      res.json({ message: "Verification code sent to email" });
    });
  });
};


export const resetpassword = (req, res) => {
  const { email, code, newPassword } = req.body;

  if (verificationCodes[email] != code) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  const hashedPassword = bcrypt.hashSync(newPassword, 10); // 🔒 Securely hash the new password

  const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
  db.query(updateQuery, [hashedPassword, email], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to reset password" });
    
    delete verificationCodes[email]; // Clean up the used code
    res.json({ message: "Password reset successfully" });
  });
};