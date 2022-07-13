const Todo = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
  await Todo.create(req.body);
  res.status(201).send();
};
