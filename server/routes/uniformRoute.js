const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Uniform } = require('../models');

// Get all uniforms
router.get('/', async (req, res) => {
  try {
    const uniforms = await Uniform.findAll();
    res.json(uniforms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific uniform by ID
router.get('/:stockId', async (req, res) => {
  const { stockId } = req.params;

  try {
    const uniform = await Uniform.findByPk(stockId);
    if (uniform) {
      res.json(uniform);
    } else {
      res.status(404).json({ message: 'Uniform not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new uniform record
router.post('/', async (req, res) => {
  const { item, size, unitPrice, amount } = req.body;

  try {
    // Check if a uniform with the same item and size but different unit price exists
    let existingUniform = await Uniform.findOne({ where: { item, size, unitPrice } });

    if (existingUniform) {
      // If it exists, update the currentStock
      existingUniform.currentStock += amount;
      await existingUniform.save();
      res.status(201).json(existingUniform);
    } else {
      // If it doesn't exist or has a different unit price, create a new uniform
      const newUniform = await Uniform.create({ item, size, unitPrice, currentStock: amount });
      res.status(201).json(newUniform);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a uniform record
router.put('/:stockId', async (req, res) => {
  const { stockId } = req.params;
  const { item, size, unitPrice, currentStock } = req.body;

  try {
    const uniform = await Uniform.findByPk(stockId);
    if (!uniform) {
      return res.status(404).json({ message: 'Uniform not found' });
    }

    // Check if another record exists with the same item, size, and unit price
    const existingUniform = await Uniform.findOne({ 
      where: { item, size, unitPrice, stockId: { [Op.ne]: stockId } } 
    });

    if (existingUniform) {
      // If a match is found, update the current stock of the existing record
      existingUniform.currentStock += currentStock;
      await existingUniform.save();

      // Delete the current record
      await uniform.destroy();

      res.json(existingUniform);
    } else {
      // If no match is found, update the current record as usual
      uniform.item = item;
      uniform.size = size;
      uniform.unitPrice = unitPrice;
      uniform.currentStock = currentStock;

      await uniform.save();

      res.json(uniform);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Get the earliest stock record based on item and size
router.get('/earliest', async (req, res) => {
  const { item, size } = req.query;
  try {
    const earliestStock = await Uniform.findOne({
      where: { item, size },
      order: [['createdAt', 'ASC']],
    });
    if (earliestStock) {
      res.json(earliestStock);
    } else {
      res.status(404).json({ message: 'No stock found for the given item and size' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data', error });
  }
});

// Get distinct items from the uniform table
router.get('/items', async (req, res) => {
  try {
    const items = await Uniform.findAll({
      attributes: ['item'],
      group: ['item']
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

// Delete a uniform record
router.delete('/:stockId', async (req, res) => {
  const { stockId } = req.params;

  try {
    const uniform = await Uniform.findByPk(stockId);
    if (!uniform) {
      return res.status(404).json({ message: 'Uniform not found' });
    }

    await uniform.destroy();
    res.json({ message: 'Uniform deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
