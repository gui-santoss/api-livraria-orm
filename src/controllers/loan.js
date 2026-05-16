import { Loan } from '../model/Loan.js';
import { Book } from '../model/Book.js';
import { User } from '../model/User.js';
import { Fine } from '../model/Fine.js';
import { sequelize } from '../config/db.js';
import logger from '../config/logger.js';

export const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        {
          model: Fine,
          as: 'fine',
          attributes: ['id', 'amount', 'paid_at'],
        },
      ],
    });
    res.status(200).json({ loans });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getLoan = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findByPk(loanId, {
      include: [
        {
          model: Fine,
          as: 'fine',
          attributes: ['id', 'amount', 'paid_at'],
        },
      ],
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found.' });
    }

    res.status(200).json(loan);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createLoan = async (req, res) => {
  const { user_id, book_id, loan_date, due_date } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: 'User is required.' });
  }
  if (!book_id) {
    return res.status(400).json({ message: 'Book is required.' });
  }
  if (!loan_date) {
    return res.status(400).json({ message: 'Loan date is required.' });
  }
  if (!due_date) {
    return res.status(400).json({ message: 'Due date is required.' });
  }

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.is_blocked) {
      await t.rollback();
      return res.status(403).json({ message: 'User is blocked.' });
    }

    const book = await Book.findByPk(book_id);
    if (!book) {
      await t.rollback();
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.stock_available <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Book is not available.' });
    }

    const loan = await Loan.create(
      { user_id, book_id, loan_date, due_date },
      { transaction: t },
    );

    book.stock_available -= 1;
    await book.save({ transaction: t });

    await t.commit();

    res.status(201).json(loan);
  } catch (err) {
    await t.rollback();
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const returnLoan = async (req, res) => {
  const { loanId } = req.params;
  const { return_date } = req.body;

  if (!return_date) {
    return res.status(400).json({ message: 'Return date is required.' });
  }

  const t = await sequelize.transaction();

  try {
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      await t.rollback();
      return res.status(404).json({ message: 'Loan not found.' });
    }

    if (loan.return_date) {
      await t.rollback();
      return res.status(400).json({ message: 'Loan already returned.' });
    }

    const book = await Book.findByPk(loan.book_id);

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

    res.status(200).json({ message: 'Book returned!', loan });
  } catch (err) {
    await t.rollback();
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
