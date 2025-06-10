import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({ storage });

export const register = (req, res) => {
  const { name, email, password } = req.body;
  const userimg = req.file ? `/uploads/${req.file.filename}` : null;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const date = new Date().toISOString().split("T")[0];

  const query =
    "INSERT INTO users (name, email, password, createdat, userimg) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [name, email, hashedPassword, date, userimg],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User registered!" });
    }
  );
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0)
      return res
        .status(401)
        .json({ message: "No user found with this email " });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user, message: `${user.name} logged in sucessfully !` });
  });
};
