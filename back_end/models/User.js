// import { pool } from "../database/db.js";

// export async function checkExistingUser (email) {
//     const [rows] = await pool.query(`SELECT user_id, password, user_role, email FROM users where email = ?`,[email]);
//  return rows[0];
// }
// export async function createStudent( full_name,email, password, dob, phone_number, gender ) {
//     const [rows] = await pool.query(
//         `INSERT INTO USERS(full_name, email, password, date_of_birth, phone_number, gender ) 
//         values (?, ?, ?, ?, ?, ?)`, [full_name, email, password, dob, phone_number, gender]
//     )
//     return rows.insertId; // return new record id
// }
// export async function getUserById(user_id) {
//     const [rows] = await pool.query(`SELECT user_id, full_name, email, date_of_birth, phone_number, gender FROM users WHERE user_id = ?`, [user_id]);
//     return rows[0];
// }


import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      full_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      phone_number: {
        type: DataTypes.STRING(20),
      },

      telegram_link: {
        type: DataTypes.STRING(255),
      },

      specialization: {
        type: DataTypes.STRING(100),
      },

      gender: {
        type: DataTypes.STRING(10),
      },

      date_of_birth: {
        type: DataTypes.DATEONLY,
      },

      user_role: {
        type: DataTypes.STRING(20),
        defaultValue: "Student",
      },

      last_login: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      createdAt: "create_at",
      updatedAt: "updated_at",
    }
  );

  export default User;


