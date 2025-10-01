const request = require('supertest');

let app;
beforeAll(async () => {
  app = (await import('../server.js')).default;
});

describe('pages render', () => {
  test('GET / returns HTML', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text.length).toBeGreaterThan(20);
  });

  test('GET /food returns HTML', async () => {
    const res = await request(app).get('/food');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });
});
