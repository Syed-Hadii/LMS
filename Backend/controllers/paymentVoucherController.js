import ChartAccount from "../models/chartAccountsModel.js";
import PaymentVoucher from "../models/paymentVoucherModel.js";

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
    // Payment object create kar rahe hain
    let payment = {
      voucher_no,
      account,
      sub_account,
      posted_date,
      date,
      reference,
      payment_method,
      paid_amount: Number(paid_amount),
      desc,
    };

    // Payment method ke mutabiq relevant fields set karein
    if (payment_method === "Bank Transfer") {
      payment.bank_account = bank_account;
      payment.transaction_number = transaction_number;
    } else if (payment_method === "Cheque") {
      payment.bank_account = bank_account;
      payment.cheque_number = cheque_number;
    } else if (payment_method === "Cash") {
      payment.cash_amount = cash_amount;
    }

    const stockCons = new PaymentVoucher(payment);
    // console.log(sub_account);
    await stockCons.save();
    console.log(typeof paid_amount);

     await accountBalance(sub_account, Number(paid_amount));
    res.json({ success: true, message: "Payment voucher added successfully." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding Stock Receive." });
  }
};

const accountBalance = async (sub_account, paid_amount) => {
  try {
    let account = await ChartAccount.findOne({ "subCat._id": sub_account });
    console.log("account id: ",account);

    if (!account) {
      console.log("Account not found");
      return;
    }

    let subAccount = account.subCat.id(sub_account);

    if (!subAccount) {
      console.log("Sub-account not found");
      return;
    }

    subAccount.balance += paid_amount;

    await account.save();
    console.log("Success:", subAccount.balance);
    
  } catch (error) {
    console.error("Error updating balance:", error);
  }
};

const get = async (req, res) => {
  const fetchAll = req.query.all === "true";
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;
  try {
    if (fetchAll) {
      const vouchers = await PaymentVoucher.find()
        .populate("account")
        .populate("bank_account")
        .lean();

      const voucherList = vouchers.map((voucher) => {
        const subAccountData = voucher.account?.subCat?.find((subCat) =>
          subCat._id.equals(voucher.sub_account)
        );

        return {
          _id: voucher._id,
          voucher_no: voucher.voucher_no,
          posted_date: voucher.posted_date,
          date: voucher.date,
          reference: voucher.reference,
          account: voucher.account?.acc_name || null, // Handle potential null
          sub_account: subAccountData ? subAccountData.name : null,
          payment_method: voucher.payment_method,
          cash_amount: voucher.cash_amount,
          cheque_number: voucher.cheque_number,
          bank_account: voucher.bank_account
            ? {
                account_name: voucher.bank_account.account_name,
                bank_name: voucher.bank_account.bank_name,
                number: voucher.bank_account.number,
              }
            : null,
          transaction_number: voucher.transaction_number,
          paid_amount: voucher.paid_amount,
          desc: voucher.desc,
          createdAt: voucher.createdAt,
          updatedAt: voucher.updatedAt,
        };
      });

      return res.status(200).json(voucherList);
    } else {
      const totalVouchers = await PaymentVoucher.countDocuments();
      const vouchers = await PaymentVoucher.find()
        .populate("account")
        .populate("bank_account")
        .skip(skip)
        .limit(limit)
        .lean();

      const voucherList = vouchers.map((voucher) => {
        const subAccountData = voucher.account?.subCat?.find((subCat) =>
          subCat._id.equals(voucher.sub_account)
        );

        return {
          _id: voucher._id,
          voucher_no: voucher.voucher_no,
          posted_date: voucher.posted_date,
          date: voucher.date,
          reference: voucher.reference,
          account: voucher.account?.acc_name || null, // Handle potential null
          sub_account: subAccountData ? subAccountData.name : null,
          payment_method: voucher.payment_method,
          cash_amount: voucher.cash_amount,
          cheque_number: voucher.cheque_number,
          bank_account: voucher.bank_account
            ? {
                account_name: voucher.bank_account.account_name,
                bank_name: voucher.bank_account.bank_name,
                number: voucher.bank_account.number,
              }
            : null,
          transaction_number: voucher.transaction_number,
          paid_amount: voucher.paid_amount,
          desc: voucher.desc,
          createdAt: voucher.createdAt,
          updatedAt: voucher.updatedAt,
        };
      });

      res.status(200).json({
        totalVouchers,
        totalPages: Math.ceil(totalVouchers / limit),
        currentPage: page,
        voucherList,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment vouchers.",
    });
  }
};

const remove = async (req, res) => {
  try {
    const { voucherId } = req.body; // Retrieve voucherId from the request body
    const voucher = await PaymentVoucher.findByIdAndDelete(voucherId);

    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found" });
    }

    res.json({ success: true, message: "Voucher deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting voucher", error });
  }
};

const update = async (req, res) => {
  try {
    const {
      voucherId,
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

    const voucher = await PaymentVoucher.findById(voucherId);
    if (!voucher) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found" });
    }

    voucher.voucher_no = voucher_no || voucher.voucher_no;
    voucher.posted_date = posted_date || voucher.posted_date;
    voucher.date = date || voucher.date;
    voucher.reference = reference || voucher.reference;
    voucher.payment_method = payment_method || voucher.payment_method;
    voucher.account = account || voucher.account;
    voucher.sub_account = sub_account || voucher.sub_account;
    voucher.cash_amount = cash_amount || voucher.cash_amount;
    voucher.cheque_number = cheque_number || voucher.cheque_number;
    voucher.bank_account = bank_account || voucher.bank_account;
    voucher.transaction_number =
      transaction_number || voucher.transaction_number;
    voucher.paid_amount = paid_amount || voucher.paid_amount;
    voucher.desc = desc || voucher.desc;

    await voucher.save();
    res.json({
      success: true,
      message: "Voucher updated successfully",
      data: voucher,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error updating voucher", error });
  }
};


export { add, get,  update, remove };

