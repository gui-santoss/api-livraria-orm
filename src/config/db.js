import { PostgresDialect } from '@sequelize/postgres';
import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: process.env.PG_DB,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  ssl: true,
  clientMiniMessages: 'notice',
});
