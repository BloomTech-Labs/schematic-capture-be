const request = require('supertest');
const server = require('../app');

const testForStatus200 = (url) => {
    test('should return 200 ok', async () => {
        const res = await request(server).get(url);
        expect(res.status).toBe(200);
    });
}

exports.testForStatus200 = testForStatus200;

describe('Users router', () => {
    test('should run the test', () => {
        expect(true).toBe(true);
    });

    describe('GET /', () => {
        testForStatus200('/api/users')

        test('should return an array of user objects', async () => {
            const res = await request(server).get('/api/users');
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject({
                id: expect.any(String),
                roleId: expect.any(Number),
                email: expect.stringMatching(process.env.TEST_USER),
                firstName: expect.stringMatching('Bob'),
                lastName: expect.stringMatching('Johnson'),
                licenseId: null,
                phone: expect.any(String),
                question: expect.any(String)
            });
        });
    });
});