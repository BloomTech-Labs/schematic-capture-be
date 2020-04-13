require("dotenv").config();

exports.up = function(knex) {
    return knex.schema
        .createTable("roles", table => {
            table.increments();
            table.string("name").notNullable();
        })
        .createTable("organizations", table => {
            table.increments();

            table.string("name").notNullable();
            table.string("phone");
            table.string("street");
            table.string("city");
            table.string("state");
            table.string("zip");
        })
        .createTable("users", table => {
            table
                .string("id")
                .unique()
                .primary();

            table
                .integer("role_id")
                .unsigned()
                .references("id")
                .inTable("roles")
                .notNullable();

            table.string("email").notNullable().unique();

            table.string("first_name").notNullable();

            table.string("last_name").notNullable();

            table.string("phone");
        })
        .createTable('users_organizations', table => {
            table.primary(['organization_id', 'user_email']);

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
        .createTable('invite_tokens', table => {
            table
                .string('id')
                .unique()
                .primary();
        })
        .createTable("clients", table => {
            table.increments();

            table.integer("organization_id")
                .unsigned()
                .references("id")
                .inTable("organizations")
                .notNullable();

            table.string("company_name").notNullable();
            table.string("phone");
            table.string("street");
            table.string("city");
            table.string('state');
            table.string("zip");
        })
        .createTable("projects", table => {
            table.increments();

            table.integer("client_id")
                .unsigned()
                .references("id")
                .inTable("clients")
                .notNullable();

            table.string("name").notNullable();
        })
        .createTable("jobsheets", table => {
            table.increments();

            table
                .timestamp('updated_at')
                .defaultTo(new Date().toISOString())
                .notNullable();
            
            table
                .string('status')
                .defaultTo('Unassigned')
                .notNullable();
            
            table
                .string('user_email')
                .references('email')
                .inTable('users')

            table
                .string('name')
                .notNullable();

            table
                .integer("project_id")
                .unsigned()
                .references("id")
                .inTable("projects")
                .notNullable();

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
        })
        .createTable("components", table => {
            table.increments();

            table
                .integer("jobsheet_id")
                .unsigned()
                .references("id")
                .inTable("jobsheets")
                .notNullable();

            table.string("component_id").notNullable();
            table.string("rl_category");
            table.string("rl_number");
            table.string("descriptions");
            table.string("manufacturer");
            table.string("part_number");
            table.string("stock_code");
            table.string("component_application");
            table.string("electrical_address");
            table.string("reference_tag");
            table.string("settings");
            table.string("image");
            table.string("resources");
            table.string("cutsheet");
            table.string("maintenance_video");
            table.string("custom");
        })
        .createTable('contacts', table => {
            table.increments();

            table.integer('client_id')
                .unsigned()
                .references('id')
                .inTable('clients')
                .notNullable();

            table.string('first_name').notNullable();
            table.string('last_name').notNullable();
            table.string('phone')
            table.string('email')
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('contacts')
        .dropTableIfExists("components")
        .dropTableIfExists("custom_fields")
        .dropTableIfExists("jobsheets")
        .dropTableIfExists("projects")
        .dropTableIfExists("clients")
        .dropTableIfExists('invite_tokens')
        .dropTableIfExists('users_organizations')
        .dropTableIfExists("users")
        .dropTableIfExists("organizations")
        .dropTableIfExists("roles");
};