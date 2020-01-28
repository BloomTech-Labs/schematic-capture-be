const db = require("../../dbConfig");

const findBy = filter => {
    return db("users").where(filter);
};

const add = async user => {
    const [id] = await db("users").insert(user, "id");

    return findBy({ id });
};

module.exports = {
    findBy,
    add
};
