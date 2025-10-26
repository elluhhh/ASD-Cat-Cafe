
// Jean Quisumbing
process.env.NODE_ENV = 'test';

const request = require('supertest');

const mockCats = [
  {
    _id: '1',
    name: 'Bilbo',
    breed: 'Domestic Long Hair',
    gender: 'Male',
    ageMonths: 150,
    microchipId: '965987654321098',
    price: 149,
    description: 'Older gentle cat',
    isAdopted: false,
    imageUrl: '/uploads/bilbo.jpg'
  }
];

// Mock the Cat model used in routes 
jest.mock('../models/Cat', () => ({
  __esModule: false,
  Cat: {
    find: jest.fn(async () => [...mockCats]),
    findById: jest.fn(async (id) => mockCats.find(c => c._id === id) || null),
    findByIdAndUpdate: jest.fn(async (id, update) => {
      const idx = mockCats.findIndex(c => c._id === id);
      if (idx === -1) return null;
      mockCats[idx] = { ...mockCats[idx], ...update };
      return mockCats[idx];
    }),
    findByIdAndDelete: jest.fn(async (id) => {
      const idx = mockCats.findIndex(c => c._id === id);
      if (idx === -1) return null;
      const [deleted] = mockCats.splice(idx, 1);
      return deleted;
    }),
    create: jest.fn(async (data) => {
      const newCat = { _id: String(mockCats.length + 1), ...data };
      mockCats.push(newCat);
      return newCat;
    })
  }
}));

const app = require('../server'); 

describe('Cat Profile API', () => {
  test('GET /catProfile/api returns cat list', async () => {
    const res = await request(app).get('/catProfile/api');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('Bilbo');
  });

  test('POST /catProfile/api/add adds a new cat', async () => {
    const res = await request(app)
      .post('/catProfile/api/add')
      .field('name', 'Cloud')
      .field('breed', 'Domestic Long Hair')
      .field('gender', 'Female')
      .field('ageMonths', '43')
      .field('price', '200')
      .field('isAdopted', 'false');

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Cloud');
    expect(mockCats.length).toBeGreaterThan(1);
  });

test('PUT /catProfile/api/:id updates cat info', async () => {
  const res = await request(app)
    .put('/catProfile/api/1')
    .set('Accept', 'application/json')
    .field('name', 'Bilbo')
    .field('breed', 'Domestic Long Hair')
    .field('gender', 'Male')
    .field('ageMonths', '150')
    .field('price', '120')
    .field('isAdopted', 'true');

  expect(res.status).toBe(200);
  expect(res.body.price).toBe(120);
  expect(res.body.isAdopted).toBe(true);
});

  test('DELETE /catProfile/api/:id deletes a cat', async () => {
    const res = await request(app).delete('/catProfile/api/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
  });
});