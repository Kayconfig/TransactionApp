## Problem Description:

Imagine you are asked to develop a transfer service with APIs to transfer money between two accounts
You application is expected to have the following database structure

- TABLE 1 - transactions  
    - reference (unique)
    - senderAccount nr
    - amount
    - receiverAccount nr
    - transferDescription
    - createdAt

- TABLE 2 - balances 
    - account nr (unique)
    - balance
    - createdAt

The transaction table registers any transaction in an account (ie. today I paid N2000 for a movie with my card), the balances table represents the account balance of customers (ie. I have N50k in my bank account). If a sender is trying to make a transaction of an amount of money more than his current balance, an error should be returned indicating insufficient funds

The API you are to develop should be able to handle a transfer request of the form below and updates the transactions/balances table accordingly.
```
{
    from: account,
    to: account,
    amount: money
}
```




