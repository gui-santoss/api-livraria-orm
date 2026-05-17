import logger from '../config/logger.js';
import * as LoanService from '../services/loan.service.js';

export const getAllLoans = async (req, res) => {
  const { user_id } = req.query;
  try {
    const loans = await LoanService.getAllLoans({ user_id });

    res.status(200).json({ loans });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getLoan = async (req, res) => {
  const { loan_id } = req.params;

  try {
    const loan = await LoanService.getLoanById(loan_id);

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

  try {
    const loan = await LoanService.createLoan({
      user_id,
      book_id,
      loan_date,
      due_date,
    });

    res.status(201).json(loan);
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: 'Internal server error.' });
  }
};

export const returnLoan = async (req, res) => {
  const { loan_id } = req.params;
  const { return_date } = req.body;

  if (!return_date) {
    return res.status(400).json({ message: 'Return date is required.' });
  }

  try {
    const loan = await LoanService.returnLoan({ loan_id, return_date });

    res.status(200).json({ message: 'Book returned!', loan });
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: 'Internal server error.' });
  }
};
