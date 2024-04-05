const express = require("express");
const router = express.Router();
const { Staff } = require("../models"); // Import the Staff model

router.get("/", async (req, res) => {
  const ListOfStaff = await Staff.findAll();
  res.json(ListOfStaff);
});

router.post("/", async (req, res) => {
  const staff = req.body;
  await Staff.create(staff);
  res.json(staff);
});

module.exports = router;

