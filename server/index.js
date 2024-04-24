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

//whenever we run the server, we want to sync(check if all the models in model folder are there, if not create them) the database
db.sequelize.sync().then(() => {
  //API
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
});
