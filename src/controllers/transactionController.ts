import {
  getTransaction,
  getAllTransactions,
  deleteTransaction,
} from '../models/transactionModel';
import { Response, Request } from 'express';

const findTransactionByReference = (req: Request, res: Response): void => {
  const transaction = getTransaction(req.params.reference);
  if (transaction) {
    res.status(200).json({
      status: 'success',
      data: transaction,
    });
  } else {
    res.status(404).json({
      status: 'fail',
      msg: 'Transaction not found.',
    });
  }
};

const findAllTransactions = (req: Request, res: Response): void => {
  const allTransactions = getAllTransactions();
  res.status(200).json({
    status: 'success',
    data: allTransactions,
  });
};

const deleteTransactionById = (req: Request, res: Response): void => {
  const reference = req.params.reference;
  const deleted = deleteTransaction(reference);
  if (deleted) {
    res.status(200).json({
      status: 'success',
      msg: `Transaction ${reference} was deleted.`,
    });
  } else {
    res.status(404).json({
      status: 'fail',
      msg: "Unable to delete transaction, ensure that you're referencing a valid transaction.",
    });
  }
};

export {
  findAllTransactions,
  findTransactionByReference,
  deleteTransactionById,
};
