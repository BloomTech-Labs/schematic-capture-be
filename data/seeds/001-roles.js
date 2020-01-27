exports.seed = function(knex) {
    return knex("roles").insert([
        {
            type: "admin"
        },
        {
            type: "technician"
        }
    ]);
};
