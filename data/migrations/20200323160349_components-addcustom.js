
exports.up = function(knex) {
  return knex.schema.table('components', tbl => {
    tbl.string('custom')
  })
};

exports.down = function(knex) {
  return knex.schema.table('components', tbl => {
      tbl.dropColumn('custom')
  })
};
