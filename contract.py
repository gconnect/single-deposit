from pyteal import *

def approval_program():
  
  on_create = Seq([
    App.globalPut(Bytes("contract_creator"), Txn.sender()),
    Return(Int(1))
  ])

  on_asset_transfer = Seq([
    Assert(Global.group_size() == Int(1)),
    Assert(Txn.application_args.length() == Int(3)), 
    
    InnerTxnBuilder.Begin(),
    InnerTxnBuilder.SetFields({
      TxnField.type_enum: TxnType.AssetTransfer,
      TxnField.asset_receiver:  Global.current_application_address(),
      TxnField.asset_amount: Btoi(Txn.application_args[1]),
      TxnField.xfer_asset: Txn.assets[0],
      TxnField.fee : Int(0),
      TxnField.rekey_to: Txn.sender()
    }),
    InnerTxn.Submit(),
    ])
  
  program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.NoOp, on_asset_transfer],
        [
            Or(
            Txn.on_completion() == OnComplete.OptIn,
            Txn.on_completion() == OnComplete.CloseOut,
            Txn.on_completion() == OnComplete.UpdateApplication,
            Txn.on_completion() == OnComplete.DeleteApplication,
            ),
            Reject(),
        ],
    )

  return program

def clear_state_program():
  
    return Int(1)


with open("approval.teal", "w") as f:
    compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
    f.write(compiled)

with open("clear_state.teal", "w") as f:
    compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
    f.write(compiled)
