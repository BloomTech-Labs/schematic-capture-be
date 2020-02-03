module.exports = (req, res, next) => {
  const { email, password, first_name, last_name, phone } = req.body;
  const errors = {};
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === undefined || email.trim() === "" || !email.match(regEx))
    errors.email = "must be a valid email format";

  if (password === undefined || password.trim() === "" || password.length < 6)
    errors.password = "must be at least 6 characters";

  if (first_name === undefined || first_name.trim() === "")
    errors.first_name = "must not be empty";

  if (last_name === undefined || last_name.trim() === "")
    errors.last_name = "must not be empty";

  if (phone === undefined || phone.trim() === "")
    errors.phone = "must not be empty";

  if (Object.entries(errors).length) return res.status(400).json(errors);

  next();
};
