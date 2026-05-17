import { Loan } from '../model/Loan.model.js';
import { Fine } from '../model/Fine.model.js';
import { sequelize } from '../config/db.js';
import * as UserService from './user.service.js';
import * as BookService from './book.service.js';

export const getAllLoans = async ({ user_id }) => {
  const where = {};

  if (user_id) {
    where.user_id = user_id;
  }

  return await Loan.findAll({
    where,
    include: [
      {
        model: Fine,
        as: 'fine',
        attributes: ['id', 'amount', 'paid_at'],
      },
    ],
  });
};

export const getLoanById = async (loan_id) => {
  return await Loan.findByPk(loan_id, {
    include: [
      {
        model: Fine,
        as: 'fine',
        attributes: ['id', 'amount', 'paid_at'],
      },
    ],
  });
};

export const createLoan = async ({ user_id, book_id, loan_date, due_date }) => {
  const t = await sequelize.transaction();
  try {
    const user = await UserService.getUserById(user_id);
    if (!user) {
      await t.rollback();
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (user.is_blocked) {
      await t.rollback();
      const error = new Error('User is blocked.');
      error.statusCode = 403;
      throw error;
    }

    const book = await BookService.getBookById(book_id);
    if (!book) {
      const error = new Error('Book not found.');
      error.statusCode = 404;
      throw error;
    }

    if (book.stock_available <= 0) {
      await t.rollback();
      const error = new Error('Book is not available.');
      error.statusCode = 400;
      throw error;
    }

    const loan = await Loan.create(
      { user_id, book_id, loan_date, due_date },
      { transaction: t },
    );

    book.stock_available -= 1;
    await book.save({ transaction: t });

    await t.commit();

    return loan;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const returnLoan = async ({ loan_id, return_date }) => {
  const t = await sequelize.transaction();
  try {
    const loan = await getLoanById(loan_id);

    if (!loan) {
      await t.rollback();
      const error = new Error('Loan not found.');
      error.statusCode = 404;
      throw error;
    }

    if (loan.return_date) {
      await t.rollback();
      const error = new Error('Loan already returned.');
      error.statusCode = 400;
      throw error;
    }

    const book = await BookService.getBookById(loan.book_id);

    if (!book) {
      await t.rollback();
      const error = new Error('Book not found.');
      error.statusCode = 404;
      throw error;
    }

    loan.return_date = return_date;
    await loan.save({ transaction: t });

    book.stock_available += 1;
    await book.save({ transaction: t });

    const fine = await Fine.findOne({ where: { loan_id: loan.id } });

    if (fine) {
      fine.paid_at = return_date;
      await fine.save({ transaction: t });
    }

    await t.commit();
    return loan;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
