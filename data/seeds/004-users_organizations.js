exports.seed = function(knex) {
    return knex("users_organizations").insert([
        {
          user_id: "tiDTfeNF1KcEkW97gPLIpG85iub2",
          organization_id: 1
        }
    ]);
};