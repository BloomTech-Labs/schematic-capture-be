exports.up = function(knex) {
    return knex.schema.table("clients", table => {
      table.string("contact_name");
      table.string("contact_email");
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('clients', tbl => {
        tbl.dropColumn('contact_name');
        tbl.dropColumn('contact_email');
    });
  };