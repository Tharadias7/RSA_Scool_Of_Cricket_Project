const express = require('express');
const router = express.Router(); 
const { Player } = require('../models');
const { generatePlayerId } = require('../utils/playerUtil');


// Get all the players
router.get("/", async (req, res) => {
    const listOfPlayers = await Player.findAll();
    res.json(listOfPlayers);
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
  const player = { ...req.body, playerId: playerId };
    console.table(player);
    await Player.create(player);
    res.json(player);
  });

module.exports = router;

