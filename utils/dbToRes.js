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
  const cameled = {};
  Object.entries(obj).forEach(item => {
    const [key, value] = item;
    cameled[toCamel(key)] = value;
  });

  return cameled;
};

module.exports = dbToRes;
