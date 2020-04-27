exports.up = function(knex) {
    return knex.schema.table('projects', tbl => {
        tbl.string('description');
    });
};

exports.down = function(knex) {
    return knex.schema.table('projects', tbl => {
        tbl.dropColumn('description');
    });
};