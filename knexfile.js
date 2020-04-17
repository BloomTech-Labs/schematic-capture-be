require("dotenv").config();

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
    staging: {
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
        pool: {
            afterCreate: (conn, done) => {
                conn.run('PRAGMA foreign_keys = ON', done);
            }
        },
        migrations: {
            directory: './data/migrations',
        },
        seeds: {
            directory: './data/seeds',
        }
    }
};
