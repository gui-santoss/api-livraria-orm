import { PostgresDialect } from '@sequelize/postgres';
import { Sequelize } from 'sequelize';
import { Author } from '../model/Author';
import { Book } from '../model/Book';
import { BookCategory } from '../model/BookCategory';
import { Category } from '../model/Category';
import { Fine } from '../model/Fine';
import { Loan } from '../model/Loan';
import { User } from '../model/User';

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'library',
  user: 'root',
  password: 'root',
  host: 'localhost',
  port: 5432,
  ssl: true,
  clientMiniMessages: 'notice',
  models: [Author, Book, BookCategory, Category, Fine, Loan, User],
});

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
