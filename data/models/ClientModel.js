const BaseModel = require('./BaseModel');
const db = require('../dbConfig');
class ClientModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  find() {
    return db("clients")
          .leftJoin('projects','projects.client_id','clients.id')
          .leftJoin('jobsheets','jobsheets.project_id','projects.id')
          .select([
            'clients.*',
            db.raw("count(DISTINCT(projects.id)) projects"),
            db.raw('(CASE WHEN (MIN(CASE WHEN (jobsheets.completed = false) THEN FALSE ELSE TRUE END::int)= 0)THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('clients.id').orderBy('clients.id')
  }

  findAssign(email) {
    return db("clients")
          .leftJoin('projects','projects.client_id','clients.id')
          .leftJoin('jobsheets','jobsheets.project_id','projects.id')
          .select([
            'clients.*',
            db.raw("count(DISTINCT(projects.id)) projects"),
            db.raw('(CASE WHEN (MIN(CASE WHEN (jobsheets.completed = false) THEN FALSE ELSE TRUE END::int)= 0)THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('clients.id').where('jobsheets.user_email',email)
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