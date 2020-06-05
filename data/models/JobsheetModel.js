const BaseModel = require('./BaseModel');
const reqToDb = require('../../utils/reqToDb');
const db = require('../dbConfig');

class JobsheetModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  add(jobsheet) {
    const { schematic, name, project_id, components} = jobsheet;

    const sanitizedComponents = components.map(component => reqToDb(component));

    return db(this.table)
      .insert({ schematic, name, project_id }, 'id')
      .then(jobsheet_ids => {
        const [id] = jobsheet_ids;
        const updatedComponents = sanitizedComponents.map(component => {
          component.jobsheet_id = id;
          return component;
        })
        return db('components')
          .insert(updatedComponents)
          .then(() => {
            return this.findBy({ id }).first();
          });
      })
  }
  findByClientId(id) {
    return db('jobsheets as j')
      .join('projects as p', 'j.project_id', 'p.id')
      .join('clients as c', 'p.client_id', 'c.id')
      .select('j.completed')
      .where('client_id', id);
  }


}

module.exports = JobsheetModel;