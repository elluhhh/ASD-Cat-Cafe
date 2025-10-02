process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server'); 
const { Cat } = require('../models/Cat');

// mock DB calls
jest.mock('../models/Cat', () => {
  const create = jest.fn();
  const find = jest.fn();
  const findById = jest.fn();
  const findByIdAndUpdate = jest.fn();
  const findByIdAndDelete = jest.fn();

  return {
    Cat: {
      create,
      find,
      findById,
      findByIdAndUpdate,
      findByIdAndDelete,
    }
  };
});

describe("Cat Profiles API", () => {
  beforeEach(() => jest.clearAllMocks());

  test("GET /cats should list all cats", async () => {
    Cat.find.mockResolvedValueOnce([
      { _id: "1", name: "Mochi", breed: "DSH", ageMonths: 12, isAdopted: false }
    ]);

    const res = await request(app).get("/cats").set("Accept", "application/json");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe("Mochi");
  });

  test("POST /cats/add should create a cat", async () => {
    Cat.create.mockResolvedValueOnce({ _id: "2", name: "Luna", breed: "Siamese", ageMonths: 6 });

    const res = await request(app)
      .post("/cats/add")
      .field("name", "Luna")
      .field("breed", "Siamese")
      .field("ageMonths", 6);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Luna");
  });

  test("PUT /cats/:id should update cat", async () => {
    Cat.findByIdAndUpdate.mockResolvedValueOnce({ _id: "1", name: "MochiUpdated" });

    const res = await request(app)
      .put("/cats/1")
      .send({ name: "MochiUpdated" })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("MochiUpdated");
  });

  test("DELETE /cats/:id should remove cat", async () => {
    Cat.findByIdAndDelete.mockResolvedValueOnce({ _id: "1" });

    const res = await request(app).delete("/cats/1");
    expect(res.status).toBe(200);
  });
});