const request = require('supertest');
const server = require('../app');
const { testForStatus200 } = require('./users.test');

describe('Roles router', () => {
    test('should run the test', () => {
        expect(true).toBe(true);
    });

    describe('GET /', () => {
        testForStatus200('/api/roles')

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