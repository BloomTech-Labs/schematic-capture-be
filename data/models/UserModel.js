const BaseModel = require("./BaseModel");
const db = require("../dbConfig");

class UserModel extends BaseModel {
	constructor(table) {
		super(table);
	}

	findWithAssignedDate() {
		return db("users")
			.leftJoin("jobsheets", "jobsheets.user_email", "users.email")
			.select([
				"users.*",
				db.raw(
					"COALESCE(array_agg(DISTINCT(jobsheets.assigned_date))) as assigned_dates"
				),
			])
			.groupBy("users.id");
	}

	findBy(email) {
		return super
			._findBy(email)
			.first()
			.then((user) => {
				return db("roles")
					.where({ id: user.role_id })
					.first()
					.then((role) => {
						user.roleId = user.role_id;
						delete user.role_id;
						user.role = role;
						return user;
					});
			});
	}

	async add(data) {
		const [id] = await db("users").insert(data, "id");
		return db("users").where("email", data.email);
	}

	getQuestion(id) {
		return db
			.select("question")
			.from("users")
			.where({ id })
			.first();
	}
}

module.exports = UserModel;
