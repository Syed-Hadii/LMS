import recieveVoucher from "../models/recieveVoucherModel.js";
import Item from "../models/itemModel.js";

const add = async (req, res) => {
  const {
    voucher_no,
    posted_date,
    date,
    reference,
    recieve_method,
    account,
    sub_account,
    cash_amount,
    cheque_number,
    bank_account,
    transaction_number,
    paid_amount,
    desc,
  } = req.body;
  try {
    let payemnt = {
      voucher_no,
      account,
      sub_account,
      posted_date,
      date,
      reference,
      recieve_method,
      paid_amount,
      desc,
    };
    if (recieve_method === "Bank Transfer") {
      payemnt.bank_account = bank_account;
      payemnt.transaction_number = transaction_number;
    } else if (recieve_method === "Cheque") {
      payemnt.bank_account = bank_account;
      payemnt.cheque_number = cheque_number;
    } else if (recieve_method === "Cash") {
      payemnt.cash_amount = cash_amount;
    }
    const stockCons = new recieveVoucher(payemnt);

    await stockCons.save();

    res.json({ success: true, message: "Pay Recive added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding Stock Recive." });
  }
};

export { add };
