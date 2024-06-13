const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Payment } = require("../models");

//Get all the records
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get payments by year
router.get("/:year", async (req, res) => {
  const { year } = req.params;

  try {
    const payments = await Payment.findAll({
      where: {
        paymentYear: year,
      },
    });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


//Check if a payment exists for a player in a specific month and year
router.get("/:playerId/:month/:year", async (req, res) => {
  const { playerId, month, year } = req.params;

  try {
    const payment = await Payment.findOne({
      where: {
        playerId,
        month,
        paymentYear: year,
      },
    });

    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ message: "No payment found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking payment", error });
  }
});


// create new payment record
router.post("/", async (req, res) => {
  const { date, amount, month, paymentYear, playerId } = req.body;

  try {
    const existingPayment = await Payment.findOne({
      where: {
        playerId,
        month,
        paymentYear,
      },
    });

    if (existingPayment) {
      return res.status(400).json({ message: "Payment already exists for this month and year." });
    }

    const newPayment = await Payment.create({ date, amount, month, paymentYear, playerId });
    res.status(201).json(newPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//Update a payment record
router.put("/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const { month, amount, date, paymentYear } = req.body;

  try {
    const payment = await Payment.findOne({
      where: { playerId, month, paymentYear },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    payment.amount = amount;
    payment.date = date;

    await payment.save();

    res.json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const { Op } = require("sequelize");
// const { Payment } = require("../models");

// //Get all the records
// router.get("/", async (req, res) => {
//   try {
//     const payments = await Payment.findAll();
//     res.json(payments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Check if a payment exists for a player in a specific month and year
// router.get("/:playerId/:month/:year", async (req, res) => {
//   const { playerId, month, year } = req.params;

//   console.log(`Received params - playerId: ${playerId}, month: ${month}, year: ${year}`); // Log received params

//   try {
//     const payment = await Payment.findOne({
//       where: {
//         playerId,
//         month,
//         date: {
//           [Op.between]: [`${year}-01-01`, `${year}-12-31`],
//         },
//       },
//     });

//     if (payment) {
//       console.log(`Payment found: ${payment}`); // Log found payment
//       res.status(200).json(payment);
//     } else {
//       console.log("No payment found"); // Log no payment found
//       res.status(404).json({ message: "No payment found" });
//     }
//   } catch (error) {
//     console.error("Error checking payment:", error); // Log error
//     res.status(500).json({ message: "Error checking payment", error });
//   }
// });

// // Create a new payment record
// router.post("/", async (req, res) => {
//   const { date, amount, month, playerId } = req.body;

//   console.log("Received payment data:", req.body); // Log the request body

//   try {
//     // Check if the payment already exists
//     const currentYear = new Date(date).getFullYear();
//     const existingPayment = await Payment.findOne({
//       where: {
//         playerId,
//         month,
//         date: {
//           [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
//         },
//       },
//     });

//     if (existingPayment) {
//       return res.status(400).json({ message: "Payment already exists for this month and year." });
//     }

//     const newPayment = await Payment.create({ date, amount, month, playerId });
//     res.status(201).json(newPayment);
//   } catch (err) {
//     console.error("Error creating payment record:", err); // Log the error
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a payment record
// router.put("/:playerId", async (req, res) => {
//   const { playerId } = req.params;
//   const { month, amount, date } = req.body;

//   try {
//     const payment = await Payment.findOne({
//       where: { playerId, month },
//     });

//     if (!payment) {
//       return res.status(404).json({ message: "Payment record not found" });
//     }

//     payment.amount = amount;
//     payment.date = date;

//     await payment.save();

//     res.json(payment);
//   } catch (err) {
//     console.error("Error updating payment record:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;

