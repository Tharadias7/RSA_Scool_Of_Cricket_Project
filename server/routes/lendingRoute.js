const express = require("express");
const router = express.Router();
const { Lendings } = require("../models");

// Get all the records
router.get("/", async (req, res) => {
  try {
    const lendings = await Lendings.findAll();
    res.json(lendings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new lending record
router.post("/", async (req, res) => {
  const { stockId, employee_no, issuedAmount, collectedDate, issuedDate } = req.body;

  console.log("Received lending data:", req.body); // Log the request body

  try {
    const newLending = await Lendings.create({ stockId, employee_no, issuedAmount, collectedDate, issuedDate });
    res.status(201).json(newLending);
  } catch (err) {
    console.error("Error creating lending record:", err); // Log the error
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
