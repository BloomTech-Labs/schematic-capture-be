exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.string("id").unique().primary();
    table.integer("role_id").unsigned().references("id").inTable("roles").notNullable();
    table.string("email").notNullable().unique();
    table.string("first_name").notNullable();
    table.string("password").notNullable();
    table.string("last_name").notNullable();
    table.string("license_id");
    table.string("phone");
    table.string("status").defaultTo("Unassigned").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users");
};
