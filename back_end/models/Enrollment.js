
// import { pool } from "../database/db.js";
// export async function createEnrollmentRecord( user_id, course_id, status) {

//     const [rows] = await pool.query( `
//         INSERT INTO ENROLLMENT( user_id, course_id, status) VALUES(?, ?, ?) `, [user_id, course_id, status]);

//     return rows.insertId;
// }
// export async function updateStatus( user_id, course_id, status) {

//     const [rows] = await pool.query ( 
//         `UPDATE ENROLLMENT 
//         set status = ? where user_id = ? and course_id = ?
//         `, [status, user_id, course_id]
//     )
//     return rows.affectedRows;
    
// }
// export async function updateProgressVideo( user_id, course_id, last_watched) {
//     const [rows] = await pool.query (
//         `UPDATE ENROLLMENT 
//         set last_watched = ? where user_id = ? and course_id = ?
//         `, [last_watched, user_id, course_id]
//     )
//     return rows.affectedRows;
// }
// export async function getEnrollmentInfo( user_id, filter) {
//     let query = `
//     select c.title, c.course_id, c.video_id, c.duration, e.last_watched as progress, e.status from enrollment e
//     join users u on e.user_id = u.user_id
//     join course c on c.course_id = e.course_id
//     where u.user_id = ?
//     `;
//     const params = [];
//     params.push(user_id);
//     if ( filter && filter !== "all") {
//         query += ` and e.status = ?`;
//         params.push(filter);
//     }

//     const [rows] = await pool.query(query, params);
//     return rows;

// }
// export async function getUserInfo(user_id) {
//     const [rows] = await pool.query(`
//         select u.user_id, u.email, u.user_role, u.full_name, u.phone_number, u.date_of_birth as dob
//         from users u 
//         where u.user_id = ?`, [user_id]);
//     return rows[0];
// }


import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";
const Enrollment = sequelize.define(
"Enrollment",
{

 enrollment_id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
 },

 user_id:{
    type:DataTypes.INTEGER,
    allowNull:false
 },

 course_id:{
    type:DataTypes.INTEGER,
    allowNull:false
 },

 status:{
    type:DataTypes.STRING(20),
    defaultValue:"Enrolled"
 },

 last_watched:{
    type:DataTypes.INTEGER
 },

 enrolled_at:{
    type:DataTypes.DATE,
    defaultValue:DataTypes.NOW
 },

 completed_at:{
    type:DataTypes.DATE
 },

 cancelled_at:{
    type:DataTypes.DATE
 }

},
{
 tableName:"enrollment",
 timestamps:false
}
);


export default Enrollment;
