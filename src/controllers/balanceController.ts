import { Response, Request } from 'express';
import {
  createAccount,
  creditAccount,
  getAccountsAndBalance,
  getBalanceByAccountNumber,
  transfer,
} from '../models/balanceModel';

const createNewAccount = (req: Request, res: Response): void => {
  const newAccountDetails = req.body;
  const accountCreated = createAccount(newAccountDetails);
  if (accountCreated) {
    res.status(201).json({
      status: 'success',
      msg: `Account ${newAccountDetails.account} created successfully.`,
    });
  } else {
    res.status(400).json({
      status: 'fail',
      msg: "Unable to create account, please ensure you're sending a valid JSON also provide account number(10 digits long) and balance.",
    });
  }
};

const getBalance = (req: Request, res: Response): void => {
  const accountNo = req.params.account;
  const balance = getBalanceByAccountNumber(accountNo);
  if (balance > -1) {
    res.status(200).json({
      status: 'success',
      data: {
        accountNo,
        balance,
      },
    });
  } else {
    res.status(404).json({
      status: 'fail',
      msg: 'Unable to get balance for invalid account number.',
    });
  }
};

const getAllAccountBalance = (req: Request, res: Response): void => {
  const allAccounts = getAccountsAndBalance();
  res.status(200).json({
    status: 'success',
    data: allAccounts,
  });
};

const deposit = (req: Request, res: Response): void => {
  const depositObj = req.body;
  if (
    'account' in depositObj &&
    'topUpAmount' in depositObj &&
    +depositObj.topUpAmount > 0
  ) {
    const credited = creditAccount(depositObj.account, depositObj.topUpAmount);
    if (credited) {
      res.status(200).json({
        status: 'success',
        msg: `${depositObj.topUpAmount} has been desposited to ${depositObj.account} successfully.\n`,
      });
    } else {
      res.status(404).json({
        status: 'fail',
        msg: "Account number doesn't exist.",
      });
    }
  } else {
    res.status(400).json({
      status: 'fail',
      msg: 'please ensure you use "account" as the key for account number, "topUpAmount" as the key for amount to be deposited, and amount to be added should not be negative.',
    });
  }
};

const transferAmount = (req: Request, res: Response): void => {
  const transferObj = req.body;
  if ('from' in transferObj && 'to' in transferObj && 'amount' in transferObj) {
    const transferred = transfer(transferObj);

    if (transferred) {
      res.status(200).json({
        status: 'success',
        msg: `${transferObj.from} successfully transferred ${transferObj.amount} to ${transferObj.to}`,
      });
    } else {
      res.status(403).json({
        status: 'fail',
        msg: `Please ensure that you're sending a valid account number( for sender and recipient) and the sender has enough balance to send the required amount.`,
      });
    }
  } else {
    res.status(400).json({
      status: 'fail',
      msg: "Invalid data, please ensure that you use the 'from' property for the sender account number, 'to' property for the recipient, and 'amount' property for the amount to be transferred.",
    });
  }
};

export {
  transferAmount,
  deposit,
  getAllAccountBalance,
  getBalance,
  createNewAccount,
};
