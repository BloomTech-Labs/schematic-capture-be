const BaseModel = require('./BaseModel');
const db = require('../dbConfig');

class UserModel extends BaseModel {
  constructor(table) {
    super(table)
  }

  async findBy(user_id) {
    console.log({ user_id });

    return db('users_organizations')
      .where({ user_id }) 
      .select('organizations.*')
      .join('organizations', 'organizations.id', 'users_organizations.organization_id')
      .then(organizations => {
        return super._findBy({ id: user_id })
          .first()
          .then(user => {
            return db('roles')
              .where({ id: user.role_id })
              .first()
              .then(role => {
                delete user.role_id;
                user.organizations = organizations;
                user.role = role
                return user;
              })
          })
      })
  }

  add(data) {
    const { organization_id, invite_token, ...userData } = data;
    const user_org = { user_id: userData.id, organization_id };

    return db('users')
      .insert(userData, 'id')
      .then(user_ids => {
        const [user_id] = user_ids;
        return db('invite_tokens')
          .insert({ id: invite_token }, 'id')
          .then(() => {
            return db('users_organizations', 'id')
              .insert(user_org)
              .then(() => {
                return this.findBy(user_id);
              })
          })
      })
  }

}

module.exports = {
  Users: new UserModel('users'),
  Organizations: new BaseModel('organizations'),
  Roles: new BaseModel('roles'),
  InviteTokens: new BaseModel('invite_tokens')
}
