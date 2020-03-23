require("dotenv").config();

exports.up = function(knex) {
  return knex.schema
    .createTable("organizations", table => {
      table.increments();
      table.string("name").notNullable();
      table.string("phone");
      table.string("street");
      table.string("city");
      table.string("state");
      table.string("zip");
    })
    .createTable("users_organizations", table => {
      table.primary(["organization_id", "user_email"]);

      table
        .string("user_email")
        .references("email")
        .inTable("users")
        .notNullable();

      table
        .integer("organization_id")
        .unsigned()
        .references("id")
        .inTable("organizations")
        .notNullable();
    })
    .createTable("invite_tokens", table => {
      table
        .string("id")
        .unique()
        .primary();
    })

    .createTable("custom_fields", table => {
      table.increments();

      table
        .integer("jobsheet_id")
        .unsigned()
        .references("id")
        .inTable("jobsheets")
        .notNullable();

      table.string("col_name").notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("custom_fields")
    .dropTableIfExists("invite_tokens")
    .dropTableIfExists("users_organizations")
    .dropTableIfExists("organizations");
};
