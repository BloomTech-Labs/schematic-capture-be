exports.up = function(knex) {
    return knex.schema.table('clients', tbl => {
        tbl.string('image');
    });
};

exports.down = function(knex) {
    return knex.schema.table('clients', tbl => {
        tbl.dropColumn('image');
    });
};