exports.seed = function(knex) {
    return knex("clients").insert([
        {
            organization_id: 1,
            company_name: 'Test Client 1',
            phone: '0000000000',
            street: 'abc 123 ave',
            city: 'alpha',
            zip: '88888'
        },
        {
            organization_id: 1,
            company_name: 'Test Client 2',
            phone: '0000000000',
            street: 'xyz 321 ave',
            city: 'beta',
            zip: '99999'
        },
        {
            organization_id: 2,
            company_name: 'Test Client 3',
            phone: '0000000000',
            street: 'xyz 421 ave',
            city: 'charlie',
            zip: '99999'
        }
    ]);
};
