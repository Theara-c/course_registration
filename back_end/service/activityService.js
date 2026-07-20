import { ActivityLog} from '../models/relationship.js'
import { sequelize } from '../database/db.js'

export async function userAction(user_id, action, target_type, target_id) {
    
    await ActivityLog.create( {
        user_id,
        action: action.trim(),
        target_type: target_type.trim(),
        target_id
    })
}
export async function getUserActivityLog() {
  const [rows] = await sequelize.query(`
    SELECT a.*, u.full_name FROM activity_log a
     LEFT JOIN users u ON a.user_id = u.user_id
     ORDER BY a.created_at DESC`)
     return rows;
}
