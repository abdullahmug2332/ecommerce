import db from '../db.js';

// Controller to get all products
export const home = (req, res) => {
  const query = 'SELECT * FROM products';  

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json({ products: results });
  });
};