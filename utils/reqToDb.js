//Converts camelCase to snake_case
const toSnake = string => {
  const capitalPattern = /[a-z]/;
  const result = string.split('').map(char => {
    if (!char.match(capitalPattern)) {
      return `_${char.toLowerCase()}`;
    }
    return char;
  })
  return result.join('');
};

//Converts key in key-object pairs to snake_case
const reqToDb = obj => {
  const snaked = {};
  Object.entries(obj).forEach(item => {
    const [key, value] = item;
    snaked[toSnake(key)] = value;
  });

  return snaked;
};

module.exports = reqToDb;