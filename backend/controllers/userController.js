import db from '../db.js'; 

export const getUserById = (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: 'User ID is required' });

  db.query(
    'SELECT id, name, email, password, role, createdat, userimg FROM users WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ message: 'Failed to get user' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(result[0]); 
    }
  );
};

export const getAllUsers = (req, res) => {
  const query = 'SELECT id, name, email, role, createdat, userimg FROM users where role=?';

  db.query(query,["user"] ,(err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Failed to get users' });
    }

    res.json(results);
  });
};
export const deleteUserById = (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: 'User ID is required' });

  // First, delete all products with sellerid = user id
  const deleteProductsQuery = 'DELETE FROM products WHERE sellerId = ?';
  db.query(deleteProductsQuery, [id], (err, productResult) => {
    if (err) {
      console.error('Error deleting user products:', err);
      return res.status(500).json({ message: 'Failed to delete user products' });
    }

    // Then delete the user
    const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
    db.query(deleteUserQuery, [id], (err, userResult) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ message: 'Failed to delete user' });
      }

      return res.json({ message: 'User and associated products deleted successfully' });
    });
  });
};