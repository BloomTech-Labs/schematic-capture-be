const knexIfHaveDropColumn = require("../../utils/knexIfHaveDropColumn");
exports.up = function(knex) {
	return knex.schema.table("components", (tbl) => {
		tbl.string("stores_part_number");
	});
};

exports.down = function(knex) {
	return knexIfHaveDropColumn("components", "stores_part_number");
};
