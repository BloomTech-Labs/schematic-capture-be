
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

exports.down = function(knex) {
    return knex.schema.table('users', tbl => {
        knex.schema.hasColumn('role_id')
            .then(exists => {
                if(exists) {
                    knex.schema.dropColumn('role_id')
                }
            })
            .catch(err =>{
                console.log(err, 'error deleting role_id in user')
            })
    })
        .then(success => {
            if(success) {
                knex.schema.table('projects', tbl => {
                    knex.schema.hasColumn('projects', 'assigned_status')
                        .then(exists => {
                            if(exists) {
                                knex.schema.dropColumn('assigned_status')
                            }
                        })
                        .catch(err =>{
                            console.log(err, 'error deleting assigned_status in proj')
                        })
                })
            }
        })
};
