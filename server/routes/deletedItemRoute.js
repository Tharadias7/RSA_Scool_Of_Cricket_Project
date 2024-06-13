const express = require("express");
const router = express.Router();
const { DeletedItem, Equipment } = require("../models");

// Get all deleted items with related equipment details
router.get("/", async (req, res) => {
  try {
    const deletedItems = await DeletedItem.findAll({
      include: [{
        model: Equipment,
        attributes: ['item', 'brand']
      }]
    });
    res.json(deletedItems);
  } catch (err) {
    console.error("Error fetching deleted items:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Get a specific deleted item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await DeletedItem.findByPk(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Deleted item not found" });
    }

    res.json(deletedItem);
  } catch (err) {
    console.error("Error fetching deleted item:", err); // Log the error
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// Create a new deleted item entry
router.post("/", async (req, res) => {
  const { stockId, item, brand, totalItems, reason, amount, description } = req.body;

  try {
    const newDeletedItem = await DeletedItem.create({
      stockId,
      item,
      brand,
      totalItems,
      reason,
      deletedAt: new Date(),
      amount,
      description,
    });

    res.status(201).json(newDeletedItem);
  } catch (err) {
    console.error("Error creating deleted item:", err); // Log the error
    res.status(400).json({ message: err.message });
  }
});

// Update a deleted item entry
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { stockId, item, brand, totalItems, reason, amount } = req.body;

  try {
    const deletedItem = await DeletedItem.findByPk(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Deleted item not found" });
    }

    deletedItem.stockId = stockId;
    deletedItem.item = item;
    deletedItem.brand = brand;
    deletedItem.totalItems = totalItems;
    deletedItem.reason = reason;

    await deletedItem.save();
    res.json(deletedItem);
  } catch (err) {
    console.error("Error updating deleted item:", err); // Log the error
    res.status(500).json({ message: err.message });
  }
});

// Delete a deleted item entry
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await DeletedItem.findByPk(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Deleted item not found" });
    }

    await deletedItem.destroy();
    res.status(204).json({ message: "Deleted item removed successfully" });
  } catch (err) {
    console.error("Error deleting deleted item:", err); // Log the error
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;