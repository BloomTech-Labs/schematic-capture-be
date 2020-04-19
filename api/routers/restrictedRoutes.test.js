/**
 * @jest-environment node
 */
const request = require('supertest');
const server = require('../app');

const performsTest = () => {
    test('should run the test', function() {
        expect(true).toBe(true);
    });
}

const requestWithBody = (putOrPost, url, changes) => {
    if (putOrPost === 'put') {
        return request(server).put(url).set('Authorization', `Bearer ${token}`).send(changes);
    } else {
        return request(server).post(url).set('Authorization', `Bearer ${token}`).send(changes);
    }
}

describe('Restricted routes', () => {
    performsTest();

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

    describe('Clients router', () => {
        performsTest();
    
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
    
        const typicalProject = {
            id: expect.any(Number),
            client_id: expect.any(Number),
            name: expect.any(String),
            completed: expect.any(Number)
        }
        describe('GET /:id/projects', () => {
            test('should return a status 200 with an array of projects', async () => {
                const res = await request(server).get('/api/clients/1/projects').set('Authorization', `Bearer ${token}`);
                expect(res.status).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body[0].client_id).toBe(1);
                expect(res.body[0]).toMatchObject(typicalProject);
            });
        });
    
        describe('POST /:id/projects', () => {
            test('should insert a project to the database and return it with a status 201', async () => {
                const testMachine = 'industrial boiler'
                const res = await requestWithBody('post', '/api/clients/1/projects', { name: testMachine })
                expect(res.status).toBe(201);
                expect(res.body.client_id).toBe(1);
                expect(res.body.completed).toBe(0);
                expect(res.body.name).toBe(testMachine)
                expect(res.body).toMatchObject(typicalProject);
            })
        })
    
        describe('PUT /:id', () => {
            const testChange = 'ACME Industrial';
            test('should return status 200 with a message confirming the client has been updated', async () => {
                const res = await requestWithBody('put', '/api/clients/1', { company_name: testChange });
                expect(res.status).toBe(200);
                expect(res.body).toMatchObject({
                    message: expect.stringMatching("client has been updated")
                });
            });
            test('should return a status 404 with an invalid client id', async () => {
                const res = await requestWithBody('put', '/api/clients/12', { company_name: testChange });
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
                const res = await requestWithBody('post', '/api/clients/create', clientInfo);
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

    describe('Jobsheets router', () => {
        performsTest();

        const typicalJobsheetObject = {
            id: expect.any(Number),
            updated_at: expect.any(String),
            status: expect.any(String),
            user_email: expect.any(String),
            name: expect.any(String),
            project_id: expect.any(Number),
            completed: expect.any(Number)
        }
    
        describe('GET /:id', () => {
            test('should return status 200 with the requested jobsheet', async () => {
                const res = await request(server).get('/api/jobsheets/1').set('Authorization', `Bearer ${token}`);
                expect(res.status).toBe(200);
                expect(res.body.id).toBe(1);
                expect(res.body).toMatchObject(typicalJobsheetObject);
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
                const res = await requestWithBody('put', '/api/jobsheets/1/update', changes);
                expect(res.status).toBe(201);
                expect(res.body.id).toBe(1);
                expect(res.body.name).toBe(changes.name);
                expect(res.body).toMatchObject(typicalJobsheetObject);
            });
        });
    });

    describe('Projects router', () => {
        performsTest();

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

        const test404Error = (testStatement, changes, url) => {
            test(testStatement, async () => {
                const res = await requestWithBody('put', url, changes);
                expect(res.status).toBe(404);
            });
        }

        describe('PUT /:id', () => {
            const changes = { name: 'The Manhattan Project' };
            test('should return status 200 and an array of projects', async () => {
                const res = await requestWithBody('put', '/api/projects/1', changes);
                expect(res.status).toBe(200);
                expect(res.body).toMatchObject({ message: expect.stringMatching("project has been updated") });
            });
            test404Error('should return status 404 if a project with the passed id doesn\'t exist.', changes, '/api/projects/25');
        });
    
        describe('PUT /:id/assignuser', () => {
            const changes = { email: 'bob_johnson@lambdaschool.com' };
            test('should return a status 201 with the updated jobsheets', async () => {
                const res = await requestWithBody('put', '/api/projects/1/assignuser', changes);
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
            test404Error('should return status 404 if a project with the passed id doesn\'t exist.', changes, '/api/projects/25/assignuser');
            test('should return status 400 if an email isn\'t included in the request body.', async () => {
                const res = await requestWithBody('put', '/api/projects/1/assignuser', { somethingElse: 'not an email' });
                expect(res.status).toBe(400);
            });
        });
    });
});