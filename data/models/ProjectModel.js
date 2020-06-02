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
            db.raw('COALESCE(array_agg(jobsheets.user_email)) as technicians'),
            db.raw("CONCAT(count(case when jobsheets.completed THEN 1 END),'/',count((jobsheets.id))) tally"),
            db.raw('(CASE WHEN (jobsheets.completed = false) THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('projects.id','jobsheets.completed').where(filter)
  }

}

module.exports = ProjectModel;