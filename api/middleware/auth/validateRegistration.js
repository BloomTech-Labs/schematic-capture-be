const { admin } = require('../../../utils/firebase');

module.exports = async (req, res, next) => {
  const { firstName, lastName, phone } = req.body;
  const errors = {};

  if (firstName === undefined || firstName.trim() === "") {
    errors.firstName = "must not be empty";
  }

  if (lastName === undefined || lastName.trim() === "") {
    errors.lastName = "must not be empty";
  }

  if (phone === undefined || phone.trim() === "") {
    errors.phone = "must not be empty";
  }

  if (Object.entries(errors).length && req.canDeleteFirebaseAccount) {
    const { auth } = admin;
    const { uid } = req.decodedIdToken;
    await auth().deleteUser(uid)
    return res.status(400).json(errors);
  }

  req.userData = {
    id: req.decodedIdToken.uid,
    email: req.decodedIdToken.email,
    firstName,
    lastName,
    phone,
    organizationId: req.decodedInviteToken.organizationId,
    roleId: req.decodedInviteToken.roleId,
    inviteToken: req.inviteToken
  }


  next();
};
