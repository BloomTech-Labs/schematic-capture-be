module.exports = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === undefined || email.trim() === "" || !email.match(regEx))
    errors.email = "must be a valid email format";

  if (password === undefined || password.trim() === "" || password.length < 6)
    errors.password = "must be at least 6 characters";

  if (Object.entries(errors).length) return res.status(400).json(errors);
  next();
};
