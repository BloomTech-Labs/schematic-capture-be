exports.seed = function(knex) {
    return knex("activity").insert([
        {
            action: 'Bob did a thing'
        },
        {
            action: 'Bob did another thing'
        },
        {
            action: 'and another thing'
        }
    ]);
};
