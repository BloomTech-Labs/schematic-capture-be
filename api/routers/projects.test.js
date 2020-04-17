/**
 * @jest-environment node
 */
const request = require('supertest');
const server = require('../app');

describe('Projects router', () => {
    test('should run the test', function() {
        expect(true).toBe(true);
    });

    let token;
    beforeAll(done => {
        request(server)
        .post('/api/auth/login')
        .send({ username: process.env.TEST_USER, password: process.env.TEST_USER_PASSWORD })
        .end((err, res) => {
            token = res.body.token;
            done();
        });
    });

    describe('GET /:id/jobsheets', () => {
        test('should return the requested project with a status 200.', async () => {
            const res = await request(server).get('/api/projects/1/jobsheets').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body[0].id).toBe(1);
            expect(res.body[0]).toMatchObject({
                completed: expect.any(Number),
                id: expect.any(Number),
                name: expect.any(String),
                project_id: expect.any(Number),
                status: expect.any(String),
                updated_at: expect.any(String),
                user_email: expect.stringMatching(process.env.TEST_USER)
            });
        });
    });
});