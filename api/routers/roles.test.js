const request = require('supertest');
const server = require('../app');

describe('Roles router', () => {
    test('should run the test', () => {
        console.log(process.env.PORT)
        console.log(process.env.DB_ENV)
        expect(true).toBe(true);
    });

    describe('GET /', () => {
        test('should return 200 ok', async () => {
            const res = await request(server).get('/api/roles');
            expect(res.status).toBe(200);
        });

        test('should return an array of 3 role objects', async () => {
            const res = await request(server).get('/api/roles');
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(3);
            expect(res.body[0]).toMatchObject({
                id: expect.any(Number),
                name: expect.stringMatching('admin')
            });
        });
    });
});