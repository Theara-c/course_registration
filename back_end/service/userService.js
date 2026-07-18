import { sequelize } from "../database/db.js";
import { Op, fn, col, QueryTypes } from "sequelize";
import { User } from "../models/relationship.js";

export async function checkExistingUser(email) {
  try {
    const user = await User.findOne({
      where: { email: email },
      attributes: ['user_id', 'password', 'user_role', 'email']
    });
    
    return user ? user.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw error;
  }
}

export async function createStudent(full_name, email, password, dob, phone_number, gender) {
  try {
    const newStudent = await User.create({
      full_name: full_name,
      email: email,
      password: password,
      date_of_birth: dob, 
      phone_number: phone_number,
      gender: gender
    });

    return newStudent.user_id; 
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

export async function getUserById(user_id) {
  try {
    const user = await User.findByPk(user_id, {
      attributes: ['user_id', 'full_name', 'email', 'date_of_birth', 'phone_number', 'gender']
    });

    return user ? user.get({ plain: true }) : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

export async function createLecturer( full_name, email, password, dob, phone_number, gender, specialization, telegram_link ) {
  try {
    const newLecturer = await User.create({
      full_name: full_name,
      email: email,
      password: password,
      specialization: specialization,
      telegram_link: telegram_link,
      user_role: "lecturer"
      
    });
    return newLecturer.user_id;
  } catch (error) {
    console.error("Error creating lecturer:", error);
    throw error;
  }
}
//for admin
export async function getDashboardStatistics() {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,

      (SELECT COUNT(*)
       FROM course
       WHERE status = 'Active') AS activeCourses,

      (SELECT COUNT(*)
       FROM course
       WHERE status = 'waiting') AS pendingApprovals;
  `;

  const [dashboard] = await sequelize.query(query, {
    type: QueryTypes.SELECT,
  });

  return dashboard;
}

export async function getPendingCourses(category = null) {

    let query = `
        SELECT
            c.course_id,
            c.title,
            c.created_at,
            cat.category_name,

            u.user_id,
            u.full_name,
            u.specialization

        FROM course c

        JOIN users u
            ON c.user_id = u.user_id

        JOIN category cat
            ON c.category_id = cat.category_id

        WHERE c.status = 'waiting'
    `;

    const replacements = {};

    if (category) {
        query += `
            AND cat.category_name = :category
        `;

        replacements.category = category;
    }

    query += `
        ORDER BY c.created_at DESC;
    `;

    return await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT,
    });

}

export async function getUsers(role, page = 1, limit = 40) {
    const offset = (page - 1) * limit;

    let query = `
        SELECT
            user_id,
            full_name,
            email,
            user_role,
            create_at
        FROM users
        WHERE user_role <> 'Admin'
    `;

    const replacements = {
        limit,
        offset,
    };

    // Filter by role
    if (role && role !== "All") {
        query += `
            AND user_role = :role
        `;

        replacements.role = role;
    }

    query += `
        ORDER BY create_at DESC
        LIMIT :limit
        OFFSET :offset
    `;

    return await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT,
    });
}
export async function getTotalUsers(role) {

    let query = `
        SELECT COUNT(*) AS totalUsers
        FROM users
        WHERE user_role <> 'Admin'
    `;

    const replacements = {};

    if (role && role !== "All") {
        query += `
            AND user_role = :role
        `;

        replacements.role = role;
    }

    const [result] = await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT,
    });

    return result.totalUsers;
}
export async function getUserStatistics() {

    const query = `
        SELECT
        (
            SELECT COUNT(*)
            FROM users
            WHERE user_role = 'Lecturer'
        ) AS totalLecturers,

        (
            SELECT COUNT(*)
            FROM users
            WHERE user_role = 'Student'
        ) AS totalStudents;
    `;

    const [result] = await sequelize.query(query, {
        type: QueryTypes.SELECT,
    });

    return result;
}
