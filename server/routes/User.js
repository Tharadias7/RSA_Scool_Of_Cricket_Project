const express = require("express");
const router = express.Router();
const { User } = require("../models"); // Import the User model

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Staff, as: "staff" }],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post("/", async (req, res) => {

  const { username, password, role, designation } = req.body; // Extracting designation and other data from request body
  
  // Mapping roles to specific values
  let userRole; // Initialize a variable to store the user's role

// Mapping roles to specific values
switch (designation) {
  case "Manager":
    userRole = "admin";
    break;
  case "Receptionist":
    userRole = "receptionist";
    break;
  case "InventoryManager":
    userRole = "inventory_manager";
    break;
  case "Coach":
    userRole = "coach";
    break;
  default:
    userRole = role; // Use the provided role if designation does not match any specific case
    break;
}

  try {
    // Creating a new user with the provided data including designation
    const newUser = await User.create({ username, password, role: userRole, designation });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
