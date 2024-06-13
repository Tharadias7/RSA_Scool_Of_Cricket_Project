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

// Check if attendance is already recorded for a player on a specific date
router.get("/:playerId/:date", async (req, res) => {
  const { playerId, date } = req.params;

  try {
    const attendance = await Attendance.findOne({
      where: { playerId, date }
    });

    if (attendance) {
      return res.status(200).json({ recorded: true });
    }

    res.status(200).json({ recorded: false });
  } catch (err) {
    console.error('Error checking attendance record:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new attendance record
router.post("/", async (req, res) => {
  const { playerId, date, attendanceStatus } = req.body;

  // Validate incoming data
  if (!playerId || !date || typeof attendanceStatus !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request data. Please provide playerId, date, and attendanceStatus.' });
  }

  try {
    // Check if attendance already exists for this player on this date
    const existingAttendance = await Attendance.findOne({
      where: { playerId, date }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: `Attendance already recorded for player ${playerId} on ${date}.` });
    }

    const newAttendance = await Attendance.create({ playerId, date, attendanceStatus });
    res.status(201).json(newAttendance);
  } catch (err) {
    console.error('Error creating attendance record:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const { Attendance } = require("../models");

// // Get all attendance records
// router.get("/", async (req, res) => {
//   try {
//     const attendances = await Attendance.findAll();
//     res.json(attendances);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Check if attendance is already recorded for a player on a specific date
// router.get("/:playerId/:date", async (req, res) => {
//   const { playerId, date } = req.params;

//   try {
//     const attendance = await Attendance.findOne({
//       where: { playerId, date }
//     });

//     if (attendance) {
//       return res.status(200).json({ recorded: true });
//     }

//     res.status(200).json({ recorded: false });
//   } catch (err) {
//     console.error('Error checking attendance record:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // Create a new attendance record
// router.post("/", async (req, res) => {
//   const { playerId, date, attendanceStatus } = req.body;

//   try {
//     // Check if attendance already exists for this player on this date
//     const existingAttendance = await Attendance.findOne({
//       where: { playerId, date }
//     });

//     if (existingAttendance) {
//       return res.status(400).json({ message: `${playerId} player's attendance already recorded for ${date}` });
//     }

//     const newAttendance = await Attendance.create({ playerId, date, attendanceStatus });
//     res.status(201).json(newAttendance);
//   } catch (err) {
//     console.error('Error creating attendance record:', err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // // Create a new attendance record
// // router.post("/", async (req, res) => {
// //   const { playerId, date, attendanceStatus } = req.body;

// //   try {
// //     const newAttendance = await Attendance.create({ playerId, date, attendanceStatus });
// //     res.status(201).json(newAttendance);
// //   } catch (err) {
// //     res.status(400).json({ message: err.message });
// //   }
// // });


// module.exports = router;