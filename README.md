# Single Payment Transaction
Single deposit transaction with Pyteal
This smart contract is able to handle payment transactions.

The user sends an ApplicationCallTxn to the smart contract with 2 app_args: ["deposit", amount] with the rekey_to field is set to the Application Address.
The smart contract calls inner_payment_transaction(), which sends the specified amount of Algos from the user account to the smart contract and rekeys the account back to the user.

# Contract
`contract.py`. The contract was created using Pyteal innertransaction and rekeyed to the contract.

# Deploy
`deploy.py` . The frontend was deployed using the Algorand JavaScript SDK.

# How to run the code:
Run python3 -m pip install -r requirements.txt
To run the contract simply run the `python3 contract.py` 
To deploy the contract and the payment transaction run `node deploy.js`

Run `npm install` to install all required dependencies.

# Demo
View in [algoexplorer](https://testnet.algoexplorer.io/application/85471002)

<img width="671" alt="Screenshot 2022-04-23 at 02 25 00" src="https://user-images.githubusercontent.com/23031920/164859480-b2f07bb0-8c72-4249-8c9b-54d2c939c49e.png">

LICENSE
Distributed under the MIT License. See for more information LICENSE

Disclaimer
This project is not audited and should not be used in a production environment.
