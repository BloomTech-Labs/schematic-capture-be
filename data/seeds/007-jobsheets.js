exports.seed = function(knex) {
    return knex("jobsheets").insert([
        {
            project_id: 1,
            user_email: 'bob_johnson@lambdaschool.com',
            name: 'HPU_Manifolds Jobsheet 1.csv',
        },
    ]);
};
