import { Book } from './Book.js';
import { Author } from './Author.js';
import { Loan } from './Loan.js';
import { User } from './User.js';
import { Fine } from './Fine.js';
import { BookCategory } from './BookCategory.js';
import { Category } from './Category.js';

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
    name: 'author_id',
    allowNull: false,
  },
});
Book.belongsTo(Author, {
  foreignKey: {
    name: 'author_id',
  },
});

// Loans FKs
User.hasMany(Loan, {
  foreignKey: {
    name: 'user_id',
    allowNull: false,
  },
});
Loan.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
  },
});

Book.hasMany(Loan, {
  foreignKey: {
    name: 'book_id',
    allowNull: false,
  },
});
Loan.belongsTo(Book, {
  foreignKey: {
    name: 'book_id',
  },
});

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
    name: 'loan_id',
    allowNull: false,
  },
  as: 'fine',
});
Fine.belongsTo(Loan, {
  foreignKey: {
    name: 'loan_id',
  },
});

/*******************************
 ********************************
 *                           ****
 *           MANY TO MANY    ****
 *                           ****
 ********************************
 ********************************/

// BookCategory FKs
Book.belongsToMany(Category, {
  through: BookCategory,
  foreignKey: 'book_id',
  as: 'category',
});

Category.belongsToMany(Book, {
  through: BookCategory,
  foreignKey: 'category_id',
});
