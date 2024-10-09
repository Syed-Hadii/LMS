import JournalVoucher from "../models/journalVoucherModel.js";

const add = async (req, res) => {
  const {
    voucher_no,
    posted_date,
    date,
    account,
    sub_account,
    bank_account,
    debit_amount,
    credit_amount,
    memo,
  } = req.body;

  try {
    let payment = {
      voucher_no,
      posted_date,
      date,
      account,
      sub_account,
      bank_account,
      debit_amount,
      credit_amount,
      memo,
    };

    const journalVoucher = new JournalVoucher(payment); // Correctly create an instance of JournalVoucher

    await journalVoucher.save(); // Save the instance to the database

    res.json({ success: true, message: "Pay Recive added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding Stock Recive." });
  }
};

export { add };
