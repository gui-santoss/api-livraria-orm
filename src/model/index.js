import Book from './Book';
import Author from './Author';

// Associations
Book.hasOne(Author, {
  foreignKey: 'authorId',
});
