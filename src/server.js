import express from 'express';
import bodyparser from 'body-parser';
import { sequelize } from './config/db.js';
import userRoutes from './routes/user.js';
import authorRoutes from './routes/author.js';
import categoryRoutes from './routes/category.js';
import bookRoutes from './routes/book.js';
import loanRoutes from './routes/loan.js';
import './model/index.js';
import 'dotenv/config';
import './jobs/fineJob.js';
import logger from './config/logger.js';

const app = express();

const port = process.env.APP_PORT;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.get('/', (req, res, next) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);
app.use('/authors', authorRoutes);
app.use('/categories', categoryRoutes);
app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);

app.use((error, req, res, next) => {
  logger.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

sequelize
  .sync()
  .then((result) => {
    logger.info('Database connected');
    app.listen(port, '0.0.0.0', () => {
      logger.info(`Server running on port ${port}`);
    });
  })
  .catch((err) => logger.error(err));
