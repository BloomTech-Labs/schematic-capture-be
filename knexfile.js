require("dotenv").config();

module.exports = {
    test: {
        client: "pg",
        connection: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        },
        migrations: {
            directory: "./data/migrations"
        },
        seeds: {
            directory: "./data/seeds"
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
        // connection: process.env.DATABASE_URL,
        connection: {
            host     : process.env.RDS_HOSTNAME,
            user     : process.env.RDS_USERNAME,
            password : process.env.RDS_PASSWORD,
            port     : process.env.RDS_PORT
        },
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
