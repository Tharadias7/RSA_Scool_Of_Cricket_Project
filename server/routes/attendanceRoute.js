const express = require("express");
const router = express.Router();
const { Attendance } = require("../models");

// Get all attendance records
router.get("/", async (req, res) => {
  try {
    const attendances = await Attendance.findAll();
    res.json(attendances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get attendance by playerId
// router.get("/:playerId", async (req, res) => {
//   const playerId = req.params.playerId;

//   try {
//     const attendance = await Attendance.findByPk(playerId);

//     if (!attendance) {
//       return res.status(404).json({ message: "Attendance not found" });
//     }

//     res.json(attendance);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Create a new attendance record
router.post("/", async (req, res) => {
  const { playerId, date, attendanceStatus } = req.body;

  try {
    const newAttendance = await Attendance.create({ playerId, date, attendanceStatus });
    res.status(201).json(newAttendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const designation = req.body.designation;
  const employeeNo = await getNextEmployeeNo(designation); //generate emp no
  const staff = { ...req.body, employee_no: employeeNo };
  console.table(staff);
  await Staff.create(staff);
  res.json(staff);
});

module.exports = router;