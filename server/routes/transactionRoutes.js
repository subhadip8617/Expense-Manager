const express = require('express');
const { addTransaction, getAllTransaction, editTransaction, deleteTransaction } = require('../controllers/transactionController');

const transactionRouter = express.Router();

transactionRouter.post('/add-transaction', addTransaction);
transactionRouter.post('/get-transaction', getAllTransaction);
transactionRouter.post('/edit-transaction', editTransaction);
transactionRouter.post('/delete-transaction', deleteTransaction);

module.exports = transactionRouter;