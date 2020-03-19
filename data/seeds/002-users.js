const crypt = require("bcryptjs");
hash = crypt.hashSync("hello", 10);

exports.seed = function(knex) {
  return knex("users").insert([
    {
      id: "tiDTfeNF1KcEkW97gPLIpG85iub2",
      role_id: 2,
      first_name: "Bob",
      last_name: "Johnson",
      password: "testing123!",
      email: "bob_johnson@lambdaschool.com",
      phone: "8008008000"
    },
    {
      id: "nMAqmtW3qAWIpBzPUE1DXxxw5aB2",
      role_id: 1,
      first_name: "test",
      password: hash,
      last_name: "administrator",
      email: "testadmin@test.com",
      phone: "4004004000"
    }
  ]);
};
