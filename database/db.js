import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

// create database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    // port: process.env.DB_PORT,
    // ssl: { rejectUnauthorized: false }
});

pool.getConnection()
    .then(() => console.log('✅ Database connected'))
    .catch(err => console.error('❌ DB connection failed:', err.message));

export  {pool};