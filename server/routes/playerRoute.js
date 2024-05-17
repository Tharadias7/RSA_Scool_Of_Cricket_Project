const express = require('express');
const router = express.Router(); 
const { Player } = require('../models');


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
    const player = req.body;
    console.table(player);
    await Player.create(player);
    res.json(player);
  });

module.exports = router;

