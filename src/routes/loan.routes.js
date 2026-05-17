import express from 'express';
import * as LoanController from '../controllers/loan.controller.js';

const router = express.Router();

router.get('/', LoanController.getAllLoans);
router.get('/:loanId', LoanController.getLoan);
router.post('/', LoanController.createLoan);
router.patch('/:loanId/return', LoanController.returnLoan);

export default router;
