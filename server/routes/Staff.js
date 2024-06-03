const express = require("express");
const router = express.Router();
const { Staff, User } = require("../models");
const { getNextEmployeeNo } = require("../utils/signUpUtil");

// Get all staff data
router.get("/", async (req, res) => {
  const listOfStaff = await Staff.findAll({
    where: { active: true },  // Fetch only active staff
  });
  res.json(listOfStaff);
});

// Create staff record
router.post("/", async (req, res) => {
  try {
    const designation = req.body.designation;
    const employeeNo = await getNextEmployeeNo(designation); // Generate emp no
    const staff = { ...req.body, employee_no: employeeNo, active: true };  // Set active to true
    console.table(staff);
    const newStaff = await Staff.create(staff);
    res.json(newStaff); // Return the created staff, including the employee_no
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update staff data
router.put("/:employee_no", async (req, res) => {
  const { employee_no } = req.params;
  const updatedStaff = req.body;

  try {
    await Staff.update(updatedStaff, {
      where: { employee_no },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate staff record
router.put("/:employee_no/deactivate", async (req, res) => {
  const { employee_no } = req.params;

  try {
    await Staff.update({ active: false }, {
      where: { employee_no },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { Staff } = require("../models");
// const { getNextEmployeeNo } = require("../utils/signUpUtil");

// // Get all staff data
// router.get("/", async (req, res) => {
//   const listOfStaff = await Staff.findAll({
//     where: { active: true },  // Fetch only active staff
//   });
//   res.json(listOfStaff);
// });

// // Create staff record
// router.post("/", async (req, res) => {
//   try {
//     const designation = req.body.designation;
//     const employeeNo = await getNextEmployeeNo(designation); // Generate emp no
//     const staff = { ...req.body, employee_no: employeeNo, active: true };  // Set active to true
//     console.table(staff);
//     const newStaff = await Staff.create(staff);
//     res.json(newStaff); // Return the created staff, including the employee_no
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update staff data
// router.put("/:employee_no", async (req, res) => {
//   const { employee_no } = req.params;
//   const updatedStaff = req.body;

//   try {
//     await Staff.update(updatedStaff, {
//       where: { employee_no },
//     });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
