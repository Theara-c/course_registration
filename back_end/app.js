import express from "express";

import cors from "cors";
// Route
import courseRouter from "./routes/courseRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import authRoute from './routes/authRoute.js'
import studentRoute from "./routes/studentRoute.js"
import adminRouter from "./routes/adminRoute.js"
import lecturerRouter from "./routes/lecturerRoute.js"
import errorHandler from "./middleware/errorHandler.js";
const app = express();
app.use(express.json());
app.use(cors());
app.use(errorHandler);

app.get("/", async (req, res) => {
  return res.json({ msg: "Hello world" });
});
app.get( '/', async ( req, res) => {
  
})
app.use("/api/courses", courseRouter);
app.use("/api/category", categoryRouter);
app.use("/api/auth", authRoute );
app.use("/api/students", studentRoute);
app.use("/api/admin", adminRouter);
app.use("/api/lecturers", lecturerRouter);


export default app;
