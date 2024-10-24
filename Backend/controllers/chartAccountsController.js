import ChartAccount from "../models/chartAccountsModel.js";

export const createChartAccount = async (req, res) => {
  try {
    const { acc_name, account_nature, subCat } = req.body;

    // Case 1: Create a main account if no sub-account data is provided
    if (!subCat || subCat.length === 0) {
      const newAccount = new ChartAccount({
        acc_name,
        account_nature, // Only main accounts will have account_nature
        subCat: [],
      });
      await newAccount.save();
      return res
        .status(201)
        .json({ message: "Main account created", data: newAccount });
    }
    // Case 2: Adding a sub-account to an existing main account
    else {
      const {
        parent_id,
        name: subAccountName,
        amount = 0, // Default amount if not provided
      } = subCat[0]; // Extract the first sub-account data from request

      // Fetch the parent (main) account by ID
      const mainAccount = await ChartAccount.findById(parent_id);
      if (!mainAccount) {
        return res.status(404).json({ message: "Main account not found" });
      }

      // Create a new sub-account object
      const newSubAccount = {
        parent_id,
        name: subAccountName,
        amount,
        balance: amount, // Set initial balance equal to the amount
      };

      // Add the new sub-account to the parent account's subCat array
      mainAccount.subCat.push(newSubAccount);

      // Update the main account’s total credit or debit based on its nature
      if (mainAccount.account_nature === "Credit") {
        mainAccount.total_credit_amount += amount;
      } else if (mainAccount.account_nature === "Debit") {
        mainAccount.total_debit_amount += amount;
      }

      // Save the updated main account with the new sub-account
      await mainAccount.save();

      return res
        .status(200)
        .json({ message: "Sub-account added", data: mainAccount });
    }
  } catch (error) {
    console.error("Error creating chart account:", error);
    res.status(500).json({ message: "Error adding chart account", error });
  }
};


export const getChartAccounts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;
  const fetchAll = req.query.all === "true"; // Check if 'all' is requested

  try {
    let chartAccounts;
    let totalAcc;

    if (fetchAll) {
      // Fetch all accounts
      chartAccounts = await ChartAccount.find().populate({
        path: "subCat.parent_id",
        select: "acc_name",
      });
      totalAcc = chartAccounts.length; // Total accounts when fetching all
    } else {
      // Paginated data
      totalAcc = await ChartAccount.countDocuments();
      chartAccounts = await ChartAccount.find()
        .skip(skip)
        .limit(limit)
        .populate({
          path: "subCat.parent_id",
          select: "acc_name",
        });
    }

    res.json({
      success: true,
      totalAcc,
      totalPages: Math.ceil(totalAcc / limit),
      currentPage: page,
      chartAccounts,
    });
  } catch (error) {
    console.error("Error fetching chart accounts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Chart accounts.",
    });
  }
};

export const updateChartAccount = async (req, res) => {
  try {
    const { accountId, subAccountId, acc_name, account_nature, subCat } =
      req.body;
    const mainAccount = await ChartAccount.findById(accountId);
    if (!mainAccount) {
      return res.status(404).json({ message: "Main account not found" });
    }

    if (!subAccountId) {
      // Update main account details
      mainAccount.acc_name = acc_name;
      mainAccount.account_nature = account_nature; // Update account nature if provided
    } else {
      const subAccount = mainAccount.subCat.id(subAccountId);
      if (!subAccount) {
        return res.status(404).json({ message: "Sub-account not found" });
      }

      // Update sub-account details
      subAccount.name = subCat.name || subAccount.name;
      subAccount.amount =
        subCat.amount !== undefined ? subCat.amount : subAccount.amount; // Update amount
      subAccount.balance = subAccount.amount; // Set balance equal to the updated amount
    }

    // Recalculate total balances of the main account
    mainAccount.total_credit_amount = mainAccount.subCat.reduce(
      (sum, subAccount) =>
        subAccount.account_nature === "Credit" ? sum + subAccount.balance : sum,
      0
    );

    mainAccount.total_debit_amount = mainAccount.subCat.reduce(
      (sum, subAccount) =>
        subAccount.account_nature === "Debit" ? sum + subAccount.balance : sum,
      0
    );

    await mainAccount.save();
    return res.status(200).json({
      message: `${subAccountId ? "Sub-account" : "Main account"} updated`,
      data: mainAccount,
    });
  } catch (error) {
    console.error("Error updating chart account:", error);
    res.status(500).json({ message: "Error updating chart account", error });
  }
};

export const deleteChartAccount = async (req, res) => {
  try {
    const { accountId, subAccountId } = req.body;

    // Check if accountId is provided
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Find the main account
    const mainAccount = await ChartAccount.findById(accountId);
    if (!mainAccount) {
      return res.status(404).json({ message: "Main account not found" });
    }

    // If subAccountId is provided, delete the sub-account
    if (subAccountId) {
      const subAccountIndex = mainAccount.subCat.findIndex(
        (subAccount) => subAccount._id.toString() === subAccountId
      );
      if (subAccountIndex === -1) {
        return res.status(404).json({ message: "Sub-account not found" });
      }

      // Remove the sub-account from the array
      mainAccount.subCat.splice(subAccountIndex, 1);

      // Recalculate the total balances of the main account
      mainAccount.total_credit_amount = mainAccount.subCat.reduce(
        (sum, subAccount) =>
          subAccount.account_nature === "Credit"
            ? sum + (subAccount.balance || 0) // Ensure balance exists
            : sum,
        0
      );

      mainAccount.total_debit_amount = mainAccount.subCat.reduce(
        (sum, subAccount) =>
          subAccount.account_nature === "Debit"
            ? sum + (subAccount.balance || 0) 
            : sum,
        0
      );

      await mainAccount.save();
      return res
        .status(200)
        .json({ message: "Sub-account deleted", data: mainAccount });
    } else {
      // If no subAccountId is provided, delete the main account
      await ChartAccount.findByIdAndDelete(accountId);
      return res.status(200).json({ message: "Main account deleted" });
    }
  } catch (error) {
    console.error("Error deleting chart account:", error); 
    return res
      .status(500)
      .json({ message: "Error deleting chart account", error: error.message });
  }
};

