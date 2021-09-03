import { BalanceInterface, TransferInterface } from '../interfaces/interface';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createTransaction } from './transactionModel';

const dbPath = path.resolve(__filename, '../../../databases/balances.json');
/**
 *
 * @returns : an array of objects representing the database.
 */
const getDB = () => {
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
const writeToDb = (arr: BalanceInterface[]) => {
  fs.writeFileSync(dbPath, JSON.stringify(arr, null, ' '));
};

const verifyAccountDetails = (accountDetail: BalanceInterface) => {
  if (
    typeof accountDetail.account === 'string' &&
    typeof accountDetail.balance === 'number' &&
    accountDetail.account.length === 10
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 *
 * @param newAccountDetails : account(object) to be added to the database
 * @returns : true if added successfully otherwise false if account number already exists or new AccountDetails doesn't have account number and balance
 */
const createAccount = (newAccountDetails: BalanceInterface): boolean => {
  const db = getDB();
  //verify that account number doesn't exist
  const accntNumberExists = db.some(
    (existingAccnt: BalanceInterface) =>
      existingAccnt.account === newAccountDetails.account,
  );
  if (!accntNumberExists && verifyAccountDetails(newAccountDetails) && newAccountDetails.account.length === 10) {
    db.push({
      ...newAccountDetails,
      createdAt: new Date().toISOString(),
    });
    writeToDb(db);
    return true;
  } else {
    return false;
  }
};

/**
 *
 * @param accountNumber : account number associated to balance
 * @returns : balance if account number exists(negative balance can never occur) otherwise -1
 */
const getBalanceByAccountNumber = (accountNumber: string): number => {
  const db = getDB();
  //verfiy that account number exist
  const accntIndex = db.findIndex(
    (existingAccnt: BalanceInterface) =>
      existingAccnt.account === accountNumber,
  );
  if (accntIndex > -1) {
    const { balance } = db[accntIndex];
    return balance;
  } else {
    return accntIndex;
  }
};

/**
 *
 * @returns : all accounts and their balance
 */
const getAccountsAndBalance = (): BalanceInterface[] => {
  return getDB();
};

/**
 *
 * @param accountNumber : account number whose balance should be topped up
 * @param topUpAmount : amount to top up
 * @returns : true if the account number exists otherwise false
 */
const creditAccount = (accountNumber: string, topUpAmount: number): boolean => {
  const db = getDB();
  const accnt: BalanceInterface = db.find(
    (existingAccount: BalanceInterface) =>
      existingAccount.account === accountNumber,
  );
  if (accnt) {
    console.log('Before: ', accnt.balance);
    accnt.balance += topUpAmount;
    // console.log("After: ",accnt.balance)
    writeToDb(db);
    return true;
  } else {
    return false;
  }
};
/**
 *
 * @param accountNumber : accountNumber of the account that should be debited
 * @param debitAmount : amount to debit from the account
 * @returns : true if account number exists and debiting the specified amount won't lead to negative balance otherwise false
 */
const debitAccount = (accountNumber: string, debitAmount: number): boolean => {
  const db = getDB();
  const accnt: BalanceInterface = db.find(
    (existingAccount: BalanceInterface) =>
      existingAccount.account === accountNumber,
  );
  if (accnt && accnt.balance - debitAmount > -1) {
    accnt.balance -= debitAmount;
    writeToDb(db);
    return true;
  } else {
    return false;
  }
};

const transfer = (transferQuery: TransferInterface): boolean => {
  const db = getDB();
  const [giverAccntNo, recipientAccntNo, amount] = [
    transferQuery.from,
    transferQuery.to,
    +transferQuery.amount,
  ];
  const giverAccnt: BalanceInterface = db.find(
    (existingAccnt: BalanceInterface) => existingAccnt.account === giverAccntNo,
  );
  const recipientAccnt: BalanceInterface = db.find(
    (existingAccnt: BalanceInterface) =>
      existingAccnt.account === recipientAccntNo,
  );
  const giverCanGive = giverAccnt.balance - amount > -1;
  if (giverAccnt && recipientAccnt && giverCanGive) {
    const transactionDetail = {
      reference: uuidv4(),
      senderAccount: giverAccntNo,
      amount,
      receiverAccount: recipientAccntNo,
      transferDescription: `Transferred ${amount} from ${giverAccntNo} to ${recipientAccntNo}`,
      createdAt: new Date().toISOString(),
    };
    //debit giver
    const debitSuccessful = debitAccount(giverAccntNo, amount);
    if (debitSuccessful) {
      const creditedSuccessful = creditAccount(recipientAccntNo, amount);
      createTransaction(transactionDetail);
      return true;
    } else {
      return false;
    }
  }

  return false;
};

export {
  createAccount,
  creditAccount,
  getAccountsAndBalance,
  getBalanceByAccountNumber,
  transfer,
};
