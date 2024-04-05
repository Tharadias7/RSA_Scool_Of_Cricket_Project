const express = require("express");
const router = express.Router();
const { User } = require("../models"); // Import the User model

router.get("/", async (req, res) => {
  const ListOfUsers = await User.findAll();
  res.json(ListOfUsers);
});

router.post("/", async (req, res) => {
  const user = req.body;
  await User.create(user);
  res.json(user);
});

module.exports = router;
