const express = require("express");
const todoController = require("../controllers/todo.controller");
const router = express.Router();

router.route("/").get(todoController.getTodos).post(todoController.createTodo);

module.exports = router;
