const request = require('supertest');
const server = require('../app');

describe('Users router', () => {
    test('should run the test', () => {
        expect(true).toBe(true);
    });

    describe('GET /', () => {
        test('should return 200 ok', async () => {
            const res = await request(server).get('/api/users');
            expect(res.status).toBe(200);
        });

        test('should return an array of user objects', async () => {
            const res = await request(server).get('/api/users');
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject({
                id: expect.any(String),
                role_id: expect.any(Number),
                email: expect.stringMatching(process.env.TEST_USER),
                first_name: expect.stringMatching('Bob'),
                last_name: expect.stringMatching('Johnson'),
                license_id: null,
                phone: expect.any(String),
                question: expect.any(String)
            });
        });
    });
});