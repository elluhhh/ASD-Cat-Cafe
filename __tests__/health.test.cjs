const request = require('supertest');

describe('health', () => {
  test('GET /health', async () => {
    const { default: app } = await import('../server.js');
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
