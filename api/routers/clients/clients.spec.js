require('dotenv').config();

const { firebase } = require('../../../utils/firebase');
const db = require('../../../data/dbConfig');
const cleanup = require('../../../data/seeds/000-cleanup');
const seedRoles = require('../../../data/seeds/001-roles');
const seedOrgs = require('../../../data/seeds/002-organizations');
const seedUsers = require('../../../data/seeds/003-users');
const seedUsersOrgs = require('../../../data/seeds/004-users_organizations');
const seedClients = require('../../../data/seeds/005-clients');
const request = require('supertest');
const app = require('../../app');

let headers;

describe('Clients Router', () => {
  beforeAll(async () => {
    await cleanup.seed(db);
    await seedRoles.seed(db);
    await seedOrgs.seed(db);
    await seedUsers.seed(db);
    await seedUsersOrgs.seed(db);
    await seedClients.seed(db);

    const TEST_EMAIL = process.env.TEST_EMAIL;
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    try {
      const data = await firebase.auth().signInWithEmailAndPassword(TEST_EMAIL, TEST_PASSWORD)
      
      const idToken = await data.user.getIdToken();

      headers = { 'Authorization': `Bearer ${idToken}` }
    } catch (error) {
      console.error('firebase auth', error);
    }
  })

  describe('GET /', () => {
    it('returns an array of all the clients associated with the organizations of the token bearer', async done => {
      let clients;
      try {
        clients = await request(app).get('/api/clients').set(headers);
      } catch (error) {
        console.error('GET /', error);
      }

      expect(Array.isArray(clients.body)).toBe(true);
      done();
    })
  });

  describe('GET /:id/projects', () => {
    it('returns an array of projects for the specific client id', async done => {
      let projects;
      try {
        projects = await request(app).get('/api/clients/1/projects').set(headers);
      } catch (error) {
        console.error('GET /:id/projects', error);
      }

      expect(Array.isArray(projects.body)).toBe(true);
      done();
    })

    it('each project has a client id', async done => {
      let projects;
      try {
        projects = await request(app).get('/api/clients/1/projects').set(headers);
      } catch (error) {
        console.error('GET /:id/projects', error);
      }

      expect(projects.body.every(project => 'clientId' in project)).toBe(true);
      done();
    })
  });

  describe('POST /create', () => {
    it('returns a client with a new id (4)', async done => {
      const clientObj = {
        companyName: 'New Test Company',
        phone: '5005005000',
        street: '890 def ave.',
        city: 'Alaphbet Town',
        state: 'WA',
        zip: '20030'
      }

      let client;

      try {
        client = await request(app)
                        .post('/api/clients/create')
                        .send(clientObj)
                        .set(headers)

      } catch (error) {
        console.error('POST /create', error)
      }
      expect(client.body.id).toBe(4);
      done();
    })
  })
})