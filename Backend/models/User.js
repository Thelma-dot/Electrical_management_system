const pool = require('../config/db');

class User {
  static async findByStaffId(staffId) {
    const [rows] = await pool.query('SELECT * FROM users WHERE staff_id = ?', [staffId]);
    return rows[0];
  }

  static async create(user) {
    const { staff_id, password, email } = user;
    const [result] = await pool.query(
      'INSERT INTO users (staff_id, password) VALUES (?, ?, ?)',
      [staff_id, password]
    );
    return result.insertId;
  }

  static async updatePassword(staffId, newPassword) {
    await pool.query('UPDATE users SET password = ? WHERE staff_id = ?', [newPassword, staffId]);
  }

  static async setResetToken(staffId, token, expiry) {
    await pool.query(
      'UPDATE users SET reset_token = ?, token_expiry = ? WHERE staff_id = ?',
      [token, expiry, staffId]
    );
  }

  static async findByResetToken(token) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND token_expiry > NOW()',
      [token]
    );
    return rows[0];
  }

  static async clearResetToken(staffId) {
    await pool.query(
      'UPDATE users SET reset_token = NULL, token_expiry = NULL WHERE staff_id = ?',
      [staffId]
    );
  }
}

module.exports = User;