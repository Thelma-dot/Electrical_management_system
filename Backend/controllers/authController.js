const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateResetToken } = require('../utils/passwordReset');
const { validatePassword, validateEmail } = require('../utils/validators');

// Login
exports.login = async (req, res) => {
  try {
    const { staffID, password } = req.body;

    // Validation
    if (!staffID || !password) {
      return res.status(400).json({ error: 'Staff ID and password are required' });
    }

    const user = await User.findByStaffId(staffID);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { staffID: user.staff_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Remove password before sending user data
    const { password: _, ...userData } = user;
    res.json({ token, user: userData });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { staffID } = req.body;
    if (!staffID) {
      return res.status(400).json({ error: 'Staff ID is required' });
    }

    const user = await User.findByStaffId(staffID);
    if (!user) {
      return res.status(404).json({ error: 'Staff ID not found' });
    }

    const token = generateResetToken();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await User.setResetToken(staffID, token, expiry);

    // For now, we just return the token in the response instead of sending email
    res.json({ message: 'Password reset token generated', token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { staffID, token, newPassword } = req.body;

    if (!staffID || !token || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters, include a number and an uppercase letter'
      });
    }

    const user = await User.findByResetToken(token);
    if (!user || user.staff_id !== staffID) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updatePassword(staffID, hashedPassword);
    await User.clearResetToken(staffID);

    res.json({ message: 'Password updated successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByStaffId(req.user.staff_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, reset_token, token_expiry, ...userData } = user;
    res.json(userData);

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findByStaffId(req.user.staff_id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password if requested
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await User.updatePassword(user.staff_id, hashedPassword);
    }

    // Update email if valid
    if (email && validateEmail(email)) {
      await User.updateEmail(user.staff_id, email);
    }

    res.json({ message: 'Profile updated successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
