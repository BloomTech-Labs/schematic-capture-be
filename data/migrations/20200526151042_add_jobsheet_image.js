const knexIfHaveDropColumn = require("../../utils/knexIfHaveDropColumn");
exports.up = function(knex) {
	return knex.schema.table("jobsheets", (tbl) => {
		tbl.string("schematic");
	});
};

exports.down = function(knex) {
	return knexIfHaveDropColumn("jobsheets", "schematic");
};
