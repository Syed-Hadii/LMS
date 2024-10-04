import ChartAccount from "../models/chartAccountsModel.js";

export const createChartAccount = async (req, res) => {
  try {
    const { name, subCat } = req.body;

    // Check if it's a main account (no subCat)
    if (!subCat || subCat.length === 0) {
      // Create a new main account
      const newAccount = new ChartAccount({
        name,
        subCat: [], // Empty subCat for main accounts
      });
      await newAccount.save();
      return res
        .status(201)
        .json({ message: "Main account created", data: newAccount });
    } else {
      // Add sub-account to existing main account
      const {
        parent_id,
        name: subAccountName,
        amount,
        account_nature,
      } = subCat[0];

      // Find the main account by parent_id
      const mainAccount = await ChartAccount.findById(parent_id);

      if (!mainAccount) {
        return res.status(404).json({ message: "Main account not found" });
      }

      // Add sub-account to subCat array of the main account
      mainAccount.subCat.push({
        parent_id,
        name: subAccountName,
        amount,
        account_nature,
      });

      await mainAccount.save();

      return res
        .status(200)
        .json({ message: "Sub-account added", data: mainAccount });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding chart account", error });
  }
};

export const getChartAccounts = async (req, res) => {
  try {
    const chartAccounts = await ChartAccount.find().populate(
      "subCat.parent_id",
      "name"
    );
    res.json({ success: true, data: chartAccounts });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching Chart accounts." });
  }
};
