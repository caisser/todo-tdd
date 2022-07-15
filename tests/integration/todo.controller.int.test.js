const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const endpointUrl = "/todos/";
let firstTodo;
let newTodoId;

describe(endpointUrl, () => {
  test("GET " + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });

  test(`GET ${endpointUrl}:id`, async () => {
    const response = await request(app).get(`${endpointUrl + firstTodo._id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  test(`GET ${endpointUrl}:wrongid`, async () => {
    const response = await request(app).get(
      `${endpointUrl}62d0ddcb8f353c7bd50f02ef`
    );
    expect(response.statusCode).toBe(404);
  });

  test("POST" + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    newTodoId = response.body._id;
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
      .put(`${endpointUrl + newTodoId}`)
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
});
