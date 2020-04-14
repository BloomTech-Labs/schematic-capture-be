const BaseModel = require('./BaseModel');
const db = require('../dbConfig');

class UserModel extends BaseModel {
  constructor(table) {
    super(table)
  }

  findBy(email) {
    return super._findBy({ email })
      .first()
      .then(user => {
        return db('roles')
          .where({ id: user.role_id })
          .first()
          .then(role => {
            delete user.role_id;
            user.role = role
            return user;
          })
      })
  }

  async add(data) {
    const [id] = await db('users').insert(data, 'id');
    return this.findBy(id);
  }

  getQuestion(id) {
    return db.select('question').from('users').where({ id }).first();
  }
}

module.exports = UserModel;