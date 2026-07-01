// middleware/auth.js
// FIXED: removed the router code that was mixed in here — that was
// causing app.js to import a router with no /login endpoint.
// This file now ONLY contains the protect + requireRole middleware functions.

import jwt from "jsonwebtoken";

export function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Not authorized, no token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, user_role }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is invalid or expired." });
  }
}

// Restricts a route to specific roles: 'Student', 'Lecturer', 'Administrator'
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.user_role)) {
      return res
        .status(403)
        .json({ error: "You do not have permission to access this." });
    }
    next();
  };
}
