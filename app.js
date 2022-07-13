const express = require("express");
const todoRouter = require("./routes/todo.routes");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to mongo successfully!"));

app.use(express.json());
app.use("/todos", todoRouter);

app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message });
  next();
});
// app.get("/", (req, res, next) => {
//   res.status(200).json({
//     status: "Hello world",
//   });
// });

module.exports = app;
