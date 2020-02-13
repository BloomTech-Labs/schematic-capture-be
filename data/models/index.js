const BaseModel = require('./BaseModel');
const db = require('../dbConfig');

class UserModel extends BaseModel {
  constructor(table) {
    super(table)
  }

  findBy(email) {
    return db('users_organizations')
      .where({ user_email: email }) 
      .select('organizations.*')
      .join('organizations', 'organizations.id', 'users_organizations.organization_id')
      .then(organizations => {
        if (!organizations.length) {
          return null;
        }

        return super._findBy({ email })
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
    const user_org = { user_email: userData.email, organization_id };

    return db('users')
      .insert(userData, 'email')
      .then(user_emails => {
        const [user_email] = user_emails;
        return db('invite_tokens')
          .insert({ id: invite_token }, 'id')
          .then(() => {
            return db('users_organizations')
              .insert(user_org)
              .then(() => {
                return this.findBy(user_email);
              })
          })
      })
  }
}

class ClientModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  findByOrganization(filter) {
    return db('users_organizations')
      .where(filter)
      .select('clients.*')
      .join('organizations', 'organizations.id', 'users_organizations.organization_id')
      .join('clients', 'clients.organization_id', 'organizations.id')
  }
}

module.exports = {
  Users: new UserModel('users'),
  Clients: new ClientModel('clients'),
  Projects: new BaseModel('projects'),
  Organizations: new BaseModel('organizations'),
  Roles: new BaseModel('roles'),
  InviteTokens: new BaseModel('invite_tokens')
}
