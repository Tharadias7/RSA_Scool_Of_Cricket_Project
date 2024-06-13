const express = require("express");
const router = express.Router();
const { Staff, User } = require("../models");
const { getNextEmployeeNo } = require("../utils/signUpUtil");

// Get all staff data
router.get("/", async (req, res) => {
  try {
    const listOfStaff = await Staff.findAll();
    res.json(listOfStaff);
  } catch (error) {
    console.error('Error fetching staff data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create staff record
router.post("/", async (req, res) => {
  try {
    const designation = req.body.designation;
    const employeeNo = await getNextEmployeeNo(designation); // Generate employee no
    const staff = { ...req.body, employee_no: employeeNo, active: true }; // Set active to true
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

// Activate staff record
router.put("/:employee_no/activate", async (req, res) => {
  const { employee_no } = req.params;

  try {
    await Staff.update({ active: true }, {
      where: { employee_no },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

