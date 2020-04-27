exports.up = function(knex) {
    return knex.schema.table('users', tbl => {
        tbl.string('image');
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', tbl => {
        tbl.dropColumn('image');
    });
};