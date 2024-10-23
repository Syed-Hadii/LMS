import JournalVoucher from "../models/journalVoucherModel.js";
import ChartAccount from "../models/chartAccountsModel.js";

const add = async (req, res) => {
  const { voucher_no, posted_date, date, debit, credit, memo } = req.body;

  // Validate accounts and sub-accounts
  if (
    !debit.account ||
    !debit.sub_account ||
    !credit.account ||
    !credit.sub_account
  ) {
    return res.status(400).json({
      success: false,
      message: "Account and sub-account must be provided.",
    });
  }

  try {
    // Create the journal voucher
    const journalVoucher = new JournalVoucher({
      voucher_no,
      posted_date,
      date,
      credit: {
        account: credit.account,
        sub_account: credit.sub_account,
        credit_amount: Number(credit.credit_amount),
      },
      debit: {
        account: debit.account,
        sub_account: debit.sub_account,
        debit_amount: Number(debit.debit_amount),
      },
      memo,
    });

    await journalVoucher.save();

    // Update balances for both accounts
    await updateAccountBalance(
      debit.sub_account,
      Number(debit.debit_amount),
      "debit"
    );
    await updateAccountBalance(
      credit.sub_account,
      Number(credit.credit_amount),
      "credit"
    );


    res.json({
      success: true,
      message: "Journal voucher created successfully.",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error Journal voucher creation." });
  }
};

// Function to update the account balance
const updateAccountBalance = async (sub_account, amount, type) => {
  try {
    // Find the account based on the sub_account
    let account = await ChartAccount.findOne({ "subCat._id": sub_account });

    if (!account) {
      console.log("Account not found");
      return;
    }

    let subAccount = account.subCat.id(sub_account);

    if (!subAccount) {
      console.log("Sub-account not found");
      return;
    }

    // Update the balance based on whether it's a debit or credit
    if (type === "debit") {
      subAccount.balance -= amount; // Decrease balance for debit
    } else if (type === "credit") {
      subAccount.balance += amount; // Increase balance for credit
    }

    await account.save();
    console.log("Updated Balance:", subAccount.balance);
  } catch (error) {
    console.error("Error updating balance:", error);
  }
};

const get = async (req, res) => {
  const fetchAll = req.query.all === "true"; // Check if the query parameter 'all' is set to true
  const page = parseInt(req.query.page) || 1; // Default page number
  const limit = 6; // Set your desired limit for pagination
  const skip = (page - 1) * limit; // Calculate skip value for pagination

  try {
    if (fetchAll) {
      // If 'all' is true, fetch all vouchers without pagination
      const vouchers = await JournalVoucher.find()
        .populate("debit.account")
        .populate("credit.account")
        .lean();

      const voucherList = vouchers.map((voucher) => {
        const debitAccount = voucher.debit.account;
        const creditAccount = voucher.credit.account;

        const debitSubAccountData =
          debitAccount && debitAccount.subCat
            ? debitAccount.subCat.find((subCat) =>
                subCat._id.equals(voucher.debit.sub_account)
              )
            : null;

        const creditSubAccountData =
          creditAccount && creditAccount.subCat
            ? creditAccount.subCat.find((subCat) =>
                subCat._id.equals(voucher.credit.sub_account)
              )
            : null;

        return {
          _id: voucher._id,
          voucher_no: voucher.voucher_no,
          posted_date: voucher.posted_date,
          date: voucher.date,
          debit: {
            account: debitAccount ? debitAccount.acc_name : null,
            sub_account: debitSubAccountData ? debitSubAccountData.name : null,
            debit_amount: voucher.debit.debit_amount,
          },
          credit: {
            account: creditAccount ? creditAccount.acc_name : null,
            sub_account: creditSubAccountData
              ? creditSubAccountData.name
              : null,
            credit_amount: voucher.credit.credit_amount,
          },
          memo: voucher.memo,
          createdAt: voucher.createdAt,
          updatedAt: voucher.updatedAt,
        };
      });

      return res.status(200).json(voucherList);
    } else {
      // If 'all' is not true, fetch vouchers with pagination
      const totalVouchers = await JournalVoucher.countDocuments(); // Get total count for pagination
      const vouchers = await JournalVoucher.find()
        .populate("debit.account")
        .populate("credit.account")
        .skip(skip)
        .limit(limit)
        .lean();

      const voucherList = vouchers.map((voucher) => {
        const debitAccount = voucher.debit.account;
        const creditAccount = voucher.credit.account;

        const debitSubAccountData =
          debitAccount && debitAccount.subCat
            ? debitAccount.subCat.find((subCat) =>
                subCat._id.equals(voucher.debit.sub_account)
              )
            : null;

        const creditSubAccountData =
          creditAccount && creditAccount.subCat
            ? creditAccount.subCat.find((subCat) =>
                subCat._id.equals(voucher.credit.sub_account)
              )
            : null;

        return {
          _id: voucher._id,
          voucher_no: voucher.voucher_no,
          posted_date: voucher.posted_date,
          date: voucher.date,
          debit: {
            account: debitAccount ? debitAccount.acc_name : null,
            sub_account: debitSubAccountData ? debitSubAccountData.name : null,
            debit_amount: voucher.debit.debit_amount,
          },
          credit: {
            account: creditAccount ? creditAccount.acc_name : null,
            sub_account: creditSubAccountData
              ? creditSubAccountData.name
              : null,
            credit_amount: voucher.credit.credit_amount,
          },
          memo: voucher.memo,
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
      message: "Error fetching journal vouchers.",
    });
  }
};

const remove = async (req, res) => {
  try {
    const { voucherId } = req.body; // Retrieve voucherId from the request body
    const voucher = await JournalVoucher.findByIdAndDelete(voucherId);

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
  // try {
  //   const {
  //     voucherId,
  //     voucher_no,
  //     posted_date,
  //     date,
  //     reference,
  //     payment_method,
  //     account,
  //     sub_account,
  //     cash_amount,
  //     cheque_number,
  //     bank_account,
  //     transaction_number,
  //     paid_amount,
  //     desc,
  //   } = req.body;

  //   const voucher = await JournalVoucher.findById(voucherId);
  //   if (!voucher) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Voucher not found" });
  //   }

  //   voucher.voucher_no = voucher_no || voucher.voucher_no;
  //   voucher.posted_date = posted_date || voucher.posted_date;
  //   voucher.date = date || voucher.date;
  //   voucher.reference = reference || voucher.reference;
  //   voucher.payment_method = payment_method || voucher.payment_method;
  //   voucher.account = account || voucher.account;
  //   voucher.sub_account = sub_account || voucher.sub_account;
  //   voucher.cash_amount = cash_amount || voucher.cash_amount;
  //   voucher.cheque_number = cheque_number || voucher.cheque_number;
  //   voucher.bank_account = bank_account || voucher.bank_account;
  //   voucher.transaction_number =
  //     transaction_number || voucher.transaction_number;
  //   voucher.paid_amount = paid_amount || voucher.paid_amount;
  //   voucher.desc = desc || voucher.desc;

  //   await voucher.save();
  //   res.json({
  //     success: true,
  //     message: "Voucher updated successfully",
  //     data: voucher,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res
  //     .status(500)
  //     .json({ success: false, message: "Error updating voucher", error });
  // }
};

export { add, get, remove, update };