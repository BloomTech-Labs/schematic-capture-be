
exports.up = function(knex) {
  return knex.schema.table('jobsheets', tbl => {
    tbl.boolean('completed').defautTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.table('jobsheets', tbl => {
    tbl.dropColumn('completed')
  })
};
