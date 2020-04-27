require("dotenv").config();

const postgresConfig = {
    client: "pg",
    connection: process.env.DATABASE_URL,
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
    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
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
    },
    development: {
        client: 'sqlite3',
        connection: {
            filename: './data/schematic_capture.db3'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './data/migrations',
        },
        seeds: {
            directory: './data/seeds',
        }
    }
};
