require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const crypto = require("crypto"); // For generating reset tokens

const app = express();
app.use(express.json());
app.use(cors());

const users = {}; // Temporary storage (replace with a database in production)

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Ensure this matches your .env file
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ 1️⃣ New Endpoint: `/send-reset-email`
app.post("/send-reset-email", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: "Click the link below to reset your password:\n\nhttp://localhost:5500/reset_password.html",
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// ✅ 2️⃣ Existing Route: `/reset-password` (Generates Token)
app.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        const token = crypto.randomBytes(32).toString("hex"); // Generate token
        users[email] = token; // Store token temporarily

        const resetLink = `http://localhost:5500/reset_password.html?token=${token}&email=${email}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

// ✅ 3️⃣ Update Password Route: `/update-password`
app.post("/update-password", (req, res) => {
    const { email, token, newPassword } = req.body;

    if (!users[email] || users[email] !== token) {
        return res.status(400).send("Invalid or expired token");
    }

    delete users[email]; // Remove token after use
    res.send("Password successfully updated!");
});

// ✅ 4️⃣ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
