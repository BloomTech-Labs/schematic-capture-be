exports.up = function(knex) {
  return knex.schema.createTable("users_clients", tbl => {
    tbl.increments();
    tbl
      .integer("client_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("clients");
    tbl
      .integer("user_id")
      .notNullable()
      .unsigned()
      .references("id")
      .inTable("users");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users_clients");
};
