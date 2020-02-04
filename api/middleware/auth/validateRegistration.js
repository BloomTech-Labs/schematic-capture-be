module.exports = (req, res, next) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const errors = {};
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  if (email === undefined || email.trim() === "" || !email.match(emailPattern))
    errors.email = "must be a valid email format";

  if (
    password === undefined ||
    password.trim() === "" ||
    !password.match(passwordPattern)
  )
    errors.password = "must be at least 6 characters";

  if (firstName === undefined || firstName.trim() === "")
    errors.firstName = "must not be empty";

  if (lastName === undefined || lastName.trim() === "")
    errors.lastName = "must not be empty";

  if (phone === undefined || phone.trim() === "")
    errors.phone = "must not be empty";

  if (Object.entries(errors).length) return res.status(400).json(errors);

  next();
};
