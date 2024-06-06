const express = require('express');
const router = express.Router();
const { Player } = require('../models');
const { generatePlayerId } = require('../utils/playerUtil');

// Get all active players
router.get('/', async (req, res) => {
  try {
    const listOfPlayers = await Player.findAll({
      where: { active: true }  // Fetch only active players
    });
    res.json(listOfPlayers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active players', error });
  }
});

// Get a player by ID
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findByPk(req.params.id);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new player
router.post("/", async (req, res) => {
    const playerId = generatePlayerId(); // Generate a unique player ID
    const player = { ...req.body, playerId: playerId, active: true };  // Set active to true
    console.table(player);
    await Player.create(player);
    res.json(player);
});

// Edit a player
router.put("/:playerId", async (req, res) => {
    const { playerId } = req.params;

    try {
        const updatedPlayer = await Player.update(req.body, {
            where: { playerId },
        });

        if (updatedPlayer[0] === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Deactivate a player
router.put("/:playerId/deactivate", async (req, res) => {
  const { playerId } = req.params;

  try {
    await Player.update({ active: false }, {
      where: { playerId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
