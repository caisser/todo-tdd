const todoController = require("../../controllers/todo.controller");
const Todo = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const todosList = require("../mock-data/todos-list.json");

Todo.create = jest.fn();
Todo.find = jest.fn();
let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("todoController.createTodo", () => {
  beforeEach(() => {
    req.body = newTodo;
  });

  it("Should have a createTodo function", () => {
    expect(typeof todoController.createTodo).toBe("function");
  });

  it("should call Todo.create", async () => {
    await todoController.createTodo(req, res, next);
    expect(Todo.create).toBeCalledWith(newTodo);
  });

  it("should  return 201 status code", async () => {
    await todoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("Should return json body in response", async () => {
    Todo.create.mockReturnValue(newTodo);
    await todoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should handle error", async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    Todo.create.mockReturnValue(rejectedPromise);
    await todoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("todoController.getTodos", () => {
  it("Should have a getTodos function", () => {
    expect(typeof todoController.getTodos).toBe("function");
  });

  it("should call Todo.find", async () => {
    await todoController.getTodos(req, res, next);
    expect(Todo.find).toBeCalledWith();
  });

  it("should return 200 on status code and list of todos", async () => {
    Todo.find.mockReturnValue(todosList);
    await todoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(todosList);
  });

  it("Should handle error", async () => {
    const errorMessage = { message: "Error on get Todos" };
    const rejectedPromise = Promise.reject(errorMessage);
    Todo.find.mockReturnValue(rejectedPromise);
    await todoController.getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
