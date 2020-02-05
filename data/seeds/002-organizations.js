exports.seed = function(knex) {
    return knex("organizations").insert([
        {
            name: "Alloy Technology Solutions",
            phone: "800-800-8000"
        }
    ]);
};
