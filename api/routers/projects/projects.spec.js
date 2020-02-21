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

