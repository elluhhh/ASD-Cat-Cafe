const request = require("supertest");
const app = require("../server");
const Staff = require("../models/staffModel");

// Mock mongoose model
jest.mock("../models/staffModel");

describe("Staff Authentication Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Staff login page renders
  test("GET /staffLogin returns HTML login form", async () => {
    const res = await request(app).get("/staffLogin");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/Staff Login/);
  });

  // Valid staff login succeeds
  test("POST /staffLogin with valid credentials shows dashboard", async () => {
    const mockStaff = {
      _id: "staff123",
      name: "Ena Debnath",
      email: "ena@catcafe.com",
      password: "ena2025"
    };

    Staff.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockStaff)
    });

    const res = await request(app)
      .post("/staffLogin")
      .send({
        email: "ena@catcafe.com",
        password: "ena2025"
      });

    expect(res.status).toBe(302);
  });

  // Invalid staff login fails
  test("POST /staffLogin with invalid credentials shows error", async () => {
    Staff.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    });

    const res = await request(app)
      .post("/staffLogin")
      .send({
        email: "wrong@catcafe.com",
        password: "wrongpassword"
      });

    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Incorrect login details/);
    expect(res.text).toMatch(/Staff Login/);
  });

  // Staff dashboard renders
  test("GET /staffDashboard renders dashboard page", async () => {
    const res = await request(app).get("/staffDashboard");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/Staff Dashboard/);
  });

  // Home page has staff login link
  test("GET / includes link to staff login", async () => {
    const res = await request(app).get("/");
    expect(res.text).toMatch(/staffLogin/);
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});