const request = require("supertest");
const app = require("../../app");
const todoMock = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
let newTodo;

describe(endpointUrl, () => {
  test("POST" + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(todoMock);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(todoMock.title);
    expect(response.body.done).toBe(todoMock.done);
    newTodo = response.body;
  });

  test("GET " + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
  });

  test(`GET ${endpointUrl}:id`, async () => {
    const response = await request(app).get(`${endpointUrl + newTodo._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  });

  test(`GET ${endpointUrl}:wrongid`, async () => {
    const response = await request(app).get(
      `${endpointUrl}62d0ddcb8f353c7bd50f02ef`
    );
    expect(response.statusCode).toBe(404);
  });

  test(
    "should return error 500 on malformed data with POST" + endpointUrl,
    async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send({ title: "missing done property" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "Todo validation failed: done: Path `done` is required.",
      });
    }
  );

  test(`PUT ${endpointUrl}:id`, async () => {
    const testTodo = { title: "foo", done: true };
    const response = await request(app)
      .put(`${endpointUrl + newTodo._id}`)
      .send(testTodo);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testTodo.title);
    expect(response.body.done).toBe(testTodo.done);
  });

  test(`PUT ${endpointUrl}:wrongid`, async () => {
    const response = await request(app)
      .put(`${endpointUrl}62d0ddcb8f353c7bd50f02ef`)
      .send(newTodo);
    expect(response.statusCode).toBe(404);
  });

  test(`DELETE ${endpointUrl}:id`, async () => {
    const response = await request(app).delete(`${endpointUrl + newTodo._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      message: "Todo deleted",
      todo: { _id: newTodo._id, __v: newTodo.__v, title: "foo", done: true },
    });
  });

  test(`DELETE ${endpointUrl}:wrongid`, async () => {
    const response = await request(app).delete(
      `${endpointUrl}62d0ddcb8f353c7bd50f02ef`
    );
    expect(response.statusCode).toBe(404);
  });
});
