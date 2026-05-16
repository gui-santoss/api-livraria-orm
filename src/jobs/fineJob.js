import cron from 'node-cron';
import { Fine } from '../model/Fine';
import { Loan } from '../model/Loan';
import 'dotenv/config';
import { Op } from 'sequelize';
import logger from '../config/logger';

cron.schedule('0 6 * * *', async () => {
  const current_date = new Date();
  const where = {};
  where.due_date = { [Op.lt]: current_date };
  where.return_date = { [Op.is]: null };

  let fine_value = process.env.FINE_VALUE;

  try {
    const loans = await Loan.findAll({ where });

    for (const loan of loans) {
      const diff = current_date - new Date(loan.due_date);
      const diffDias = Math.ceil(diff / (1000 * 60 * 60 * 24));

      const final_fine_value = fine_value * diffDias;

      const where = {};

      where.loan_id = { [Op.is]: loan.id };

      const existing_fine = await Fine.findAll({ where });

      if (existing_fine.length > 0) {
        const fine = existing_fine[0];
        Object.assign(fine, {
          amount: final_fine_value,
        });

        await fine.save();
      } else {
        await Fine.create({
          loan_id: loan.id,
          amount: final_fine_value,
        });
      }
    }
  } catch (err) {
    logger.error(err);
  }
});
