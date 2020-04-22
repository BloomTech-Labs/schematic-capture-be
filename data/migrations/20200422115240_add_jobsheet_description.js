exports.up = function(knex) {
    return knex.schema.table('jobsheets', tbl => {
        tbl.string('description');
    });
};

exports.down = function(knex) {
    return knex.schema.table('jobsheets', tbl => {
        tbl.dropColumn('description');
    });
};