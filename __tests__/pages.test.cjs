const request = require("supertest");
const app = require("../server");

describe("pages render", () => {
  test("GET / returns HTML", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });

  test("GET /food returns HTML", async () => {
    const res = await request(app).get("/food");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });
});
