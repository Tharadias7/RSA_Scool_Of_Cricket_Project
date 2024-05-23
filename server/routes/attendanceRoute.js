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


module.exports = router;