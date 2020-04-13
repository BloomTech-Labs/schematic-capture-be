
exports.up = function(knex) {
  return knex.schema.table('projects', tbl => {
    tbl.boolean('completed').defaultTo(false)

    tbl.boolean('assigned_status')
  })
};

exports.down = function(knex) {
  return knex.schema.table('projects', tbl => {
    knex.schema.hasColumn('projects', 'assigned_status')
    .then(exists => {
      if (exists) {
        tbl.dropColumn('assigned_status');
      }
      return knex.schema.hasColumn('projects', 'completed')
      .then(exists => {
        if (exists) {
          tbl.dropColomn('completed');
        }
      }).catch(err => {
        console.log(err, 'Problem droping completed column.');
      })
    })
    .catch(err => {
      console.log(err, 'Problem droping assigned_status column.');
    });
  });
};
