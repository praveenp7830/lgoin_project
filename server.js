const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const app = express();

const PORT = 3000;

// ======================================
// DATABASE
// ======================================

const db = new Database("users.db");

// Create users table if it doesn't exist

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS users (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        email TEXT UNIQUE NOT NULL,

        password TEXT NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`,
).run();

console.log("Database connected.");

// ======================================
// MIDDLEWARE
// ======================================

app.use(express.json());

// Serve frontend

app.use(express.static(path.join(__dirname, "public")));

// ======================================
// REGISTER API
// ======================================

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill in all fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    // Check if email already exists

    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user

    db.prepare(
      `
            INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)
        `,
    ).run(name, email, hashedPassword);

    res.status(201).json({
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// ======================================
// LOGIN API
// ======================================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    // Find user

    const user = db
      .prepare(
        `
                SELECT *
                FROM users
                WHERE email = ?
            `,
      )
      .get(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Login successful

    res.json({
      message: "Login successful!",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong.",
    });
  }
});

// ======================================
// START SERVER
// ======================================

app.listen(PORT, () => {
  console.log(`
    
========================================

 NovaAuth Server Running

 http://localhost:${PORT}

========================================

    `);
});
