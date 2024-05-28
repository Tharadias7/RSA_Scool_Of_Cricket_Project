const express = require("express");
const router = express.Router();
const { Equipment } = require("../models");

// Get all the records
router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.findAll();
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new equipment record
router.post("/", async (req, res) => {
  const { item, brand, totalItems, availableItems } = req.body;

  console.log("Received equipment data:", req.body); // Log the request body

  try {
    const newEquipment = await Equipment.create({ item, brand, totalItems, availableItems });
    res.status(201).json(newEquipment);
  } catch (err) {
    console.error("Error creating equipment record:", err); // Log the error
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
