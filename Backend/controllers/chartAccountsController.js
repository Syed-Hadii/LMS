import ChartAccount from "../models/chartAccountsModel.js";

export const createChartAccount = async (req, res) => {
  try {
    const chartAccount = new ChartAccount({
      name: req.body.name,
      subCat: req.body.subCat || undefined,
    });

    await chartAccount.save();

    res.json({ success: true, message: "Chart added successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching Chart records." });
  }
};
