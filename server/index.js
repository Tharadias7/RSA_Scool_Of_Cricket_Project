const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Define the database synchronization function
async function syncDatabase() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync models in order
    await db.Staff.sync();
    await db.Equipment.sync();
    await db.Coach.sync();
    await db.Player.sync();
    await db.Attendance.sync();
    await db.Payment.sync();
    await db.Lendings.sync();

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Routers

// user router
const userRouter = require("./routes/User");
app.use("/user", userRouter);

// staff router
const staffRouter = require("./routes/Staff");
app.use("/staff", staffRouter);

// coach router
const coachRouter = require("./routes/coachRoute");
app.use("/coach", coachRouter);

// player router
const playerRouter = require("./routes/playerRoute");
app.use("/player", playerRouter);

// attendance router
const attendanceRouter = require("./routes/attendanceRoute");
app.use("/attendance", attendanceRouter);

// payment router
const paymentRouter = require("./routes/paymentRoute");
app.use("/payment", paymentRouter);

// equipment router
const equipmentRouter = require("./routes/equipmentRoute");
app.use("/equipment", equipmentRouter);

// lendings router
const lendingsRouter = require("./routes/lendingRoute");
app.use("/lending", lendingsRouter);

// Sync the database before starting the server
syncDatabase().then(() => {
  // API
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}).catch((error) => {
  console.error("Failed to sync database:", error);
});
