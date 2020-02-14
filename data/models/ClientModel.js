const BaseModel = require('./BaseModel');
const db = require('../dbConfig');

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

module.exports = ClientModel;