
import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

  const Category = sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "category",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

export default Category;
