
exports.up = function(knex) {
  knex.schema.table('jobsheets', tbl => {
    tbl.boolean('completed').defautTo(false)
  })
};

exports.down = function(knex) {
  knex.schema.table('jobsheets', tbl => {
    tbl.dropColumn('completed')
  })
};
