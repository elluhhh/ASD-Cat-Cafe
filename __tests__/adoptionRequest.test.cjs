// Jean Quisumbing

process.env.NODE_ENV = 'test';

const request = require('supertest');

const mockRequests = [];

// Mock AdoptionRequest model 
jest.mock('../models/adoptionRequest', () => ({
  __esModule: false,
  AdoptionRequest: {
    create: jest.fn(async (data) => {
      const doc = { trackingCode: 'ABC123', status: 'Pending', ...data };
      mockRequests.push(doc);
      return doc;
    }),
    findOne: jest.fn(async (query) =>
      mockRequests.find(r => r.trackingCode === query.trackingCode) || null
    )
  }
}));

// Mock Cat model
jest.mock('../models/Cat', () => ({
  __esModule: false,
  Cat: { findById: jest.fn(async () => null) }
}));

const app = require('../server');

describe('🐾 Adoption Request (Mock Mongoose)', () => {
  test('POST /adoption/request creates a new request and redirects', async () => {
    const res = await request(app)
      .post('/adoption/request')
      .type('form')
      .send({
        name: 'Alice',
        email: 'alice@example.com',
        phone: '0400000000',
        address: '1 Main St',
        livesWithChildren: 'no',
        hasOtherPets: 'yes',
        whyAdopt: 'I love cats'
      });

    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/adoption/status/ABC123');
    expect(mockRequests.length).toBe(1);
  });

  test('GET /adoption/status/:code renders a valid request', async () => {
    mockRequests.push({
      trackingCode: 'TEST001',
      status: 'Approved',
      applicant: { name: 'Bob', email: 'bob@test.com' }
    });

    const res = await request(app).get('/adoption/status/TEST001');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Adoption Request Status');
  });

  test('GET /adoption/status?code=XYZ redirects to correct URL', async () => {
    const res = await request(app).get('/adoption/status?code=XYZ');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/adoption/status/XYZ');
  });

  test('GET /adoption/status/:invalid returns 404', async () => {
    const res = await request(app).get('/adoption/status/NOPE');
    expect(res.status).toBe(404);
    expect(res.text).toContain('Not found');
  });
});