const db = require("../../dbConfig");

const findBy = filter => {
    return db("users")
        .where(filter)
        .select(
            "users.*",
            "roles.type as role",
            "organizations.name as organization"
        )
        .join("organizations", "organizations.id", "users.organization_id")
        .join("roles", "roles.id", "users.role_id");
};

const add = async user => {
    const [id] = await db("users").insert(user, "id");

    return findBy({ "users.id": id }).first();
};

const getAssignments = user_id => {
    // TODO bring jobsheet model instead
    return db("jobsheets").where({ user_id });
};

module.exports = {
    findBy,
    add,
    getAssignments
};
