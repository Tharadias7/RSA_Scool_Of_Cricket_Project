const express = require("express");
const router = express.Router();
const { Equipment, DeletedItem, Staff } = require("../models");
const Sequelize = require('sequelize');

// Get all the records
router.get("/", async (req, res) => {
  try {
    const equipment = await Equipment.findAll({
      where: {
        totalItems: {
          [Sequelize.Op.gt]: 0, // Only include records where totalItems > 0
        },
      },
    });
    res.json(equipment);
  } catch (err) {
    console.error("Error fetching equipment:", err); // Log the error
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Create or update an equipment record
router.post("/", async (req, res) => {
  const { item, brand, totalItems } = req.body;

  try {
    const existingEquipment = await Equipment.findOne({ where: { item, brand } });

    if (existingEquipment) {
      existingEquipment.totalItems += totalItems;
      existingEquipment.availableItems += totalItems;

      await existingEquipment.save();
      res.status(200).json(existingEquipment);
    } else {
      const newEquipment = await Equipment.create({ item, brand, totalItems, availableItems: totalItems });
      res.status(201).json(newEquipment);
    }
  } catch (err) {
    console.error("Error creating or updating equipment record:", err);
    res.status(400).json({ message: err.message });
  }
});

//update amounts after delete
router.put("/update-equipment", async (req, res) => {
  const { stockId, amount, description } = req.body;

  try {
    const equipment = await Equipment.findByPk(stockId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Calculate new values
    const newTotalItems = equipment.totalItems - amount;
    const newAvailableItems = (equipment.availableItems !== null) ? equipment.availableItems - amount : null;

    // Update the equipment
    equipment.totalItems = newTotalItems;
    equipment.availableItems = newAvailableItems;

    await equipment.save();

    res.status(200).json(equipment);
  } catch (err) {
    console.error("Error updating equipment:", err); // Log the error
    res.status(400).json({ message: err.message });
  }
});

// Update an equipment record
router.put("/:stockId", async (req, res) => {
  const { stockId } = req.params;
  const { item, brand, totalItems } = req.body;

  try {
    const equipment = await Equipment.findByPk(stockId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    equipment.item = item;
    equipment.brand = brand;
    equipment.totalItems = totalItems;
    equipment.availableItems = totalItems; // Optional: reset available items to total items

    await equipment.save();
    res.json(equipment);
  } catch (err) {
    console.error("Error updating equipment record:", err);
    res.status(500).json({ message: err.message });
  }
});


// Get all distinct items and brands from equipment
router.get("/options", async (req, res) => {
  try {
    const items = await Equipment.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('item')), 'item']],
      raw: true
    });

    const brands = await Equipment.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']],
      raw: true
    });

    const activeCoaches = await Staff.findAll({
      where: {
        designation: 'Coach',
        active: true,
      },
      attributes: ['employee_no', 'name'],
      raw: true
    });

    res.json({
      items: items.map(i => i.item),
      brands: brands.map(b => b.brand),
      activeCoaches
    });
  } catch (err) {
    console.error("Error fetching options:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Get equipment by stockId
router.get("/:stockId", async (req, res) => {
  const { stockId } = req.params;

  try {
    const equipment = await Equipment.findByPk(stockId);

    if (equipment) {
      res.json(equipment);
    } else {
      res.status(404).json({ message: "Equipment not found" });
    }
  } catch (err) {
    console.error("Error fetching equipment:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;

