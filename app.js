import express from "express";

import cors from "cors";
import { pool } from "./database/db.js";
// Route
import courseRouter from "./routes/courseRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import authRoute from './routes/authRoute.js'
import studentRoute from "./routes/studentRoute.js"
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  return res.json({ msg: "Hello world" });
});
app.get( '/', async ( req, res) => {
  
})


app.use("/api/courses", courseRouter);
app.use("/api/category", categoryRouter);
app.use("/api/auth", authRoute );
app.use("/api/students", studentRoute);


export default app;
