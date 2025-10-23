const request = require('supertest');

const mockCatModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

jest.mock('../models/Cat', () => ({
  __esModule: false,
  Cat: mockCatModel,    
  default: mockCatModel,
  ...mockCatModel,
}));

let app;

describe('Cat Profile API (mocked)', () => {
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = require('../server');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /catProfile/api returns list', async () => {
    const fakeList = [
      { _id: '1', name: 'Mochi', breed: 'DSH', gender: 'Female', ageMonths: 12, isAdopted: false, price: 100, description: 'Sweet', imageUrl: '/uploads/a.jpg' },
      { _id: '2', name: 'Bilbo', breed: 'Ragdoll', gender: 'Male', ageMonths: 36, isAdopted: true, price: 200, description: 'Brave', imageUrl: '/uploads/b.jpg' },
    ];
    mockCatModel.find.mockResolvedValueOnce(fakeList);

    const res = await request(app).get('/catProfile/api').set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(fakeList);
    expect(mockCatModel.find).toHaveBeenCalledTimes(1);
  });

  test('POST /catProfile/api/add creates a cat (multipart, mocked)', async () => {
    const created = {
      _id: 'abc123',
      name: 'NewCat',
      breed: 'Siamese',
      gender: 'Female',
      ageMonths: 8,
      microchipId: '99999',
      price: 150,
      description: 'Curious',
      isAdopted: false,
      imageUrl: '/uploads/new.jpg',
    };
    mockCatModel.create.mockResolvedValueOnce(created);

    const res = await request(app)
      .post('/catProfile/api/add')
      .set('Accept', 'application/json')
      .field('name', 'NewCat')
      .field('breed', 'Siamese')
      .field('gender', 'Female')
      .field('ageMonths', '8')
      .field('microchipId', '99999')
      .field('price', '150')
      .field('description', 'Curious')
      .field('isAdopted', 'false')
      .attach('image', Buffer.from('fake'), 'file.jpg');

    expect([200, 201]).toContain(res.status);
    expect(res.body).toEqual(created);
    expect(mockCatModel.create).toHaveBeenCalledTimes(1);
    const arg = mockCatModel.create.mock.calls[0][0];
    expect(arg).toMatchObject({
      name: 'NewCat',
      breed: 'Siamese',
      gender: 'Female',
      ageMonths: 8,
      microchipId: '99999',
      price: 150,
      description: 'Curious',
      isAdopted: false,
    });
  });

  test('PUT /catProfile/api/:id updates cat (JSON, mocked)', async () => {
    const id = 'abc123';
    const updated = {
      _id: id,
      name: 'Bilbo Baggins',
      breed: 'Ragdoll',
      gender: 'Male',
      ageMonths: 40,
      microchipId: '12345',
      price: 220,
      description: 'Upgraded',
      isAdopted: true,
      imageUrl: '/uploads/old.jpg', 
    };
    mockCatModel.findByIdAndUpdate.mockResolvedValueOnce(updated);

    const res = await request(app)
      .put(`/catProfile/api/${id}`)
      .set('Accept', 'application/json')
      .send({
        name: 'Bilbo Baggins',
        breed: 'Ragdoll',
        gender: 'Male',
        ageMonths: 40,
        microchipId: '12345',
        price: 220,
        description: 'Upgraded',
        isAdopted: true,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
    expect(mockCatModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    const [calledId, updateObj, options] = mockCatModel.findByIdAndUpdate.mock.calls[0];
    expect(calledId).toBe(id);
    expect(updateObj).toMatchObject({
      name: 'Bilbo Baggins',
      gender: 'Male',
      ageMonths: 40,
      isAdopted: true,
    });
    expect(options).toMatchObject({ new: true, runValidators: true });
  });

  test('DELETE /catProfile/api/:id deletes cat (mocked)', async () => {
    const id = 'to-del';
    mockCatModel.findByIdAndDelete.mockResolvedValueOnce({ _id: id });

    const res = await request(app).delete(`/catProfile/api/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
    expect(mockCatModel.findByIdAndDelete).toHaveBeenCalledWith(id);
  });
});