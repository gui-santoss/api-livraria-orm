import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const BookCategory = sequelize.define('BookCategories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
});
