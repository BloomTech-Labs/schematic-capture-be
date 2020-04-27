const knexIfHaveDropColumn = require('../../utils/knexIfHaveDropColumn');
exports.up = function(knex) {
  return knex.schema.table('jobsheets', tbl => {
    tbl.boolean('completed').defaultTo(false)
  })
};

exports.down = function(knex) {
  return knexIfHaveDropColumn('jobsheets', 'completed');
};
