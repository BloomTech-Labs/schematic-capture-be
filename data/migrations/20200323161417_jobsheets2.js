
exports.up = function(knex) {
  return knex.schema.table('jobsheets', tbl => {
    tbl.boolean('completed').defaultTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.table('jobsheets', tbl => {
    knex.schema.hasColumn('jobsheets', 'completed')
    .then(exists => {
      if (exists) {
        tbl.dropColumn('completed');
      }
    }).catch(err => {
      console.log(err);
    });
  });
};
