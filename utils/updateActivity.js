const { Components, Jobsheets, Projects, Clients, Users, Activity } = require('../data/models');

//case 0 - Creating a new Client
//case 1 - Creating a new Project
//case 2 - Creating a new Jobsheet
//case 3 - Assigning a technician
//case 4 - Completing a Jobsheet


module.exports = (token,caseNum,info) => {


    Users.findBy({ email: token.email }).then(async user => {

        if(caseNum === 1){
        theClient = await Clients.findBy({ id: info.idParam });
        } else 
        if(caseNum === 2){
        theProject = await Projects.findBy({ id: info.projectId });    
        theClient = await Clients.findBy({ id: theProject[0].client_id });
        } else 
        if(caseNum === 3){
        theProject = await Projects.findBy({ id: info.idParam });    
        theClient = await Clients.findBy({ id: theProject[0].client_id });
        theTech = await Users.findBy({ email: info.email });
        } else
        if(caseNum === 4){
        theComponent = await Components.findBy({id: info})
        theJobsheet = await Jobsheets.findBy({id: theComponent[0].jobsheet_id})
        theProject = await Projects.findBy({ id: theJobsheet[0].project_id });    
        theClient = await Clients.findBy({ id: theProject[0].client_id });
        }


        function switcher(value) {
            switch (value) {
            case 0:
                value = `${user.first_name} ${user.last_name} created a new client '${info.companyName}'`;
                break;
            case 1:
                value = `${user.first_name} ${user.last_name} created a new project '${info.name}' for ${theClient[0].company_name}`;
                break;
            case 2:
                value = `${user.first_name} ${user.last_name} created a new jobsheet '${info.name}' in Project:'${theProject[0].name}' for Client:'${theClient[0].company_name}'`;
                break;  
            case 3:
                value = `${user.first_name} ${user.last_name} assigned technician '${theTech.first_name} ${theTech.last_name} (${theTech.email})' to Project:'${theProject[0].name}' for Client:'${theClient[0].company_name}'`;
                break;
            case 4:
                value = `${user.first_name} ${user.last_name} completed jobsheet '${theJobsheet[0].name}' of Project:'${theProject[0].name}' for Client:'${theClient[0].company_name}'`;
                break;       
            }
            return value;
        }



        
        await Activity.add({ action: `${switcher(caseNum)}` });

    }).catch(error => res.status(500).json({ error: error.message, step: 'updateActivity.js' }));
}