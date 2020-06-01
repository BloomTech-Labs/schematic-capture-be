const BaseModel = require('./BaseModel');
const db = require('../dbConfig');
class ProjectModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  findBy(filter) {
    return db("projects")
          .leftJoin('jobsheets','jobsheets.project_id','projects.id')
          .select([
            'projects.id',
            'projects.client_id',
            'projects.name',
            'projects.description',
            db.raw('CASE WHEN jobsheets.completed is 0 THEN FALSE ELSE TRUE END as completed'),
            db.raw('group_concat(jobsheets.user_email) as technicians')
          ])
          .groupBy('projects.id').where(filter)
  }

}

module.exports = ProjectModel;