import app from "../src/app";
import request from "supertest";
import {getAllTransactions} from "../src/models/transactionModel"
import {getAccountsAndBalance} from "../src/models/balanceModel";

describe("TEST FOR BALANCE", ()=>{
    test("/balance GET should return 200, json should contain data property that contains array of accounts", async ()=>{
        await request(app)
              .get("/balance")
              .expect("Content-Type", "application/json; charset=utf-8")
              .expect(200)
              .expect((res)=>{
                  
                  expect(res.body.data).toBeInstanceOf(Array)
              })
    });
    test("/balance/:account GET should return 200, for valid account number", async ()=>{
        const validAccountNo = getAccountsAndBalance()[0].account
        await request(app)
                .get(`/balance/${validAccountNo}`)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .expect((res)=>{
                  expect(res.body.status).toBe('success')
              })
    })

    test("/balance/:account GET should return 404, for invalid account number", async ()=>{
        const validAccountNo = "invalidaccountNumber"
        await request(app)
                .get(`/balance/${validAccountNo}`)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(404)
                .expect((res)=>{
                  expect(res.body.status).toBe('fail')
              })
    })
    test("/balance/transfer should return 200 for successful transfer.", async ()=>{
        const lastTwoAccnts = getAccountsAndBalance().slice(-2)
        const transferData = {
            to: lastTwoAccnts[0].account,
            from: lastTwoAccnts[1].account,
            amount: 1
        }
        await request(app)
                .post("/balance/transfer")
                .send(transferData)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .expect((res)=>{
                  expect(res.body.status).toBe('success')
              })
    });

    test("/balance/transfer should return 403 for invalid account number", async ()=>{
        const lastTwoAccnts = getAccountsAndBalance().slice(-2)
        const transferData = {
            to: "invalidAccountNumber",
            from: lastTwoAccnts[1].account,
            amount: 1
        }
        await request(app)
                .post("/balance/transfer")
                .send(transferData)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(403)
                .expect((res)=>{
                  expect(res.body.status).toBe('fail')
              })
    });

    test("/balance/transfer should return 400 when the 'from' or 'to' or 'amount' property is missing in request body.", async ()=>{
        const lastTwoAccnts = getAccountsAndBalance().slice(-2)
        const transferData = {
            toMe: lastTwoAccnts[0].account,
            fromKe: lastTwoAccnts[1].account,
            amount: 1
        }
        await request(app)
                .post("/balance/transfer")
                .send(transferData)
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(400)
                .expect((res)=>{
                  expect(res.body.status).toBe('fail')
              })
    });
})

describe("TEST FOR TRANSACTIONS", ()=>{
    test("/transaction GET Should return 200 status and data property is an array", async()=>{
        await request(app)
                .get("/transaction")
                .expect("Content-Type", "application/json; charset=utf-8")
                .expect(200)
                .expect((res)=>{
                    expect(res.body.data).toBeInstanceOf(Array)
                })
    });

    test("/transaction/:reference GET should return 200 status code for valid transaction reference", async()=>{
        const validTransactionId = getAllTransactions()[0].reference
        await request(app)
            .get(`/transaction/${validTransactionId}`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect((res)=>{
                expect(res.body.data).toBeInstanceOf(Object)
            });
    });

    test("/transaction/:reference GET should return 404 status code for invalid transaction reference", async()=>{
        const validTransactionId = "aRandomIdThatCanNeverExist"
        await request(app)
            .get(`/transaction/${validTransactionId}`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(404)
            .expect((res)=>{
                expect(res.body.msg).toBe("Transaction not found.")
            });
    });


    // test("/transaction/:reference DELETE should return 200 status code for valid transaction reference", async()=>{
    //     const validTransactionId = getAllTransactions()[0].reference
    //     await request(app)
    //         .delete(`/transaction/${validTransactionId}`)
    //         .expect("Content-Type", "application/json; charset=utf-8")
    //         .expect(200)
    //         .expect((res)=>{
    //             expect(res.body.msg).toBe(`Transaction ${validTransactionId} was deleted.`)
    //         });
    // });

    test("/transaction/:reference DELETE should return 404 status code for invalid transaction reference", async()=>{
        const validTransactionId = "invalidreference"
        await request(app)
            .delete(`/transaction/${validTransactionId}`)
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(404)
            .expect((res)=>{
                expect(res.body.msg).toBe("Unable to delete transaction, ensure that you're referencing a valid transaction.")
            });
    });
});

describe("TEST FOR CREATING ACCOUNT", ()=>{
    test("/create-account POST should return 201 for successful creation of account.", async ()=>{
        const accountDetails = {
            account: "1029473625".split("").sort((a,b)=> 0.5 - Math.random()).join(""),
            balance: 2000
        }
        await request(app)
                .post("/create-account")
                .send(accountDetails)
                .expect("Content-Type", "application/json; charset=utf-8")
            .expect(201)
            .expect((res)=>{
                expect(res.body.status).toBe("success")
            });
    });

    test("/create-account POST should return 400 when 'balance' property is missing in request body.", async ()=>{
        const accountDetails = {
            account: "1029473625".split("").sort(()=> 0.5 - Math.random()).join(""),
            balanciaga: 2000
        }
        await request(app)
                .post("/create-account")
                .send(accountDetails)
                .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .expect((res)=>{
                expect(res.body.status).toBe("fail")
            });
    });


    test("/create-account POST should return 400 when 'account' property is missing in request body.", async ()=>{
        const accountDetails = {
            accountNo: "1029473625".split("").sort(()=> 0.5 - Math.random()).join(""),
            balance: 2000
        }
        await request(app)
                .post("/create-account")
                .send(accountDetails)
                .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400)
            .expect((res)=>{
                expect(res.body.status).toBe("fail")
            });
    });
})

