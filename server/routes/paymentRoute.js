const express = require("express");
const router = express.Router();
const { Payment } = require("../models");

// Get all the records
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments); // Corrected typo
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new payment record
router.post("/", async (req, res) => {
  const { transactionId, date, amount, month, playerId } = req.body;

  try {
    const newPayment = await Payment.create({ transactionId, date, amount, month, playerId });
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
