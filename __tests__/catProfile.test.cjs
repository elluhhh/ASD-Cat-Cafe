const request = require("supertest");
const app = require("../server");

// Mock model
const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

jest.mock("../models/Cat", () => ({
  // Your route does: const CatModel = require('../models/Cat'); const Cat = CatModel?.Cat || CatModel
  Cat: {
    find: (...args) => mockFind(...args),
    create: (...args) => mockCreate(...args),
    findByIdAndDelete: (...args) => mockFindByIdAndDelete(...args),
  },
}));

describe("Cat Profile API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /catProfile/api returns cat list", async () => {
    mockFind.mockResolvedValue([
      {
        _id: "c1",
        name: "Mochi",
        breed: "DSH",
        gender: "Female",
        ageMonths: 12,
        microchipId: "12345",
        price: 99,
        description: "Sweet cat",
        isAdopted: false,
        imageUrl: "/uploads/mochi.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await request(app)
      .get("/catProfile/api")
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe("Mochi");
  });

  test("POST /catProfile/api/add adds a new cat (JSON without file)", async () => {
    const newCat = {
      _id: "c2",
      name: "Bilbo",
      breed: "Ragdoll",
      gender: "Male",
      ageMonths: 24,
      microchipId: "99999",
      price: 150,
      description: "Fluffy",
      isAdopted: false,
      imageUrl: "",
    };

    mockCreate.mockResolvedValue(newCat);

    const res = await request(app)
      .post("/catProfile/api/add")
      .set("Accept", "application/json")
      .send({
        name: "Bilbo",
        breed: "Ragdoll",
        gender: "Male",
        ageMonths: 24,
        microchipId: "99999",
        price: 150,
        description: "Fluffy",
        isAdopted: false,
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Bilbo");
    expect(mockCreate).toHaveBeenCalled();
  });

  test("DELETE /catProfile/api/:id deletes a cat", async () => {
    mockFindByIdAndDelete.mockResolvedValue({ _id: "c1" });

    const res = await request(app).delete("/catProfile/api/c1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
});

afterAll(async () => {
  await new Promise((r) => setTimeout(r, 300));
});