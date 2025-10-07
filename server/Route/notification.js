import { Router } from "express";
import { Account } from "../Model/accountSchema.js";
import { generateFinancialAdvises } from "./generateAdvise.js";

const notifyRoute = Router()

notifyRoute.get('/notifications', async (req, res) => {
  try {
    const Email = req.email;
    const refresh = req.query.refresh === "true"; // check query param
    const userAccount = await Account.findOne({ email: Email });

    if (!userAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    let allAdvises;

    if (refresh) {
      // 🔄 Regenerate financial advises
      allAdvises = await generateFinancialAdvises(userAccount);
    } else {
      // ⚡ Return from DB directly
      allAdvises = userAccount.advises || [];
    }

    const unreadCount = allAdvises.filter(a => !a.read).length;

    res.status(200).json({
      message: refresh 
        ? "Notifications refreshed and fetched successfully"
        : "Notifications fetched successfully",
      notifications: allAdvises,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notifyRoute.post('/notifications/mark-read', async (req, res) => {
  try {
    const Email = req.email;
    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) return res.status(404).json({ message: "Account not found" });

    userAccount.advises.forEach(a => (a.read = true));
    await userAccount.save();

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

notifyRoute.delete('/notifications/:id', async (req, res) => {
  try {
    const Email = req.email;
    const notificationId = req.params.id;

    const userAccount = await Account.findOne({ email: Email });
    if (!userAccount) return res.status(404).json({ message: "Account not found" });

    userAccount.advises = userAccount.advises.filter(
      advise => advise._id.toString() !== notificationId
    );

    await userAccount.save();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error in deleting notification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {notifyRoute}