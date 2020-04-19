module.exports = (f, obj) => {
    const result = {};
    Object.entries(obj).forEach(item => {
        const [key, value] = item;
        result[f(key)] = value;
    });
    
    return result;
}