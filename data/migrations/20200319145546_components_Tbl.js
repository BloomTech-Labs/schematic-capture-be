exports.up = function(knex) {
  return knex.schema.createTable("components", table => {
    table.increments();
    table.integer("jobsheet_id").unsigned().references("id").inTable("jobsheets").notNullable();
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
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("components");
};
