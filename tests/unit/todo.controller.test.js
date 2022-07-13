const todoController = require("../../controllers/todo.controller");
const Todo = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");

Todo.create = jest.fn();
let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = null;
});

describe("todoController.createTodo", () => {
  it("Should have a createTodo function", () => {
    expect(typeof todoController.createTodo).toBe("function");
  });

  it("should call Todo.create", async () => {
    req.body = newTodo;
    await todoController.createTodo(req, res, next);
    expect(Todo.create).toBeCalledWith(newTodo);
  });

  it("should  return 201 status code", async () => {
    req.body = newTodo;
    await todoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
