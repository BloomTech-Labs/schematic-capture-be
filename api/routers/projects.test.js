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
        test('should return the jobsheets of the requested project with a status 200.', async () => {
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
        test('should return status 404 if a project with the passed id doesn\'t exist.', async () => {
            const res = await request(server).get('/api/projects/25/jobsheets').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(404);
        });
    });

    describe('PUT /:id', () => {
        const changes = { name: 'The Manhattan Project' };
        test('should return status 200 and an array of projects', async () => {
            const res = await request(server)
                .put('/api/projects/1').set('Authorization', `Bearer ${token}`)
                .send(changes);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ message: expect.stringMatching("project has been updated") });
        });
        test('should return status 404 if a project with the passed id doesn\'t exist.', async () => {
            const res = await request(server)
                .put('/api/projects/25').set('Authorization', `Bearer ${token}`)
                .send(changes);
            expect(res.status).toBe(404);
        });
    });

    describe('PUT /:id/assignuser', () => {
        const changes = { email: 'bob_johnson@lambdaschool.com' };
        test('should return a status 201 with the updated jobsheets', async () => {
            const res = await request(server)
                .put('/api/projects/1/assignuser').set('Authorization', `Bearer ${token}`)
                .send(changes);
            expect(res.status).toBe(201);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0]).toMatchObject({
                id: expect.any(Number),
                updated_at: expect.any(String),
                status: expect.stringMatching('assigned'),
                user_email: expect.stringMatching(changes.email),
                name: expect.any(String),
                project_id: expect.any(Number),
                completed: expect.any(Number)
            });
        });
        test('should return status 404 if a project with the passed id doesn\'t exist.', async () => {
            const res = await request(server)
                .put('/api/projects/25/assignuser').set('Authorization', `Bearer ${token}`)
                .send(changes);
            expect(res.status).toBe(404);
        });
        test('should return status 400 if an email isn\'t included in the request body.', async () => {
            const res = await request(server)
                .put('/api/projects/1/assignuser').set('Authorization', `Bearer ${token}`)
                .send({ somethingElse: 'not an email' });
            expect(res.status).toBe(400);
        });
    });
});