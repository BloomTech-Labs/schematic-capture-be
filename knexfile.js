require("dotenv").config();

const postgresConfig = {
    client: "pg",
    connection: "postgres://postgres:itsogre@localhost:5432/hello",
    pool: {
        min: 2,
        max: 20
    },
    migrations: {
        directory: "./data/migrations"
    },
    seeds: {
        directory: "./data/seeds"
    }
}

module.exports = {
    test: {
        client: 'sqlite3',
        connection: {
            filename: './data/test.db3'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './data/migrations',
        },
        seeds: {
            directory: './data/seeds',
        }
    },
    staging: postgresConfig,
    production: postgresConfig,
    development: postgresConfig
};
