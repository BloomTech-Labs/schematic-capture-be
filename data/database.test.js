/**
 * @jest-environment node
 */
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './data/test_migrations_seeds.db3'
    },
    useNullAsDefault: true,
    migrations: {
        directory: './data/migrations',
    },
    seeds: {
        directory: './data/seeds',
    }
});

describe('Database migrations and seeds', () => {
    test('should run the test', function() {
        expect(true).toBe(true);
    });
    beforeAll(async () => {
        await knex.migrate.latest();
        return knex.seed.run();
    });
    afterAll(() => {
        return knex.migrate.rollback().then(() => knex.destroy());
    });
});