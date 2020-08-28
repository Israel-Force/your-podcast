const passport = require("passport");
const jwt = require("jsonwebtoken");

// sign Token function
const signToken = (user) => {
  return jwt.sign(
    { email: user.admin, userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.admin_login = (req, res) => {
  passport.authenticate("local-adminSignin", (err, user, info) => {
    if (err)
      res.status(500).json({
        error: err,
      });
    if (!user) {
      req.flash("error", "Invalid email or password");
      const infoError = [];
      infoError.push(info.message);
      return res
        .status(401)
        .json({ isAuthenticated: false, message: infoError });
    }
    // if there is a user
    req.login(user, (err) => {
      if (err)
        res.status(500).json({
          error: err,
        });
      const token = signToken(user);
      return res.status(200).json({ isAuthenticated: true, token: token });
    });
  })(req, res);
};

exports.get_admin_login_error = (req, res) => {
  const message = req.flash("error");
  res.status(200).json({ message: message });
};

exports.admin_signup = (req, res) => {
  passport.authenticate("local-adminSignup", (err, user, info) => {
    if (err)
      res.status(500).json({
        error: err,
      });
    if (!user) {
      let message = req.flash("error");
      return res.status(401).json({ isAuthenticated: false, message: message });
    }
    // if there is a user
    req.login(user, (err) => {
      if (err)
        res.status(500).json({
          error: err,
        });
      const token = signToken(user);
      return res.status(200).send({ isAuthenticated: true, token });
    });
  })(req, res);
};
