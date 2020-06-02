const BaseModel = require('./BaseModel');
const mapper = require('./clientMap');
const db = require('../dbConfig');

class ClientModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  find() {
    return db("clients")
          .select('clients.*')
          .select('p.completed')
          .join('projects as p','p.client_id','clients.id')
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