//imports from packages
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
//import from files
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

//INIT
const app = express();
const port = 3000;
const DB =
  "mongodb+srv://faizan:Kingstar23@cluster0.ys9jr9y.mongodb.net/?retryWrites=true&w=majority";
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
  .connect(DB)
  .then(() => {
    console.log("Success");
  })
  .catch((e) => {
    console.log(e);
  });

app.listen(port, "0.0.0.0", () => {
  console.log(`connected at port number ${port}`);
});
