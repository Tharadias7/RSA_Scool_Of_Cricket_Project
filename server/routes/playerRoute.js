const express = require('express');
const router = express.Router();
const { Player } = require('../models');
const { generatePlayerId } = require('../utils/playerUtil');

// Get all players
router.get("/", async (req, res) => {
  try {
    const listOfPlayers = await Player.findAll();
    res.json(listOfPlayers);
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).json({ message: 'Error fetching player data', error: error.message });
  }
});

// Get player by ID
router.get('/:playerId', async (req, res) => {
  const { playerId } = req.params;

  try {
    const player = await Player.findOne({
      where: { playerId, active: true }
    });

    if (!player) {
      return res.status(404).json({ message: 'Invalid player ID or player not active' });
    }
    res.json(player);
  } catch (error) {
    console.error(`Error fetching player with playerId: ${playerId}`, error);
    res.status(500).json({ message: 'Error fetching player', error: error.message });
  }
});

// Create a new player
router.post("/", async (req, res) => {
  const playerId = generatePlayerId();
  const player = { ...req.body, playerId, active: true };

  try {
    await Player.create(player);
    res.json(player);
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      console.error('Foreign key constraint error:', error);
      res.status(400).json({ message: 'Invalid foreign key: employee_no does not exist in coaches table', error: error.message });
    } else {
      console.error('Error creating player:', error);
      res.status(500).json({ message: 'Error creating player', error: error.message });
    }
  }
});

// Edit a player
router.put("/:playerId", async (req, res) => {
  const { playerId } = req.params;

  try {
    const updatedPlayer = await Player.update(req.body, {
      where: { playerId },
    });

    if (updatedPlayer[0] === 0) {
      return res.status(404).json({ message: 'Player not found or update failed' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ message: 'Error updating player', error: error.message });
  }
});

// Deactivate a player
router.put("/:playerId/deactivate", async (req, res) => {
  const { playerId } = req.params;

  try {
    const updatedPlayer = await Player.update({ active: false }, {
      where: { playerId },
    });

    if (updatedPlayer[0] === 0) {
      return res.status(404).json({ message: 'Player not found or deactivation failed' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deactivating player:', error);
    res.status(500).json({ message: 'Error deactivating player', error: error.message });
  }
});

// Activate player record
router.put("/:playerId/activate", async (req, res) => {
  const { playerId } = req.params;

  try {
    await Player.update({ active: true }, {
      where: { playerId },
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error activating player:', error);
    res.status(500).json({ message: 'Error activating player', error: error.message });
  }
});

module.exports = router;
