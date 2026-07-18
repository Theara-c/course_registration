
import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

const Rating=sequelize.define(
"Rating",
{

rating_id:{
 type:DataTypes.INTEGER,
 primaryKey:true,
 autoIncrement:true
},


enrollment_id:{
 type:DataTypes.INTEGER,
 allowNull:false
},


rating:{
 type:DataTypes.INTEGER,
 allowNull:false,
 validate:{
   min:1,
   max:5
 }
},


feedback:{
 type:DataTypes.TEXT
}

},
{
 tableName:"rating",
 timestamps:true,
 createdAt:"created_at",
 updatedAt:false
}

);

export default Rating;