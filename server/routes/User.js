const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

// Get all user data
router.get('/', async (req, res) => {
  try {
    const listOfUsers = await User.findAll({
      where: { active: true }, // Fetch only active users
    });
    res.json(listOfUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user record
router.post('/', async (req, res) => {
  try {
    const user = { ...req.body, active: true };  // Set active to true
    user.password = bcrypt.hashSync(user.password, 10); // Hash the password
    const newUser = await User.create(user);
    res.json(newUser); // Return the created user
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user data
router.put('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const updatedUser = req.body;

  try {
    await User.update(updatedUser, {
      where: { id: user_id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deactivate user record
router.put('/:user_id/deactivate', async (req, res) => {
  const { user_id } = req.params;

  try {
    await User.update({ active: false }, {
      where: { id: user_id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user record
router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    await User.destroy({
      where: { id: user_id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login user

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

    const user = await User.findOne({ where: { username: username } });

    if (!user) res.json({ error: 'User not found' });
    
    bcrypt.compare(password, user.password).then(async(match) => {
      if (!match)  res.json({ error: 'Wrong username and password combination' });
      
      const accessToken = sign(
        { id: user.id, username: user.username }, 
        "importantsecret"
      );
      res.json(accessToken);
});
});

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { username: username } });

//     if (!user) {
//       return res.json({ success: false, error: 'User not found' });
//     }

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.json({ success: false, error: 'Wrong username and password combination' });
//     }

//     const accessToken = sign({ id: user.id, username: user.username }, 
//       "importantsecret"
//     );

//     res.json({ success: true, message: 'User logged in', token: accessToken });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
//   }
// });

module.exports = router;
