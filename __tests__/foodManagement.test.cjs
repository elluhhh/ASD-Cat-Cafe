const request = require("supertest");
const app = require("../server");
const Food = require("../models/foodModel");

// Mock mongoose model
jest.mock("../models/foodModel");

describe("Food Management Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Health endpoint
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  // Customer menu API endpoint
  test("GET /api/menu returns array of available foods", async () => {
    const mockFoods = [
      { 
        _id: "123", 
        name: "Latte", 
        category: "drink", 
        price: 5.0, 
        stock: 10,
        status: "Available",
        vegan: false
      },
      { 
        _id: "456",
        name: "Cookie", 
        category: "food", 
        price: 3.5, 
        stock: 5,
        status: "Available",
        vegan: true
      }
    ];
    
    Food.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockFoods)
    });
    
    const res = await request(app).get("/api/menu");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("id");
  });

  // Staff food management page renders
  test("GET /food/management returns HTML page", async () => {
    Food.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue([])
    });
    
    const res = await request(app).get("/food/management");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/Staff Food Management/);
  });

  // Customer food ordering page renders
  test("GET /food returns customer menu page", async () => {
    const res = await request(app).get("/food");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/Menu/);
  });

  // Only available items returned to customers
  test("GET /api/menu returns only available items", async () => {
    const mockFoods = [
      { 
        _id: "123",
        name: "Available Item", 
        status: "Available",
        price: 5.0
      }
    ];
    
    Food.find = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockFoods)
    });
    
    const res = await request(app).get("/api/menu");
    expect(Food.find).toHaveBeenCalledWith({ status: "Available" });
    expect(res.body.every(item => item.status === "Available")).toBe(true);
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});