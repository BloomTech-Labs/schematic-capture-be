module.exports = {

    clientsToBody,
    projectsToBody
  };

  function clientsToBody(client) {
    const result = {
      ...client,
    };

    return result;
  }
  
  function projectsToBody(project) {
    return {
      ...project,
    };
  }


  