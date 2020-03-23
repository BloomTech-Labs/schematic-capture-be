
exports.up = function(knex) {
  knex.schema.table('components', tbl => {
    tbl.string('custom')
  })
};

exports.down = function(knex) {
  knex.schema.table('components', tbl => {
      tbl.dropColumn('custom')
  })
};
