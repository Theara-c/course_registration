import {pool} from '../database/db.js'
const getAllUser = async () => {
    const [rows] = await pool.query(`SELECT * FROM users`)
    return rows
}

export { getAllUser }