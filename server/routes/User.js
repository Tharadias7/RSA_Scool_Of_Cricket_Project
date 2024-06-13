const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

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

// Get user data by employee_no
router.get('/:employee_no', async (req, res) => {
  const { employee_no } = req.params;
  try {
    const user = await User.findOne({ where: { employee_no } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, password, ...rest } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already in use' });
    }

    // Create the new user if the username is unique
    const user = { ...rest, username, password: bcrypt.hashSync(password, 10), active: true };
    const newUser = await User.create(user);
    res.json(newUser);
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

  try {
    const user = await User.findOne({ where: { username: username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Wrong username and password combination' });
    }
      
    res.json({ username: user.username, role: user.role }); // Return only the user role
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { User } = require('../models');
// const bcrypt = require('bcrypt');

// // Get all user data
// router.get('/', async (req, res) => {
//   try {
//     const listOfUsers = await User.findAll({
//       where: { active: true }, // Fetch only active users
//     });
//     res.json(listOfUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get user data by employee_no
// router.get('/:employee_no', async (req, res) => {
//   const { employee_no } = req.params;
//   try {
//     const user = await User.findOne({ where: { employee_no } });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Create user record
// router.post("/", async (req, res) => {
//   try {
//     const user = { ...req.body, active: true }; // Set active to true
//     user.password = bcrypt.hashSync(user.password, 10); // Hash the password
//     const newUser = await User.create(user);
//     res.json(newUser); // Return the created user
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Update user data
// router.put('/:user_id', async (req, res) => {
//   const { user_id } = req.params;
//   const updatedUser = req.body;

//   try {
//     await User.update(updatedUser, {
//       where: { id: user_id },
//     });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Deactivate user record
// router.put('/:user_id/deactivate', async (req, res) => {
//   const { user_id } = req.params;

//   try {
//     await User.update({ active: false }, {
//       where: { id: user_id },
//     });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Delete user record
// router.delete('/:user_id', async (req, res) => {
//   const { user_id } = req.params;

//   try {
//     await User.destroy({
//       where: { id: user_id },
//     });
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Login user

// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { username: username } });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({ error: 'Wrong username and password combination' });
//     }
      
//     res.json({ username: user.username, role: user.role }); // Return only the user role
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// module.exports = router;
