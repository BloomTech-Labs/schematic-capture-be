/**
 * @jest-environment node
 */
const request = require('supertest');
const server = require('../app');

describe('Clients router', () => {
    test('should run the test', function() {
        expect(true).toBe(true);
    });

    let token;
    beforeAll(done => {
        request(server)
        .post('/api/auth/login')
        .send({ username: process.env.TEST_USER, password: process.env.TEST_USER_PASSWORD })
        .end((err, res) => {
            console.log(err);
            token = res.body.token;
            done();
        });
    });

    describe('GET /', () => {
        test('/ should return a status 200 with an array of client objects', async () => {
            const res = await request(server).get('/api/clients/').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject({
                id: expect.any(Number),
                companyName: expect.any(String),
                phone: expect.any(String),
                street: expect.any(String),
                city: expect.any(String),
                state: null,
                zip: expect.any(String)
            });
        });
    });

    describe('GET /withcompleted', () => {
        test('/withcompleted should return status 200 with an array of clients including a completed key', async () => {
            const res = await request(server).get('/api/clients/withcompleted').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject({
                id: expect.any(Number),
                company_name: expect.any(String),
                phone: expect.any(String),
                street: expect.any(String),
                city: expect.any(String),
                state: null,
                zip: expect.any(String),
                completed: expect.any(Boolean)
            });
        });
    });
});