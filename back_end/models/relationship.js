import {sequelize} from "../database/db.js";

import User from "./User.js";
import Course from "./Course.js";
import Category from "./Category.js";
import Enrollment from "./Enrollment.js";
import Rating from "./Rating.js";
import ActivityLog from "./Activity_Log.js";

// Relationships
// instructor create course
User.hasMany(Course, {
  foreignKey: "user_id",
  as: "courses",
});

Course.belongsTo(User, {
  foreignKey: "user_id",
  as: "instructor",
});

Category.hasMany(Course, {
  foreignKey: "category_id",
  as: "courses",
});

Course.belongsTo(Category, {
  foreignKey: "category_id",
  as: "category",
});

User.hasMany(Enrollment, {
  foreignKey: "user_id",
  as: "enrollments",
});

Enrollment.belongsTo(User, {
  foreignKey: "user_id",
  as: "student",
});

Course.hasMany(Enrollment, {
  foreignKey: "course_id",
  as: "enrollments",
});

Enrollment.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

Enrollment.hasOne(Rating, {
  foreignKey: "enrollment_id",
  as: "rating",
});

Rating.belongsTo(Enrollment, {
  foreignKey: "enrollment_id",
  as: "enrollment",
});

User.hasMany(ActivityLog, {
  foreignKey: "user_id",
  as: "activities",
});

ActivityLog.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

export {
  sequelize,
  User,
  Course,
  Category,
  Enrollment,
  Rating,
  ActivityLog,
};