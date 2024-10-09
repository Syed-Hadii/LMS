import PaymentVoucher from "../models/paymentVoucherModel.js";
import Item from "../models/itemModel.js";

const add = async (req, res) => {
  const {
    voucher_no,
    posted_date,
    date,
    reference,
    payment_method,
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
      payment_method,
      paid_amount,
      desc,
    };
    if (payment_method === "Bank Transfer") {
      payemnt.bank_account = bank_account;
      payemnt.transaction_number = transaction_number;
    } else if (payment_method === "Cheque") {
      payemnt.bank_account = bank_account; 
      payemnt.cheque_number = cheque_number;
    } else if (payment_method === "Cash") {
      payemnt.cash_amount = cash_amount;
    }
    const stockCons = new PaymentVoucher(payemnt);

    await stockCons.save();

    res.json({ success: true, message: "Pay Recive added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding Stock Recive." });
  }
};

export { add };
