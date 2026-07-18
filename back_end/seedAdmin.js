import bcrypt from "bcrypt";
import User from "./models/User.js";

const existingAdmin = await User.findOne({
  where: {
    email: "admin@example.com",
  },
});

if (!existingAdmin) {
  const password = await bcrypt.hash("admin123", 10);

  await User.create({
    full_name: "System Administrator",
    email: "admin@example.com",
    password,
    user_role: "Admin",
  });

  console.log("Admin account created.");
} else {
  console.log("Admin already exists.");
}