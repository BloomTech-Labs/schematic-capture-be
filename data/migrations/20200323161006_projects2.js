
exports.up = function(knex) {
  return knex.schema.table('projects', tbl => {
    tbl.boolean('completed').defaultTo(false)
    tbl.boolean('assigned_status')
  })
};

exports.down = function(knex) {
  return knex.schema.table('projects', tbl => {
    tbl.dropColumn('assigned_status');
    tbl.dropColumn('completed');
  });
};
