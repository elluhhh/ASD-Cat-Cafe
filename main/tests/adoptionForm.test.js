/* eslint-env jest, node */
process.env.NODE_ENV = 'test';

jest.mock('../models/adoptionRequest', () => {
    const create = jest.fn();
    const findOne = jest.fn();
    return { AdoptionRequest: { create, findOne } };
});

const request = require('supertest');
const app = require('../server');   // <-- import app.js, not server.js
const { AdoptionRequest } = require('../models/adoptionRequest');

describe("Adoption Form (server)", () => {
    test("GET /adoption/request renders form", async () => {
        const res = await request(app).get("/adoption/request");
        expect(res.status).toBe(200);
        expect(res.text).toContain("<form"); // depends on your adoptionForm.ejs
    });

    test("POST /adoption/request creates request and redirects", async () => {
        AdoptionRequest.create.mockResolvedValueOnce({ trackingCode: "TRACK123" });

        const res = await request(app)
            .post("/adoption/request")
            .send({ name: "Jean", email: "test@example.com" });

        expect(res.status).toBe(302);
        expect(res.header.location).toContain("/adoption/status/TRACK123");
    });

    test("GET /adoption/status/:code renders status (found)", async () => {
        AdoptionRequest.findOne.mockResolvedValueOnce({
            trackingCode: "X1",
            status: "RECEIVED",
            applicant: { name: "Jean", email: "j@example.com", phone: "0412..." },
            createdAt: new Date(),
            updatedAt: new Date(),
            catId: null,
        });

        const res = await request(app).get("/adoption/status/X1");
        expect(res.status).toBe(200);
        expect(res.text).toContain("RECEIVED");
        expect(res.text).toContain("X1");
    });

    test("GET /adoption/status/:code returns 404 when missing", async () => {
        AdoptionRequest.findOne.mockResolvedValueOnce(null);
        const res = await request(app).get("/adoption/status/NOPE");
        expect(res.status).toBe(404);
        expect(res.text).toMatch(/not found/i);
    });

    test("GET / redirects to /adoption/request", async () => {
        const res = await request(app).get("/");
        expect(res.status).toBe(302);
        expect(res.header.location).toBe("/adoption/request");
    });
});