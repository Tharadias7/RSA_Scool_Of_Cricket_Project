const express = require("express");
const router = express.Router();
const { Coach } = require("../models");

// Get all coaches
router.get("/", async (req, res) => {
  try {
    const coaches = await Coach.findAll();
    res.json(coaches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a coach by employee number
router.get("/:employee_no", async (req, res) => {
  const employee_no = req.params.employee_no;

  try {
    const coach = await Coach.findByPk(employee_no);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    res.json(coach);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create a new coach
router.post("/", async (req, res) => {
  const { employee_no, qualifications, assigned_team } = req.body;
  try {
    const newCoach = await Coach.create({ employee_no, qualifications, assigned_team });
    res.status(201).json(newCoach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a coach
router.put("/:employee_no", async (req, res) => {
  const employee_no = req.params.employee_no;
  const updates = req.body;

  try {
    const coach = await Coach.findByPk(employee_no);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    await coach.update(updates);
    res.json(coach);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a coach
router.delete("/:employee_no", async (req, res) => {
  const employee_no = req.params.employee_no;

  try {
    const coach = await Coach.findByPk(employee_no);

    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    await coach.destroy();
    res.json({ message: "Coach deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
