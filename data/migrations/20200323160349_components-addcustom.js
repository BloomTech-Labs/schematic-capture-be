
exports.up = function(knex) {
  return knex.schema.table('components', tbl => {
    tbl.string('custom')
  })
};

exports.down = function(knex) {
  return knex.schema.table('components', tbl => {
    knex.schema.hasColumn('components', 'custom')
    .then(exists => {
      if (exists) {
        tbl.dropColumn('custom');
      }
    }).catch(err => {
      console.log(err);
    });
  });
};
