/**
 * @jest-environment node
 */
const request = require('supertest');
const server = require('./app');

describe('Server', () => {
    test('should run the test', function() {
        expect(true).toBe(true);
    });

    describe('GET /', () => {
        test('should return a status 200 with a confirmation the server is running.', async () => {
            const res = await request(server).get('/');
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ running: true });
        });
    });
});