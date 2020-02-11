const db = require('../dbConfig');

class BaseModel {
  constructor(table) {
    this.table = db(table);
  }

  _find() {
    return this.table;
  }

  _findBy(filter) {
    return this.table.where(filter);
  }

  _add(data) {
    return this.table
      .insert(data, 'id')
      .then(ids => {
        const [id] = ids;
        return this.table.baseFindBy({ id: id });
      });
  }

  _remove(filter) {
    return this.table
      .findBy(filter)
      .delete('id')
  }

  find() {
    return this._find();
  }

  findBy(filter) {
    return this._findBy(filter);
  }

  add(data) {
    return this._add(data);
  }

  remove(filter) {
    return this._remove(filter);
  }
}

module.exports = BaseModel;