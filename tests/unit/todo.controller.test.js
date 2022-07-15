const todoController = require("../../controllers/todo.controller");
const Todo = require("../../model/todo.model");
const httpMocks = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const todosList = require("../mock-data/todos-list.json");

Todo.create = jest.fn();
Todo.find = jest.fn();
Todo.findById = jest.fn();
Todo.findByIdAndUpdate = jest.fn();
let req, res, next;
const todoId = "62cf81c9e3196307562709c7";
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

  it("Should return 404 when db is empty", async () => {
    Todo.find.mockReturnValue(null);
    await todoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      message: "No data to retrieved",
    });
  });
});

describe("todoController.getTodoById", () => {
  it("Shoud have getTodoById function", () => {
    expect(typeof todoController.getTodoById).toBe("function");
  });

  it("Shoud call Todo.findById function", async () => {
    req.params.id = todoId;
    await todoController.getTodoById(req, res, next);
    expect(Todo.findById).toBeCalledWith(todoId);
  });

  it("should return 200 on status code and retrieve one todo", async () => {
    req.params.id = todoId;
    Todo.findById.mockReturnValue(newTodo);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should handle error", async () => {
    req.params.id = todoId;
    const errorMessage = { message: "Can not find by id" };
    const rejectedPromise = Promise.reject(errorMessage);
    Todo.findById.mockReturnValue(rejectedPromise);
    await todoController.getTodoById(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("Should return 404 when todo don't exist", async () => {
    req.params.id = todoId;
    Todo.findById.mockReturnValue(null);
    await todoController.getTodoById(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      message: "Todo doesn't exists",
    });
  });
});

describe("todoController.updateTodo", () => {
  it("should have a updateTodo function", () => {
    expect(typeof todoController.updateTodo).toBe("function");
  });

  it("Should call todo.findAndUpdate method", async () => {
    req.params.id = todoId;
    req.body = newTodo;
    await todoController.updateTodo(req, res, next);
    expect(Todo.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {
      new: true,
    });
  });

  it("should return 200 on status code and retrieve todo updated", async () => {
    req.params.id = todoId;
    req.body = newTodo;
    Todo.findByIdAndUpdate.mockReturnValue(newTodo);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("Should handle error", async () => {
    errorMessage = "Error updating todo";
    rejectedPromise = Promise.reject(errorMessage);
    Todo.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await todoController.updateTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("Should handle 404", async () => {
    Todo.findByIdAndUpdate.mockReturnValue(null);
    await todoController.updateTodo(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual({
      message: "Todo doesn't exists",
    });
  });
});
