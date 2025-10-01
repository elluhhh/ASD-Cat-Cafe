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

// Add these tests to the existing file

describe("Checkout & Payment Tests (F109)", () => {
    
    test("GET /checkout returns HTML page", async () => {
        const res = await request(app).get("/checkout");
        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/html/);
    });

    test("POST /checkout/process validates required fields", async () => {
        const res = await request(app)
            .post("/checkout/process")
            .send({});
        
        expect(res.status).toBe(400);
    });

    test("POST /checkout/process accepts valid payment", async () => {
        const res = await request(app)
            .post("/checkout/process")
            .send({
                cardNumber: "1234567890123456",
                cardName: "John Doe",
                expiry: "12/25",
                cvv: "123",
                email: "test@example.com",
                total: "25.00"
            });
        
        expect(res.status).toBe(200);
        expect(res.text).toMatch(/Payment Successful/);
    });

    test("POST /checkout/process rejects invalid email", async () => {
        const res = await request(app)
            .post("/checkout/process")
            .send({
                cardNumber: "1234567890123456",
                cardName: "John Doe",
                expiry: "12/25",
                cvv: "123",
                email: "invalid-email",
                total: "25.00"
            });
        
        expect(res.status).toBe(400);
    });
});