const jwt = require("jsonwebtoken");
const passport = require("passport");

const Podcast = require("../model/podcast");
const User = require("../model/user");
const Admin = require("../model/admin");

// sign Token function
const signToken = (user) => {
  return jwt.sign(
    { email: user.email, userId: user._id, firstName: user.firstName },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.get_related_user_podcasts = (req, res) => {
  const id = req.user.userId;
  Podcast.find()
    .where({ user: id })
    .populate("user", "firstName")
    .exec()
    .then((docs) => {
      if (docs) {
        res.status(200).json({
          message: "handling get request to get user podcasts",
          isAuthenticated: true,
          podcast: docs.map((doc) => {
            return {
              title: doc.title,
              filePath: doc.filePath,
              description: doc.description,
              by: doc.by,
              name: doc.user.firstName,
              id: doc._id,
              request: {
                type: "GET",
                description: "SHARE_PODCAST",
                url: "http://localhost:4000/podcast/" + doc._id,
              },
            };
          }),
          userFirstName: req.user.firstName,
        });
      } else {
        res.status(404).json({
          message: "no such podcast",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.get_user_signup_error = (req, res) => {
  const message = req.flash("error");
  res.status(200).json({ message: message });
};

exports.user_signup = (req, res) => {
  passport.authenticate(
    "local-signup",
    { session: false },
    (err, user, info) => {
      if (err)
        res.status(500).json({
          error: err,
        });
      // if there is a user
      if (user) {
        const token = signToken(user);
        res.status(200).send({ isAuthenticated: true, token });
      }
      if (!user) {
        return res.status(401).json({ isAuthenticated: false, message: info });
      }
    }
  )(req, res);
};

exports.get_user_login_error = (req, res) => {
  const message = req.flash("error");
  res.status(200).json({ message: message });
};

exports.user_login = (req, res) => {
  passport.authenticate(
    "local-signin",
    { session: false },
    (err, user, info) => {
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
    }
  )(req, res);
};

exports.delete_user = (req, res, next) => {
  const id = req.params.user_id;
  User.findOneAndDelete({ _id: id }, (err, doc) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else if (doc !== null) {
      res.status(200).json({
        message: "user deleted successfully",
      });
    } else {
      res.status(404).json({
        message: " user does not exist",
      });
    }
  });
};

exports.get_all_user = (req, res) => {
  const id = req.user.email;
  Admin.findOne({ admin: id }, function (err, user) {
    if (err) console.log(err);
    if (user) {
      User.find()
        .select("_id firstName lastName email joined")
        .exec()
        .then((doc) => {
          return res.status(200).json({
            message: "all users",
            count: doc.length,
            users: doc.map((document) => {
              return {
                id: document._id,
                firstName: document.firstName,
                lastName: document.lastName,
                email: document.email,
                joined: document.joined,
              };
            }),
          });
        })
        .catch((err) => {
          return res.status(500).json({
            error: err,
          });
        });
    }
  });
};

exports.google_login = (req, res) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err)
      return res.status(500).json({
        error: err,
      });
    if (!user)
      return res.status(401).json({ message: info, isAuthenticated: false });
    // if there is a user
    req.login(user, (err) => {
      if (err)
        return res.status(500).json({
          error: err,
        });
      const token = signToken(user);
      return res.status(200).send({ isAuthenticated: true, token });
    });
  })(req, res);
};
