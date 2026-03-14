import Book from './Book';
import Author from './Author';
import Loan from './Loan';
import User from './User';
import Fine from './Fine';
import BookCategory from './BookCategory';
import Category from './Category';

/*******************************
 *                           ****
 *          ASSOCIATIONS     ****
 *                           ****
 ********************************/

/*******************************
 ********************************
 *                           ****
 *           ONE TO MANY     ****
 *                           ****
 ********************************
 ********************************/

// Books FKs
Author.hasMany(Book, {
  foreignKey: {
    name: 'authorId',
    allowNull: false,
  },
});
Book.belongsTo(Author);

// Loans FKs
User.hasMany(Loan, {
  foreignKey: {
    name: 'loanId',
    allowNull: false,
  },
});
Loan.belongsTo(User);

Book.hasMany(Loan, {
  foreignKey: {
    name: 'bookId',
    allowNull: false,
  },
});
Loan.belongsTo(Book);

/*******************************
 ********************************
 *                           ****
 *           ONE TO ONE      ****
 *                           ****
 ********************************
 ********************************/

// Fines FKs
Loan.hasOne(Fine, {
  foreignKey: {
    name: 'loanId',
    allowNull: false,
  },
});
Fine.belongsTo(Loan);

/*******************************
 ********************************
 *                           ****
 *           MANY TO MANY    ****
 *                           ****
 ********************************
 ********************************/

// BookCategory FKs
Book.belongsToMany(Category, { through: BookCategory });
Category.belongsToMany(Book, { through: BookCategory });
