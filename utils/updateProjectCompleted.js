const { Jobsheets, Projects } = require('../data/models');

/* 
 ************************* NOT YET TESTED **************************
*/

//Will keep track of completed jobsheets.
//Use after every jobsheet is created and after every jobsheet's completed column is changed.
//If all jobsheets are completed or there are no current jobsheets,
//The project completed column will be changed to true.
module.exports = (jobsheetId) => {
    //find jobsheet
    let projectJobsheets;
    Jobsheets.findBy({ id: jobsheetId }).then(async jobsheets => {
        //get all jobsheets with same project_id
        jobsheets[0];
        projectJobsheets = await Jobsheets.findBy({ project_id: jobsheets[0].project_id });
        //check if all are completed.
        for (let i = 0; i < projectJobsheets.length; i++) {
            if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'test') {
                if (projectJobsheets[i].completed === 0) {
                    //All jobsheets are not completed.
                    await Projects.update({ id: projectJobsheets[0].project_id }, { completed: false });
                    return;
                }
            } else {
                if (projectJobsheets[i].completed === false) {
                    //All jobsheets are not completed.
                    await Projects.update({ id: projectJobsheets[0].project_id }, { completed: false });
                    return;
                }
            }
        }
        //All jobsheets are complete
        //If all are completed update completed column
        await Projects.update({ id: projectJobsheets[0].project_id }, { completed: true });
    }).catch(error => res.status(500).json({ error: error.message, step: 'updateProjectCompleted' }));
}