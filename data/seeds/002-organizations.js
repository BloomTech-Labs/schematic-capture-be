exports.seed = function(knex) {
    return knex("organizations").insert([
        {
            name: "Alloy Technology Solutions",
            phone: "8008008000"
        },
        {
            
            name: "Test Organization 1",
            phone: "5005005000"
        }
    ]);
};
