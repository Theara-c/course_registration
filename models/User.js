import { pool } from "../database/db.js";

export async function checkExistingUser (email) {
    const [rows] = await pool.query(`SELECT user_id, password, user_role, email FROM users where email = ?`,[email]);
 return rows[0];
}
export async function createStudent( full_name,email, password, dob, phone_number, gender ) {
    const [rows] = await pool.query(
        `INSERT INTO USERS(full_name, email, password, date_of_birth, phone_number, gender ) 
        values (?, ?, ?, ?, ?, ?)`, [full_name, email, password, dob, phone_number, gender]
    )
    return rows.insertId; // return new record id
}
export async function getUserById(user_id) {
    const [rows] = await pool.query(`SELECT user_id, full_name, email, date_of_birth, phone_number, gender FROM users WHERE user_id = ?`, [user_id]);
    return rows[0];
}

// return user info with enroll course
