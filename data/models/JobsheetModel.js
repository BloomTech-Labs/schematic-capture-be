const BaseModel = require('./BaseModel');
const { reqToDb } = require('../../utils');
const db = require('../dbConfig');

class JobsheetModel extends BaseModel {
  constructor(table) {
    super(table);
  }

  add(jobsheet) {
    const { name, project_id, components} = jobsheet;

    const sanitizedComponents = components.map(component => reqToDb(component));

    return db(this.table)
      .insert({ name, project_id }, 'id')
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
}

module.exports = JobsheetModel;