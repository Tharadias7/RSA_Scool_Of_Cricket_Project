const express = require('express');
const router = express.Router();
const { DeletedItem, Equipment } = require('../models'); // Adjust the path as necessary

// Get all deleted items
router.get('/', async (req, res) => {
  try {
    const deletedItems = await DeletedItem.findAll();
    res.json(deletedItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a deleted item by ID
router.get('/:id', async (req, res) => {
  try {
    const deletedItem = await DeletedItem.findByPk(req.params.id);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new deleted item
router.post('/', async (req, res) => {
  try {
    const deletedItem = await DeletedItem.create(req.body);
    res.json(deletedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a deleted item
router.put('/:id', async (req, res) => {
  try {
    const deletedItem = await DeletedItem.findByPk(req.params.id);
    if (deletedItem) {
      await deletedItem.update(req.body);
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: 'Deleted item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

