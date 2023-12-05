const express = require("express");
const {Pool} = require("pg");
const cors = require("cors");
const resRouter = require("./routes/resturant")
const app = express();
app.use(cors());
app.use(express.json());
app.use("/res",resRouter);


app.listen(5000);
console.log("listening");

