exports.seed = function(knex) {
    return knex("custom_fields").insert([
        {
            jobsheet_id: 1,
            col_name: 'Stores Part #',
        },
    ]);
};