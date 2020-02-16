const { Users, UsersOrganizations } = require('../../../data/models');
const getUserInfo = (req, res, next) => {
  const { email } = req.decodedIdToken;

  Users
    .findBy(email)
    .then(user => {
      req.userInfo = user;
      next();
    })
    .catch(error => res.status(500).json({ error: error.message, step: '/getUserInfo' }))
}

const getUserOrganizations = async (req, res, next) => {
  const { email } = req.decodedIdToken;

  try {
    const organizations = await UsersOrganizations
      .findBy({ user_email: email })
      .select('organization_id');
    

    req.userOrganizations = organizations.map(organization => organization.organization_id);
    next();
    
  } catch (error) {
    res.status(500).json({ error: error.message, step: 'getUserOrganizations' });
  }
}

module.exports = {
  getUserInfo,
  getUserOrganizations
}