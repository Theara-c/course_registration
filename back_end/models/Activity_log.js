
import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

const ActivityLog=sequelize.define(
"ActivityLog",
{

log_id:{
 type:DataTypes.INTEGER,
 primaryKey:true,
 autoIncrement:true
},


user_id:{
 type:DataTypes.INTEGER
},


action:{
 type:DataTypes.STRING(100),
 allowNull:false
},


target_type:{
 type:DataTypes.STRING(50)
},


target_id:{
 type:DataTypes.INTEGER
}

},
{
 tableName:"activity_log",
 timestamps:true,
 createdAt:"created_at",
 updatedAt:false
}

);


export default ActivityLog;

