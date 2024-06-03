const express = require("express");
const router = express.Router();
const { User, Staff } = require("../models"); // Import the User and Staff models

// Get all users
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

// Create a new user
router.post("/", async (req, res) => {
  const { username, password, role, employee_no } = req.body; // Ensure employee_no is included

  // Mapping roles to specific values
  let userRole; // Initialize a variable to store the user's role

  switch (role) {
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
      userRole = role; // Use the provided role if it does not match any specific case
      break;
  }

  try {
    // Creating a new user with the provided data including designation
    const newUser = await User.create({ username, password, role: userRole, employee_no });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user by employee_no
router.put("/:employee_no", async (req, res) => {
  const { employee_no } = req.params;
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { employee_no } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ username, password });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
