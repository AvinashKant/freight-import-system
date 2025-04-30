const request = require('supertest');
const app = require("../app");


describe('GET /api/freight', () => {
  it('should return a list of freight rates with pagination meta', async () => {

    const response = await request(app).get("/api/freight");
    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty('status', true);
    expect(response.body).toHaveProperty('message', 'Freight rates fetched successfully');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    expect(response.body).toHaveProperty('meta');
    expect(response.body.meta).toHaveProperty('totalRecords');
    expect(response.body.meta).toHaveProperty('currentPage', 1);
    expect(response.body.meta).toHaveProperty('pageSize', 10);
    expect(response.body.meta).toHaveProperty('totalPages');

    if (response.body.data.length > 0) {
      const sample = response.body.data[0];
      expect(sample).toHaveProperty('origin_country');
      expect(sample).toHaveProperty('destination_country');
      expect(sample).toHaveProperty('container_type');
      expect(sample).toHaveProperty('carrier');
      expect(sample).toHaveProperty('freight_rate');
    }
  });
});

describe('POST /api/freight/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save valid freight data and return 201', async () => {
     const validPayload = [
      {
        "origin_country": "Test origin",
        "destination_country": "origin destination",
        "container_type": "80Fit",
        "carrier": "Test carrier",
        "freight_rate": "1100"
      }
    ];

    const response = await request(app)
      .post('/api/freight')
      .send(validPayload);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Freight data saved successfully!');
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body).toHaveProperty('meta');

  });

  it('should return 400 if freight data array is empty', async () => {
    const res = await request(app)
      .post('/api/freight')
      .send([]);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid or empty freight data');
  });

  it('should return 400 if payload is not an array', async () => {
    const res = await request(app)
      .post('/api/freight')
      .send({ some: 'object' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Invalid or empty freight data');
  });

  it('should return 400 for validation errors', async () => {
    const invalidPayload = [
      {
        origin_country: "USA",
        destination_country: "India",
        container_type: "GP20",
        carrier: "Maersk",
        freight_rate: -500,
        datetime: "invalid-date"
      }
    ];

    const res = await request(app)
      .post('/api/freight')
      .send(invalidPayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.details)).toBe(true);
    expect(res.body.details.length).toBeGreaterThan(0);
  });
});
