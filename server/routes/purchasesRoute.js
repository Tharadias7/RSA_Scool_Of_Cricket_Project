const express = require('express');
const router = express.Router();
const { Purchases, Uniform } = require('../models');
const db = require('../models');

// Get all purchases records
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchases.findAll();
    res.json(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Create a new purchase record
router.post('/', async (req, res) => {
  const { stockId, playerId, quantity, date, unitPrice } = req.body;

  console.log("Received Payload:", req.body); // Log the incoming payload

  if (!stockId || !playerId || !quantity || !date || !unitPrice) {
    console.log("Validation Error: Missing required fields");
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (isNaN(quantity) || isNaN(parseFloat(unitPrice))) {
    console.log("Validation Error: Quantity and unit price must be numbers");
    return res.status(400).json({ message: 'Quantity and unit price must be numbers' });
  }

  try {
    // Start a transaction to ensure both operations (purchase creation and stock update) are atomic
    await db.sequelize.transaction(async (t) => {
      // Create a new purchase record
      const newPurchase = await Purchases.create({
        stockId,
        playerId,
        quantity,
        date,
        unitPrice: parseFloat(unitPrice)
      }, { transaction: t });

      // Update the current stock in the Uniform table
      const uniform = await Uniform.findByPk(stockId, { transaction: t });
      if (!uniform) {
        console.log("Error: Uniform not found");
        throw new Error('Uniform not found');
      }

      if (uniform.currentStock < quantity) {
        console.log("Error: Not enough stock available");
        throw new Error('Not enough stock available');
      }

      uniform.currentStock -= quantity;
      await uniform.save({ transaction: t });

      res.status(201).json(newPurchase);
    });
  } catch (err) {
    console.error("Error during transaction:", err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
