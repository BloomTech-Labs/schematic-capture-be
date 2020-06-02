const BaseModel = require('./BaseModel');
const db = require('../dbConfig');
class ClientModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  find() {
    return db("clients")
          .leftJoin('projects','projects.client_id','clients.id')
          .select([
            'clients.*',
            db.raw('(CASE WHEN (projects.completed = false) THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('clients.id','projects.completed')
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