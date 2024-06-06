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
  const { item, brand, totalItems } = req.body;

  console.log("Received equipment data:", req.body); // Log the request body

  try {
    const newEquipment = await Equipment.create({ item, brand, totalItems, availableItems: totalItems });
    res.status(201).json(newEquipment);
  } catch (err) {
    console.error("Error creating equipment record:", err); // Log the error
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

// Partially delete equipment (reduce quantity)
router.put("/reduce/:stockId", async (req, res) => {
  const { stockId } = req.params;
  const { amount } = req.body;

  try {
    const equipment = await Equipment.findByPk(stockId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const deleteAmount = parseInt(amount, 10);

    if (deleteAmount > equipment.totalItems) {
      return res.status(400).json({ message: "Entered amount is greater than total items." });
    }

    equipment.totalItems -= deleteAmount;
    equipment.availableItems = Math.max(equipment.availableItems - deleteAmount, 0); // Prevent negative available items

    await equipment.save();
    res.json(equipment);
  } catch (err) {
    console.error("Error reducing equipment quantity:", err);
    res.status(500).json({ message: err.message });
  }
});

// Delete an equipment record
router.delete("/:stockId", async (req, res) => {
  const { stockId } = req.params;

  try {
    const equipment = await Equipment.findByPk(stockId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    await equipment.destroy();
    res.status(204).json({ message: "Equipment deleted successfully" });
  } catch (err) {
    console.error("Error deleting equipment record:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { Equipment } = require("../models");

// // Get all the records
// router.get("/", async (req, res) => {
//   try {
//     const equipment = await Equipment.findAll();
//     res.json(equipment);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new equipment record
// router.post("/", async (req, res) => {
//   const { item, brand, totalItems } = req.body;

//   console.log("Received equipment data:", req.body); // Log the request body

//   try {
//     const newEquipment = await Equipment.create({ item, brand, totalItems, availableItems: totalItems });
//     res.status(201).json(newEquipment);
//   } catch (err) {
//     console.error("Error creating equipment record:", err); // Log the error
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update an equipment record
// router.put("/:stockId", async (req, res) => {
//   const { stockId } = req.params;
//   const { item, brand, totalItems } = req.body;

//   try {
//     const equipment = await Equipment.findByPk(stockId);

//     if (!equipment) {
//       return res.status(404).json({ message: "Equipment not found" });
//     }

//     equipment.item = item;
//     equipment.brand = brand;
//     equipment.totalItems = totalItems;
//     equipment.availableItems = totalItems; // Optional: reset available items to total items

//     await equipment.save();
//     res.json(equipment);
//   } catch (err) {
//     console.error("Error updating equipment record:", err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete an equipment record
// router.delete("/:stockId", async (req, res) => {
//   const { stockId } = req.params;
  
//   try {
//     const equipment = await Equipment.findByPk(stockId);
    
//     if (!equipment) {
//       return res.status(404).json({ message: "Equipment not found" });
//     }

//     await equipment.destroy();
//     res.status(204).json({ message: "Equipment deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting equipment record:", err);
//     res.status(500).json({ message: err.message });
//   }
// });



// module.exports = router;
