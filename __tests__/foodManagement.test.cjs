const request = require("supertest");
const app = require("../server");
const Food = require("../models/foodModel");

// mock mongoose model
jest.mock("../models/foodModel");

describe("Food Management Tests", () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    // tetsing health endpoint
    test("GET /health returns ok", async () => {
        const res = await request(app).get("/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });

    // testing API endpoint
    test("GET /foodManagement/api returns array of foods", async () => {
        const mockFoods = [
            { name: "Latte", category: "drink", price: 5.0, stock: 10 },
            { name: "Cookie", category: "food", price: 3.5, stock: 5 }
        ];
        
        Food.find = jest.fn().mockResolvedValue(mockFoods);
        
        const res = await request(app).get("/foodManagement/api");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
    });

    // testing food management page renders
    test("GET /foodManagement returns HTML", async () => {
        Food.find = jest.fn().mockResolvedValue([]);
        
        const res = await request(app).get("/foodManagement");
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/html/);
    });
});