exports.seed = function(knex) {
    return knex("projects").insert([
        {
            client_id: 1,
            name: 'Test Project 1'
        },
        {
            client_id: 1,
            name: 'Test Project 2'
        },
        {
            client_id: 2,
            name: 'Test Project 3'
        }
    ]);
};
