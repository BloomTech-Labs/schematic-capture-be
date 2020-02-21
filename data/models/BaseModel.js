const db = require('../dbConfig');


class BaseModel {
  constructor(table) {
    this.table = table;
  }

  _find() {
    return db(this.table);
  }

  _findBy(filter) {
    return db(this.table).where(filter);
  }

  _findByMultiple(filter, by) {
    return db(this.table).whereIn(filter, by);
  }

  _add(data, filter=null) {
    return db(this.table)
      .insert(data, 'id')
      .then(ids => {
        const [id] = ids;
        return this.findBy(filter || { id }).first();
      });
  }

  _update(filter, changes) {
    return db(this.table).findBy(filter)
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

  findByMultiple(filter, by) {
    return this._findByMultiple(filter, by);
  }

  add(data, filter=null) {
    return this._add(data, filter);
  }

  update(filter, changes) {
    return this._update(filter, changes);
  }

  remove(filter) {
    return this._remove(filter);
  }
}

module.exports = BaseModel;