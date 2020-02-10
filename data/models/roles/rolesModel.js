const db = require("../../dbConfig");

const find = () => {
  return db("roles");
};

module.exports = {
  find
};
