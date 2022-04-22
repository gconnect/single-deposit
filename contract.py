from pyteal import *

on_create = Seq([
  App.globalPut(Bytes("contract_creator"), Txn.sender()),
  App.globalPut(Bytes("deposit"), Int(0)),
  Return(Int(1))
])

on_asset_transfer = Seq([
  InnerTxnBuilder.Begin(),
  InnerTxnBuilder.SetFields({
    TxnField.type_enum: TxnType.AssetTransfer,
    TxnField.asset_receiver: Txn.Sender(),
    TxnField.asset_amount: Int(1000),
    TxnField.xfer_asset: Txn.assets[0], # Must be in the assets array sent as part of the application call
}),
InnerTxn.Submit(),
])