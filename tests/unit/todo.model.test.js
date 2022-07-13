const Todo = require("../../model/todo.model");

describe("todo model", () => {
  it("Shoud throw error with missing fields", async () => {
    let err = null;
    try {
      let todo = new Todo({});
      await todo.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors).toHaveProperty("title");
    expect(err.errors).toHaveProperty("done");
  });
});
