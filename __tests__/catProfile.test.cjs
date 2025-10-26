// Jean Quisumbing
const request = require("supertest");
const app = require("../server");

const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockFindById = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

jest.mock("../models/Cat", () => ({
  Cat: {
    find: (...args) => mockFind(...args),
    create: (...args) => mockCreate(...args),
    findById: (...args) => mockFindById(...args),
    findByIdAndUpdate: (...args) => mockFindByIdAndUpdate(...args),
    findByIdAndDelete: (...args) => mockFindByIdAndDelete(...args),
  },
}));

describe("Cat Profile Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /catProfile/api returns cat list", async () => {
    mockFind.mockResolvedValue([
      { _id: "1", name: "Mochi", breed: "DSH", gender: "Female" },
    ]);

    const res = await request(app).get("/catProfile/api");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe("Mochi");
  });

  test("POST /catProfile/api/add creates a new cat", async () => {
    const newCat = {
      _id: "2",
      name: "Bilbo",
      breed: "Ragdoll",
      gender: "Male",
      ageMonths: 24,
      price: 150,
    };

    mockCreate.mockResolvedValue(newCat);

    const res = await request(app)
      .post("/catProfile/api/add")
      .set("Accept", "application/json")
      .send(newCat);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Bilbo");
    expect(mockCreate).toHaveBeenCalled();
  });

  test("PUT /catProfile/api/:id updates a cat", async () => {
    // Mock findById().select('imageUrl') chain
    mockFindById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ imageUrl: "/uploads/old.png" }),
    });

    const updatedCat = {
      _id: "1",
      name: "Mochi",
      price: 120,
      isAdopted: true,
      gender: "Female",
    };

    mockFindByIdAndUpdate.mockResolvedValue(updatedCat);

    const res = await request(app)
      .put("/catProfile/api/1")
      .send({ price: 120, isAdopted: true, gender: "Female" });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(120);
    expect(res.body.isAdopted).toBe(true);
  });

  test("DELETE /catProfile/api/:id removes a cat", async () => {
    mockFindByIdAndDelete.mockResolvedValue({ _id: "1" });

    const res = await request(app).delete("/catProfile/api/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
});

afterAll(async () => {
  await new Promise((r) => setTimeout(r, 300));
});