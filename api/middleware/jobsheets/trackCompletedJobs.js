const { Jobsheets, Projects } = require('../../../data/models');

/* 
 ************************* NOT YET TESTED **************************
*/

//This middleware will keep track of completed jobsheets.
//If all jobsheets are completed or there are no current jobsheets,
//The project completed column will be changed to true.
module.exports = (req, res, next) => {
    if (req.body.completed) {
        //find jobsheet
        Jobsheets.findBy({ id })
        .then(jobsheets => {
            //get all jobsheets with same project_id
            jobsheets[0];
            return Jobsheets.findBy({ project_id: jobsheet[0].project_id });
        })
        .then(async jobsheets => {
            //check if all are completed.
            for (let i = 0; i < jobsheets.length; i++) {
                if (process.env.DB_ENV === 'development' || process.env.DB_ENV === 'test') {
                    if (jobsheets[i].completed === 0) {
                        //All jobsheets are not completed.
                        next();
                    }
                } else {
                    if (jobsheets[i].completed === false) {
                        //All jobsheets are not completed.
                        next();
                    }
                }
            }
            //All jobsheets are complete
            //If all are completed update completed column
            await Projects.update({ id: jobsheets[0].project_id }, { completed: true });
            next();
        })
        .catch(error => res.status(500).json({ error: error.message, step: '/:id' }));
    } else {
        next();
    }
}