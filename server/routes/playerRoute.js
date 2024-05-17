const express = require('express');
const router = express.Router(); 
const { Player } = require('../models');


// Get a player by ID
router.get("/", async (req, res) => {
    const listOfPlayers = await Player.findAll();
    res.json(listOfPlayers);
  });
  

// Create a new player

router.post("/", async (req, res) => {
    const player = req.body;
    console.table(player);
    await Player.create(player);
    res.json(player);
  });

module.exports = router;

