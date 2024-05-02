const express = require("express");
const router = express.Router();
const { Staff } = require("../models"); 
const { getNextEmployeeNo } = require("../utils/signUpUtil"); 

router.get("/", async (req, res) => {
  const listOfStaff = await Staff.findAll();
  res.json(listOfStaff);
});

router.post("/", async (req, res) => {
  const designation = req.body.designation;
  const employeeNo = await getNextEmployeeNo(designation);
  const staff = { ...req.body, employee_no: employeeNo };
  console.table(staff);
  await Staff.create(staff);
  res.json(staff);
});

module.exports = router;