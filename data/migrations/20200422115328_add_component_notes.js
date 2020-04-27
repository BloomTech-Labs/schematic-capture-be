exports.up = function(knex) {
    return knex.schema.table('components', tbl => {
        tbl.text('notes');
    });
};

exports.down = function(knex) {
    return knex.schema.table('components', tbl => {
        tbl.dropColumn('notes');
    });
};