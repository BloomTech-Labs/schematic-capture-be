module.exports = (table, tableConfigArray) => {
    for (let i = 0; i < tableConfigArray.length; i++) {
        table[eval(tableConfigArray[i])];
    };
};