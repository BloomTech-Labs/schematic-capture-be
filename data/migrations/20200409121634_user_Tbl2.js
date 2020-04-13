
exports.up = function(knex) {
    return knex.schema.table('users', tbl => {
        knex.schema.hasColumn('users', 'role_id')
            .then(exists => {
                if(exists){
                    tbl.dropColumn('role_id')
                    tbl
                        .integer('role_id')
                        .unsigned()
                        .references('id')
                        .inTable('roles')
                        .notNullable()
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE')
                }
            })
            .then(success => {
                if(success){
                    knex.schema.hasColumn('projects', 'assigned_status')
                        .then(exists => {
                            if(exists) {
                                knex.schema.dropColumn('assigned_status')
                            }
                        })
                        .catch(err => {
                            console.log(err, 'error taking down assignedstatus from proj')
                        })
                }
            })
            .catch(err =>{
                console.log(err, 'error removing role_id old and then creating role_id new')
            })
    })
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
