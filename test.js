import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import authenticateToken from "./middleware/Authen.js";
dotenv.config();
const app = express();
app.use(express.json());
const users = [
  {
    name: "John",
    password: "$2b$10$9Tyw/N8M2L47Otf0cRH9OuTIya1G7XHvzUe/pO3VSiJkptLQXny0a",
  },
  {
    name: "No",
    password: "pass",
  },
];

app.get("/user", authenticateToken, async (req, res) => {
  res.json(users.filter((u) => u.name == req.user.name));
});
app.post("/login", async (req, res) => {
  const user = users.find((u) => u.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
    if (err) {
      return res.status(500).send("Error generating token");
    }
    res.json({ accessToken: token });
  });
});

app.listen(3000);
