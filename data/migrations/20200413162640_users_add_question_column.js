
exports.up = function(knex) {
    return knex.schema.table('users', tbl => {
        tbl.string('question'); //make not nullable? Will have to re-run seed data.
    })
};

exports.down = function(knex) {
    return knex.schema.table('users', tbl => {
        tbl.dropColumn('question');
    })
};
