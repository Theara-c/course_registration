import express from "express";
// import loginRoute from './controller/loginRoute'
// import signupRoute from './controller/loginRoute'
import cors from 'cors'
import { pool } from "./database/db.js";
const app = express();
app.use(express.json());
app.use(cors());

const getAllUser = async () => {
  const [rows] = await pool.query(`SELECT * FROM users`);
  return rows;
};
const getUserById = async (id) => {
  const [rows] = await pool.query("select user_id,full_name,email ,password,phone_number, telegram_link,gender,date_of_birth,user_role from users where user_id = ? ", [id]);

  return rows[0];
};
app.get("/", async (req, res) => {
  return res.json({ msg: "Hello world" });
});
app.get("/users/:id", async (req, res) => {
  const  id  = parseInt(req.params.id);
  if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
  try {
    const users = await getUserById(id);
      return res.json(users);
  } catch (error ) {
    return res.status(500).json({ error: "Unable to fetch users" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await getAllUser();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch users" });
  }
});
// app.use('/login', loginRoute);
// app.use('/signup', signupRoute);

export default app;
