/**
 * @jest-environment node
 */
const request = require('supertest');
const server = require('../app');

describe('Jobsheets router', () => {
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

    describe('GET /:id', () => {
        test('should return status 200 with the requested jobsheet', async () => {
            const res = await request(server).get('/api/jobsheets/1').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.id).toBe(1);
            expect(res.body).toMatchObject({
                id: expect.any(Number),
                updated_at: expect.any(String),
                status: expect.any(String),
                user_email: expect.any(String),
                name: expect.any(String),
                project_id: expect.any(Number),
                completed: expect.any(Number)
            })
        })
    });

    describe('GET /assigned', () => {
        test('should return a status 200 with an array of assigned projects.', async () => {
            const res = await request(server).get('/api/jobsheets/assigned').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].jobsheet[0].userEmail).toBe(process.env.TEST_USER);
        });
    });

    describe('GET /:id/components', () => {
        test('should return a status 200 with an array of components.', async () => {
            const res = await request(server)
                .get('/api/jobsheets/1/components').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].jobsheetId).toBe(1);
            expect(res.body[0]).toMatchObject({
                id: expect.any(Number),
                jobsheetId: expect.any(Number),
                componentId: expect.any(String),
                rlCategory: expect.any(String),
                rlNumber: expect.any(String),
                descriptions: expect.any(String),
                manufacturer: expect.any(String),
                partNumber: expect.any(String),
                stockCode: expect.any(String),
                componentApplication: expect.any(String),
                electricalAddress: expect.any(String),
                referenceTag: expect.any(String),
                settings: expect.any(String),
                image: expect.any(String),
                resources: expect.any(String),
                cutsheet: expect.any(String),
                maintenanceVideo: expect.any(String),
                custom: null
            });
        });
    });

    describe('PUT /:id/update', () => {
        test('should return status 201 with the requested jobsheet', async () => {
            const changes = { name: "ACME Manifolds Jobsheet" }
            const res = await request(server)
                .put('/api/jobsheets/1/update')
                .set('Authorization', `Bearer ${token}`)
                .send(changes);
            expect(res.status).toBe(201);
            expect(res.body.id).toBe(1);
            expect(res.body.name).toBe(changes.name);
            expect(res.body).toMatchObject({
                id: expect.any(Number),
                updated_at: expect.any(String),
                status: expect.any(String),
                user_email: expect.any(String),
                name: expect.any(String),
                project_id: expect.any(Number),
                completed: expect.any(Number)
            });
        });
    });
});