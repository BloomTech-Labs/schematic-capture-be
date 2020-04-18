exports.up = function(knex) {
  return knex.schema.createTable("contacts", table => {
    table.increments();
    table.integer("client_id").unsigned().references("id").inTable("clients").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("phone");
    table.string("email");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("contacts");
};
