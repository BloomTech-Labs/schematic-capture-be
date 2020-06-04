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
            'projects.*',
            db.raw('COALESCE(array_agg(DISTINCT(jobsheets.user_email))) as technicians'),
            db.raw("CONCAT(count(case when jobsheets.completed THEN 1 END),'/',count((jobsheets.id))) tally")
          ])
          .groupBy('projects.id').where(filter)
  }


  setComplete(filter) {
    var subQuery = db("projects")
    .select('projects.id')
    .leftJoin('jobsheets','jobsheets.project_id','projects.id')
    .where('jobsheets.completed',false)
    .first();
    
    if(subQuery){
    return db("projects").update({completed:false}).where('id',subQuery)
    } else {
      return db("projects").update({completed:true}).where('id')
    }

  }
}

module.exports = ProjectModel;