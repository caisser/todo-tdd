const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "Hello world",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
