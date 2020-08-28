module.exports = function (passport) {
  require("dotenv").config();
  const LocalStrategy = require("passport-local").Strategy;
  const GooglePlusTokenStrategy = require("passport-google-token").Strategy;
  const User = require("../api/model/user");
  const Admin = require("../api/model/admin");
  const mongoose = require("mongoose");
  const bcrypt = require("bcrypt");

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // user signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        const { firstName, lastName } = req.body;
        req.checkBody("email", "Invalid Email").notEmpty().isEmail();
        req
          .checkBody("password", "Invalid Password")
          .notEmpty()
          .isLength({ min: 4 });
        req
          .checkBody("firstName", "Invalid First Name")
          .notEmpty()
          .isLength({ min: 3 });
        req
          .checkBody("lastName", "Invalid Last Name")
          .notEmpty()
          .isLength({ min: 3 });
        const errors = req.validationErrors();
        if (errors) {
          let message = [];
          var old = "";
          errors.forEach((error) => {
            var newError = error.msg;
            if (newError === old) null;
            else {
              message.push(error.msg);
              old = newError;
            }
          });
          return done(null, false, req.flash("error", message));
        }
        const checkMail = email.toLowerCase();
        User.findOne({ email: checkMail }, function (err, user) {
          if (err) return done(err);
          // if there is a user
          if (user)
            return done(null, false, [ "email already exist" ]);
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) return done(err);
            else {
              const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                firstName,
                lastName,
                email: checkMail,
                password: hash,
                joined: new Date(),
              });
              newUser
                .save()
                .then((doc) => done(null, doc, { message: "user created" }))
                .catch((err) => done(err));
            }
          });
        });
      }
    )
  );

  //user login
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        const checkMail = email.toLowerCase();
        User.findOne({ email: checkMail }, function (err, user) {
          if (err) return done(err);
          // if no user
          if (!user)
            return done(null, false, {
              message: "Invalid Email or password",
            });
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) return done(err);
            if (result) return done(null, user);
            return done(null, false, {
              message: "Invalid Email or password",
            });
          });
        });
      }
    )
  );

  //admin login
  passport.use(
    "local-adminSignin",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        const checkMail = email.toLowerCase();
        Admin.findOne({ admin: checkMail }, function (err, user) {
          if (err) return done(err);
          // if no admin user
          if (!user)
            return done(null, false, { message: "Admin does not exist" });
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) return done(err);
            if (result) return done(null, user);
            return done(null, false, { message: "wrong Admin Credentials" });
          });
        });
      }
    )
  );

  // admin signup
  passport.use(
    "local-adminSignup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      function (req, email, password, done) {
        const checkMail = email.toLowerCase();
        Admin.findOne({ admin: checkMail }, function (err, user) {
          if (err) return done(err);
          // if there is a user
          if (user)
            return done(null, false, { message: "email already exist" });
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) return done(err);
            else {
              const newAdmin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                admin: checkMail,
                password: hash,
              });
              newAdmin
                .save()
                .then((doc) => done(null, doc, { message: "admin created" }))
                .catch((err) => done(err));
            }
          });
        });
      }
    )
  );

  //google strategy
  passport.use(
    "google",
    new GooglePlusTokenStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }, (err, user) => {
          if (err) return done(err);
          if (!user) {
            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              joined: new Date(),
              googleId: profile.id,
            });
            newUser
              .save()
              .then((user) => done(null, user, { message: "user created" }))
              .catch((err) => done(err));
          } else return done(null, user);
        });
      }
    )
  );
};
