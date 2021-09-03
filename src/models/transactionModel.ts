import { TransactionInterface } from '../interfaces/interface';
import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__filename, '../../../databases/transactions.json');
/**
 *
 * @returns : an array of Transaction objects representing the database.
 */
const getDB = (): TransactionInterface[] => {
  //ensure that db exists
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
  }
  //get db
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return db;
};

/**
 *
 * @param arr : the database(array) to be written to balances.json
 */
const writeToDb = (arr: TransactionInterface[]) => {
  fs.writeFileSync(dbPath, JSON.stringify(arr, null, ' '));
};

/**
 *
 * @param reference : reference to use to identify the transaction in the database
 * @returns : transaction object if reference(for transaction) exists otherwise false
 */
const getTransaction = (reference: string): TransactionInterface | false => {
  const db = getDB();
  const transaction = db.find(
    (transaction: TransactionInterface) => transaction.reference === reference,
  );
  if (transaction) {
    return transaction;
  } else {
    return false;
  }
};

/**
 *
 * @returns : all the transactions in the database
 */
const getAllTransactions = (): TransactionInterface[] => {
  return getDB();
};

const createTransaction = (transaction: TransactionInterface): boolean => {
  const db = getDB();
  db.push(transaction);
  //update transaction database file
  writeToDb(db);
  return true;
};

/**
 *
 * @param reference : reference to identify the transaction
 * @returns : true if the transaction was deleted successfully otherwise false - mainly because the transaction reference doesn't exist.
 */
const deleteTransaction = (reference: string): boolean => {
  // console.log("Delete has been called....")
  const db = getDB();
  const transactionIndex = db.findIndex(
    (transaction: TransactionInterface) => transaction.reference === reference,
  );
  if (transactionIndex < 0) {
    // console.log("Transaction doesn't exist.")
    return false;
  } else {
    // console.log("Transaction exist..")
    db.splice(transactionIndex, 1);
    writeToDb(db);
    return true;
  }
};
///delete is running infinitely

export {
  getTransaction,
  getAllTransactions,
  createTransaction,
  deleteTransaction,
};
