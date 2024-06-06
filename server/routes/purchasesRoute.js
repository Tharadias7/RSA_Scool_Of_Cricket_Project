const express = require('express');
const router = express.Router();
const { Purchases } = require('../models');

// Get all purchases records
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchases.findAll();
    res.json(purchases);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add purchase record
router.post('/', async (req, res) => {
  try {
    const purchase = await Purchases.create(req.body);
    res.json(purchase);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete purchase record
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Purchases.destroy({ where: { transactionId: id } });
    if (result) {
      res.status(200).json({ message: 'Purchase deleted successfully' });
    } else {
      res.status(404).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase', error });
  }
});

// Edit (update) purchase record
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Purchases.update(req.body, {
      where: { transactionId: id }
    });
    if (updated) {
      const updatedPurchase = await Purchases.findOne({ where: { transactionId: id } });
      res.status(200).json({ message: 'Purchase updated successfully', purchase: updatedPurchase });
    } else {
      res.status(404).json({ message: 'Purchase not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating purchase', error });
  }
});

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { Purchases } = require('../models');

// // Get all purchases records
// router.get('/', async (req, res) => {
//   try {
//     const purchases = await Purchases.findAll();
//     res.json(purchases);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Add purchase record
// router.post('/', async (req, res) => {
//   try {
//     const purchase = await Purchases.create(req.body);
//     res.json(purchase);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Delete purchase record
// router.delete('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const result = await Purchases.destroy({ where: { transactionId: id } });
//     if (result) {
//       res.status(200).json({ message: 'Purchase deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'Purchase not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting purchase', error });
//   }
// });

// // Edit (update) purchase record
// router.put('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const [updated] = await Purchases.update(req.body, {
//       where: { transactionId: id }
//     });
//     if (updated) {
//       const updatedPurchase = await Purchases.findOne({ where: { transactionId: id } });
//       res.status(200).json({ message: 'Purchase updated successfully', purchase: updatedPurchase });
//     } else {
//       res.status(404).json({ message: 'Purchase not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating purchase', error });
//   }
// });

// module.exports = router;
