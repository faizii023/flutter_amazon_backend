//imports from packages
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
//import from files
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

//INIT
const app = express();
//Middleware
//Client side->Server side->Client side.
app.use(express.json());

app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//Status
app.get("/api",  (req, res) => {
  res.send("Server is on");
});

//Connections
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Success");
  })
  .catch((e) => {
    console.log("Error",e);
    console.log(e.toString());
  });

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`connected at port number ${process.env.PORT}`);
});
