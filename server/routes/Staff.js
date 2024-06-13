const express = require("express");
const router = express.Router();
const { Staff, User } = require("../models");
const { getNextEmployeeNo } = require("../utils/signUpUtil");
//const { sequelize } = require('./models');


// Get all staff data
router.get("/", async (req, res) => {
  try {
    const listOfStaff = await Staff.findAll({
      include: {
        model: User,
        as: 'user', // Specify the alias
        attributes: ['username'], // Only include the username attribute from the User model
      }
    });
    res.json(listOfStaff);
  } catch (error) {
    console.error('Error fetching staff data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all active coaches
router.get('/coaches', async (req, res) => {
  try {
    const coaches = await Staff.findAll({
      where: {
        designation: 'Coach',
        active: true
      }
    });
    res.json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({ message: 'Error fetching coaches', error: error.message });
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

// Get distinct designations
router.get('/designations', async (req, res) => {
  try {
    const designations = await db.Staff.findAll({
      attributes: [
        [db.Sequelize.fn('DISTINCT', db.Sequelize.col('designation')), 'designation'],
      ],
    });
    res.json(designations.map(d => d.designation));
  } catch (error) {
    console.error('Error fetching distinct designations:', error);
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;

