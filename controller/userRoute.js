import {pool} from '../database/db.js'
const getAllUser = async ( ) => {
    const [rows] = await pool.query( `select * from user`);
    return rows;
}
