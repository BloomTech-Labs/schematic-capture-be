const knex = require('../data/dbConfig');
module.exports = (table, columnToDelete) => {
    return knex.schema.table(table, tbl => {
        knex.schema.hasColumn(table, columnToDelete)
        .then(exists => {
            if (exists) {
                tbl.dropColumn(columnToDelete);
            }
        }).catch(err => {
            console.log(err);
        });
    });
}