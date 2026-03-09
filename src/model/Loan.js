import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('pg::memory');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  loan_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  return_date: {
    type: DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
});
