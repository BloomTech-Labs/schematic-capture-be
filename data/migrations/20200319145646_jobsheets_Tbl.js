exports.up = function(knex) {
  return knex.schema.createTable("jobsheets", table => {
    table.increments();

    table
      .timestamp("updated_at")
      .defaultTo(new Date().toISOString())
      .notNullable();

    table
      .string("status")
      .defaultTo("Unassigned")
      .notNullable();

    table
      .string("user_email")
      .references("email")
      .inTable("users");

    table.string("name").notNullable();

    table
      .integer("project_id")
      .unsigned()
      .references("id")
      .inTable("projects")
      .notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("jobsheets");
};
