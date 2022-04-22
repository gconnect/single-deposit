import { makeApplicationCreateTxnFromObject,OnApplicationComplete, waitForConfirmation,
   encodeUint64, getApplicationAddress, makeApplicationNoOpTxn, } from "algosdk";
import fs from "fs";
require('dotenv').config({path: './.env'})

   // Connect your client
   const algodToken = {"X-API-Key": process.env.API_KEY}
   const algodServer = process.env.ALGOD_SERVER
   const algodPort = process.env.PORT
   let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

   const account = algosdk.mnemonicToSecretKey(process.env.SENDER)
   const user = account.addr

  const deploy = async () => {
    const suggestedParams = await algodClient.getTransactionParams().do();

    const app = fs.readFileSync(new URL("./approval.teal"), "utf8");
    const compileApp = await algodClient.compile(app).do();

    const clearState = fs.readFileSync(new URL("./clear_state.teal"), "utf8");
    const compiledClearProg = await algodClient.compile(clearState).do();
  
    const tx = makeApplicationCreateTxnFromObject({
      suggestedParams,
      from: user.addr,
      approvalProgram: new Uint8Array(Buffer.from(compileApp.result, "base64")),
      clearProgram: new Uint8Array(Buffer.from(compiledClearProg.result, "base64")),
      numGlobalByteSlices: 0,
      numGlobalInts: 0,
      numLocalByteSlices: 0,
      numLocalInts: 0,
      onComplete: OnApplicationComplete.NoOpOC,
    });

    let txSigned = tx.signTxn(user.sk);
    const { txId } = await algodClient.sendRawTransaction(txSigned).do();
    const transactionResponse = await waitForConfirmation(algodClient, txId, 5);
    const appId = transactionResponse["application-index"];
    
    console.log("Created app-id: ", appId);

    return appId
}

const deposit = async (appId) => {

  // get transaction params
  const params = await algodClient.getTransactionParams().do();

  // deposit
  const enc = new TextEncoder();
  const depositAmount = 2000000; //2 Algo

  let txn = makeApplicationNoOpTxn(
    user.addr,
    { ...params, flatFee: true, fee: 2000 }, // must pay for inner transaction
    appId,
    [enc.encode("deposit"), encodeUint64(depositAmount)],
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    getApplicationAddress(appId), // rekey to application address
  );

  let txId = await submitTransaction(txn, user.sk);

  console.log("Deposit transaction id: " + txId);
}

const main = async () =>{
  var appId = await deploy()

  await deposit(appId);
  
  asa_deposit(appId, asset_Id);
};

main()