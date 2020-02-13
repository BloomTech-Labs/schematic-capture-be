exports.seed = function(knex) {
    return knex("clients").insert([
        {
            organization_id: 1,
            name: 'Test Client 1'
        },
        {
            organization_id: 1,
            name: 'Test Client 2'
        },
        {
            organization_id: 2,
            name: 'Test Client 3'
        }
    ]);
};
