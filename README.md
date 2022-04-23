# Single Payment Transaction
Single deposit transaction with Pyteal
This smart contract is able to handle payment transactions.

The user sends an ApplicationCallTxn to the smart contract with 2 app_args: ["deposit", amount] with the rekey_to field is set to the Application Address.
The smart contract calls inner_payment_transaction() subroutine, which sends the specified amount of Algos from the user account to the smart contract and rekeys the account back to the user.

# Contract
`contract.py`

# Deploy
`deploy.py`

# How to run the code:
Run python3 -m pip install -r requirements.txt
Simply run the `contract.py` file

Run `npm install` to install all required dependencies.
