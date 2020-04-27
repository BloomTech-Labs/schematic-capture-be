exports.up = function(knex) {
  return knex.schema.createTable("projects", table => {
    table.increments();
    table.integer("client_id").unsigned().references("id").inTable("clients").notNullable();
    table.string("name").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("projects");
};
