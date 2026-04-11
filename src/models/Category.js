import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true },

  description: { type: DataTypes.TEXT },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

export default Category;