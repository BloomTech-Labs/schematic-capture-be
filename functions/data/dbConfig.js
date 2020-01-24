const knex = require("knex");
const config = require("../configs/knexfile");

const environment = process.env.DB_ENV;

module.exports = knex(config[environment]);
