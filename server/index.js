const express = require("express");
const app = express();
const cors = require("cors"); 

app.use(express.json());
app.use(cors());

const db = require("./models");

//ROUTERS

//user router
const userRouter = require("./routes/User");
app.use("/user", userRouter);

//staff router
const staffRouter = require("./routes/Staff");  
app.use("/staff", staffRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
