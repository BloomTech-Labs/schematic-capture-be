const convertCase = require('./convertCase');
//Convets snake_case to camelCase
const toCamel = string => {
  const result = string.split("_").map((part, i) => {
    if (i === 0 || part.length === 1) return part;

    return `${part[0].toUpperCase()}${part.slice(1)}`;
  });

  return result.join("");
};

//Converts key in key-object pairs to camelCase
const dbToRes = obj => {
  return convertCase(toCamel, obj);
};

module.exports = dbToRes;
