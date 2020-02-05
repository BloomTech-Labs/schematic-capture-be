exports.seed = function(knex) {
    return knex("clients").insert([
        {
            organization_id: 1,
            name: "Boeing"
        }
    ]);
};
