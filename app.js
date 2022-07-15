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

module.exports = app;
