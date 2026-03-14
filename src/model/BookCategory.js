import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const BookCategory = sequelize.define('BookCategories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
});
