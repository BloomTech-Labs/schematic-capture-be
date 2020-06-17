exports.up = function(knex) {
    return knex.schema.table('projects', tbl => {
      tbl.date('assigned_date')
    })
  };
  
  exports.down = function(knex) {
    return knex.schema.table('projects', tbl => {
      knex.schema.hasColumn('projects', 'assigned_date').then(exists => {
        if (exists) {
          tbl.dropColumn('assigned_date');
        }
      });
    });
  };
  