const express = require('express');
const router = express.Router();
const { Lendings, Equipment, Staff } = require('../models');

// Get all the lending records with associated equipment data
router.get("/", async (req, res) => {
  try {
    const lendings = await Lendings.findAll({
      include: [
        {
          model: Equipment,
          attributes: ['item', 'brand'],
        },
      ],
    });
    res.json(lendings);
  } catch (err) {
    console.error('Error fetching lending records:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new lending record
router.post('/', async (req, res) => {
  const { stockId, employee_no, issuedAmount, issuedDate } = req.body;

  try {
    const equipment = await Equipment.findOne({ where: { stockId } });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (equipment.availableItems < issuedAmount) {
      return res.status(400).json({ message: 'Not enough items available' });
    }

    await Lendings.create({
      stockId,
      employee_no,
      issuedAmount,
      issuedDate,
      collectedDate: null,
    });

    equipment.availableItems -= issuedAmount;
    await equipment.save();

    res.status(201).json({ message: 'Lending record created successfully' });
  } catch (error) {
    console.error('Error creating lending record:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update lending record and increase available items when collected
router.put("/:id/collect", async (req, res) => {
  const { id } = req.params;
  const collectedDate = new Date().toISOString();

  try {
    const lending = await Lendings.findOne({ where: { issueId: id } });

    if (!lending) {
      return res.status(404).json({ message: "Lending record not found" });
    }

    if (lending.collectedDate) {
      return res.status(400).json({ message: "Item already collected" });
    }

    const equipment = await Equipment.findOne({ where: { stockId: lending.stockId } });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Update the lending record with collectedDate
    lending.collectedDate = collectedDate;
    await lending.save();

    // Update the available items in the equipment record
    equipment.availableItems += lending.issuedAmount;
    await equipment.save();

    res.status(200).json({ message: "Collection recorded successfully" });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a lending record
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const lending = await Lendings.findOne({ where: { issueId: id } });

    if (!lending) {
      return res.status(404).json({ message: "Lending record not found" });
    }

    if (!lending.collectedDate) {
      return res.status(400).json({ message: "Cannot delete a lending record that has not been collected" });
    }

    await lending.destroy();

    res.status(200).json({ message: "Lending record deleted successfully" });
  } catch (error) {
    console.error("Error deleting lending record:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;