const express = require("express");
const router = express.Router();
const { Op } = require("sequelize"); 
const { Payment } = require("../models");

// Get all the records
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new payment record
router.post("/", async (req, res) => {
  const { date, amount, month, playerId } = req.body;

  console.log("Received payment data:", req.body); // Log the request body

  try {
    const newPayment = await Payment.create({ date, amount, month, playerId });
    res.status(201).json(newPayment);
  } catch (err) {
    console.error("Error creating payment record:", err); // Log the error
    res.status(400).json({ message: err.message });
  }
});

// Update a payment record
router.put("/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const { month, amount, date } = req.body;

  try {
    const payment = await Payment.findOne({
      where: { playerId, month },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    payment.amount = amount;
    payment.date = date;

    await payment.save();

    res.json(payment);
  } catch (err) {
    console.error("Error updating payment record:", err);
    res.status(400).json({ message: err.message });
  }
});

// Check if a payment exists for a player in a specific month and year
router.get("/:playerId/:month/:year", async (req, res) => {
  const { playerId, month, year } = req.params;

  try {
    const payment = await Payment.findOne({
      where: {
        playerId,
        month,
        date: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        },
      },
    });

    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ message: "No payment found" });
    }
  } catch (error) {
    console.error("Error checking payment:", error);
    res.status(500).json({ message: "Error checking payment", error });
  }
});

module.exports = router;
