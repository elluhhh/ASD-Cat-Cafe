const request = require("supertest");
const app = require("../server");

describe("menu api", () => {
  test("GET /api/menu returns array", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});