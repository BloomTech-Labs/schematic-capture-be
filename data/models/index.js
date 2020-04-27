const BaseModel = require('./BaseModel');
const UserModel = require('./UserModel');
const ClientModel = require('./ClientModel');
const JobsheetModel = require('./JobsheetModel');

module.exports = {
  Users: new UserModel('users'),
  Clients: new ClientModel('clients'),
  Projects: new BaseModel('projects'),
  Jobsheets: new JobsheetModel('jobsheets'),
  Components: new BaseModel('components'),
  Organizations: new BaseModel('organizations'),
  UsersOrganizations: new BaseModel('users_organizations'),
  Roles: new BaseModel('roles'),
  InviteTokens: new BaseModel('invite_tokens')
}