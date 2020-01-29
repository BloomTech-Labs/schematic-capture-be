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

    return findBy({ id }).first();
};

module.exports = {
    findBy,
    add
};
