const express = require("express");
const router = express.Router();
const { User } = require("../models"); // Import the User model

router.get("/", async (req, res) => {
  const listOfUsers = await User.findAll();
  res.json(listOfUsers);
});

router.post("/", async (req, res) => {

  const { username, password, role } = req.body;
  
  if(req.body.role == 'Manager') req.body.role = 'admin';
  else if(req.body.role == 'Receptionist') req.body.role = 'receptionist';
  else if(req.body.role == 'InventoryManager') req.body.role = 'inventory_manager';
  else if(req.body.role == 'Coach') req.body.role = 'coach';
  console.table(req.body);

  try {
    const newUser = await User.create({ username, password, role });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  // const user = req.body;
  // await User.create(user);
  // res.json(user);
});

module.exports = router;
