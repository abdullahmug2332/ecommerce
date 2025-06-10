import db from '../db.js';
import bcrypt from 'bcryptjs';

export const updateUserProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;
  const userimg = req.file ? `/uploads/${req.file.filename}` : null;

  let query = 'UPDATE users SET ';
  const fields = [];
  const values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email);
  }
  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }
  if (userimg) {
    fields.push('userimg = ?');
    values.push(userimg);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  query += fields.join(', ') + ' WHERE id = ?';
  values.push(userId);

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    db.query('SELECT id, name, email, userimg, createdat FROM users WHERE id = ?', [userId], (err, rows) => {
      if (err) {
        console.error('Error fetching updated user:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      const updatedUser = rows[0];
      res.json({ user: updatedUser });
    });
  });
  console.log("Request body:", req.body);
  console.log("Uploaded file:", req.file);
  console.log("User ID from token:", req.user?.id);
};
