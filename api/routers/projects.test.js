/**
 * @jest-environment node
 */
const request = require('supertest');
const server = require('../app');

describe('Projects router', () => {
    test('should run the test', function() {
        expect(true).toBe(true);
    });
});