const BaseModel = require('./BaseModel');
const db = require('../dbConfig');
class ProjectModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  findPlus(filter) {
    return db("projects")
          .leftJoin('jobsheets','jobsheets.project_id','projects.id')
          .select([
            'projects.id',
            'projects.client_id',
            'projects.name',
            'projects.description',
            db.raw('IFNULL(string_agg(jobsheets.user_email),"Unassigned") as technicians'),
            db.raw('(sum(case when jobsheets.completed <> FALSE THEN TRUE ELSE FALSE END)||"/"||count(jobsheets.completed)) tally'),
            db.raw('(CASE WHEN (jobsheets.completed = false) THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('projects.id').where(filter)
  }

}

module.exports = ProjectModel;