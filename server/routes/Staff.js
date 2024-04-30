const express = require("express");
const router = express.Router();
const { Staff } = require("../models"); 
const { getNextEmployeeNo } = require("../utils/signUpUtil"); 

router.get("/", async (req, res) => {
  const listOfStaff = await Staff.findAll();
  res.json(listOfStaff);
});

router.post("/", async (req, res) => {
  const { name, contact_no, designation } = req.body;

  try {
    const employeeNo = await getNextEmployeeNo(designation);
    const staff = await Staff.create({
      name,
      contact_no,
      designation,
      employee_no: employeeNo,
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;

