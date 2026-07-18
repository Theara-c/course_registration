import express, { Router } from "express";
import {
  createStudentAccount,
  getCurrent,
  loginUser,
} from "../controller/userController.js";
import authenticate from "../middleware/Authen.js";
const auth = Router();
auth.get("/", (req, res) => {
  res.json("hello");
});
// auth.post("/login",  )
auth.post("/signup", createStudentAccount);

// auth.post("/login", authenticate, getCurrentUser);
auth.post("/login", loginUser);
auth.get("/me", authenticate, getCurrent);

export default auth;
