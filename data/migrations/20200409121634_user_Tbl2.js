const knexIfHaveDropColumn = require('../../utils/knexIfHaveDropColumn');
exports.up = async knex => {
    await knex.schema.table('users', tbl => {
        tbl.dropColumn('role_id');
    });
    await knex.schema.table('users', tbl => {
        tbl.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE').onUpdate('CASCADE');
    });
    return knex.schema.table('projects', tbl => {
        tbl.dropColumn('assigned_status');
    });
};

exports.down = async knex => {
    await knexIfHaveDropColumn('users', 'role_id');
    return knexIfHaveDropColumn('projects', 'assigned_status');
};
