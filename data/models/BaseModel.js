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
        return this.findBy({ id: id });
      });
  }

  _update(filter, changes) {
    return this.findBy(filter)
      .update(changes, 'id')
      .then(ids => {
        const [id] = ids;
        return this.findBy(filter);
      })
  }

  _remove(filter) {
    return this.findBy(filter)
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

  update(filter, changes) {
    return this._update(filter, changes);
  }

  remove(filter) {
    return this._remove(filter);
  }
}

module.exports = BaseModel;