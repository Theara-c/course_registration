import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize';
dotenv.config();


const sequelize = new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASSWORD,
{
host: process.env.DB_HOST,
dialect: 'mysql',
port: process.env.PORT,
ssl: { rejectUnauthorized: false}
}
);

sequelize.authenticate()
.then(() => {
console.log('✅ Database connected');
})
.catch((err) => {
console.error('❌ DB connection failed:', err.message);
});

export { sequelize };   

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//     // port: process.env.DB_PORT,
//     // ssl: { rejectUnauthorized: false }
// });
// export  {pool};