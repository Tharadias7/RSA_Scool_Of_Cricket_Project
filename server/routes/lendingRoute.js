const express = require("express");
const router = express.Router();
const { Lending } = require("../models");

// Get all the records
router.get("/", async (req, res) => {
  try {
    const lendings = await Lending.findAll();
    res.json(lendings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new lending record
router.post("/", async (req, res) => {
  const { stockId, employee_no, issuedAmount, collectedDate, issuedDate } = req.body;
  console.log("Received lending data:", req.body); // Log the request body
  
  // Validation Check
  if (!stockId || !employee_no || !issuedAmount || !issuedDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newLending = await Lending.create({ stockId, employee_no, issuedAmount, collectedDate, issuedDate });
    res.status(201).json(newLending);
  } catch (err) {
    console.error("Error creating lending record:", err); // Log the error
    res.status(400).json({ message: err.message });
  }
});




// Update a lending record
router.put("/:stockId/:employee_no", async (req, res) => {
  const { stockId, employee_no } = req.params;
  const { collectedDate } = req.body;

  try {
    const lending = await Lending.findOne({ where: { stockId, employee_no } });
    if (lending) {
      lending.collectedDate = collectedDate;
      await lending.save();
      res.status(200).json(lending);
    } else {
      res.status(404).json({ error: "Lending not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating lending" });
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { Lending, Equipment } = require("../models");

// // Get all the records
// router.get("/", async (req, res) => {
//   try {
//     const lendings = await Lending.findAll();
//     res.json(lendings);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new lending record
// router.post("/", async (req, res) => {
//   const { stockId, employee_no, issuedAmount, collectedDate, issuedDate } = req.body;
//   console.log("Received lending data:", req.body); // Log the request body

//   // Validation Check
//   if (!stockId || !employee_no || !issuedAmount || !issuedDate) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Start a transaction
//     const result = await sequelize.transaction(async (t) => {
//       // Create the lending record
//       const newLending = await Lending.create(
//         { stockId, employee_no, issuedAmount, collectedDate, issuedDate },
//         { transaction: t }
//       );

//       // Find the equipment and update the available items
//       const equipment = await Equipment.findByPk(stockId, { transaction: t });
//       if (!equipment) {
//         throw new Error("Equipment not found");
//       }

//       // Ensure there are enough items available to issue
//       if (equipment.availableItems < issuedAmount) {
//         throw new Error("Not enough available items to issue");
//       }

//       equipment.availableItems -= issuedAmount;
//       await equipment.save({ transaction: t });

//       return newLending;
//     });

//     res.status(201).json(result);
//   } catch (err) {
//     console.error("Error creating lending record:", err); // Log the error
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a lending record
// router.put("/:stockId/:employee_no", async (req, res) => {
//   const { stockId, employee_no } = req.params;
//   const { collectedDate } = req.body;

//   try {
//     const lending = await Lending.findOne({ where: { stockId, employee_no } });
//     if (lending) {
//       lending.collectedDate = collectedDate;
//       await lending.save();
//       res.status(200).json(lending);
//     } else {
//       res.status(404).json({ error: "Lending not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error updating lending" });
//   }
// });

// module.exports = router;

