const request = require('supertest');
const app = require('../app');

describe('GET /catprofile', () => {
  it('responds with 200 and contains heading text', async () => {
    const res = await request(app).get('/catprofile');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Cat Profiles/i);
  });
});