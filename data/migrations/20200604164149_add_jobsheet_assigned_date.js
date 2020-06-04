const knexIfHaveDropColumn = require("../../utils/knexIfHaveDropColumn");
exports.up = function(knex) {
	return knex.schema.table("jobsheets", (tbl) => {
		tbl.date("assigned_date");
	});
};

exports.down = function(knex) {
	return knexIfHaveDropColumn("jobsheets", "assigned_date");
};
