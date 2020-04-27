const knexIfHaveDropColumn = require('../../utils/knexIfHaveDropColumn');
exports.up = function(knex) {
  return knex.schema.table('components', tbl => {
    tbl.string('custom')
  })
};

exports.down = function(knex) {
  return knexIfHaveDropColumn('components', 'custom');
};
