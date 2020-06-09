const BaseModel = require('./BaseModel');
const db = require('../dbConfig');
class ProjectModel extends BaseModel {
  constructor(table) {
    super(table);
  }         
  findPlus(filter) {
    return db("projects")
          .leftJoin('jobsheets','jobsheets.project_id','projects.id')
          .leftJoin('users','users.email','jobsheets.user_email')
          .select([
            'projects.*',
            db.raw("COALESCE(array_agg(DISTINCT(jobsheets.user_email))) as technicians"),
            db.raw("CONCAT(count(case when jobsheets.completed THEN 1 END),'/',count((jobsheets.id))) tally"),
            db.raw('(CASE WHEN (MIN(CASE WHEN (jobsheets.completed = false) THEN FALSE ELSE TRUE END::int)= 0) THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('projects.id').where(filter)
  }

  findAssign(filter,email) {
    return db("projects")
          .leftJoin('jobsheets','jobsheets.project_id','projects.id')
          .leftJoin('users','users.email','jobsheets.user_email')
          .select([
            'projects.*',
            db.raw("COALESCE(array_agg(DISTINCT(jobsheets.user_email))) as technicians"),
            db.raw("CONCAT(count(case when jobsheets.completed THEN 1 END),'/',count((jobsheets.id))) tally"),
            db.raw('(CASE WHEN (MIN(CASE WHEN (jobsheets.completed = false) THEN FALSE ELSE TRUE END::int)= 0) THEN FALSE ELSE TRUE END) as completed')
          ])
          .groupBy('projects.id').where(filter).andWhere('jobsheets.user_email',email)
  }
  
  


}

module.exports = ProjectModel;