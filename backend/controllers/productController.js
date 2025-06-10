import db from '../db.js';
import path from 'path';
import fs from 'fs';

export const getAllProducts = (req, res) => {
  const query = 'SELECT * FROM products';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Failed to get products' });
    }

    res.json(results);
  });
};

export const getProductById = (req, res) => {
  const productId = req.params.id;

  const sql = 'SELECT * FROM products WHERE id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(result[0]);
  });
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    db.query("DELETE FROM `products` WHERE id= ?", [productId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed in deleteing product" });
    res.json({messgae:"Delete Successfully"});
  });

  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

const __dirname = path.resolve();

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, description } = req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = `/products/${req.file.filename}`;
  }

  const getOldImage = 'SELECT image FROM products WHERE id = ?';
  db.query(getOldImage, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });

    const oldImagePath = result[0]?.image;

    const updateQuery = `
      UPDATE products 
      SET name = ?, category = ?, price = ?, stock = ?, description = ?
      ${imagePath ? ', image = ?' : ''}
      WHERE id = ?
    `;

    const values = imagePath
      ? [name, category, price, stock, description, imagePath, id]
      : [name, category, price, stock, description, id];

    db.query(updateQuery, values, (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });

      // Delete old image if a new one was uploaded
      if (imagePath && oldImagePath) {
        const filePath = path.join(__dirname, oldImagePath);
        fs.unlink(filePath, (err) => {
          if (err) console.log('Failed to delete old image:', err);
        });
      }

      res.json({ message: 'Product updated successfully' });
    });
  });
};

export const filterProducts = (req, res) => {
  const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  let query = 'SELECT * FROM products WHERE 1=1';
  const values = [];

  if (category) {
    query += ' AND category = ?';
    values.push(category);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    values.push(minPrice);
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    values.push(maxPrice);
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  values.push(parseInt(limit), offset);

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error filtering products:', err);
      return res.status(500).json({ message: 'Failed to filter products' });
    }

    res.json(results);
  });
};