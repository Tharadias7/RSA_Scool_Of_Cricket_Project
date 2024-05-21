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
router.get("/:id", async (req, res) => {
    const playerId = req.params.id;
    const player = await Player.findByPk(playerId);

    if (player) {
        res.json(player);
    } else {
        res.status(404).json({ message: 'Player not found' });
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

