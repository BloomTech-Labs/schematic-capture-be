exports.seed = function(knex) {
  return knex("users").insert([
    {
      id: "tiDTfeNF1KcEkW97gPLIpG85iub2",
      role_id: 1,
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob_johnson@lambdaschool.com",
      phone: "8008008000",
      question: "Who's a major player in the cowboy scene?"
    },
    {
      id: "nMAqmtW3qAWIpBzPUE1DXxxw5aB2",
      role_id: 2,
      first_name: "test",
      last_name: "tech",
      email: "testTech@test.com",
      phone: "4004004000"
    }
  ]);
};
