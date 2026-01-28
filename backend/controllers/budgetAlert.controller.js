import BudgetAlert from "../models/BudgetAlert.js";

/* GET ALL ALERTS */
export const getBudgetAlerts = async (req, res) => {
  try {
    const alerts = await BudgetAlert.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({ data: alerts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

/* CLEAR ALERT */
export const deleteAlert = async (req, res) => {
  try {
    await BudgetAlert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.json({ message: "Alert cleared" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete alert" });
  }
};
