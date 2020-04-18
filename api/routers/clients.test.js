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
            token = res.body.token;
            done();
        });
    });

    describe('GET /', () => {
        test('should return a status 200 with an array of client objects', async () => {
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
        test('should return status 200 with an array of clients including a completed key', async () => {
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

    describe('GET /:id/projects', () => {
        test('should return a status 200 with an array of projects', async () => {
            const res = await request(server).get('/api/clients/1/projects').set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].client_id).toBe(1);
            expect(res.body[0]).toMatchObject({
                id: expect.any(Number),
                client_id: expect.any(Number),
                name: expect.any(String),
                completed: expect.any(Number)
            });
        });
    });

    describe('POST /:id/projects', () => {
        test('should insert a project to the database and return it with a status 201', async () => {
            const testMachine = 'industrial boiler'
            const res = await request(server)
                .post('/api/clients/1/projects').set('Authorization', `Bearer ${token}`)
                .send({ name: testMachine });
            expect(res.status).toBe(201);
            expect(res.body.client_id).toBe(1);
            expect(res.body.completed).toBe(0);
            expect(res.body).toMatchObject({
                id: expect.any(Number),
                client_id: expect.any(Number),
                name: expect.stringMatching(testMachine),
                completed: expect.any(Number)
            });
        })
    })

    describe('PUT /:id', () => {
        const testChange = 'ACME Industrial';
        test('should return status 200 with a message confirming the client has been updated', async () => {
            const res = await request(server)
                .put('/api/clients/1').set('Authorization', `Bearer ${token}`)
                .send({ company_name: testChange });
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                message: expect.stringMatching("client has been updated")
            });
        });
        test('should return a status 404 with an invalid client id', async () => {
            const res = await request(server)
                .put('/api/clients/12').set('Authorization', `Bearer ${token}`)
                .send({ company_name: testChange });
            expect(res.status).toBe(404);
        });
    });

    describe('POST /create', () => {
        test('should return a status 200 with the created client.', async () => {
            const clientInfo = {
                companyName: "ACME Steel",
                phone: "1-800-W-R-STEEL",
                street: "1 Rockerfeller Ave",
                city: "Newark",
                state: "NJ",
                zip: "10612"
            };
            const res = await request(server)
                .post('/api/clients/create').set('Authorization', `Bearer ${token}`)
                .send(clientInfo);
            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                id: expect.any(Number),
                company_name: expect.stringMatching(clientInfo.companyName),
                phone: expect.stringMatching(clientInfo.phone),
                street: expect.stringMatching(clientInfo.street),
                city: expect.stringMatching(clientInfo.city),
                state: expect.stringMatching(clientInfo.state),
                zip: expect.stringMatching(clientInfo.zip)
            });
        });
    })
});