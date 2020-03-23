
exports.up = function(knex) {
  knex.schema.table('projects', tbl => {
    tbl.boolean('completed').defaultTo(false)

    tbl.boolean('assigned_status')
  })
};

exports.down = function(knex) {
  knex.schema.table('projects', tbl => {
    tbl.dropColomn('assigned_status')
    tbl.dropColumn('completed')
  })
};
