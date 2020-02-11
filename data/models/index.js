const BaseModel = require('./BaseModel');
const db = require('../dbConfig');

class UserModel extends BaseModel {
  constructor(table) {
    super(table)
  }

  async add(data) {
    const { organization_id, user_id, ...user } = data;
    user.id = user_id;

    await db('users_organizations').insert({ organization_id, user_id })
    return this._add(user)
  }

  async findBy(userId) {
    const organizations = await db('users_organizations as uo')
      .where({ 'uo.user_id': userId })
      .select('orgs.*')
      .join('organizations as orgs', 'orgs.id', 'uo.organization_id')
    
    const user = await this._findBy({ 'users.id': userId }).first();
    const role = await db('roles').where({ id: user.role_id }).first();

    return {
      ...user,
      role,
      organizations
    }
  }
}

module.exports = {
  Users: new UserModel('users'),
  Organizations: new BaseModel('organizations'),
  Roles: new BaseModel('roles')
}