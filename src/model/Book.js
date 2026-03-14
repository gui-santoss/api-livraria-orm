import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },
  stock_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  stock_available: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
});
