const { Components, Jobsheets } = require('../data/models');
const updateActivity = require('../utils/updateActivity');

//Will keep track of completed components.
//Use after every component is created and after every component's image column is changed.
//If all components are completed or there are no current components,
//The jobsheet completed column will be changed to true.

module.exports = (ComponentId,token) => {
    //find jobsheet
    let jobsheetComponents;
    Components.findBy({ id: ComponentId }).then(async components => {
        //get all components with same jobsheet_id
        components[0];
        jobsheetComponents = await Components.findBy({ jobsheet_id: components[0].jobsheet_id });
        //check if all are completed.
        for (let i = 0; i < jobsheetComponents.length; i++) {

                if (jobsheetComponents[i].image == null) {
                    //All components images are null.
                    await Jobsheets.update({ id: jobsheetComponents[0].jobsheet_id }, { completed: false });
                    return;
                }
             else 
                if (jobsheetComponents[i].image == "") {
                    //All components images are null.
                    await Jobsheets.update({ id: jobsheetComponents[0].jobsheet_id }, { completed: false });
                    return;
                }

        }
        //All jobsheets are complete
        //If all are completed update completed column
        await Jobsheets.update({ id: jobsheetComponents[0].jobsheet_id }, { completed: true }).then(update => updateActivity(token,4,ComponentId));
    }).catch(error => res.status(500).json({ error: error.message, step: 'updateJobsheetCompleted' }));
}