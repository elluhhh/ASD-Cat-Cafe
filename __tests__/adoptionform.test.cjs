const request = require('supertest');

// Minimal mock of your AdoptionRequest model with the methods the route uses.
const mockAdoptionModel = {
  create: jest.fn(),
  findOne: jest.fn(),
};

jest.mock('../models/AdoptionRequest', () => ({
  __esModule: false,
  AdoptionRequest: mockAdoptionModel,
  default: mockAdoptionModel,
  ...mockAdoptionModel,
}));

let app;

describe('Adoption Request (mocked)', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = require('../server');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /adoption/request creates a request (mocked)', async () => {
    const fake = {
      _id: 'r1',
      trackingCode: 'AbC123xy',
      status: 'Received',
      applicant: { name: 'Jane Tester', email: 'jane@example.com' },
    };
    mockAdoptionModel.create.mockResolvedValueOnce(fake);

    const res = await request(app)
      .post('/adoption/request')
      .type('form')
      .send({
        'applicant.name': 'Jane Tester',
        'applicant.email': 'jane@example.com',
        'applicant.whyAdopt': 'Because...',
      });

    // Many implementations redirect to /adoption/status/:code (302) OR return JSON (201)
    expect([200, 201, 302]).toContain(res.status);
    expect(mockAdoptionModel.create).toHaveBeenCalledTimes(1);
  });

  test('GET /adoption/status/:code returns 200 if found', async () => {
    const code = 'AbC123xy';
    const fake = {
      _id: 'r1',
      trackingCode: code,
      status: 'In Review',
      applicant: { name: 'Jane Tester', email: 'jane@example.com' },
      updatedAt: new Date().toISOString(),
    };
    mockAdoptionModel.findOne.mockResolvedValueOnce(fake);

    const res = await request(app).get(`/adoption/status/${code}`);
    expect([200]).toContain(res.status);
    expect(mockAdoptionModel.findOne).toHaveBeenCalledWith({ trackingCode: code });
  });

  test('GET /adoption/status/:code returns 404 (or 200 with not-found page) when missing', async () => {
    const code = 'NOPE';
    mockAdoptionModel.findOne.mockResolvedValueOnce(null);

    const res = await request(app).get(`/adoption/status/${code}`);
    expect([200, 404]).toContain(res.status);
  });
});