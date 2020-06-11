exports.up = function(knex) {
    return knex.schema.createTable("activity", table => {
      table.increments();
      table.string("email").references("email").inTable("users");
      table.string("action").notNullable();
      table.timestamp("timestamp").defaultTo(new Date().toISOString()).notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("activity");
  };
  