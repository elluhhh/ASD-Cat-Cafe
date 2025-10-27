// Ena Debnath
const request = require("supertest");
const app = require("../server");
const Order = require("../models/orderModel");

// Mock mongoose model
jest.mock("../models/orderModel");

describe("Checkout & Payment Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Checkout page requires orderId
  test("GET /checkout without orderId redirects", async () => {
    const res = await request(app).get("/checkout");
    expect(res.status).toBe(302); // Redirect
  });

  // Checkout page loads with valid orderId
  test("GET /checkout with orderId returns HTML page", async () => {
    const mockOrder = {
      _id: "test123",
      items: [
        { name: "Latte", qty: 2, priceCents: 500 }
      ],
      totals: { subtotal: 1000, tax: 100, total: 1100 },
      status: "CONFIRMED"
    };

    Order.findById = jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockOrder)
    });

    const res = await request(app).get("/checkout?orderId=test123");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/Checkout/);
  });

  // Payment processing validates required fields
  test("POST /checkout/process rejects missing orderId", async () => {
    const res = await request(app)
      .post("/checkout/process")
      .send({
        cardNumber: "1234567890123456",
        cardName: "John Doe",
        expiry: "12/25",
        cvv: "123",
        email: "test@example.com"
      });
    
    expect(res.status).toBe(400);
    expect(res.text).toMatch(/Missing orderId/);
  });

  // Payment validates card number format
  test("POST /checkout/process rejects invalid card number", async () => {
    const mockOrder = {
      _id: "test123",
      items: [],
      totals: { total: 1000 },
      status: "CONFIRMED",
      save: jest.fn().mockResolvedValue(true)
    };

    Order.findById = jest.fn().mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/checkout/process")
      .send({
        orderId: "test123",
        cardNumber: "123", // Invalid: too short
        cardName: "John Doe",
        expiry: "12/25",
        cvv: "123",
        email: "test@example.com"
      });
    
    expect(res.status).toBe(400);
    expect(res.text).toMatch(/Invalid card number/);
  });

  // Payment validates email format
  test("POST /checkout/process rejects invalid email", async () => {
    const mockOrder = {
      _id: "test123",
      items: [],
      totals: { total: 1000 },
      status: "CONFIRMED",
      save: jest.fn().mockResolvedValue(true)
    };

    Order.findById = jest.fn().mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/checkout/process")
      .send({
        orderId: "test123",
        cardNumber: "1234567890123456",
        cardName: "John Doe",
        expiry: "12/25",
        cvv: "123",
        email: "invalid-email" // Invalid format
      });
    
    expect(res.status).toBe(400);
    expect(res.text).toMatch(/Invalid email/);
  });

  // Payment validates expiry format
  test("POST /checkout/process rejects invalid expiry", async () => {
    const mockOrder = {
      _id: "test123",
      items: [],
      totals: { total: 1000 },
      status: "CONFIRMED",
      save: jest.fn().mockResolvedValue(true)
    };

    Order.findById = jest.fn().mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/checkout/process")
      .send({
        orderId: "test123",
        cardNumber: "1234567890123456",
        cardName: "John Doe",
        expiry: "1225", // Invalid format (should be MM/YY)
        cvv: "123",
        email: "test@example.com"
      });
    
    expect(res.status).toBe(400);
    expect(res.text).toMatch(/Invalid or expired card/);
  });

  // Payment validates month in expiry (01-12 only)
test("POST /checkout/process rejects invalid month in expiry", async () => {
  const mockOrder = {
    _id: "test123",
    items: [],
    totals: { total: 1000 },
    status: "CONFIRMED",
    save: jest.fn().mockResolvedValue(true)
  };

  Order.findById = jest.fn().mockResolvedValue(mockOrder);

  const res = await request(app)
    .post("/checkout/process")
    .send({
      orderId: "test123",
      cardNumber: "1234567890123456",
      cardName: "John Doe",
      expiry: "13/25", // Invalid: month 13
      cvv: "123",
      email: "test@example.com"
    });
  
  expect(res.status).toBe(400);
  expect(res.text).toMatch(/Invalid or expired card/);
});

// Payment validates card is not expired
test("POST /checkout/process rejects expired card", async () => {
  const mockOrder = {
    _id: "test123",
    items: [],
    totals: { total: 1000 },
    status: "CONFIRMED",
    save: jest.fn().mockResolvedValue(true)
  };

  Order.findById = jest.fn().mockResolvedValue(mockOrder);

  const res = await request(app)
    .post("/checkout/process")
    .send({
      orderId: "test123",
      cardNumber: "1234567890123456",
      cardName: "John Doe",
      expiry: "12/20", // Expired: December 2020
      cvv: "123",
      email: "test@example.com"
    });
  
  expect(res.status).toBe(400);
  expect(res.text).toMatch(/Invalid or expired card/);
});

  // Valid payment succeeds and shows success page
  test("POST /checkout/process accepts valid payment", async () => {
    const mockOrder = {
      _id: "test123",
      items: [
        { name: "Latte", qty: 2, priceCents: 500 }
      ],
      totals: { subtotal: 1000, tax: 100, total: 1100 },
      status: "CONFIRMED",
      save: jest.fn().mockResolvedValue(true)
    };

    Order.findById = jest.fn().mockResolvedValue(mockOrder);

    const res = await request(app)
      .post("/checkout/process")
      .send({
        orderId: "test123",
        cardNumber: "1234567890123456",
        cardName: "John Doe",
        expiry: "12/25",
        cvv: "123",
        email: "test@example.com"
      });
    
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Payment Successful/);
    expect(mockOrder.status).toBe("PAID");
    expect(mockOrder.save).toHaveBeenCalled();
  });

  // Payment updates order status
  test("POST /checkout/process updates order to PAID", async () => {
    const mockOrder = {
      _id: "test123",
      items: [{ name: "Test", qty: 1, priceCents: 100 }],
      totals: { total: 110 },
      status: "CONFIRMED",
      save: jest.fn().mockResolvedValue(true)
    };

    Order.findById = jest.fn().mockResolvedValue(mockOrder);

    await request(app)
      .post("/checkout/process")
      .send({
        orderId: "test123",
        cardNumber: "1234567890123456",
        cardName: "Test User",
        expiry: "12/25",
        cvv: "123",
        email: "test@example.com"
      });

    expect(mockOrder.status).toBe("PAID");
    expect(mockOrder.paidAt).toBeDefined();
    expect(mockOrder.paymentMethod).toBe("CARD");
  });
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
});