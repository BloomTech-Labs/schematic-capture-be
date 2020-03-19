exports.up = function(knex) {
  return knex.schema.createTable("clients", table => {
    table.increments();

    table.string("company_name").notNullable();
    table.string("phone");
    table.string("street");
    table.string("city");
    table.string("state");
    table.string("zip");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("clients");
};
