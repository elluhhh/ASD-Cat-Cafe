const request = require('supertest');

let app;
beforeAll(async () => {
  app = (await import('../server.js')).default;
});

test('GET /api/menu returns array', async () => {
  const res = await request(app).get('/api/menu');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
