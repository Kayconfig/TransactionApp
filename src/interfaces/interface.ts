interface TransactionInterface {
  reference?: string;
  senderAccount: string;
  amount: number;
  receiverAccount: string;
  transferDescription: string;
  createdAt: string;
}

interface BalanceInterface {
  account: string;
  balance: number;
  createdAt?: string;
}

interface TransferInterface {
  from: string;
  to: string;
  amount: number;
}

export { TransactionInterface, BalanceInterface, TransferInterface };
