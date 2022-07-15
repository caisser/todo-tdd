const express = require("express");
const todoController = require("../controllers/todo.controller");
const router = express.Router();

router.route("/").get(todoController.getTodos).post(todoController.createTodo);

router
  .route("/:id")
  .get(todoController.getTodoById)
  .put(todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;
