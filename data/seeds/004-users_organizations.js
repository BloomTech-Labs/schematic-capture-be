exports.seed = function(knex) {
    return knex("users_organizations").insert([
        {
          user_email: "bob_johnson@lambdaschool.com",
          organization_id: 1
        },
        {
          user_email: "testadmin@test.com",
          organization_id: 1
        }
    ]);
};